/**
 * Generate Critical CSS Script
 * Extracts critical above-the-fold CSS and inlines it in HTML files
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Read critical CSS file
const criticalCSS = readFileSync('./critical-css.css', 'utf8');

// Minify CSS (basic minification)
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around special chars
    .replace(/;}/g, '}') // Remove last semicolon in block
    .trim();
}

const minifiedCriticalCSS = minifyCSS(criticalCSS);

// HTML files to update
const htmlFiles = [
  'index.html',
  'campaign-start.html',
  'configuration.html',
  'initiative.html',
  'encounters.html',
  'monsters.html',
  'npcs.html',
  'notes.html',
  'inspiration.html',
  'backup.html'
];

console.log('🎨 Generating Critical CSS...\n');

htmlFiles.forEach((file) => {
  try {
    let html = readFileSync(file, 'utf8');

    // Check if critical CSS is already inlined
    if (html.includes('/* CRITICAL CSS */')) {
      console.log(`⏭️  Skipping ${file} (already has critical CSS)`);
      return;
    }

    // Find the closing </head> tag
    const headCloseIndex = html.indexOf('</head>');

    if (headCloseIndex === -1) {
      console.warn(`⚠️  Warning: ${file} doesn't have a </head> tag`);
      return;
    }

    // Insert critical CSS before </head>
    const criticalCSSBlock = `
  <!-- Critical CSS - Inline for fastest first paint -->
  <style>
    /* CRITICAL CSS */
    ${minifiedCriticalCSS}
  </style>

  <!-- Async load non-critical CSS -->
  <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <link rel="preload" href="design-system.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <link rel="preload" href="medieval-theme.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <link rel="preload" href="responsive-design.css" as="style" onload="this.onload=null;this.rel='stylesheet'">

  <!-- Fallback for browsers without JS -->
  <noscript>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="design-system.css">
    <link rel="stylesheet" href="medieval-theme.css">
    <link rel="stylesheet" href="responsive-design.css">
  </noscript>
`;

    // Remove existing stylesheet links that we're making async
    html = html.replace(/<link\s+rel="stylesheet"\s+href="(styles|design-system|medieval-theme|responsive-design|global-overrides)\.css"[^>]*>/g, '');

    // Insert critical CSS
    html = html.slice(0, headCloseIndex) + criticalCSSBlock + html.slice(headCloseIndex);

    // Write updated HTML
    writeFileSync(file, html, 'utf8');

    console.log(`✅ Updated ${file}`);
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log('\n🎉 Critical CSS generation complete!');
console.log('\n📊 Stats:');
console.log(`   Original CSS size: ${criticalCSS.length} bytes`);
console.log(`   Minified CSS size: ${minifiedCriticalCSS.length} bytes`);
console.log(`   Savings: ${((1 - minifiedCriticalCSS.length / criticalCSS.length) * 100).toFixed(2)}%`);
console.log(`   Files updated: ${htmlFiles.length}`);

console.log('\n💡 Next steps:');
console.log('   1. Test pages to ensure styling is correct');
console.log('   2. Run Lighthouse audit to measure performance');
console.log('   3. Build for production: npm run build');
