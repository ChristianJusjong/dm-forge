// ==========================================
// AUTHENTICATION SYSTEM
// ==========================================

// Hash password using simple SHA-256 (browser-based)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Get all users from localStorage
function getUsers() {
  const users = localStorage.getItem('dm_codex_users');
  return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem('dm_codex_users', JSON.stringify(users));
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

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
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

    // Verify password
    const hashedPassword = await hashPassword(password);
    if (hashedPassword !== user.password) {
      return { success: false, message: 'Invalid email/username or password' };
    }

    // Store logged in user (without password)
    const sessionUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      loginAt: new Date().toISOString()
    };

    localStorage.setItem('dm_codex_current_user', JSON.stringify(sessionUser));

    return { success: true, message: 'Login successful!', user: sessionUser };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An error occurred during login' };
  }
}

// Logout user
function logout() {
  localStorage.removeItem('dm_codex_current_user');
  window.location.href = 'login.html';
}

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('dm_codex_current_user') !== null;
}

// Get current logged in user
function getCurrentUser() {
  const user = localStorage.getItem('dm_codex_current_user');
  return user ? JSON.parse(user) : null;
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
  localStorage.setItem('dm_codex_current_user', JSON.stringify(currentUser));

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
  const hashedOldPassword = await hashPassword(oldPassword);
  if (hashedOldPassword !== user.password) {
    return { success: false, message: 'Current password is incorrect' };
  }

  // Update to new password
  const hashedNewPassword = await hashPassword(newPassword);
  user.password = hashedNewPassword;

  saveUsers(users);

  return { success: true, message: 'Password changed successfully' };
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
