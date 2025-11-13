# 💰 Google AdSense Setup Guide

## Overview
Denne guide hjælper dig med at sætte Google AdSense op på DM Codex webapp'en for at tjene penge via reklamer.

---

## 📋 Trin 1: Ansøg om Google AdSense

### Forudsætninger
- Du skal have et Google-konto
- Din webapp skal være hosted på et offentligt domæne (ikke localhost)
- Du skal have original content (✅ du har allerede det!)

### Ansøgningsproces
1. Gå til: https://www.google.com/adsense
2. Klik "Get started" / "Kom i gang"
3. Indtast dit website URL (f.eks. `https://dmcodex.com`)
4. Indtast din email og accept vilkår
5. Forbind dit domæne ved at tilføje AdSense kode i `<head>` sektionen

---

## 📝 Trin 2: Verificer dit website

Google vil give dig en verificeringskode som denne:
```html
<script data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js">
</script>
```

**Hvor skal du tilføje den?**
Du behøver IKKE tilføje den manuelt - den er allerede integreret i `ads.js` filen!

---

## ⚙️ Trin 3: Konfigurer ads.js

Åbn `ads.js` filen og opdater følgende:

```javascript
const ADSENSE_CONFIG = {
  enabled: true,
  client: 'ca-pub-XXXXXXXXXXXXXXXX', // ← ERSTAT med dit AdSense Publisher ID
  slots: {
    sidebar: 'XXXXXXXXXX', // ← ERSTAT med dit Ad Slot ID
  }
};
```

### Hvor finder du disse værdier?

1. **Publisher ID (client)**:
   - Find det i din AdSense dashboard
   - Det starter altid med `ca-pub-`
   - Eksempel: `ca-pub-1234567890123456`

2. **Ad Slot ID**:
   - Opret en ny "Ad unit" i AdSense dashboard
   - Vælg "Display ads" → "Vertical" (160x600)
   - Kopier Slot ID fra koden de giver dig

---

## 🚀 Trin 4: Aktiver Rigtige Ads

I `ads.js` på linje 146, ændre fra:
```javascript
// Nuværende (placeholder):
createPlaceholderAds();

// Til (rigtige ads):
initializeAds();
```

Kommentarer det ud således:
```javascript
// Use placeholder ads until you have AdSense approval
// createPlaceholderAds();

// Uncomment this when you have your AdSense client ID
initializeAds();
```

---

## 📊 Ad Placering

Webapp'en har allerede sidebar ads konfigureret:

- **Venstre sidebar**: 160x600 banner
- **Højre sidebar**: 160x600 banner
- **Synlighed**: Kun på skærme bredere end 1400px
- **Stil**: Diablo-inspireret mørk tema matching

---

## 💡 Optimering Tips

### 1. **Ad Types**
I AdSense dashboard kan du vælge:
- ✅ Display ads (anbefalet for sidebars)
- ✅ In-feed ads (til content areas)
- ❌ Pop-ups/interstitials (irriterende for brugere)

### 2. **Auto Ads vs Manual**
- **Auto Ads**: Google placerer ads automatisk (nemt, men mindre kontrol)
- **Manual Ads**: Du styrer præcist hvor ads vises (anbefalet for din webapp)

### 3. **Responsive Ads**
Webapp'en bruger:
```javascript
ad.setAttribute('data-full-width-responsive', 'true');
```
Dette gør ads responsive og adaptive.

---

## 🔍 Test Mode

Før AdSense approval, vil du se **placeholder ads** (grå bokse).

Efter approval og konfiguration, vil rigtige ads vises.

**Vigtigt**: Test aldrig ved at klikke på dine egne ads! Det er imod AdSense regler.

---

## 💰 Forventet Indtjening

### CPM (Cost Per Mille - per 1000 visninger)
- **Gaming/D&D niche**: $2-8 CPM
- **US/UK trafik**: Højere CPM
- **Dansk trafik**: Lavere CPM ($1-3)

### Estimat baseret på trafik:
| Daglige Besøgende | Månedlige Pageviews | Estimeret Indtjening |
|-------------------|---------------------|---------------------|
| 50                | 3,000               | $6-24/måned         |
| 200               | 12,000              | $24-96/måned        |
| 1,000             | 60,000              | $120-480/måned      |
| 5,000             | 300,000             | $600-2,400/måned    |

*Antager 2 ads per side × 2 pageviews per besøg*

---

## ⚠️ AdSense Policies - VIGTIGT!

### DO:
- ✅ Lav original, værdifuld content
- ✅ Sørg for god brugeroplevelse
- ✅ Respekter copyright (D&D SRD er OK!)
- ✅ Hav Privacy Policy og Terms of Service

### DON'T:
- ❌ Klik aldrig på dine egne ads
- ❌ Bed ikke brugere om at klikke på ads
- ❌ Placer ads på error pages
- ❌ Modificer AdSense koden

---

## 📄 Påkrævede Sider

Du skal have disse sider på dit website:

### 1. Privacy Policy
Inkluder:
- Hvilke data du indsamler
- Google AdSense cookies
- Google Analytics (hvis du bruger det)
- GDPR compliance (for EU brugere)

### 2. Terms of Service
Inkluder:
- Brugsvilkår
- Copyright notices
- Disclaimer for D&D content

---

## 🚦 Godkendelsesproces

1. **Ansøgning** → 1-2 dage
2. **Website review** → 1-4 uger
3. **Godkendelse/Afvisning** → Email notifikation

### Almindelige afvisningsgrunde:
- Ikke nok content
- Copyright issues
- Navigation problemer
- Manglende Privacy Policy

**Din webapp burde blive godkendt**, da den har:
- ✅ Original features (AI generators, initiative tracker)
- ✅ God UX/design
- ✅ Værdifuldt content for D&D spillere
- ✅ SRD-compliant monster data

---

## 🔧 Troubleshooting

### Problem: "Ads not showing"
**Løsning**:
1. Tjek browser console for fejl
2. Verificer AdSense koden er korrekt
3. Vent 24-48 timer efter aktivering
4. Tjek at ad blocker er slået fra

### Problem: "Low earnings"
**Løsning**:
1. Øg trafik (SEO, social media)
2. Optimer ad placering
3. Test forskellige ad formater
4. Target højere CPM trafik (US/UK)

### Problem: "Account suspended"
**Løsning**:
- Gennemgå AdSense policies
- Fjern eventuelle policy violations
- Appeal via AdSense dashboard

---

## 📈 Næste Skridt

1. **Host webapp'en** på et domæne (Netlify, Vercel, eller Cloudflare Pages er gratis!)
2. **Ansøg om AdSense** (kan tage 2-4 uger)
3. **Mens du venter**: Byg brugerbase via Reddit, Discord communities
4. **Efter godkendelse**: Konfigurer `ads.js` og aktiver ads
5. **Monitor performance** via AdSense dashboard

---

## 🎯 Alternative/Supplerende Indtægtskilder

Mens du venter på AdSense godkendelse:

1. **Ko-fi/Patreon** - Direkte supporter donations
2. **Amazon Affiliate** - Link til D&D bøger/dice
3. **Freemium model** - Betal for premium features
4. **Buy Me A Coffee** - One-time donations

---

## 📚 Resourcer

- [AdSense Help Center](https://support.google.com/adsense)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)
- [GDPR Compliance Guide](https://support.google.com/adsense/answer/9012903)

---

**Held og lykke med monetiseringen! 💰⚔️**

*Har du spørgsmål? Åbn en issue på GitHub eller kontakt mig.*
