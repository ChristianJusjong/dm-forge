// ==========================================
// FIREBASE CONFIGURATION
// Cloud sync and authentication setup
// ==========================================

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

/**
 * Firebase Configuration
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (or use existing)
 * 3. Click "Add app" → Web (</> icon)
 * 4. Register your app
 * 5. Copy the config object below
 * 6. Replace the placeholder values with your actual Firebase config
 *
 * SECURITY NOTE:
 * These values are safe to expose in client-side code.
 * Security is handled by Firestore Security Rules.
 */

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX" // Optional: for Google Analytics
};

/**
 * Check if Firebase is configured
 */
export function isFirebaseConfigured() {
  return firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";
}

/**
 * Initialize Firebase
 */
let app = null;
let db = null;
let auth = null;
let storage = null;

export function initializeFirebase() {
  if (!isFirebaseConfigured()) {
    console.warn('⚠️ Firebase not configured. Cloud sync disabled.');
    console.log('📝 To enable cloud sync:');
    console.log('   1. Create a Firebase project at https://console.firebase.google.com/');
    console.log('   2. Get your config from Project Settings → General → Your apps');
    console.log('   3. Update firebase-config.js with your config');
    return null;
  }

  try {
    // Initialize Firebase app
    app = initializeApp(firebaseConfig);

    // Initialize services
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);

    console.log('✅ Firebase initialized successfully');

    return { app, db, auth, storage };
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    return null;
  }
}

/**
 * Get Firebase instances
 */
export function getFirebaseApp() {
  if (!app) {
    return initializeFirebase()?.app || null;
  }
  return app;
}

export function getFirebaseDB() {
  if (!db) {
    initializeFirebase();
  }
  return db;
}

export function getFirebaseAuth() {
  if (!auth) {
    initializeFirebase();
  }
  return auth;
}

export function getFirebaseStorage() {
  if (!storage) {
    initializeFirebase();
  }
  return storage;
}

/**
 * Firebase Emulator Configuration (for local development)
 * Uncomment to use Firebase emulators
 */
export function useFirebaseEmulators() {
  if (!db || !auth || !storage) {
    console.error('Firebase not initialized');
    return;
  }

  // Uncomment these lines to use emulators:
  // import { connectFirestoreEmulator } from 'firebase/firestore';
  // import { connectAuthEmulator } from 'firebase/auth';
  // import { connectStorageEmulator } from 'firebase/storage';

  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectStorageEmulator(storage, 'localhost', 9199);

  console.log('🔧 Using Firebase emulators');
}

// Make globally available
if (typeof window !== 'undefined') {
  window.initializeFirebase = initializeFirebase;
  window.getFirebaseDB = getFirebaseDB;
  window.getFirebaseAuth = getFirebaseAuth;
  window.getFirebaseStorage = getFirebaseStorage;
  window.isFirebaseConfigured = isFirebaseConfigured;
}

export default {
  initializeFirebase,
  getFirebaseApp,
  getFirebaseDB,
  getFirebaseAuth,
  getFirebaseStorage,
  isFirebaseConfigured,
  useFirebaseEmulators
};
