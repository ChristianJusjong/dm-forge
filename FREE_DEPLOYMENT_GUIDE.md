# 🚀 Free Deployment Guide

**Cost:** $0/month (100% FREE)
**Setup Time:** 10-15 minutes
**Best Options:** Vercel, Netlify, GitHub Pages, Cloudflare Pages

---

## 🎯 Recommended: Vercel (Easiest & Best)

**Why Vercel:**
- ✅ **100% Free** for personal projects
- ✅ **Automatic deployments** from Git
- ✅ **Global CDN** (fast worldwide)
- ✅ **Automatic HTTPS**
- ✅ **Zero configuration** for Vite apps
- ✅ **Unlimited bandwidth**
- ✅ **Custom domain support** (free)

### Free Tier Limits:
- **Bandwidth:** Unlimited
- **Build time:** 6,000 minutes/month (way more than needed)
- **Deployments:** Unlimited
- **Team size:** 1 (perfect for personal projects)

---

## 📋 Step-by-Step: Deploy to Vercel (10 minutes)

### Step 1: Prepare Your Project

1. **Install Vercel CLI** (optional but helpful):
```bash
npm install -g vercel
```

2. **Ensure your project builds successfully**:
```bash
npm run build
```

Expected output:
```
✓ built in 3.2s
dist/index.html
dist/js/...
```

---

### Step 2: Push to GitHub

