// ==========================================
// CLOUD SYNC UTILITIES
// Real-time campaign synchronization with Firebase
// ==========================================

import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { getFirebaseDB, getFirebaseAuth, isFirebaseConfigured } from './firebase-config.js';

// Sync state
let currentUser = null;
let syncEnabled = false;
let syncListeners = new Map(); // Track active listeners
let pendingSyncs = []; // Queue for offline syncs

/**
 * Initialize cloud sync
 * @returns {Promise<boolean>} Success status
 */
export async function initializeCloudSync() {
  if (!isFirebaseConfigured()) {
    console.warn('⚠️ Firebase not configured. Cloud sync unavailable.');
    return false;
  }

  try {
    const auth = getFirebaseAuth();
    if (!auth) {
      console.error('❌ Firebase auth not initialized');
      return false;
    }

    // Check if user preference for cloud sync is enabled
    const cloudSyncPref = localStorage.getItem('cloud_sync_enabled');
    if (cloudSyncPref !== 'true') {
      console.log('ℹ️  Cloud sync disabled by user preference');
      return false;
    }

    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser = user;
        syncEnabled = true;
        console.log('✅ Cloud sync enabled for user:', user.uid);

        // Start listening for changes
        startSyncListeners();

        // Sync pending changes
        syncPendingChanges();
      } else {
        currentUser = null;
        syncEnabled = false;
        console.log('ℹ️  User not authenticated, cloud sync disabled');
        stopSyncListeners();
      }
    });

    // Try to sign in anonymously if not authenticated
    const currentAuthUser = auth.currentUser;
    if (!currentAuthUser) {
      await signInAnonymously(auth);
      console.log('✅ Signed in anonymously for cloud sync');
    }

    return true;
  } catch (error) {
    console.error('❌ Cloud sync initialization failed:', error);
    return false;
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email, password) {
  try {
    const auth = getFirebaseAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Signed in:', userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('❌ Sign in failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create account with email and password
 */
export async function createAccount(email, password) {
  try {
    const auth = getFirebaseAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ Account created:', userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('❌ Account creation failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sign out
 */
export async function signOut() {
  try {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
    stopSyncListeners();
    console.log('✅ Signed out');
    return { success: true };
  } catch (error) {
    console.error('❌ Sign out failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sync campaign to cloud
 * @param {string} campaignCode - Campaign code
 * @param {Object} campaignData - Campaign data to sync
 * @returns {Promise<boolean>} Success status
 */
export async function syncCampaignToCloud(campaignCode, campaignData) {
  if (!syncEnabled || !currentUser) {
    console.warn('⚠️  Cloud sync not enabled');
    // Queue for later sync
    pendingSyncs.push({ type: 'campaign', code: campaignCode, data: campaignData });
    return false;
  }

  try {
    const db = getFirebaseDB();
    const campaignRef = doc(db, 'campaigns', campaignCode);

    const syncData = {
      ...campaignData,
      userId: currentUser.uid,
      lastSync: serverTimestamp(),
      syncVersion: (campaignData.syncVersion || 0) + 1,
      deviceId: getDeviceId()
    };

    await setDoc(campaignRef, syncData, { merge: true });

    console.log('✅ Campaign synced to cloud:', campaignCode);
    return true;
  } catch (error) {
    console.error('❌ Cloud sync failed:', error);

    // If offline, queue for later
    if (error.code === 'unavailable') {
      pendingSyncs.push({ type: 'campaign', code: campaignCode, data: campaignData });
    }

    return false;
  }
}

/**
 * Load campaign from cloud
 * @param {string} campaignCode - Campaign code
 * @returns {Promise<Object|null>} Campaign data or null
 */
export async function loadCampaignFromCloud(campaignCode) {
  if (!syncEnabled || !currentUser) {
    console.warn('⚠️  Cloud sync not enabled');
    return null;
  }

  try {
    const db = getFirebaseDB();
    const campaignRef = doc(db, 'campaigns', campaignCode);
    const campaignSnap = await getDoc(campaignRef);

    if (campaignSnap.exists()) {
      const data = campaignSnap.data();
      console.log('✅ Campaign loaded from cloud:', campaignCode);
      return data;
    } else {
      console.log('ℹ️  Campaign not found in cloud');
      return null;
    }
  } catch (error) {
    console.error('❌ Cloud load failed:', error);
    return null;
  }
}

/**
 * Delete campaign from cloud
 * @param {string} campaignCode - Campaign code
 * @returns {Promise<boolean>} Success status
 */
export async function deleteCampaignFromCloud(campaignCode) {
  if (!syncEnabled || !currentUser) {
    return false;
  }

  try {
    const db = getFirebaseDB();
    const campaignRef = doc(db, 'campaigns', campaignCode);
    await deleteDoc(campaignRef);

    console.log('✅ Campaign deleted from cloud:', campaignCode);
    return true;
  } catch (error) {
    console.error('❌ Cloud delete failed:', error);
    return false;
  }
}

/**
 * Get all user's campaigns from cloud
 * @returns {Promise<Array>} List of campaigns
 */
export async function getUserCampaignsFromCloud() {
  if (!syncEnabled || !currentUser) {
    return [];
  }

  try {
    const db = getFirebaseDB();
    const campaignsRef = collection(db, 'campaigns');
    const q = query(campaignsRef, where('userId', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);

    const campaigns = [];
    querySnapshot.forEach((doc) => {
      campaigns.push({
        code: doc.id,
        ...doc.data()
      });
    });

    console.log(`✅ Found ${campaigns.length} campaigns in cloud`);
    return campaigns;
  } catch (error) {
    console.error('❌ Failed to get campaigns:', error);
    return [];
  }
}

/**
 * Start real-time sync listeners
 */
function startSyncListeners() {
  if (!syncEnabled || !currentUser) {
    return;
  }

  const activeCampaignCode = localStorage.getItem('activeCampaignCode');
  if (!activeCampaignCode) {
    return;
  }

  // Stop existing listeners
  stopSyncListeners();

  try {
    const db = getFirebaseDB();
    const campaignRef = doc(db, 'campaigns', activeCampaignCode);

    // Listen for campaign changes
    const unsubscribe = onSnapshot(campaignRef, (snapshot) => {
      if (snapshot.exists()) {
        const cloudData = snapshot.data();
        handleCloudUpdate(activeCampaignCode, cloudData);
      }
    }, (error) => {
      console.error('❌ Snapshot listener error:', error);
    });

    syncListeners.set(activeCampaignCode, unsubscribe);
    console.log('👂 Listening for cloud changes:', activeCampaignCode);
  } catch (error) {
    console.error('❌ Failed to start sync listener:', error);
  }
}

/**
 * Stop all sync listeners
 */
function stopSyncListeners() {
  syncListeners.forEach((unsubscribe, campaignCode) => {
    unsubscribe();
    console.log('🛑 Stopped listening:', campaignCode);
  });
  syncListeners.clear();
}

/**
 * Handle cloud data update
 * @param {string} campaignCode - Campaign code
 * @param {Object} cloudData - Data from cloud
 */
function handleCloudUpdate(campaignCode, cloudData) {
  const localData = safeLocalStorageGet(`campaign_${campaignCode}`, null);

  // Check if cloud data is newer
  const cloudVersion = cloudData.syncVersion || 0;
  const localVersion = localData?.syncVersion || 0;

  // Check device ID to avoid self-updates
  const cloudDeviceId = cloudData.deviceId;
  const currentDeviceId = getDeviceId();

  if (cloudDeviceId === currentDeviceId) {
    // This update came from this device, ignore
    return;
  }

  if (cloudVersion > localVersion) {
    console.log('🔄 Newer data found in cloud, updating local...');

    // Update localStorage
    safeLocalStorageSet(`campaign_${campaignCode}`, cloudData);

    // Trigger UI update if function exists
    if (typeof window.updateCampaignUI === 'function') {
      window.updateCampaignUI();
    }

    // Show notification
    showCloudSyncNotification('Campaign updated from another device', 'success');
  } else if (cloudVersion < localVersion) {
    console.log('📤 Local data is newer, syncing to cloud...');

    // Local is newer, sync to cloud
    syncCampaignToCloud(campaignCode, localData);
  }
}

/**
 * Sync pending changes (when coming back online)
 */
async function syncPendingChanges() {
  if (pendingSyncs.length === 0) {
    return;
  }

  console.log(`📤 Syncing ${pendingSyncs.length} pending changes...`);

  const syncsToProcess = [...pendingSyncs];
  pendingSyncs = [];

  for (const sync of syncsToProcess) {
    if (sync.type === 'campaign') {
      await syncCampaignToCloud(sync.code, sync.data);
    }
  }

  console.log('✅ Pending changes synced');
}

/**
 * Get or create device ID
 * @returns {string} Device ID
 */
function getDeviceId() {
  let deviceId = localStorage.getItem('device_id');

  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('device_id', deviceId);
  }

  return deviceId;
}

/**
 * Show cloud sync notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type
 */
function showCloudSyncNotification(message, type = 'info') {
  if (typeof showSyncNotification === 'function') {
    showSyncNotification(message, type);
  } else {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}

/**
 * Enable cloud sync
 * @returns {Promise<boolean>} Success status
 */
export async function enableCloudSync() {
  localStorage.setItem('cloud_sync_enabled', 'true');
  return await initializeCloudSync();
}

/**
 * Disable cloud sync
 */
export function disableCloudSync() {
  localStorage.setItem('cloud_sync_enabled', 'false');
  syncEnabled = false;
  stopSyncListeners();
  console.log('ℹ️  Cloud sync disabled');
}

/**
 * Check if cloud sync is enabled
 * @returns {boolean} Sync status
 */
export function isCloudSyncEnabled() {
  return syncEnabled && currentUser !== null;
}

/**
 * Get current sync status
 * @returns {Object} Status info
 */
export function getSyncStatus() {
  return {
    enabled: syncEnabled,
    authenticated: currentUser !== null,
    userId: currentUser?.uid || null,
    email: currentUser?.email || null,
    isAnonymous: currentUser?.isAnonymous || false,
    pendingSyncs: pendingSyncs.length,
    activeListeners: syncListeners.size
  };
}

// Make globally available
if (typeof window !== 'undefined') {
  window.initializeCloudSync = initializeCloudSync;
  window.syncCampaignToCloud = syncCampaignToCloud;
  window.loadCampaignFromCloud = loadCampaignFromCloud;
  window.deleteCampaignFromCloud = deleteCampaignFromCloud;
  window.getUserCampaignsFromCloud = getUserCampaignsFromCloud;
  window.enableCloudSync = enableCloudSync;
  window.disableCloudSync = disableCloudSync;
  window.isCloudSyncEnabled = isCloudSyncEnabled;
  window.getSyncStatus = getSyncStatus;
  window.signInWithEmail = signInWithEmail;
  window.createAccount = createAccount;
  window.signOut = signOut;
}

export default {
  initializeCloudSync,
  syncCampaignToCloud,
  loadCampaignFromCloud,
  deleteCampaignFromCloud,
  getUserCampaignsFromCloud,
  enableCloudSync,
  disableCloudSync,
  isCloudSyncEnabled,
  getSyncStatus,
  signInWithEmail,
  createAccount,
  signOut
};
