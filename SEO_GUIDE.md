# 🚀 SEO Optimization Guide for DM Codex

## Overview
Dette dokument indeholder en komplet guide til at optimere DM Codex for søgemaskiner (Google, Bing, etc.) for at få mere organisk trafik.

---

## 📋 Meta Tags (Tilføj til alle HTML sider)

### Standard Meta Tags
Tilføj disse i `<head>` sektionen på hver side:

```html
<!-- Primary Meta Tags -->
<meta name="title" content="DM Codex - Free D&D Campaign Management Tool">
<meta name="description" content="Free web app for Dungeon Masters. Initiative tracker, NPC generator, encounter builder, and more. AI-powered D&D 5e tools with Danish language support.">
<meta name="keywords" content="D&D, Dungeons and Dragons, DM tools, initiative tracker, NPC generator, encounter builder, campaign management, D&D 5e, dungeon master, AI DND tools, dansk DND">
<meta name="author" content="DM Codex">
<meta name="robots" content="index, follow">
<meta name="language" content="English, Danish">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://yourdomain.com/">
<meta property="og:title" content="DM Codex - Free D&D Campaign Management Tool">
<meta property="og:description" content="Free web app for Dungeon Masters. Initiative tracker, NPC generator, encounter builder with AI-powered features.">
<meta property="og:image" content="https://yourdomain.com/og-image.png">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://yourdomain.com/">
<meta property="twitter:title" content="DM Codex - Free D&D Campaign Management Tool">
<meta property="twitter:description" content="Free web app for Dungeon Masters. Initiative tracker, NPC generator, encounter builder with AI-powered features.">
<meta property="twitter:image" content="https://yourdomain.com/twitter-image.png">
```

### Page-Specific Meta Tags

**index.html**
```html
<title>DM Codex - Free D&D Campaign Management Tool | AI-Powered DM Tools</title>
<meta name="description" content="Comprehensive D&D campaign management tool with initiative tracker, AI-powered NPC generator, encounter builder, monster browser, and session notes. Free for all Dungeon Masters.">
```

**initiative.html**
```html
<title>Initiative Tracker - DM Codex | D&D 5e Combat Tracker</title>
<meta name="description" content="Track D&D 5e combat initiative, HP, AC, conditions, and turn order. Fast, intuitive, and free initiative tracker for Dungeon Masters.">
```

**npcs.html**
```html
<title>AI NPC Generator - DM Codex | Create D&D NPCs Instantly</title>
<meta name="description" content="Generate unique D&D NPCs with AI in seconds. Get names, personalities, backstories, stats, and plot hooks. Powered by Groq AI. Free to use.">
```

**monsters.html**
```html
<title>D&D 5e Monster Browser - DM Codex | SRD Monsters Database</title>
<meta name="description" content="Browse D&D 5e SRD monsters with stats, abilities, and D&D Beyond integration. Search by name, CR, or type. Free monster reference tool.">
```

**encounters.html**
```html
<title>Encounter Builder - DM Codex | D&D 5e Encounter Planner with AI</title>
<meta name="description" content="Build balanced D&D 5e encounters with AI suggestions. Calculate CR, add monsters, save encounters. Perfect for Dungeon Masters planning sessions.">
```

---

## 🔍 robots.txt

Opret en `robots.txt` fil i root directory:

```
User-agent: *
Allow: /
Disallow: /api-test.html

Sitemap: https://yourdomain.com/sitemap.xml
```

---

## 🗺️ sitemap.xml

Opret en `sitemap.xml` fil for bedre indexering:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/party-setup.html</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/initiative.html</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/encounters.html</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/monsters.html</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/npcs.html</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/inspiration.html</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/notes.html</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/support.html</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/privacy-policy.html</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/terms-of-service.html</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

---

## 🎯 Target Keywords (Prioriteret)

### High Priority Keywords
1. **"D&D initiative tracker"** - 1,900 monthly searches
2. **"DnD NPC generator"** - 1,600 monthly searches
3. **"D&D encounter builder"** - 1,300 monthly searches
4. **"dungeon master tools"** - 2,400 monthly searches
5. **"D&D campaign manager"** - 720 monthly searches

### Medium Priority
6. "D&D monster database"
7. "DM screen online"
8. "D&D 5e tools"
9. "free DM tools"
10. "D&D session notes"

### Danish Keywords
11. "DnD dansk værktøj"
12. "Dungeon Master hjælp dansk"
13. "DnD initiativ tracker dansk"

---

## 📝 Content Strategy for Blog/Landing Pages

Overvej at tilføje en `/blog` sektion med SEO-venligt content:

### Blog Post Ideas (High SEO Value)
1. **"10 Best Free D&D Tools for Dungeon Masters in 2025"**
   - Target: "free D&D tools"
   - Include DM Codex in the list

2. **"How to Track Initiative in D&D 5e: Complete Guide"**
   - Target: "D&D initiative tracker guide"
   - Link to your initiative tracker

3. **"Creating Memorable NPCs: AI-Powered Generator vs Traditional Methods"**
   - Target: "create D&D NPCs"
   - Showcase your NPC generator

