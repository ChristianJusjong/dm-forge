# 🔥 Firebase Cloud Sync Setup Guide

**Status:** Ready for Configuration
**Cost:** FREE for up to 50K reads/day, 20K writes/day
**Features:** Real-time sync, cross-device campaigns, automatic backups

---

## 📋 Quick Start (5 Minutes)

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: **"dm-forge"** (or your choice)
4. Click **Continue**
5. Disable Google Analytics (optional, can enable later)
6. Click **Create project**
7. Wait for project creation (~30 seconds)
8. Click **Continue**

---

### Step 2: Register Web App

1. In Firebase Console, click **Web icon** (</>) to add a web app
2. App nickname: **"Dungeon Master Forge"**
3. **Don't** check "Firebase Hosting" (we'll deploy elsewhere)
4. Click **Register app**
5. **Copy the configuration object** shown:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "dm-forge-xxxxx.firebaseapp.com",
  projectId: "dm-forge-xxxxx",
  storageBucket: "dm-forge-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012abcdef",
  measurementId: "G-XXXXXXXXXX"
};
```

6. Click **Continue to console**

---

### Step 3: Configure Firebase Config File

1. Open `firebase-config.js` in your project
2. Replace the placeholder config with your copied config:

```javascript
// BEFORE:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  // ...
};

// AFTER (use your actual values):
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "dm-forge-xxxxx.firebaseapp.com",
  projectId: "dm-forge-xxxxx",
  storageBucket: "dm-forge-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012abcdef",
  measurementId: "G-XXXXXXXXXX"
};
```

3. Save the file

---

### Step 4: Enable Firestore Database

1. In Firebase Console, go to **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
   - **Production mode** requires security rules (see Step 6)
4. Select location: Choose closest to your users
   - **us-central** (Iowa) - Good for North America
   - **europe-west** (Belgium) - Good for Europe
   - **asia-southeast** (Singapore) - Good for Asia
5. Click **Enable**
6. Wait for database creation (~1 minute)

---

### Step 5: Enable Authentication

1. In Firebase Console, go to **Build → Authentication**
2. Click **Get started**
3. Click **Sign-in method** tab
4. Enable **Anonymous** provider:
   - Click **Anonymous**
   - Toggle **Enable**
   - Click **Save**
5. (Optional) Enable **Email/Password** provider:
   - Click **Email/Password**
   - Toggle **Enable**
   - Click **Save**

---

### Step 6: Configure Firestore Security Rules

**IMPORTANT:** Test mode rules expire after 30 days!

1. In Firebase Console, go to **Firestore Database → Rules**
2. Replace with these production-ready rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Campaign data
    match /campaigns/{campaignCode} {
      // Allow read if:
      // - User is authenticated
      // - Campaign belongs to user OR is shared
      allow read: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         request.auth.uid in resource.data.get('sharedWith', []));

      // Allow create if:
      // - User is authenticated
      // - Campaign userId matches auth user
      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid;

      // Allow update/delete if:
      // - User owns the campaign
      allow update, delete: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    // User data
    match /users/{userId} {
      // Users can only read/write their own data
      allow read, write: if request.auth != null &&
        request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

---

### Step 7: Test Cloud Sync

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Open browser console (F12)

4. Look for Firebase initialization message:
   ```
   ✅ Firebase initialized successfully
   ✅ Cloud sync enabled for user: anonymous_xxx
   ```

5. Create a test campaign

6. Check Firebase Console → Firestore Database → Data
   - Should see `campaigns` collection
   - Should see your campaign document

7. Test sync:
   - Open app in another browser tab
   - Make changes in one tab
   - Changes should appear in other tab

---

## 🎯 Features Enabled

### ✅ Real-Time Sync
- Changes sync across all devices instantly
- Updates appear without page refresh
- Conflict resolution (newest version wins)

### ✅ Automatic Backups
- All campaign data backed up to cloud
- No data loss even if device breaks
- Accessible from any device

### ✅ Offline Support
- Works offline with cached data
- Syncs changes when back online
- Queue system for pending syncs

### ✅ Multi-Device Access
- Access campaigns from phone, tablet, desktop
- Same campaign code works everywhere
- Real-time collaboration (future)

---

## 💰 Pricing & Limits

### Free Spark Plan (Default)
**Perfect for personal use**

| Resource | Free Quota | Estimated Users |
|----------|------------|-----------------|
| **Firestore Reads** | 50,000/day | ~500 active users/day |
| **Firestore Writes** | 20,000/day | ~200 campaigns/day |
| **Storage** | 1 GB | ~10,000 campaigns |
| **Bandwidth** | 10 GB/month | Plenty |
| **Authentication** | Unlimited | Unlimited |

**Cost if exceeded:** $0.06 per 100K reads, $0.18 per 100K writes

### Blaze Plan (Pay-as-you-go)
**Required for production apps with >100 users**

- Same free quotas as Spark
- Pay only for usage beyond free tier
- Typical cost: $5-25/month for 1,000 active users

---

## 🔒 Security Best Practices

### 1. Never Commit Firebase Config to Public Repos
While API keys in `firebase-config.js` are safe for client-side use, avoid committing them to public GitHub repos.

**Add to `.gitignore`:**
```
firebase-config.js
.env
```

**Use environment variables:**
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ...
};
```

