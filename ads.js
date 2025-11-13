// ==========================================
// GOOGLE ADSENSE INTEGRATION
// ==========================================

// Configuration
const ADSENSE_CONFIG = {
  enabled: true, // Set to false to disable ads globally
  client: 'ca-pub-XXXXXXXXXXXXXXXX', // Replace with your AdSense client ID
  slots: {
    sidebar: 'XXXXXXXXXX', // Replace with your ad slot ID
  }
};

// Initialize AdSense ads
function initializeAds() {
  if (!ADSENSE_CONFIG.enabled) {
    console.log('📢 Ads are disabled');
    return;
  }

  // Check if screen is wide enough for ads
  if (window.innerWidth < 1400) {
    console.log('📢 Screen too small for sidebar ads');
    return;
  }

  // Inject AdSense script
  if (!document.querySelector('script[src*="adsbygoogle"]')) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.setAttribute('data-ad-client', ADSENSE_CONFIG.client);
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }

  // Create ad containers
  createAdSidebars();
}

// Create left and right sidebar ad containers
function createAdSidebars() {
  const body = document.body;

  // Left sidebar
  const leftAd = createAdContainer('left');
  body.appendChild(leftAd);

  // Right sidebar
  const rightAd = createAdContainer('right');
  body.appendChild(rightAd);

  // Initialize ads after a short delay
  setTimeout(() => {
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, 100);
}

// Create a single ad container
function createAdContainer(position) {
  const container = document.createElement('div');
  container.className = `ad-container ${position}`;

  const wrapper = document.createElement('div');
  wrapper.className = 'ad-wrapper';

  const label = document.createElement('div');
  label.className = 'ad-label';
  label.textContent = 'Advertisement';

  // Create AdSense ad unit
  const ad = document.createElement('ins');
  ad.className = 'adsbygoogle';
  ad.style.display = 'block';
  ad.setAttribute('data-ad-client', ADSENSE_CONFIG.client);
  ad.setAttribute('data-ad-slot', ADSENSE_CONFIG.slots.sidebar);
  ad.setAttribute('data-ad-format', 'auto');
  ad.setAttribute('data-full-width-responsive', 'true');

  wrapper.appendChild(label);
  wrapper.appendChild(ad);
  container.appendChild(wrapper);

  return container;
}

// Placeholder ads for testing (before AdSense approval)
function createPlaceholderAds() {
  const body = document.body;

  // Left placeholder
  const leftPlaceholder = createPlaceholderContainer('left');
  body.appendChild(leftPlaceholder);

  // Right placeholder
  const rightPlaceholder = createPlaceholderContainer('right');
  body.appendChild(rightPlaceholder);
}

function createPlaceholderContainer(position) {
  const container = document.createElement('div');
  container.className = `ad-container ${position}`;

  const wrapper = document.createElement('div');
  wrapper.className = 'ad-wrapper';

  const label = document.createElement('div');
  label.className = 'ad-label';
  label.textContent = 'Advertisement';

  const placeholder = document.createElement('div');
  placeholder.style.cssText = `
    width: 160px;
    height: 600px;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(139, 0, 0, 0.1) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(212, 175, 55, 0.4);
    font-size: 12px;
    text-align: center;
    border-radius: 4px;
    font-family: 'Cinzel', serif;
    padding: 1rem;
  `;
  placeholder.textContent = '160x600 Ad Space';

  wrapper.appendChild(label);
  wrapper.appendChild(placeholder);
  container.appendChild(wrapper);

  return container;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Use placeholder ads until you have AdSense approval
  // Comment out this line and uncomment initializeAds() when ready
  createPlaceholderAds();

  // Uncomment this when you have your AdSense client ID
  // initializeAds();
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const ads = document.querySelectorAll('.ad-container');
    if (window.innerWidth < 1400) {
      ads.forEach(ad => ad.style.display = 'none');
    } else {
      ads.forEach(ad => ad.style.display = 'block');
    }
  }, 250);
});