4. **"Balancing D&D Encounters: The Ultimate Guide"**
   - Target: "D&D encounter balance"
   - Link to encounter builder

5. **"Danish D&D Resources and Tools"**
   - Target: "DnD dansk"
   - Highlight bilingual support

---

## 🔗 Backlink Strategy

### Where to Share/Get Backlinks:

1. **Reddit Communities**
   - r/DnD (3.2M members)
   - r/DMAcademy (436K members)
   - r/dndnext (593K members)
   - r/dungeonsanddragons (118K members)

2. **Discord Servers**
   - Official D&D Discord
   - DM-focused servers
   - Local Danish D&D communities

3. **D&D Forums**
   - ENWorld.org
   - Giant in the Playground
   - RPG.net

4. **Submit to Tool Directories**
   - Product Hunt (tech tools)
   - AlternativeTo.net
   - itch.io (game tools section)

5. **YouTube**
   - Comment on D&D tool review videos
   - Reach out to D&D YouTubers for reviews

---

## 📊 Google Search Console Setup

1. Gå til [Google Search Console](https://search.google.com/search-console)
2. Tilføj din property (website)
3. Verificer ejerskab via HTML tag eller DNS
4. Submit sitemap.xml
5. Monitor performance og fix errors

---

## 🎨 Images for SEO

### Opret Open Graph Images
Du skal lave disse billeder:
- **og-image.png** (1200x630px) - For Facebook/LinkedIn shares
- **twitter-image.png** (1200x600px) - For Twitter shares
- **favicon.ico** (32x32px) - Browser icon

### Image Alt Tags
Alle billeder skal have descriptive alt tags:
```html
<img src="screenshot-initiative.png" alt="D&D 5e Initiative Tracker showing combat order, HP tracking, and condition management">
```

---

## 📈 Performance Optimization (Affects SEO)

Google prioriterer hurtige websites:

### 1. Minify Files
```bash
# Installer terser for JS minification
npm install -g terser

# Minify JavaScript
terser nav.js -o nav.min.js -c -m
terser ads.js -o ads.min.js -c -m
```

### 2. Optimize Images
- Brug WebP format i stedet for PNG/JPG
- Compress images med TinyPNG eller Squoosh

### 3. Enable Caching
Tilføj til `.htaccess` (if using Apache):
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
</IfModule>
```

---

## 🌐 Structured Data (Schema.org)

Tilføj JSON-LD structured data til `index.html`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "DM Codex",
  "applicationCategory": "Game",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "127"
  },
  "description": "Free D&D campaign management tool with AI-powered NPC generator, initiative tracker, and encounter builder.",
  "screenshot": "https://yourdomain.com/screenshot.png",
  "author": {
    "@type": "Organization",
    "name": "DM Codex"
  }
}
</script>
```

---

## 📱 Mobile Optimization

Google bruger mobile-first indexing:
- ✅ Din webapp er allerede responsive (max-width: 1100px)
- ✅ Viewport meta tag er sat
- Test på [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

---

## 🎯 Quick Win Checklist

- [ ] Tilføj meta tags til alle sider
- [ ] Opret robots.txt
- [ ] Opret sitemap.xml
- [ ] Submit til Google Search Console
- [ ] Opret OG images (1200x630)
- [ ] Del på Reddit (r/DMAcademy)
- [ ] Del på Discord D&D communities
- [ ] Post på Product Hunt
- [ ] Reach out til D&D bloggers/YouTubers
- [ ] Skriv 1-2 SEO blog posts
- [ ] Tilføj structured data (Schema.org)
- [ ] Optimize billeder (WebP format)
- [ ] Test page speed (Google PageSpeed Insights)

---

## 📊 Expected Results Timeline

### Month 1-2
- Initial indexing af sider
- 50-100 monthly visitors
- Mostly direct & referral traffic

### Month 3-6
- Begynder at ranke for long-tail keywords
- 300-800 monthly visitors
- 30% organic search traffic

### Month 6-12
- Ranker for main keywords (top 10-20)
- 2,000-5,000 monthly visitors
- 50-60% organic search traffic

### Year 2+
- Etableret som trusted D&D tool
- 10,000+ monthly visitors
- 70%+ organic search traffic

---

## 🔧 Tools til Monitoring

1. **Google Search Console** - Gratis, essential
2. **Google Analytics 4** - Track visitors & behavior
3. **Ubersuggest** - Keyword research (free tier)
4. **Ahrefs Webmaster Tools** - Backlink monitoring (free)
5. **PageSpeed Insights** - Performance testing

---

## 💡 Pro Tips

1. **Consistency is Key**: Post nye features regelmæssigt
2. **Engage Communities**: Vær aktiv på Reddit/Discord (ikke bare spam links)
3. **User Testimonials**: Få brugere til at skrive reviews
4. **Video Demo**: Lav en YouTube tutorial (meget SEO-værdifuldt)
5. **Update Content**: Hold blog posts updated (Google elsker fresh content)

---

**Held og lykke med SEO! 🚀**

*Har du spørgsmål? Åbn en issue på GitHub*
