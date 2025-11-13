# 🎨 Design System Guide - DM Codex

Dette er den officielle design system guide for DM Codex webappen. Design systemet sikrer konsistent styling, læsbarhed og brugervenlighed gennem hele applikationen.

## 📋 Indhold

1. [Oversigt](#oversigt)
2. [Hvordan man bruger det](#hvordan-man-bruger-det)
3. [Farvepalette](#farvepalette)
4. [Typografi](#typografi)
5. [Spacing](#spacing)
6. [Komponenter](#komponenter)
7. [Utility Classes](#utility-classes)
8. [Best Practices](#best-practices)

---

## 🌟 Oversigt

Design systemet er defineret i `design-system.css` og inkluderer:

- **CSS Variables** (Custom Properties) for alle design tokens
- **Utility Classes** for hurtig styling
- **Komponent Styles** for konsistente UI-elementer
- **Responsive Design** tokens

### Inkluder i HTML

```html
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="design-system.css">
```

**Vigtigt:** `design-system.css` skal loades EFTER `styles.css` for at overskrive gamle styles.

---

## 🎨 Farvepalette

### Primære Farver

```css
/* Guld toner */
--color-primary: #d4af37;           /* Standard guld */
--color-primary-light: #f0d06b;     /* Lys guld (til tekst) */
--color-primary-dark: #8b7355;      /* Mørk guld/brun */

/* Baggrunde */
--color-bg-darkest: #0a0604;        /* Mørkeste baggrund */
--color-bg-dark: #1a0f0a;           /* Hovedbaggrund */
--color-bg-medium: #2d1f15;         /* Kort baggrunde */
--color-bg-light: #3e2e23;          /* Lysere baggrunde */

/* Tekst farver */
--color-text-primary: #e8d5b7;      /* Hovedtekst (høj kontrast) */
--color-text-secondary: #f4e8d0;    /* Sekundær tekst (højere kontrast) */
--color-text-muted: #b8956a;        /* Dæmpet tekst */
--color-text-dark: #5c4033;         /* Mørk tekst (til lyse baggrunde) */
```

### Semantiske Farver

```css
--color-success: #4caf50;           /* Succes grøn */
--color-warning: #ff9800;           /* Advarsel orange */
--color-danger: #ff6b6b;            /* Fare rød */
--color-info: #7fd77f;              /* Info blå-grøn */
```

### Brug i HTML

```html
<!-- Med CSS variables -->
<h2 style="color: var(--color-primary-light);">Overskrift</h2>

<!-- Med utility classes (anbefalet) -->
<h2 class="text-gold-light">Overskrift</h2>
<p class="text-primary">Normal tekst</p>
<span class="text-success">Succes besked</span>
```

---

## 📝 Typografi

### Font Families

```css
--font-primary: 'Lato', 'Georgia', serif;      /* Brødtekst */
--font-display: 'Cinzel', serif;                /* Overskrifter */
```

### Font Størrelser

```css
/* Base */
--font-size-base: 16px;              /* Root font size */

/* Skala */
--font-size-xs: 0.85rem;             /* 13.6px */
--font-size-sm: 0.9rem;              /* 14.4px */
--font-size-md: 1rem;                /* 16px */
--font-size-lg: 1.1rem;              /* 17.6px */
--font-size-xl: 1.25rem;             /* 20px */

/* Overskrifter */
--font-size-h1: 2.2rem;              /* 35.2px */
--font-size-h2: 1.8rem;              /* 28.8px */
--font-size-h3: 1.5rem;              /* 24px */
--font-size-h4: 1.25rem;             /* 20px */
--font-size-h5: 1.1rem;              /* 17.6px */
--font-size-h6: 1rem;                /* 16px */
```

### Font Weights

```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Line Heights

```css
--line-height-tight: 1.4;
--line-height-normal: 1.6;
--line-height-relaxed: 1.7;
--line-height-loose: 1.8;
```

### Brug i HTML

```html
<!-- Med utility classes -->
<p class="text-lg text-bold">Stor, fed tekst</p>
<p class="text-sm text-muted">Lille, dæmpet tekst</p>
```

---

## 📏 Spacing

### Spacing Skala

```css
--spacing-xs: 0.25rem;    /* 4px */
--spacing-sm: 0.5rem;     /* 8px */
--spacing-md: 1rem;       /* 16px */
--spacing-lg: 1.5rem;     /* 24px */
--spacing-xl: 2rem;       /* 32px */
--spacing-2xl: 3rem;      /* 48px */
--spacing-3xl: 4rem;      /* 64px */
```

### Brug i HTML

```html
<!-- Margin utility classes -->
<div class="m-md">Margin all around</div>
<div class="mt-lg">Margin top large</div>
<div class="mb-xl">Margin bottom extra large</div>

<!-- Padding utility classes -->
<div class="p-md">Padding all around</div>

<!-- Gap (for flex/grid) -->
<div class="d-flex gap-md">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

## 🧩 Komponenter

### Labels

Alle labels bruger konsistent styling automatisk:

```html
<label class="input-label">Navn</label>
<label class="label-sm">Kompakt label</label>
<label class="label-required">Påkrævet felt</label>
```

**Styling:**
- Farve: `--color-primary-light` (#f0d06b)
- Font: Cinzel (display font)
- Størrelse: 1.1rem
- Text shadow for læsbarhed

### Input Felter

```html
<!-- Text input -->
<input type="text" class="input" placeholder="Indtast tekst">

<!-- Number input -->
<input type="number" class="input" value="10">

<!-- Textarea -->
<textarea class="textarea" rows="4"></textarea>

<!-- Select -->
<select class="input">
  <option>Vælg</option>
</select>
```

**Styling:**
- Baggrund: rgba(255, 255, 255, 0.05)
- Border: 2px solid #7c624d
- Tekst: #f4e8d0
- Focus: Guld border med glow effekt

### Buttons

```html
<!-- Standard button -->
<button class="btn">Klik her</button>

<!-- Button varianter (definer i styles.css) -->
<button class="btn btn-primary">Primær</button>
<button class="btn btn-secondary">Sekundær</button>
<button class="btn btn-danger">Slet</button>

<!-- Button størrelser -->
<button class="btn btn-sm">Lille</button>
<button class="btn btn-large">Stor</button>
```

### Cards

```html
<div class="card">
  <h3 class="text-gold mb-md">Kort Titel</h3>
  <p class="text-primary">Kort indhold her...</p>
</div>
```

---

## 🛠️ Utility Classes

### Tekst Farver

```html
<p class="text-primary">Primær tekst</p>
<p class="text-secondary">Sekundær tekst</p>
<p class="text-muted">Dæmpet tekst</p>
<p class="text-gold">Guld tekst</p>
<p class="text-gold-light">Lys guld tekst</p>
<p class="text-success">Succes tekst</p>
<p class="text-warning">Advarsel tekst</p>
<p class="text-danger">Fare tekst</p>
```

### Tekst Størrelser

```html
<p class="text-xs">Meget lille</p>
<p class="text-sm">Lille</p>
<p class="text-md">Medium</p>
<p class="text-lg">Stor</p>
<p class="text-xl">Meget stor</p>
```

### Tekst Weights

```html
<p class="text-light">Light</p>
<p class="text-normal">Normal</p>
<p class="text-medium">Medium</p>
<p class="text-semibold">Semibold</p>
<p class="text-bold">Bold</p>
```

### Tekst Alignment

```html
<p class="text-left">Venstre</p>
<p class="text-center">Centeret</p>
<p class="text-right">Højre</p>
```

### Display

```html
<div class="d-none">Skjult</div>
<div class="d-block">Block</div>
<div class="d-flex">Flex</div>
<div class="d-grid">Grid</div>
```

### Flexbox

```html
<div class="d-flex justify-center align-center gap-md">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

**Flexbox utilities:**
- `justify-start`, `justify-center`, `justify-end`, `justify-between`
- `align-start`, `align-center`, `align-end`
- `flex-row`, `flex-column`
- `flex-wrap`, `flex-nowrap`

### Width

```html
<div class="w-100">Full width</div>
<div class="w-auto">Auto width</div>
```

---

## ✅ Best Practices

### ❌ Undgå dette:

```html
<!-- DÅRLIGT: Inline styles -->
<label style="color: #d4af37; font-size: 18px;">Label</label>

<!-- DÅRLIGT: Hardcoded farver -->
<p style="color: #e8d5b7;">Tekst</p>

<!-- DÅRLIGT: Inkonsistent spacing -->
<div style="margin-top: 17px; padding: 23px;">Content</div>
```

### ✅ Gør dette i stedet:

```html
<!-- GODT: Brug utility classes -->
<label class="input-label">Label</label>

<!-- GODT: Brug design system farver -->
<p class="text-primary">Tekst</p>

<!-- GODT: Brug spacing skala -->
<div class="mt-lg p-xl">Content</div>
```

### 📋 Tjekliste for nye komponenter:

- [ ] Brug CSS variables for farver
- [ ] Brug spacing skala for margin/padding
- [ ] Brug font size tokens
- [ ] Brug utility classes hvor muligt
- [ ] Test læsbarhed (mindst 4.5:1 kontrast ratio)
- [ ] Test på mobile enheder
- [ ] Dokumenter nye komponenter her

### 🎯 Kontrast Retningslinjer

**WCAG 2.0 AA Standard:**
- Normal tekst: Minimum 4.5:1 kontrast ratio
- Stor tekst (18px+): Minimum 3:1 kontrast ratio

**Anbefalede kombinationer:**

✅ **God kontrast:**
- `--color-text-primary` (#e8d5b7) på `--color-bg-dark` (#1a0f0a)
- `--color-text-secondary` (#f4e8d0) på `--color-bg-dark` (#1a0f0a)
- `--color-primary-light` (#f0d06b) på `--color-bg-dark` (#1a0f0a)

⚠️ **Undgå:**
- `--color-text-muted` (#b8956a) til lang brødtekst
- Lys tekst på lys baggrund
- Mørk tekst på mørk baggrund

---

## 🔄 Migration Guide

### Konverter gammel kode til design system:

**Før:**
```html
<div class="card" style="margin-bottom: 1.5rem;">
  <h4 style="color: var(--wood-brown); margin-bottom: 1rem;">Titel</h4>
  <label style="color: #d4af37;">Label</label>
  <p style="color: #d4c3a0; font-size: 0.9rem;">Tekst</p>
</div>
```

**Efter:**
```html
<div class="card mb-lg">
  <h4 class="text-gold mb-md">Titel</h4>
  <label class="input-label">Label</label>
  <p class="text-primary">Tekst</p>
</div>
```

### Find og erstat mønstre:

```bash
# Find problematiske inline styles
grep -r 'style="color:' *.html

# Find gamle CSS variabler
grep -r 'var(--wood-brown)' *.html
```

---

## 📱 Responsive Design

Design systemet inkluderer automatisk responsive font-størrelser:

**Tablet (max-width: 768px):**
- Base font: 15px
- H1: 1.8rem
- Mindre padding/spacing

**Mobile (max-width: 480px):**
- Base font: 14px
- H1: 1.6rem
- Kompakt button sizes

**Specialized layouts:**
```css
.creature-form-grid {
  /* Desktop: 6 columns */
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto;

  /* Tablet: 2 columns */
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  /* Mobile: 1 column */
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}
```

---

## 🆘 Support

Hvis du har spørgsmål eller forslag til design systemet:

1. Check først denne guide
2. Se `design-system.css` for alle tilgængelige tokens
3. Test ændringer lokalt før deployment
4. Dokumenter nye patterns her

**Husk:** Konsistens er nøglen til god UX! 🎯
