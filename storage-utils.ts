// ==========================================
// SAFE LOCALSTORAGE UTILITIES
// Provides error-safe localStorage operations with TypeScript
// ==========================================

/**
 * Safely parse JSON with error handling
 * @param jsonString - JSON string to parse
 * @param fallback - Value to return if parsing fails
 * @returns Parsed object or fallback value
 */
export function safeJSONParse<T>(jsonString: string | null | undefined, fallback: T): T {
  if (!jsonString) {
    return fallback;
  }

  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('JSON parse error:', error);
    console.error('Failed to parse:', jsonString?.substring(0, 100));
    return fallback;
  }
}

/**
 * Safely stringify JSON with error handling
 * @param data - Data to stringify
 * @param fallback - String to return if stringify fails
 * @returns JSON string or fallback
 */
export function safeJSONStringify(data: any, fallback: string = '{}'): string {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('JSON stringify error:', error);
    return fallback;
  }
}

/**
 * Safely get item from localStorage with JSON parsing
 * @param key - localStorage key
 * @param fallback - Value to return if key doesn't exist or parse fails
 * @returns Parsed value or fallback
 */
export function safeLocalStorageGet<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    if (value === null) {
      return fallback;
    }
    return safeJSONParse<T>(value, fallback);
  } catch (error) {
    console.error(`localStorage get error for key "${key}":`, error);
    return fallback;
  }
}

/**
 * Safely set item in localStorage with JSON stringification and quota handling
 * @param key - localStorage key
 * @param value - Value to store (will be JSON stringified)
 * @returns True if successful, false otherwise
 */
export function safeLocalStorageSet(key: string, value: any): boolean {
  try {
    const jsonString = safeJSONStringify(value);
    localStorage.setItem(key, jsonString);
    return true;
  } catch (error: any) {
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
 * @param key - localStorage key
 * @returns True if successful, false otherwise
 */
export function safeLocalStorageRemove(key: string): boolean {
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
 * @param key - localStorage key
 * @param fallback - String to return if key doesn't exist
 * @returns Value or fallback
 */
export function safeLocalStorageGetString(key: string, fallback: string = ''): string {
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
 * @param key - localStorage key
 * @param value - String value to store
 * @returns True if successful, false otherwise
 */
export function safeLocalStorageSetString(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error: any) {
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
 * @returns True if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
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
 * @param prefix - Optional prefix to filter keys
 * @returns Array of keys
 */
export function getAllLocalStorageKeys(prefix: string = ''): string[] {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (!prefix || key.startsWith(prefix))) {
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
 * @param prefix - Prefix to match
 * @returns Number of items cleared
 */
export function clearLocalStorageByPrefix(prefix: string): number {
  try {
    const keys = getAllLocalStorageKeys(prefix);
    keys.forEach(key => localStorage.removeItem(key));
    return keys.length;
  } catch (error) {
    console.error('Error clearing localStorage by prefix:', error);
    return 0;
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
}

// Warn if localStorage is not available
if (typeof document !== 'undefined') {
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
}

// Export all functions as default for convenience
export default {
  safeJSONParse,
  safeJSONStringify,
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeLocalStorageRemove,
  safeLocalStorageGetString,
  safeLocalStorageSetString,
  isLocalStorageAvailable,
  getAllLocalStorageKeys,
  clearLocalStorageByPrefix
};
