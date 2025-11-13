// ==========================================
// PWA INSTALL PROMPT
// Custom installation UI for Progressive Web App
// ==========================================

let deferredPrompt = null;
let installBanner = null;

/**
 * Initialize PWA install prompt
 */
export function initializeInstallPrompt() {
  if (typeof window === 'undefined') {
    return;
  }

  console.log('🚀 PWA Install Prompt initialized');

  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

  // Track successful installs
  window.addEventListener('appinstalled', handleAppInstalled);

  // Check if already installed
  if (isStandalone()) {
    console.log('✅ App is already installed');
    showInstalledBadge();
  }

  // Check if user dismissed install prompt recently
  const dismissed = localStorage.getItem('install-prompt-dismissed');
  if (dismissed) {
    const dismissedTime = parseInt(dismissed);
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    if (daysSinceDismissed < 7) {
      console.log(`⏰ Install prompt dismissed ${daysSinceDismissed.toFixed(1)} days ago`);
      return;
    }
  }
}

/**
 * Handle beforeinstallprompt event
 */
function handleBeforeInstallPrompt(e) {
  console.log('📱 beforeinstallprompt event fired');

  // Prevent default browser install prompt
  e.preventDefault();

  // Store event for later use
  deferredPrompt = e;

  // Show custom install UI after delay (don't annoy users immediately)
  setTimeout(() => {
    showInstallBanner();
  }, 5000); // Show after 5 seconds
}

/**
 * Show custom install banner
 */
function showInstallBanner() {
  // Don't show if banner already exists
  if (installBanner) {
    return;
  }

  // Create banner element
  installBanner = document.createElement('div');
  installBanner.className = 'pwa-install-banner';
  installBanner.innerHTML = `
    <div class="install-banner-content">
      <div class="install-banner-icon">📱</div>
      <div class="install-banner-text">
        <h4 class="install-banner-title">Install Dungeon Master Forge</h4>
        <p class="install-banner-subtitle">Quick access and offline play!</p>
      </div>
      <div class="install-banner-actions">
        <button class="btn btn-primary btn-sm" id="pwa-install-btn">Install</button>
        <button class="btn btn-text btn-sm" id="pwa-dismiss-btn">Not now</button>
      </div>
    </div>
  `;

  // Add styles
  addInstallBannerStyles();

  // Append to body
  document.body.appendChild(installBanner);

  // Trigger animation
  setTimeout(() => {
    installBanner.classList.add('install-banner-show');
  }, 100);

  // Add event listeners
  document.getElementById('pwa-install-btn').addEventListener('click', handleInstallClick);
  document.getElementById('pwa-dismiss-btn').addEventListener('click', handleDismissClick);

  console.log('✅ Install banner shown');
}

/**
 * Handle install button click
 */
async function handleInstallClick() {
  if (!deferredPrompt) {
    console.warn('⚠️ No deferred prompt available');
    return;
  }

  console.log('👆 User clicked install');

  // Hide banner
  hideInstallBanner();

  // Show native install prompt
  deferredPrompt.prompt();

  // Wait for user choice
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`📊 User choice: ${outcome}`);

  if (outcome === 'accepted') {
    console.log('✅ User accepted install');

    // Track installation
    trackEvent('pwa_install_accepted', {
      event_category: 'engagement',
      event_label: 'PWA Install Accepted'
    });
  } else {
    console.log('❌ User dismissed install');

    // Track dismissal
    trackEvent('pwa_install_dismissed', {
      event_category: 'engagement',
      event_label: 'PWA Install Dismissed'
    });
  }

  // Clear deferred prompt
  deferredPrompt = null;
}

/**
 * Handle dismiss button click
 */
function handleDismissClick() {
  console.log('👋 User dismissed install banner');

  // Hide banner
  hideInstallBanner();

  // Store dismissal time
  localStorage.setItem('install-prompt-dismissed', Date.now().toString());

  // Track dismissal
  trackEvent('pwa_banner_dismissed', {
    event_category: 'engagement',
    event_label: 'PWA Banner Dismissed'
  });
}

/**
 * Hide install banner with animation
 */
function hideInstallBanner() {
  if (!installBanner) {
    return;
  }

  installBanner.classList.remove('install-banner-show');

  setTimeout(() => {
    if (installBanner && installBanner.parentNode) {
      installBanner.parentNode.removeChild(installBanner);
    }
    installBanner = null;
  }, 300);
}

