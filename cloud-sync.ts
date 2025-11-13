// ==========================================
// CLOUD SYNC UTILITIES
// Real-time campaign synchronization with Firebase (TypeScript)
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
  Unsubscribe,
  DocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { getFirebaseDB, getFirebaseAuth, isFirebaseConfigured } from './firebase-config.js';
import type {
  Campaign,
  SyncStatus,
  PendingSync,
  AuthResult,
  Nullable
} from './types';

// Sync state
let currentUser: Nullable<User> = null;
let syncEnabled: boolean = false;
let syncListeners: Map<string, Unsubscribe> = new Map(); // Track active listeners
let pendingSyncs: PendingSync[] = []; // Queue for offline syncs

/**
 * Initialize cloud sync
 * @returns Success status
 */
export async function initializeCloudSync(): Promise<boolean> {
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
    onAuthStateChanged(auth, (user: User | null) => {
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
export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const auth = getFirebaseAuth();
    if (!auth) {
      return { success: false, error: 'Firebase auth not initialized' };
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Signed in:', userCredential.user.email);
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        isAnonymous: userCredential.user.isAnonymous,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      }
    };
  } catch (error: any) {
    console.error('❌ Sign in failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Create account with email and password
 */
export async function createAccount(email: string, password: string): Promise<AuthResult> {
  try {
    const auth = getFirebaseAuth();
    if (!auth) {
      return { success: false, error: 'Firebase auth not initialized' };
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ Account created:', userCredential.user.email);
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        isAnonymous: userCredential.user.isAnonymous,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      }
    };
  } catch (error: any) {
    console.error('❌ Account creation failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<AuthResult> {
  try {
    const auth = getFirebaseAuth();
    if (!auth) {
      return { success: false, error: 'Firebase auth not initialized' };
    }

    await firebaseSignOut(auth);
    stopSyncListeners();
    console.log('✅ Signed out');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Sign out failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Sync campaign to cloud
 * @param campaignCode - Campaign code
 * @param campaignData - Campaign data to sync
 * @returns Success status
 */
export async function syncCampaignToCloud(
  campaignCode: string,
  campaignData: Campaign
): Promise<boolean> {
  if (!syncEnabled || !currentUser) {
    console.warn('⚠️  Cloud sync not enabled');
    // Queue for later sync
    pendingSyncs.push({
      type: 'campaign',
      code: campaignCode,
      data: campaignData,
      timestamp: Date.now()
    });
    return false;
  }

  try {
    const db = getFirebaseDB();
    if (!db) {
      return false;
    }

    const campaignRef = doc(db, 'campaigns', campaignCode);

    const syncData: Partial<Campaign> = {
      ...campaignData,
      userId: currentUser.uid,
      lastSync: serverTimestamp() as any,
      syncVersion: (campaignData.syncVersion || 0) + 1,
      deviceId: getDeviceId()
    };

    await setDoc(campaignRef, syncData, { merge: true });

    console.log('✅ Campaign synced to cloud:', campaignCode);
    return true;
  } catch (error: any) {
    console.error('❌ Cloud sync failed:', error);

    // If offline, queue for later
    if (error.code === 'unavailable') {
      pendingSyncs.push({
        type: 'campaign',
        code: campaignCode,
        data: campaignData,
        timestamp: Date.now()
      });
    }

    return false;
  }
}

/**
 * Load campaign from cloud
 * @param campaignCode - Campaign code
 * @returns Campaign data or null
 */
export async function loadCampaignFromCloud(
  campaignCode: string
): Promise<Nullable<Campaign>> {
  if (!syncEnabled || !currentUser) {
    console.warn('⚠️  Cloud sync not enabled');
    return null;
  }

  try {
    const db = getFirebaseDB();
    if (!db) {
      return null;
    }

    const campaignRef = doc(db, 'campaigns', campaignCode);
    const campaignSnap: DocumentSnapshot = await getDoc(campaignRef);

    if (campaignSnap.exists()) {
      const data = campaignSnap.data() as Campaign;
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
 * @param campaignCode - Campaign code
 * @returns Success status
 */
export async function deleteCampaignFromCloud(campaignCode: string): Promise<boolean> {
  if (!syncEnabled || !currentUser) {
    return false;
  }

  try {
    const db = getFirebaseDB();
    if (!db) {
      return false;
    }

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
 * @returns List of campaigns
 */
export async function getUserCampaignsFromCloud(): Promise<Campaign[]> {
  if (!syncEnabled || !currentUser) {
    return [];
  }

  try {
    const db = getFirebaseDB();
    if (!db) {
      return [];
    }

    const campaignsRef = collection(db, 'campaigns');
    const q = query(campaignsRef, where('userId', '==', currentUser.uid));
    const querySnapshot: QuerySnapshot = await getDocs(q);

    const campaigns: Campaign[] = [];
    querySnapshot.forEach((doc) => {
      campaigns.push({
        code: doc.id,
        ...doc.data()
      } as Campaign);
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
function startSyncListeners(): void {
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
    if (!db) {
      return;
    }

    const campaignRef = doc(db, 'campaigns', activeCampaignCode);

    // Listen for campaign changes
    const unsubscribe = onSnapshot(
      campaignRef,
      (snapshot: DocumentSnapshot) => {
        if (snapshot.exists()) {
          const cloudData = snapshot.data() as Campaign;
          handleCloudUpdate(activeCampaignCode, cloudData);
        }
      },
      (error: Error) => {
        console.error('❌ Snapshot listener error:', error);
      }
    );

    syncListeners.set(activeCampaignCode, unsubscribe);
    console.log('👂 Listening for cloud changes:', activeCampaignCode);
  } catch (error) {
    console.error('❌ Failed to start sync listener:', error);
  }
}

/**
 * Stop all sync listeners
 */
function stopSyncListeners(): void {
  syncListeners.forEach((unsubscribe: Unsubscribe, campaignCode: string) => {
    unsubscribe();
    console.log('🛑 Stopped listening:', campaignCode);
  });
  syncListeners.clear();
}

/**
 * Handle cloud data update
 * @param campaignCode - Campaign code
 * @param cloudData - Data from cloud
 */
function handleCloudUpdate(campaignCode: string, cloudData: Campaign): void {
  // Import storage utils dynamically to avoid circular dependency
  const localData = (window as any).safeLocalStorageGet(`campaign_${campaignCode}`, null);

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
    (window as any).safeLocalStorageSet(`campaign_${campaignCode}`, cloudData);

    // Trigger UI update if function exists
    if (typeof (window as any).updateCampaignUI === 'function') {
      (window as any).updateCampaignUI();
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
async function syncPendingChanges(): Promise<void> {
  if (pendingSyncs.length === 0) {
    return;
  }

  console.log(`📤 Syncing ${pendingSyncs.length} pending changes...`);

  const syncsToProcess = [...pendingSyncs];
  pendingSyncs = [];

  for (const sync of syncsToProcess) {
    if (sync.type === 'campaign') {
      await syncCampaignToCloud(sync.code, sync.data as Campaign);
    }
  }

  console.log('✅ Pending changes synced');
}

/**
 * Get or create device ID
 * @returns Device ID
 */
function getDeviceId(): string {
  let deviceId = localStorage.getItem('device_id');

  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('device_id', deviceId);
  }

  return deviceId;
}

/**
 * Show cloud sync notification
 * @param message - Notification message
 * @param type - Notification type
 */
function showCloudSyncNotification(message: string, type: string = 'info'): void {
  if (typeof (window as any).showSyncNotification === 'function') {
    (window as any).showSyncNotification(message, type);
  } else {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}

/**
 * Enable cloud sync
 * @returns Success status
 */
export async function enableCloudSync(): Promise<boolean> {
  localStorage.setItem('cloud_sync_enabled', 'true');
  return await initializeCloudSync();
}

/**
 * Disable cloud sync
 */
export function disableCloudSync(): void {
  localStorage.setItem('cloud_sync_enabled', 'false');
  syncEnabled = false;
  stopSyncListeners();
  console.log('ℹ️  Cloud sync disabled');
}

/**
 * Check if cloud sync is enabled
 * @returns Sync status
 */
export function isCloudSyncEnabled(): boolean {
  return syncEnabled && currentUser !== null;
}

/**
 * Get current sync status
 * @returns Status info
 */
export function getSyncStatus(): SyncStatus {
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
  (window as any).initializeCloudSync = initializeCloudSync;
  (window as any).syncCampaignToCloud = syncCampaignToCloud;
  (window as any).loadCampaignFromCloud = loadCampaignFromCloud;
  (window as any).deleteCampaignFromCloud = deleteCampaignFromCloud;
  (window as any).getUserCampaignsFromCloud = getUserCampaignsFromCloud;
  (window as any).enableCloudSync = enableCloudSync;
  (window as any).disableCloudSync = disableCloudSync;
  (window as any).isCloudSyncEnabled = isCloudSyncEnabled;
  (window as any).getSyncStatus = getSyncStatus;
  (window as any).signInWithEmail = signInWithEmail;
  (window as any).createAccount = createAccount;
  (window as any).signOut = signOut;
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