1. **Create a GitHub account** (if you don't have one):
   - Go to https://github.com/signup
   - Free account is perfect

2. **Create a new repository**:
   - Go to https://github.com/new
   - Repository name: `dm-forge` (or your choice)
   - Make it **Public** or **Private** (both work)
   - Don't initialize with README (you already have files)
   - Click **Create repository**

3. **Initialize Git in your project** (if not already):
```bash
cd "C:\ClaudeCodeProject\DND Character Sheet"
git init
git add .
git commit -m "Initial commit - D&D DM Forge"
```

4. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/dm-forge.git
git branch -M main
git push -u origin main
```

---

### Step 3: Deploy to Vercel

#### Option A: Using Vercel Website (Recommended for beginners)

1. **Go to Vercel**:
   - Visit https://vercel.com/signup
   - Click **Continue with GitHub**
   - Authorize Vercel to access your repositories

2. **Import your project**:
   - Click **Add New Project**
   - Select **Import Git Repository**
   - Find your `dm-forge` repository
   - Click **Import**

3. **Configure project**:
   - **Framework Preset:** Vite ✅ (auto-detected)
   - **Root Directory:** `./` (leave default)
   - **Build Command:** `npm run build` ✅ (auto-detected)
   - **Output Directory:** `dist` ✅ (auto-detected)
   - **Install Command:** `npm install` ✅ (auto-detected)

4. **Add environment variables** (if using Firebase):
   - Click **Environment Variables**
   - Add your Firebase config:
     ```
     VITE_FIREBASE_API_KEY=your_api_key_here
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
     VITE_FIREBASE_APP_ID=1:123456789:web:abc123
     ```

5. **Deploy**:
   - Click **Deploy**
   - Wait 1-2 minutes for build
   - 🎉 **Your app is live!**

6. **Get your URL**:
   - You'll get a URL like: `https://dm-forge-abc123.vercel.app`
   - Your app is now live and accessible worldwide!

#### Option B: Using Vercel CLI (Faster for developers)

1. **Login to Vercel**:
```bash
vercel login
```

2. **Deploy**:
```bash
vercel
```

Follow prompts:
- **Set up and deploy?** → Y
- **Which scope?** → Your account
- **Link to existing project?** → N
- **Project name?** → dm-forge
- **Directory?** → `./` (press Enter)
- **Override settings?** → N

3. **Production deployment**:
```bash
vercel --prod
```

4. **Done!** Your URL will be shown in the terminal.

---

## 🔄 Automatic Deployments

Once set up, Vercel automatically deploys:
- **Every push to `main`** → Production deployment
- **Every pull request** → Preview deployment (unique URL for testing)

Just push your code:
```bash
git add .
git commit -m "Update feature"
git push
```

Vercel automatically builds and deploys in ~1 minute! ✅

---

## 🌐 Add a Custom Domain (Optional, FREE)

### Option 1: Free Vercel Subdomain
You get `https://your-app.vercel.app` for free!

### Option 2: Your Own Domain

1. **Buy a domain** (optional):
   - Namecheap: $8/year for .com
   - Google Domains: $12/year
   - Cloudflare: $8/year
   - **Or use free subdomain from Vercel!**

2. **Add domain in Vercel**:
   - Go to your project → **Settings** → **Domains**
   - Enter your domain: `dmforge.com`
   - Vercel shows DNS records to add

3. **Update DNS** (in your domain registrar):
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

4. **Wait 5-10 minutes** for DNS propagation
5. **HTTPS automatically enabled** by Vercel!

---

## 📱 Alternative Free Hosting Options

### Option 2: Netlify (Also Excellent)

**Free Tier:**
- 100 GB bandwidth/month
- Unlimited sites
- Automatic HTTPS
- Custom domains

**Deploy to Netlify:**

1. **Create `netlify.toml`** in your project root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Go to Netlify**:
   - https://app.netlify.com/signup
   - Continue with GitHub
   - Import your repository
   - Click **Deploy**

3. **Done!** Your URL: `https://your-app.netlify.app`

---

### Option 3: GitHub Pages (Good for simple sites)

**Free Tier:**
- 1 GB storage
- 100 GB bandwidth/month
- Custom domains

**Deploy to GitHub Pages:**

1. **Install gh-pages**:
```bash
npm install -D gh-pages
```

2. **Update `package.json`**:
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/dm-forge",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Update `vite.config.js`**:
```javascript
export default defineConfig({
  base: '/dm-forge/',  // Your repo name
  // ... rest of config
})
```

4. **Deploy**:
```bash
npm run deploy
```

5. **Enable GitHub Pages**:
   - Go to repository → **Settings** → **Pages**
   - Source: **gh-pages** branch
   - Click **Save**

6. **Done!** Your URL: `https://YOUR_USERNAME.github.io/dm-forge`

---

### Option 4: Cloudflare Pages (Fastest Global CDN)

**Free Tier:**
- Unlimited bandwidth
- Unlimited requests
- 500 builds/month

**Deploy to Cloudflare Pages:**

1. **Go to Cloudflare Pages**:
   - https://pages.cloudflare.com/
   - Sign up (free)
   - Connect GitHub

2. **Create project**:
   - Select your repository
   - **Build command:** `npm run build`
   - **Build output:** `dist`
   - Click **Deploy**

3. **Done!** Your URL: `https://dm-forge.pages.dev`

---

## 🔥 Firebase Hosting (If using Firebase)

Since you already have Firebase for cloud sync, you can use Firebase Hosting too!

**Free Tier:**
- 10 GB storage
- 360 MB/day bandwidth
- Custom domain

**Deploy to Firebase:**

1. **Install Firebase CLI**:
```bash
npm install -g firebase-tools
```

2. **Login**:
```bash
firebase login
```

3. **Initialize**:
```bash
firebase init hosting
```

Select:
- **Public directory:** `dist`
- **Single-page app:** Yes
- **Automatic builds:** No (we'll deploy manually)

4. **Build and deploy**:
```bash
npm run build
firebase deploy
```

5. **Done!** Your URL: `https://your-project.web.app`

---

## 📊 Comparison Table

| Service | Free Bandwidth | Build Time | Custom Domain | Auto Deploy | Best For |
|---------|----------------|------------|---------------|-------------|----------|
| **Vercel** | Unlimited | 6000 min/mo | ✅ Free | ✅ Auto | **Best overall** |
| **Netlify** | 100 GB/mo | 300 min/mo | ✅ Free | ✅ Auto | Great alternative |
| **GitHub Pages** | 100 GB/mo | Unlimited | ✅ Free | ✅ Auto | Simple sites |
| **Cloudflare** | Unlimited | 500 builds/mo | ✅ Free | ✅ Auto | Fastest CDN |
| **Firebase** | 10 GB/mo | Manual | ✅ Free | ⚠️ Manual | Already using Firebase |

**Recommendation:** Use **Vercel** for the best experience!

---

## 🎯 Complete Deployment Checklist

### Before Deployment:
- [ ] Test build locally: `npm run build`
- [ ] Test preview: `npm run preview`
- [ ] Update Firebase config (if using)
- [ ] Test on mobile devices
- [ ] Test PWA installation
- [ ] Check all features work offline

### Initial Deployment:
- [ ] Push code to GitHub
- [ ] Connect to Vercel (or other service)
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Deploy and test live site
- [ ] Test on multiple devices

### After Deployment:
- [ ] Test Firebase cloud sync (if enabled)
- [ ] Test PWA installation on live site
- [ ] Check HTTPS is enabled
- [ ] Test offline functionality
- [ ] Share URL with friends!

---

## 🔒 Security Best Practices

### 1. Environment Variables
Never commit Firebase keys to Git! Use environment variables:

**Create `.env`** in project root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Update `firebase-config.js`**:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

**Add to `.gitignore`**:
```
.env
.env.local
.env.production
firebase-config.js
```

### 2. Firebase Security Rules
Update Firestore rules (see FIREBASE_SETUP_GUIDE.md):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /campaigns/{campaignCode} {
      allow read: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         request.auth.uid in resource.data.get('sharedWith', []));

      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid;

      allow update, delete: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 🚀 Deployment Script (Optional)

Create `deploy.sh` for easy deployment:

```bash
#!/bin/bash

echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  echo "🚀 Deploying to Vercel..."
  vercel --prod
  echo "🎉 Deployment complete!"
else
  echo "❌ Build failed! Fix errors before deploying."
  exit 1
fi
```

Make executable:
```bash
chmod +x deploy.sh
```

Run:
```bash
./deploy.sh
```

---

## 🐛 Troubleshooting

### Build Fails on Vercel

**Issue:** `Module not found` errors

**Fix:**
1. Ensure all dependencies are in `package.json`
2. Run `npm install` locally
3. Commit `package-lock.json`
4. Push to GitHub

---

### PWA Not Installing on Live Site

**Issue:** Install prompt doesn't show

**Fix:**
1. Check HTTPS is enabled (automatic on Vercel)
2. Verify `manifest.json` is accessible at `/manifest.json`
3. Check Service Worker is registered
4. Use Chrome DevTools → Application → Manifest

---

### Firebase Not Working

**Issue:** Firebase errors on live site

**Fix:**
1. Add environment variables in Vercel
2. Update Firebase security rules
3. Add live domain to Firebase authorized domains:
   - Firebase Console → Authentication → Settings
   - Add `your-app.vercel.app` to authorized domains

---

### Custom Domain Not Working

**Issue:** Domain shows error

**Fix:**
1. Wait 5-10 minutes for DNS propagation
2. Check DNS records are correct
3. Try `https://` instead of `http://`
4. Clear browser cache

---

## 📈 Monitoring Your Site

### Vercel Analytics (Free)
- Go to Project → **Analytics**
- See pageviews, visitors, performance
- Completely free!

### Google Analytics (Optional)
Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 💰 Cost Breakdown

### Total Monthly Cost: **$0**

- **Hosting (Vercel):** $0
- **Database (Firebase Free Tier):** $0
- **CDN:** $0
- **HTTPS Certificate:** $0
- **Bandwidth:** $0 (unlimited on Vercel)
- **Build minutes:** $0 (6000 free minutes)

### Optional Costs:
- **Custom domain:** $8-12/year (optional, can use free .vercel.app)
- **Firebase Blaze plan:** Pay-as-you-go (only if exceeding free tier)

**Estimated monthly cost for 1000 users:** Still $0! 🎉

---

## 🎉 You're Done!

Your D&D Dungeon Master Forge is now:
- ✅ **Live on the internet**
- ✅ **Accessible worldwide**
- ✅ **100% free hosting**
- ✅ **Automatic HTTPS**
- ✅ **Automatic deployments**
- ✅ **Global CDN (fast)**
- ✅ **PWA installable**
- ✅ **Cloud sync enabled**
- ✅ **Production-ready**

**Share your URL:**
`https://your-app.vercel.app`

---

## 📚 Additional Resources

**Vercel Documentation:**
- https://vercel.com/docs

**Deployment Best Practices:**
- https://web.dev/deployment/

**Firebase Hosting:**
- https://firebase.google.com/docs/hosting

**PWA on Production:**
- https://web.dev/progressive-web-apps/

---

**Document Version:** 1.0
**Last Updated:** 2025-11-13
**Status:** READY TO DEPLOY ✅