/**
 * Handle successful app installation
 */
function handleAppInstalled() {
  console.log('🎉 PWA installed successfully!');

  // Track installation
  trackEvent('pwa_installed', {
    event_category: 'engagement',
    event_label: 'PWA Installed'
  });

  // Show success notification
  showSuccessNotification('App installed successfully! 🎉');

  // Clear deferred prompt
  deferredPrompt = null;

  // Show installed badge
  showInstalledBadge();
}

/**
 * Check if app is running in standalone mode (installed)
 */
function isStandalone() {
  // Check display-mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // Check iOS
  if (window.navigator.standalone === true) {
    return true;
  }

  // Check Android
  if (document.referrer.includes('android-app://')) {
    return true;
  }

  return false;
}

/**
 * Show installed badge in navigation
 */
function showInstalledBadge() {
  // Add "Installed" badge to navigation
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  const badge = document.createElement('div');
  badge.className = 'pwa-installed-badge';
  badge.innerHTML = '✅ Installed';
  badge.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 1px solid #4caf50;
  `;

  nav.style.position = 'relative';
  nav.appendChild(badge);
}

/**
 * Show success notification
 */
function showSuccessNotification(message) {
  if (typeof showSyncNotification === 'function') {
    showSyncNotification(message, 'success');
  } else {
    // Fallback notification
    const notification = document.createElement('div');
    notification.className = 'pwa-success-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: rgba(76, 175, 80, 0.95);
      color: #fff;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
}

/**
 * Track event (analytics)
 */
function trackEvent(eventName, eventParams = {}) {
  // Google Analytics 4
  if (typeof gtag === 'function') {
    gtag('event', eventName, eventParams);
  }

  // Console log for development
  console.log(`📊 Event tracked: ${eventName}`, eventParams);
}

/**
 * Add CSS styles for install banner
 */
function addInstallBannerStyles() {
  // Check if styles already added
  if (document.getElementById('pwa-install-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'pwa-install-styles';
  style.textContent = `
    .pwa-install-banner {
      position: fixed;
      bottom: -200px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #2d1f15 0%, #1a1308 100%);
      border: 2px solid #d4af37;
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7);
      z-index: 10000;
      max-width: 90%;
      width: 500px;
      transition: bottom 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .pwa-install-banner.install-banner-show {
      bottom: 20px;
    }

    .install-banner-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .install-banner-icon {
      font-size: 2.5rem;
      flex-shrink: 0;
      animation: bounce 2s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .install-banner-text {
      flex: 1;
      min-width: 0;
    }

    .install-banner-title {
      color: #d4af37;
      margin: 0 0 0.25rem 0;
      font-size: 1.1rem;
      font-weight: 700;
      text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
    }

    .install-banner-subtitle {
      color: #b8956a;
      margin: 0;
      font-size: 0.9rem;
    }

    .install-banner-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      white-space: nowrap;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .pwa-install-banner {
        width: calc(100% - 40px);
        padding: 1rem;
      }

      .install-banner-content {
        flex-direction: column;
        text-align: center;
        gap: 0.75rem;
      }

      .install-banner-actions {
        flex-direction: row;
        width: 100%;
      }

      .install-banner-actions .btn {
        flex: 1;
      }
    }

    /* Animations */
    @keyframes slideInRight {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;

  document.head.appendChild(style);
}

/**
 * Manual install trigger (for custom button)
 */
export function triggerInstall() {
  if (deferredPrompt) {
    handleInstallClick();
  } else if (isStandalone()) {
    alert('App is already installed!');
  } else {
    alert('Install prompt not available. Please use browser menu to install.');
  }
}

/**
 * Check if install prompt is available
 */
export function canInstall() {
  return deferredPrompt !== null;
}

/**
 * Get installation status
 */
export function getInstallStatus() {
  return {
    isInstalled: isStandalone(),
    canPrompt: deferredPrompt !== null,
    isDismissed: localStorage.getItem('install-prompt-dismissed') !== null
  };
}

// Make functions globally available
if (typeof window !== 'undefined') {
  window.initializeInstallPrompt = initializeInstallPrompt;
  window.triggerInstall = triggerInstall;
  window.canInstall = canInstall;
  window.getInstallStatus = getInstallStatus;
  window.isStandalone = isStandalone;
}

export default {
  initializeInstallPrompt,
  triggerInstall,
  canInstall,
  getInstallStatus,
  isStandalone
};