### 2. Implement Proper Security Rules
Never use test mode in production! Update rules within 30 days.

### 3. Monitor Usage
Set up budget alerts in Firebase Console:
1. Go to **Project Settings → Usage and billing**
2. Click **Set budget alert**
3. Set limit (e.g., $10/month)
4. Get email if approaching limit

### 4. Enable App Check (Optional)
Prevents abuse from bots:
1. Go to **Build → App Check**
2. Register app
3. Enable reCAPTCHA
4. Update security rules to require App Check

---

## 🧪 Testing Cloud Sync

### Test 1: Basic Sync
1. Create campaign on Device A
2. Load same campaign on Device B (using campaign code)
3. Make changes on Device A
4. Changes appear on Device B (within 1-2 seconds)
5. Make changes on Device B
6. Changes appear on Device A

**Expected:** ✅ Bidirectional sync works

### Test 2: Offline Sync
1. Create campaign while online
2. Turn off internet (DevTools → Network → Offline)
3. Make changes to campaign
4. Turn internet back on
5. Changes should sync automatically

**Expected:** ✅ Offline queue works

### Test 3: Conflict Resolution
1. Open campaign on two devices
2. Turn off sync on Device B
3. Make conflicting changes on both devices
4. Turn sync back on Device B
5. Newest version should win

**Expected:** ✅ Conflicts resolved

### Test 4: New Device
1. Create campaign on Device A
2. Note campaign code
3. Open app on completely new device
4. Enter campaign code
5. All data loads from cloud

**Expected:** ✅ Cross-device access works

---

## 🐛 Troubleshooting

### Issue: "Firebase not configured"
**Solution:**
1. Check `firebase-config.js` has your actual config
2. Verify `apiKey` is not "YOUR_API_KEY_HERE"
3. Restart dev server

### Issue: "Permission denied" errors
**Solution:**
1. Check Firestore security rules
2. Verify user is authenticated
3. Check campaign `userId` matches `auth.uid`

### Issue: Sync not working
**Solution:**
1. Open browser console
2. Look for error messages
3. Check internet connection
4. Verify Firestore is enabled in Firebase Console
5. Check Firebase Console → Firestore → Data for campaigns

### Issue: "Quota exceeded"
**Solution:**
1. Check Firebase Console → Usage
2. Optimize read/write operations
3. Implement caching
4. Upgrade to Blaze plan if needed

### Issue: Slow sync
**Solution:**
1. Check internet connection
2. Optimize data structure (reduce size)
3. Choose closer Firestore location
4. Implement debouncing for rapid changes

---

## 📊 Monitoring & Analytics

### View Real-Time Usage
1. Firebase Console → **Firestore Database → Usage**
2. See reads, writes, deletes
3. Check storage used

### Enable Google Analytics (Optional)
1. Firebase Console → Project Settings
2. Click **Integrations** tab
3. Enable **Google Analytics**
4. Create or link GA4 property
5. Track user engagement, campaigns created, etc.

### Set Up Alerts
1. Firebase Console → Project Settings → Usage and billing
2. Set budget alerts
3. Get email when approaching limits

---

## 🚀 Production Deployment

### Before Going Live:

- [ ] Update Firestore security rules (no test mode!)
- [ ] Set up budget alerts
- [ ] Configure custom domain (optional)
- [ ] Enable App Check (recommended)
- [ ] Test all sync scenarios
- [ ] Monitor usage for first week
- [ ] Have backup plan (export feature)

### Recommended Settings:
```javascript
// Firestore rules
- Test mode: Development only (30 days max)
- Production rules: User-based access control
- Indexes: Create composite indexes as needed

// Authentication
- Anonymous: Enabled (for quick start)
- Email/Password: Enabled (for permanent accounts)
- Password reset: Configured

// Budget Alerts
- Set alert at 80% of budget
- Monitor daily usage
- Scale Firestore location if needed
```

---

## 📚 Additional Resources

**Firebase Documentation:**
- https://firebase.google.com/docs/firestore
- https://firebase.google.com/docs/auth

**Video Tutorials:**
- https://www.youtube.com/watch?v=q5J5ho7YUhA (Firestore basics)
- https://www.youtube.com/watch?v=BRkxuZt2XMY (Security rules)

**Community:**
- https://stackoverflow.com/questions/tagged/firebase
- https://firebase.googleblog.com/

---

## ✅ Checklist

### Setup Complete When:
- [ ] Firebase project created
- [ ] Web app registered
- [ ] Config updated in firebase-config.js
- [ ] Firestore enabled
- [ ] Authentication enabled (Anonymous)
- [ ] Security rules configured
- [ ] Cloud sync tested successfully
- [ ] Multi-device sync working
- [ ] Offline sync working
- [ ] Budget alerts set

---

## 🎉 Success!

Once setup is complete, your users can:
- ✅ Access campaigns from any device
- ✅ Never lose data (cloud backup)
- ✅ Sync in real-time across devices
- ✅ Work offline and sync later
- ✅ Share campaigns (future feature)

**Estimated Setup Time:** 5-10 minutes
**Monthly Cost:** $0 (for personal use)
**User Experience:** Seamless, automatic

---

**Document Version:** 1.0
**Last Updated:** 2025-11-13
**Status:** READY FOR SETUP ✅
