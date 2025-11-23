// ==========================================
// SAFE LOCALSTORAGE UTILITIES
// Provides error-safe localStorage operations
// ==========================================

/**
 * Safely parse JSON with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Value to return if parsing fails
 * @returns {*} Parsed object or fallback value
 */
function safeJSONParse(jsonString, fallback = null) {
  if (!jsonString) {
    return fallback;
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parse error:', error);
    console.error('Failed to parse:', jsonString?.substring(0, 100));
    return fallback;
  }
}

/**
 * Safely stringify JSON with error handling
 * @param {*} data - Data to stringify
 * @param {string} fallback - String to return if stringify fails
 * @returns {string} JSON string or fallback
 */
function safeJSONStringify(data, fallback = '{}') {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('JSON stringify error:', error);
    return fallback;
  }
}

/**
 * Safely get item from localStorage with JSON parsing
 * @param {string} key - localStorage key
 * @param {*} fallback - Value to return if key doesn't exist or parse fails
 * @returns {*} Parsed value or fallback
 */
function safeLocalStorageGet(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) {
      return fallback;
    }
    return safeJSONParse(value, fallback);
  } catch (error) {
    console.error(`localStorage get error for key "${key}":`, error);
    return fallback;
  }
}

/**
 * Safely set item in localStorage with JSON stringification and quota handling
 * @param {string} key - localStorage key
 * @param {*} value - Value to store (will be JSON stringified)
 * @returns {boolean} True if successful, false otherwise
 */
function safeLocalStorageSet(key, value) {
  try {
    const jsonString = safeJSONStringify(value);
    localStorage.setItem(key, jsonString);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('⚠️ localStorage quota exceeded!');
      alert(
        '⚠️ Storage Quota Exceeded!\n\n' +
        'Your browser storage is full. Please:\n' +
        '1. Export your data using the Backup page\n' +
        '2. Delete old campaigns you no longer need\n' +
        '3. Clear browser cache (after exporting!)'
      );
    } else {
      console.error(`localStorage set error for key "${key}":`, error);
    }
    return false;
  }
}

/**
 * Safely remove item from localStorage
 * @param {string} key - localStorage key
 * @returns {boolean} True if successful, false otherwise
 */
function safeLocalStorageRemove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`localStorage remove error for key "${key}":`, error);
    return false;
  }
}

/**
 * Get raw string from localStorage (no JSON parsing)
 * @param {string} key - localStorage key
 * @param {string} fallback - String to return if key doesn't exist
 * @returns {string} Value or fallback
 */
function safeLocalStorageGetString(key, fallback = '') {
  try {
    const value = localStorage.getItem(key);
    return value !== null ? value : fallback;
  } catch (error) {
    console.error(`localStorage getString error for key "${key}":`, error);
    return fallback;
  }
}

/**
 * Set raw string in localStorage (no JSON stringification)
 * @param {string} key - localStorage key
 * @param {string} value - String value to store
 * @returns {boolean} True if successful, false otherwise
 */
function safeLocalStorageSetString(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('⚠️ localStorage quota exceeded!');
      alert(
        '⚠️ Storage Quota Exceeded!\n\n' +
        'Your browser storage is full. Please visit the Backup page to export and free up space.'
      );
    } else {
      console.error(`localStorage setString error for key "${key}":`, error);
    }
    return false;
  }
}

/**
 * Check if localStorage is available and working
 * @returns {boolean} True if localStorage is available
 */
function isLocalStorageAvailable() {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.error('localStorage is not available:', error);
    return false;
  }
}

/**
 * Get all keys from localStorage
 * @param {string} prefix - Optional prefix to filter keys
 * @returns {Array<string>} Array of keys
 */
function getAllLocalStorageKeys(prefix = '') {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!prefix || key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return keys;
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
}

/**
 * Clear all localStorage items with a specific prefix
 * @param {string} prefix - Prefix to match
 * @returns {number} Number of items cleared
 */
function clearLocalStorageByPrefix(prefix) {
  try {
    const keys = getAllLocalStorageKeys(prefix);
    keys.forEach(key => localStorage.removeItem(key));
    return keys.length;
  } catch (error) {
    console.error('Error clearing localStorage by prefix:', error);
    return 0;
  }
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Create a full backup of all application data
 * @returns {string} JSON string of all data
 */
function createBackup() {
  const backup = {
    version: 1,
    timestamp: Date.now(),
    data: {}
  };

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      backup.data[key] = localStorage.getItem(key);
    }
    return JSON.stringify(backup, null, 2);
  } catch (error) {
    console.error('Backup creation failed:', error);
    return null;
  }
}

/**
 * Restore data from backup
 * @param {string} jsonString - Backup JSON string
 * @returns {object} Result { success: boolean, message: string }
 */
function restoreBackup(jsonString) {
  try {
    const backup = JSON.parse(jsonString);
    
    if (!backup.data) {
      return { success: false, message: 'Invalid backup format: missing data object' };
    }

    // Clear current storage
    localStorage.clear();

    // Restore keys
    Object.keys(backup.data).forEach(key => {
      localStorage.setItem(key, backup.data[key]);
    });

    return { success: true, message: 'Backup restored successfully' };
  } catch (error) {
    console.error('Restore error:', error);
    return { success: false, message: 'Failed to parse backup file: ' + error.message };
  }
}

// Make functions globally available
if (typeof window !== 'undefined') {
  window.safeJSONParse = safeJSONParse;
  window.safeJSONStringify = safeJSONStringify;
  window.safeLocalStorageGet = safeLocalStorageGet;
  window.safeLocalStorageSet = safeLocalStorageSet;
  window.safeLocalStorageRemove = safeLocalStorageRemove;
  window.safeLocalStorageGetString = safeLocalStorageGetString;
  window.safeLocalStorageSetString = safeLocalStorageSetString;
  window.isLocalStorageAvailable = isLocalStorageAvailable;
  window.getAllLocalStorageKeys = getAllLocalStorageKeys;
  window.clearLocalStorageByPrefix = clearLocalStorageByPrefix;
  window.escapeHTML = escapeHTML;
  window.createBackup = createBackup;
  window.restoreBackup = restoreBackup;
}

// Warn if localStorage is not available
document.addEventListener('DOMContentLoaded', () => {
  if (!isLocalStorageAvailable()) {
    alert(
      '⚠️ localStorage Not Available\n\n' +
      'This application requires localStorage to function. Please:\n' +
      '1. Enable cookies and site data in your browser settings\n' +
      '2. Disable private/incognito mode\n' +
      '3. Try a different browser'
    );
  }
});
