// ==========================================
// AUTHENTICATION SYSTEM
// ==========================================

// Generate a random salt
function generateSalt() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Hash password using SHA-256 with optional salt
async function hashPassword(password, salt = '') {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get all users from localStorage
function getUsers() {
  return safeLocalStorageGet('dm_codex_users', []);
}

// Save users to localStorage
function saveUsers(users) {
  safeLocalStorageSet('dm_codex_users', users);
}

// Sign up new user
async function signup(username, email, password) {
  try {
    const users = getUsers();

    // Check if username already exists
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: 'Username already exists' };
    }

    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Email already registered' };
    }

    // Generate salt and hash password
    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      salt: salt,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true, message: 'Account created successfully!' };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'An error occurred during signup' };
  }
}

// Login user
async function login(emailOrUsername, password) {
  try {
    const users = getUsers();

    // Find user by email or username
    const user = users.find(u =>
      u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
      u.username.toLowerCase() === emailOrUsername.toLowerCase()
    );

    if (!user) {
      return { success: false, message: 'Invalid email/username or password' };
    }

    // Verify password (handle both legacy and salted)
    let isValid = false;
    let migrated = false;

    if (user.salt) {
      // Modern salted hash
      const hashedPassword = await hashPassword(password, user.salt);
      isValid = (hashedPassword === user.password);
    } else {
      // Legacy unsalted hash
      const legacyHash = await hashPassword(password, '');
      if (legacyHash === user.password) {
        isValid = true;
        // MIGRATION: Upgrade to salted hash
        const newSalt = generateSalt();
        const newHash = await hashPassword(password, newSalt);

        user.salt = newSalt;
        user.password = newHash;
        migrated = true;
      }
    }

    if (!isValid) {
      return { success: false, message: 'Invalid email/username or password' };
    }

    // Save migration if needed
    if (migrated) {
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = user;
        saveUsers(users);
        console.log('🔒 Security Upgrade: User account migrated to salted hash.');
      }
    }

    // Store logged in user (without password/salt)
    const sessionUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      loginAt: new Date().toISOString()
    };

    safeLocalStorageSet('dm_codex_current_user', sessionUser);

    return { success: true, message: 'Login successful!', user: sessionUser };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An error occurred during login' };
  }
}

// Logout user
function logout() {
  safeLocalStorageRemove('dm_codex_current_user');
  window.location.href = 'login.html';
}

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('dm_codex_current_user') !== null;
}

// Get current logged in user
function getCurrentUser() {
  return safeLocalStorageGet('dm_codex_current_user');
}

// Require authentication (call this on protected pages)
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Update user profile
function updateUserProfile(updates) {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false, message: 'Not logged in' };

  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === currentUser.id);

  if (userIndex === -1) {
    return { success: false, message: 'User not found' };
  }

  // Update allowed fields
  if (updates.username) {
    // Check if new username already exists
    if (users.find((u, i) => i !== userIndex && u.username.toLowerCase() === updates.username.toLowerCase())) {
      return { success: false, message: 'Username already exists' };
    }
    users[userIndex].username = updates.username;
    currentUser.username = updates.username;
  }

  if (updates.email) {
    // Check if new email already exists
    if (users.find((u, i) => i !== userIndex && u.email.toLowerCase() === updates.email.toLowerCase())) {
      return { success: false, message: 'Email already registered' };
    }
    users[userIndex].email = updates.email;
    currentUser.email = updates.email;
  }

  saveUsers(users);
  safeLocalStorageSet('dm_codex_current_user', currentUser);

  return { success: true, message: 'Profile updated successfully' };
}

// Change password
async function changePassword(oldPassword, newPassword) {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false, message: 'Not logged in' };

  const users = getUsers();
  const user = users.find(u => u.id === currentUser.id);

  if (!user) {
    return { success: false, message: 'User not found' };
  }

  // Verify old password
  let isValidOld = false;
  if (user.salt) {
    const hashedOld = await hashPassword(oldPassword, user.salt);
    isValidOld = (hashedOld === user.password);
  } else {
    const hashedOldLegacy = await hashPassword(oldPassword, '');
    isValidOld = (hashedOldLegacy === user.password);
  }

  if (!isValidOld) {
    return { success: false, message: 'Current password is incorrect' };
  }

  // Update to new password (always salted)
  const newSalt = generateSalt();
  const hashedNewPassword = await hashPassword(newPassword, newSalt);
  user.password = hashedNewPassword;
  user.salt = newSalt;

  saveUsers(users);

  return { success: true, message: 'Password changed successfully' };
}

