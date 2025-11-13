// ==========================================
// DATA BACKUP & EXPORT/IMPORT MANAGER
// Provides data backup, export, and import functionality
// ==========================================

/**
 * Export all localStorage data as JSON backup file
 */
function exportAllData() {
  try {
    const backup = {
      version: 1,
      timestamp: Date.now(),
      date: new Date().toISOString(),
      data: {}
    };

    // Collect all localStorage data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      backup.data[key] = value;
    }

    // Create downloadable JSON file
    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `dm-forge-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ Data exported successfully');
    return true;
  } catch (error) {
    console.error('❌ Export failed:', error);
    alert('Failed to export data. Please try again.');
    return false;
  }
}

/**
 * Import data from JSON backup file
 * @param {File} file - The backup file to import
 */
function importData(file) {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const backup = JSON.parse(e.target.result);

      // Validate backup structure
      if (!backup.version || !backup.data) {
        throw new Error('Invalid backup file format');
      }

      // Confirm before overwriting
      const message = `This will restore data from ${new Date(backup.timestamp).toLocaleString()}.\n\n` +
                     `⚠️ WARNING: This will OVERWRITE your current data!\n\n` +
                     `Do you want to continue?`;

      if (!confirm(message)) {
        return;
      }

      // Clear existing data (optional - comment out to merge instead)
      // localStorage.clear();

      // Restore data
      let restoredCount = 0;
      Object.keys(backup.data).forEach(key => {
        try {
          localStorage.setItem(key, backup.data[key]);
          restoredCount++;
        } catch (error) {
          console.error(`Failed to restore key: ${key}`, error);
        }
      });

      alert(`✅ Successfully restored ${restoredCount} items!\n\nReloading page...`);
      location.reload();
    } catch (error) {
      console.error('❌ Import failed:', error);
      alert('Failed to import backup file. The file may be corrupted or in the wrong format.');
    }
  };

  reader.onerror = () => {
    alert('Failed to read file. Please try again.');
  };

  reader.readAsText(file);
}

/**
 * Export only campaign data (specific campaign or all campaigns)
 * @param {string} campaignCode - Optional specific campaign code to export
 */
function exportCampaignData(campaignCode = null) {
  try {
    const backup = {
      version: 1,
      type: 'campaign',
      timestamp: Date.now(),
      date: new Date().toISOString(),
      campaigns: {}
    };

    if (campaignCode) {
      // Export specific campaign
      const campaignData = localStorage.getItem(`campaign_${campaignCode}`);
      if (!campaignData) {
        alert('Campaign not found!');
        return false;
      }
      backup.campaigns[campaignCode] = campaignData;
      backup.activeCampaign = campaignCode;
    } else {
      // Export all campaigns
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('campaign_')) {
          backup.campaigns[key.replace('campaign_', '')] = localStorage.getItem(key);
        }
      }

      // Include active campaign code
      const activeCampaign = localStorage.getItem('activeCampaignCode');
      if (activeCampaign) {
        backup.activeCampaign = activeCampaign;
      }
    }

    // Create downloadable JSON file
    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    const filename = campaignCode
      ? `campaign-${campaignCode}-${new Date().toISOString().split('T')[0]}.json`
      : `all-campaigns-${new Date().toISOString().split('T')[0]}.json`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ Campaign data exported successfully');
    return true;
  } catch (error) {
    console.error('❌ Campaign export failed:', error);
    alert('Failed to export campaign data. Please try again.');
    return false;
  }
}

/**
 * Check localStorage usage and warn if approaching quota
 */
function checkStorageUsage() {
  try {
    // Calculate approximate size of localStorage
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      totalSize += key.length + value.length;
    }

    // Convert to KB
    const sizeKB = (totalSize / 1024).toFixed(2);
    const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    // Typical localStorage quota is 5-10MB
    const quotaMB = 5; // Conservative estimate
    const usagePercent = ((sizeMB / quotaMB) * 100).toFixed(1);

    console.log(`📊 Storage Usage: ${sizeKB} KB (${sizeMB} MB) - ${usagePercent}% of ~${quotaMB}MB quota`);

    // Warn if over 80% capacity
    if (usagePercent > 80) {
      const message = `⚠️ Storage Warning\n\n` +
                     `You're using ${usagePercent}% of available storage (${sizeMB} MB / ${quotaMB} MB).\n\n` +
                     `Consider exporting and archiving old campaigns to free up space.`;
      console.warn(message);

      if (usagePercent > 90) {
        alert(message);
      }
    }

    return {
      totalSize,
      sizeKB,
      sizeMB,
      usagePercent
    };
  } catch (error) {
    console.error('Failed to check storage usage:', error);
    return null;
  }
}

/**
 * Show backup reminder if user hasn't backed up recently
 */
function checkBackupReminder() {
  const lastBackup = localStorage.getItem('last_backup_date');
  const daysSinceBackup = lastBackup
    ? Math.floor((Date.now() - parseInt(lastBackup)) / (1000 * 60 * 60 * 24))
    : 999;

  // Remind weekly
  if (daysSinceBackup >= 7) {
    const message = lastBackup
      ? `It's been ${daysSinceBackup} days since your last backup.`
      : `You haven't created a backup yet.`;

    console.warn(`⚠️ Backup Reminder: ${message}`);

    // Show non-intrusive reminder (could be styled banner instead of alert)
    if (daysSinceBackup >= 30) {
      if (confirm(`${message}\n\nWould you like to create a backup now?`)) {
        exportAllData();
        localStorage.setItem('last_backup_date', Date.now().toString());
      }
    }
  }
}

/**
 * Record successful backup
 */
function recordBackup() {
  localStorage.setItem('last_backup_date', Date.now().toString());
}

// Auto-check storage usage and backup reminder on page load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    checkStorageUsage();
    checkBackupReminder();
  });
}

// Make functions globally available
if (typeof window !== 'undefined') {
  window.exportAllData = exportAllData;
  window.importData = importData;
  window.exportCampaignData = exportCampaignData;
  window.checkStorageUsage = checkStorageUsage;
  window.checkBackupReminder = checkBackupReminder;
  window.recordBackup = recordBackup;
}
