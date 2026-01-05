/**
 * data-manager.js
 * Handles export and import of application data (localStorage).
 */

import { t } from './translations.js';

// Prefix used for all application keys
const APP_PREFIX = 'dm_forge_';
// Legacy keys that don't match the prefix but should be preserved
const LEGACY_KEYS = ['campaigns', 'current_campaign_id', 'user_settings', 'language'];

export const dataManager = {
  /**
   * Export all application data to a JSON string
   */
  exportData: function () {
    const data = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      store: {}
    };

    // Collect all relevant keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(APP_PREFIX) || LEGACY_KEYS.includes(key)) {
        try {
          const value = localStorage.getItem(key);
          // Try to parse to ensure valid JSON, but store as is or string
          // Actually, we can just store the string value, but parsing helps verification
          data.store[key] = JSON.parse(value);
        } catch (e) {
          // specific simple strings like 'language' might fail JSON.parse if not quoted, 
          // but usually localStorage strings are just strings. 
          // Let's just store the raw string value to be safe and simple.
          data.store[key] = localStorage.getItem(key);
        }
      }
    }

    return JSON.stringify(data, null, 2);
  },

  /**
   * Download the exported data as a .json file
   */
  downloadExport: function () {
    const json = this.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    const date = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `dm-forge-backup-${date}.json`;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Import data from a JSON string
   * @param {string} jsonString 
   */
  importData: function (jsonString) {
    try {
      const data = JSON.parse(jsonString);

      if (!data.store || typeof data.store !== 'object') {
        throw new Error('Invalid backup format');
      }

      let count = 0;
      // Restore keys
      Object.keys(data.store).forEach(key => {
        const value = data.store[key];
        // If it was stored as an object, stringify it back for localStorage
        const storageValue = typeof value === 'object' ? JSON.stringify(value) : value;
        localStorage.setItem(key, storageValue);
        count++;
      });

      return { success: true, count };
    } catch (error) {
      console.error('Import failed:', error);
      return { success: false, error: error.message };
    }
  }
};

// Expose to window for UI access
window.dataManager = dataManager;