// Save API key to user profile
function saveUserApiKey(username, apiKey) {
  console.log('saveUserApiKey called for user:', username);

  const users = getUsers();
  const userIndex = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());

  if (userIndex === -1) {
    console.error('User not found:', username);
    return { success: false, message: 'User not found' };
  }

  console.log('Saving API key to user profile...');

  // Save API key to user profile
  users[userIndex].apiKey = apiKey;
  saveUsers(users);

  console.log('API key saved to users array, updating current user session...');

  // Also update current user session
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.username.toLowerCase() === username.toLowerCase()) {
    currentUser.apiKey = apiKey;
    localStorage.setItem('dm_codex_current_user', JSON.stringify(currentUser));
    console.log('✅ Current user session updated with API key');
  } else {
    console.warn('Current user not matching or not found');
  }

  console.log('✅ API key saved successfully');
  return { success: true, message: 'API key saved to profile' };
}

// Get API key from user profile
function getUserApiKey(username) {
  console.log('getUserApiKey called for user:', username);

  const users = getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

  if (!user) {
    console.warn('User not found:', username);
    return null;
  }

  const apiKey = user.apiKey || null;
  console.log('API key for user:', apiKey ? 'found' : 'not found');

  return apiKey;
}

// Get user's campaigns
function getUserCampaigns(username) {
  const users = getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

  if (!user) {
    return [];
  }

  // Return campaigns array, or empty array if none exist
  return user.campaigns || [];
}

// Add campaign to user's list
function addUserCampaign(username, campaignCode, campaignName) {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());

  if (userIndex === -1) {
    console.error('User not found:', username);
    return { success: false, message: 'User not found' };
  }

  // Initialize campaigns array if it doesn't exist
  if (!users[userIndex].campaigns) {
    users[userIndex].campaigns = [];
  }

  // Check if campaign already exists in user's list
  const existingCampaignIndex = users[userIndex].campaigns.findIndex(
    c => c.code === campaignCode
  );

  if (existingCampaignIndex !== -1) {
    // Update existing campaign's last accessed time
    users[userIndex].campaigns[existingCampaignIndex].lastAccessed = Date.now();
    users[userIndex].campaigns[existingCampaignIndex].name = campaignName;
  } else {
    // Add new campaign
    users[userIndex].campaigns.push({
      code: campaignCode,
      name: campaignName,
      lastAccessed: Date.now()
    });
  }

  // Sort campaigns by last accessed (most recent first)
  users[userIndex].campaigns.sort((a, b) => b.lastAccessed - a.lastAccessed);

  saveUsers(users);

  return { success: true, message: 'Campaign added to user list' };
}

// Get Groq API key from user profile (used by all pages)
function getGroqApiKey() {
  console.log('🔑 getGroqApiKey called');

  // Always get fresh user data from localStorage
  const currentUser = getCurrentUser();
  console.log('👤 Current user:', currentUser ? currentUser.username : 'NOT LOGGED IN');

  if (!currentUser) {
    console.error('❌ No current user, cannot get API key');
    return null;
  }

  // First, try to get directly from users array in localStorage (most reliable)
  const users = getUsers();
  const fullUser = users.find(u => u.username.toLowerCase() === currentUser.username.toLowerCase());

  if (fullUser && fullUser.apiKey) {
    console.log('✅ API key found in users array:', fullUser.apiKey.substring(0, 10) + '...');

    // Also update current user session to keep it in sync
    if (!currentUser.apiKey || currentUser.apiKey !== fullUser.apiKey) {
      currentUser.apiKey = fullUser.apiKey;
      localStorage.setItem('dm_codex_current_user', JSON.stringify(currentUser));
      console.log('🔄 Synced API key to current user session');
    }

    return fullUser.apiKey;
  }

  // Fallback: Check current user session (in case it's there but not in users array)
  if (currentUser.apiKey) {
    console.log('✅ API key found in current user session:', currentUser.apiKey.substring(0, 10) + '...');
    return currentUser.apiKey;
  }

  console.error('❌ API key not found anywhere');
  console.log('📋 Debug - Current user object:', { ...currentUser, password: '[REDACTED]' });
  console.log('📋 Debug - Full user from array:', fullUser ? { ...fullUser, password: '[REDACTED]' } : 'NOT FOUND');

  return null;
}

// Export functions to window for use in inline scripts
window.signup = signup;
window.login = login;
window.logout = logout;
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.requireAuth = requireAuth;
window.updateUserProfile = updateUserProfile;
window.changePassword = changePassword;
window.getUserCampaigns = getUserCampaigns;
window.addUserCampaign = addUserCampaign;
window.saveUserApiKey = saveUserApiKey;
window.getUserApiKey = getUserApiKey;
window.getGroqApiKey = getGroqApiKey;
