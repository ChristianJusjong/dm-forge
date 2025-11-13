// ==========================================
// MULTI-TAB SYNCHRONIZATION UTILITIES
// Keeps data synchronized across browser tabs
// ==========================================

/**
 * Initialize multi-tab synchronization
 * Call this on page load to enable cross-tab sync
 */
function initializeTabSync() {
  if (typeof window === 'undefined') {
    return;
  }

  // Listen for storage changes from other tabs
  window.addEventListener('storage', handleStorageChange);

  // Register this tab
  registerTab();

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    unregisterTab();
  });

  console.log('✅ Multi-tab synchronization initialized');
}

/**
 * Handle storage changes from other tabs
 * @param {StorageEvent} event - Storage event from another tab
 */
function handleStorageChange(event) {
  if (!event.key) {
    // localStorage.clear() was called
    console.warn('⚠️ All localStorage cleared in another tab');
    location.reload();
    return;
  }

  console.log(`📡 Storage changed in another tab: ${event.key}`);

  // Handle specific key changes
  switch(event.key) {
    case 'initiative_tracker':
      handleInitiativeSync(event);
      break;

    case 'activeCampaignCode':
      handleCampaignSwitch(event);
      break;

    case 'dm_codex_current_user':
      handleUserChange(event);
      break;

    default:
      // Handle campaign-specific changes
      if (event.key.startsWith('campaign_')) {
        handleCampaignDataSync(event);
      } else if (event.key.startsWith('session_notes')) {
        handleNotesSync(event);
      }
      break;
  }
}

/**
 * Sync initiative tracker changes
 * @param {StorageEvent} event
 */
function handleInitiativeSync(event) {
  if (typeof loadInitiativeData === 'function' && typeof renderCombatants === 'function') {
    console.log('🔄 Syncing initiative data...');
    loadInitiativeData();
    renderCombatants();

    // Show notification
    showSyncNotification('Initiative tracker updated in another tab');
  }
}

/**
 * Handle campaign switch in another tab
 * @param {StorageEvent} event
 */
function handleCampaignSwitch(event) {
  const oldCampaign = event.oldValue;
  const newCampaign = event.newValue;

  if (oldCampaign !== newCampaign) {
    console.log(`🔄 Campaign switched in another tab: ${newCampaign}`);

    // Show confirmation before reloading
    if (confirm('Campaign was switched in another tab. Reload this page to sync?')) {
      location.reload();
    } else {
      showSyncNotification('Warning: This tab is viewing a different campaign', 'warning');
    }
  }
}

/**
 * Handle user login/logout in another tab
 * @param {StorageEvent} event
 */
function handleUserChange(event) {
  const wasLoggedIn = event.oldValue !== null;
  const isLoggedIn = event.newValue !== null;

  if (wasLoggedIn && !isLoggedIn) {
    // Logged out in another tab
    console.log('🚪 User logged out in another tab');
    alert('You have been logged out in another tab.');
    location.href = 'login.html';
  } else if (!wasLoggedIn && isLoggedIn) {
    // Logged in in another tab
    console.log('🔓 User logged in in another tab');
    if (confirm('User logged in in another tab. Reload to sync?')) {
      location.reload();
    }
  }
}

/**
 * Handle campaign data changes
 * @param {StorageEvent} event
 */
function handleCampaignDataSync(event) {
  const campaignCode = event.key.replace('campaign_', '');
  const activeCampaignCode = localStorage.getItem('activeCampaignCode');

  if (campaignCode === activeCampaignCode) {
    console.log('🔄 Active campaign data changed in another tab');

    if (typeof updateCampaignInfo === 'function') {
      updateCampaignInfo();
    }

    showSyncNotification('Campaign data updated in another tab');
  }
}

/**
 * Handle session notes sync
 * @param {StorageEvent} event
 */
function handleNotesSync(event) {
  if (window.location.pathname.includes('notes.html')) {
    console.log('🔄 Session notes changed in another tab');

    if (typeof loadSessions === 'function') {
      if (confirm('Session notes updated in another tab. Reload to see changes?')) {
        location.reload();
      }
    }
  }
}

/**
 * Show sync notification to user
 * @param {string} message - Message to show
 * @param {string} type - 'info', 'warning', or 'success'
 */
function showSyncNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `sync-notification sync-${type}`;
  notification.textContent = `🔄 ${message}`;

  // Style notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '80px',
    right: '20px',
    padding: '1rem 1.5rem',
    background: type === 'warning' ? 'rgba(255, 152, 0, 0.95)' : 'rgba(76, 175, 80, 0.95)',
    color: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: '10000',
    fontFamily: 'Lato, sans-serif',
    fontSize: '0.9rem',
    fontWeight: '600',
    maxWidth: '300px',
    animation: 'slideInRight 0.3s ease-out'
  });

  document.body.appendChild(notification);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

/**
 * Register this tab for tracking
 */
function registerTab() {
  const tabs = safeLocalStorageGet('active_tabs', []);
  const tabId = Date.now().toString();

  tabs.push({
    id: tabId,
    url: window.location.href,
    timestamp: Date.now()
  });

  safeLocalStorageSet('active_tabs', tabs);
  safeLocalStorageSetString('current_tab_id', tabId);

  // Clean up old tabs (older than 1 hour)
  cleanupOldTabs();
}

/**
 * Unregister this tab
 */
function unregisterTab() {
  const currentTabId = localStorage.getItem('current_tab_id');
  const tabs = safeLocalStorageGet('active_tabs', []);

  const updatedTabs = tabs.filter(tab => tab.id !== currentTabId);
  safeLocalStorageSet('active_tabs', updatedTabs);
}

/**
 * Clean up tabs older than 1 hour
 */
function cleanupOldTabs() {
  const tabs = safeLocalStorageGet('active_tabs', []);
  const oneHourAgo = Date.now() - (60 * 60 * 1000);

  const activeTabs = tabs.filter(tab => tab.timestamp > oneHourAgo);
  safeLocalStorageSet('active_tabs', activeTabs);
}

/**
 * Get count of active tabs
 * @returns {number} Number of active tabs
 */
function getActiveTabCount() {
  cleanupOldTabs();
  const tabs = safeLocalStorageGet('active_tabs', []);
  return tabs.length;
}

/**
 * Broadcast change to other tabs
 * @param {string} key - localStorage key that changed
 * @param {*} value - New value
 */
function broadcastChange(key, value) {
  // Storage event only fires in OTHER tabs, not current tab
  // So we manually store the value to trigger the event
  safeLocalStorageSet(key, value);

  console.log(`📤 Broadcasting change: ${key}`);
}

/**
 * Check for conflicts before saving
 * @param {string} key - localStorage key
 * @param {*} newValue - Value to save
 * @returns {boolean} True if safe to save, false if conflict detected
 */
function checkSaveConflict(key, newValue) {
  const currentValue = safeLocalStorageGet(key, null);

  if (!currentValue) {
    return true; // No conflict, key doesn't exist
  }

  // Simple timestamp-based conflict detection
  const currentTimestamp = currentValue?.lastModified || 0;
  const newTimestamp = newValue?.lastModified || Date.now();

  if (newTimestamp < currentTimestamp) {
    console.warn(`⚠️ Conflict detected for ${key}: Local data is newer`);
    return false;
  }

  return true;
}

/**
 * Safe save with conflict detection
 * @param {string} key - localStorage key
 * @param {*} value - Value to save
 * @returns {boolean} True if saved successfully
 */
function safeSaveWithConflictCheck(key, value) {
  // Add timestamp to value
  const valueWithTimestamp = {
    ...value,
    lastModified: Date.now()
  };

  if (!checkSaveConflict(key, valueWithTimestamp)) {
    if (confirm('Data was modified in another tab. Overwrite with your changes?')) {
      return safeLocalStorageSet(key, valueWithTimestamp);
    }
    return false;
  }

  return safeLocalStorageSet(key, valueWithTimestamp);
}

// Add CSS animation for notifications
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }

    .sync-notification {
      transition: all 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);
}

// Make functions globally available
if (typeof window !== 'undefined') {
  window.initializeTabSync = initializeTabSync;
  window.handleStorageChange = handleStorageChange;
  window.showSyncNotification = showSyncNotification;
  window.getActiveTabCount = getActiveTabCount;
  window.broadcastChange = broadcastChange;
  window.safeSaveWithConflictCheck = safeSaveWithConflictCheck;
  window.checkSaveConflict = checkSaveConflict;
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeTabSync();

  // Show active tab count in console
  const tabCount = getActiveTabCount();
  if (tabCount > 1) {
    console.log(`📱 ${tabCount} tabs open with Dungeon Master Forge`);
  }
});
