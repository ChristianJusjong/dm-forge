# 🚂 Deploy to Railway - Quick Guide

**Railway is perfect for your app!** It's just as good as Vercel and you already have an account.

---

## 🎯 Deploy to Railway (5 minutes)

### Step 1: Push to GitHub

Since your GitHub username is **ChristianJusjong**, run these commands:

```bash
cd "C:\ClaudeCodeProject\DND Character Sheet"

git remote add origin https://github.com/ChristianJusjong/dm-forge.git

git branch -M main

git push -u origin main
```

**Note:** Make sure you've created the `dm-forge` repository first at https://github.com/new

---

### Step 2: Deploy to Railway

#### Option A: Using Railway CLI (Fastest)

1. **Install Railway CLI** (if not already):
```bash
npm install -g @railway/cli
```

2. **Login:**
```bash
railway login
```

3. **Initialize and deploy:**
```bash
cd "C:\ClaudeCodeProject\DND Character Sheet"
railway init
railway up
```

4. **Done!** Railway will give you a URL.

---

#### Option B: Using Railway Dashboard (Easier)

1. **Go to Railway Dashboard:**
   - Visit: https://railway.app/dashboard
   - Login with your account

2. **Create New Project:**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - If prompted, authorize Railway to access your GitHub

3. **Select Repository:**
   - Find and select: **`ChristianJusjong/dm-forge`**
   - Click to select it

4. **Railway Auto-Detects Everything:**
   - ✅ Build command: `npm run build`
   - ✅ Start command: Will serve static files
   - No configuration needed!

5. **Add Static Site Configuration:**
   - Railway needs to know to serve the `dist` folder
   - See Step 3 below

---

### Step 3: Configure Railway for Static Site

Create a `railway.json` file (I'll create this for you):

Railway will automatically:
- Install dependencies
- Run build
- Serve the `dist` folder

---

### Step 4: Get Your Live URL

1. **In Railway Dashboard:**
   - Click on your deployed project
   - Go to **Settings** tab
   - Click **"Generate Domain"**

2. **Your URL will be:**
   ```
   https://dm-forge-production-XXXX.up.railway.app
   ```

3. **Visit your URL** - Your app is live! 🎉

---

## 🔧 Railway Configuration Files

I'll create these files for you to make deployment smooth:

1. **railway.json** - Railway configuration
2. **nixpacks.toml** - Build configuration (optional)

---

## 💰 Railway Pricing

**Free Tier (Starter Plan):**
- **$5 free credits** per month
- **500 hours** of usage
- Perfect for personal projects
- **More than enough** for your app!

**Cost for your app:** ~$0-2/month (well within free tier)

---

## 🔄 Automatic Deployments

After initial setup, every push to GitHub triggers automatic deployment:

```bash
git add .
git commit -m "Update feature"
git push
```

Railway automatically:
1. Detects push
2. Builds app
3. Deploys new version
4. Updates live URL

---

## 🆚 Railway vs Vercel

Both are excellent! Here's the comparison:

| Feature | Railway | Vercel |
|---------|---------|--------|
| **Free tier** | $5 credits/mo | Unlimited |
| **Build time** | Fast | Very fast |
| **Custom domain** | ✅ Free | ✅ Free |
| **Auto deploy** | ✅ Yes | ✅ Yes |
| **Database** | ✅ Built-in | ❌ Separate |
| **Best for** | Full-stack | Static/SSR |

**For your static D&D app:** Both work perfectly! Since you have Railway, use it!

---

## 📊 Railway Features for Your App

**✅ What you get:**
- Global CDN
- Automatic HTTPS
- Custom domains
- Environment variables
- Deployment history
- Rollback capability
- Real-time logs

---

## 🔥 Optional: Add Firebase Environment Variables

If using Firebase cloud sync:

1. **In Railway Dashboard:**
   - Select your project
   - Go to **Variables** tab
   - Click **"New Variable"**

2. **Add these:**
   ```
   VITE_FIREBASE_API_KEY=your_actual_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

3. **Redeploy** (Railway will do this automatically)

---

## 🎯 Complete Deployment Checklist

### Before Deployment:
- [x] Git repository initialized ✅
- [x] All files committed ✅
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Domain generated
- [ ] App tested live

### After Deployment:
- [ ] Test PWA installation
- [ ] Test offline mode
- [ ] Test on mobile
- [ ] Share URL with friends!

---

## 🚀 Quick Start Commands

**Complete deployment in 5 commands:**

```bash
# 1. Navigate to project
cd "C:\ClaudeCodeProject\DND Character Sheet"

# 2. Connect to GitHub
git remote add origin https://github.com/ChristianJusjong/dm-forge.git
git branch -M main
git push -u origin main

# 3. Deploy to Railway (if using CLI)
railway init
railway up
```

**Or just use the Railway Dashboard** (easier for first time)!

---

## 📱 Your Live URLs

After deployment:

**Production URL:**
```
https://dm-forge-production.up.railway.app
```

**GitHub Repository:**
```
https://github.com/ChristianJusjong/dm-forge
```

**Railway Dashboard:**
```
https://railway.app/project/YOUR_PROJECT_ID
```

---

## 🐛 Troubleshooting

### Build Fails

**Check Railway logs:**
- Dashboard → Your Project → Deployments → Click deployment → View logs
- Common issue: Missing dependencies
- Fix: Ensure `package.json` is correct

### Port Error

**Railway expects port from environment:**
- For static sites, this is handled automatically
- If issues, Railway serves from `dist` folder

### Environment Variables Not Working

**Check variable names:**
- Must start with `VITE_` for Vite apps
- Check spelling matches exactly
- Redeploy after adding variables

---

## 💡 Pro Tips

**1. Custom Domain (Free):**
- Railway Settings → Domains → Add custom domain
- Point your domain's CNAME to Railway
- HTTPS automatic!

**2. View Logs:**
- Dashboard → Your Project → Deployments
- Real-time logs help debug issues

**3. Rollback:**
- Dashboard → Deployments
- Click any previous deployment
- Click "Redeploy" to rollback

**4. Metrics:**
- Dashboard shows CPU, memory, network usage
- Monitor your app's performance

---

## 🎉 Summary

Railway is perfect for your app because:

✅ **Free tier** is generous ($5 credits/month)
✅ **Easy setup** with GitHub integration
✅ **Automatic deployments** on every push
✅ **Built-in database** if you need it later
✅ **Great for full-stack** apps

Your D&D app will be live in minutes! 🚂

---

## Next Steps

1. **Create GitHub repo** (if not already): https://github.com/new
2. **Push your code** using the commands above
3. **Go to Railway**: https://railway.app/dashboard
4. **Deploy from GitHub**
5. **Generate domain**
6. **Share your app!** 🎊

---

**Document Version:** 1.0
**Created:** 2025-11-13
**Status:** READY FOR RAILWAY 🚂
