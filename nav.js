// ==========================================
// NAVIGATION BAR & SHARED UTILITIES
// ==========================================

// Initialize language from localStorage
let currentLanguage = localStorage.getItem('language') || 'en';

// ⚠️ SECURITY: API keys removed from client-side code
// Translation feature disabled until backend proxy is implemented
// TODO: Implement backend API proxy for secure translation calls

// Translation function for UI elements
function t(key) {
  return translations[currentLanguage]?.[key] || key;
}

// Groq Translation function - DISABLED for security
// Returns original text without translation
async function translateWithGroq(text, targetLang = null) {
  // Translation feature disabled - API key was exposed in client-side code
  // This is a security vulnerability that has been fixed
  // To re-enable: implement backend proxy server for API calls
  console.warn('Translation feature disabled - API key removed for security');
  return text;
}

// Get current language
function getCurrentLanguage() {
  return currentLanguage;
}

// Update all translations in the DOM
function updateTranslations() {
  // Text content translations
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Placeholder translations
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Option translations
  document.querySelectorAll('option[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}

// Initialize navigation bar
function initializeNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const navHTML = `
    <nav class="main-nav">
      <div class="nav-container">
        <!-- Brand/Logo -->
        <a href="dashboard.html" class="nav-brand">
          <img src="logo-icon.svg" alt="Dungeon Master Forge" style="width: 32px; height: 32px; margin-right: 0.5rem;">
          <span>Dungeon Master Forge</span>
        </a>

        <!-- Mobile Toggle -->
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
          ☰
        </button>

        <!-- Navigation Links -->
        <ul class="nav-links" id="nav-links">
          <li><a href="configuration.html" class="nav-link ${currentPage === 'configuration.html' ? 'active' : ''}" data-i18n="configuration">Configuration</a></li>
          <li><a href="initiative.html" class="nav-link ${currentPage === 'initiative.html' ? 'active' : ''}" data-i18n="initiative">Initiative</a></li>
          <li><a href="encounters.html" class="nav-link ${currentPage === 'encounters.html' ? 'active' : ''}" data-i18n="encounters">Encounters</a></li>
          <li><a href="monsters.html" class="nav-link ${currentPage === 'monsters.html' ? 'active' : ''}" data-i18n="monsters">Monsters</a></li>
          <li><a href="npcs.html" class="nav-link ${currentPage === 'npcs.html' ? 'active' : ''}" data-i18n="npcs">NPCs</a></li>
          <li><a href="inspiration.html" class="nav-link ${currentPage === 'inspiration.html' ? 'active' : ''}" data-i18n="inspiration">Inspiration</a></li>
          <li><a href="notes.html" class="nav-link ${currentPage === 'notes.html' ? 'active' : ''}" data-i18n="notes">Notes</a></li>
        </ul>

        <!-- Controls -->
        <div class="nav-controls">
          <div id="nav-user-info"></div>
          <div id="nav-campaign-info"></div>
        </div>
      </div>
    </nav>

    <!-- Footer -->
    <footer style="background: linear-gradient(180deg, transparent 0%, rgba(10, 6, 4, 0.95) 100%); border-top: 2px solid rgba(212, 175, 55, 0.3); padding: 3rem 1.5rem 1.5rem; margin-top: 5rem; position: relative; z-index: 2;">
      <div style="max-width: 1100px; margin: 0 auto;">
        <!-- Footer Top: Support CTA -->
        <div style="text-align: center; margin-bottom: 2.5rem; padding: 2rem; background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(139, 0, 0, 0.1) 100%); border-radius: 12px; border: 2px solid rgba(212, 175, 55, 0.3);">
          <h3 style="color: #d4af37; margin-bottom: 0.75rem; font-family: 'Cinzel', serif; text-shadow: 0 0 10px rgba(212, 175, 55, 0.6);">💰 Support Dungeon Master Forge</h3>
          <p style="color: #e8d5b7; margin-bottom: 1.25rem; line-height: 1.6;">Help keep this tool free and add new features!</p>
          <a href="support.html" style="display: inline-block; padding: 0.75rem 2rem; background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%); color: #0a0604; text-decoration: none; font-weight: 700; font-family: 'Cinzel', serif; border-radius: 8px; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);" onmouseover="this.style.background='linear-gradient(135deg, #f0d06b 0%, #d4af37 100%)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='linear-gradient(135deg, #d4af37 0%, #b8941f 100%)'; this.style.transform='translateY(0)'">View Support Options</a>
        </div>

        <!-- Footer Links Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2.5rem; text-align: left;">
          <!-- Tools Column -->
          <div>
            <h4 style="color: #d4af37; margin-bottom: 1rem; font-family: 'Cinzel', serif; font-size: 1.1rem;">⚔️ Tools</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><a href="initiative.html" style="color: #d4c3a0; text-decoration: none; transition: color 0.3s; font-size: 0.95rem;" onmouseover="this.style.color='#f0d06b'" onmouseout="this.style.color='#d4c3a0'">Initiative Tracker</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="npcs.html" style="color: #d4c3a0; text-decoration: none; transition: color 0.3s; font-size: 0.95rem;" onmouseover="this.style.color='#f0d06b'" onmouseout="this.style.color='#d4c3a0'">NPC Generator</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="encounters.html" style="color: #d4c3a0; text-decoration: none; transition: color 0.3s; font-size: 0.95rem;" onmouseover="this.style.color='#f0d06b'" onmouseout="this.style.color='#d4c3a0'">Encounter Builder</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="monsters.html" style="color: #d4c3a0; text-decoration: none; transition: color 0.3s; font-size: 0.95rem;" onmouseover="this.style.color='#f0d06b'" onmouseout="this.style.color='#d4c3a0'">Monster Browser</a></li>
            </ul>
          </div>

          <!-- Community Column -->
          <div>
            <h4 style="color: #d4af37; margin-bottom: 1rem; font-family: 'Cinzel', serif; font-size: 1.1rem;">🛡️ Community</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><a href="support.html" style="color: #f0d06b; text-decoration: none; transition: color 0.3s; font-size: 0.95rem; font-weight: 600;" onmouseover="this.style.color='#d4af37'" onmouseout="this.style.color='#f0d06b'">💰 Support Us</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="https://github.com/YOURUSERNAME/dm-codex" target="_blank" style="color: #d4c3a0; text-decoration: none; transition: color 0.3s; font-size: 0.95rem;" onmouseover="this.style.color='#f0d06b'" onmouseout="this.style.color='#d4c3a0'">GitHub</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="https://discord.gg/YOURDISCORD" target="_blank" style="color: #d4c3a0; text-decoration: none; transition: color 0.3s; font-size: 0.95rem;" onmouseover="this.style.color='#f0d06b'" onmouseout="this.style.color='#d4c3a0'">Discord Community</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="https://reddit.com/r/dmcodex" target="_blank" style="color: #d4c3a0; text-decoration: none; transition: color 0.3s; font-size: 0.95rem;" onmouseover="this.style.color='#f0d06b'" onmouseout="this.style.color='#d4c3a0'">Reddit</a></li>
            </ul>
          </div>

          <!-- Legal Column -->
          <div>
            <h4 style="color: #d4af37; margin-bottom: 1rem; font-family: 'Cinzel', serif; font-size: 1.1rem;">📜 Legal</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 0.5rem;"><a href="privacy-policy.html" style="color: #d4c3a0; text-decoration: none; transition: color 0.3s; font-size: 0.95rem;" onmouseover="this.style.color='#f0d06b'" onmouseout="this.style.color='#d4c3a0'">Privacy Policy</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="terms-of-service.html" style="color: #d4c3a0; text-decoration: none; transition: color 0.3s; font-size: 0.95rem;" onmouseover="this.style.color='#f0d06b'" onmouseout="this.style.color='#d4c3a0'">Terms of Service</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="#" style="color: #d4c3a0; text-decoration: none; transition: color 0.3s; font-size: 0.95rem;" onmouseover="this.style.color='#f0d06b'" onmouseout="this.style.color='#d4c3a0'">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div style="border-top: 1px solid rgba(212, 175, 55, 0.2); padding-top: 1.5rem; text-align: center;">
          <p style="color: #8b7355; font-size: 0.85rem; margin-bottom: 0.75rem; line-height: 1.6;">
            Dungeon Master Forge uses D&D 5e SRD content under the Open Gaming License.<br>
            "Dungeons & Dragons" and "D&D" are trademarks of Wizards of the Coast LLC.
          </p>
          <p style="color: #8b7355; font-size: 0.8rem; margin: 0;">
            © 2025 Dungeon Master Forge. Made with ⚔️ for Dungeon Masters everywhere.
          </p>
        </div>
      </div>
    </footer>
  `;

  // Insert nav at the beginning of the app div
  const app = document.getElementById('app');
  if (app) {
    // Split navHTML into nav and footer
    const navEndIndex = navHTML.indexOf('</nav>') + 7;
    const navPart = navHTML.substring(0, navEndIndex);
    const footerPart = navHTML.substring(navEndIndex);

    // Insert nav at beginning
    app.insertAdjacentHTML('afterbegin', navPart);

    // Insert footer at end
    app.insertAdjacentHTML('beforeend', footerPart);
  }

  // Language toggle is now in configuration page
  // This function can be called from configuration.html
  window.changeLanguage = function(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', currentLanguage);
    updateTranslations();
    window.dispatchEvent(new Event('languageChanged'));
  };

  // Setup mobile toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    });
  }

  updateTranslations();
  updateUserInfo();
  updateNavCampaignInfo();
}

// Update user info in nav
function updateUserInfo() {
  const userInfoDiv = document.getElementById('nav-user-info');
  if (!userInfoDiv) return;

  // Check if auth.js is loaded
  if (typeof isLoggedIn !== 'function' || typeof getCurrentUser !== 'function') return;

  if (isLoggedIn()) {
    const user = getCurrentUser();
    // Use textContent for security - prevent XSS injection via username
    const safeUsername = typeof escapeHTML === 'function' ? escapeHTML(user.username) : user.username;
    userInfoDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-right: 1rem;">
        <span style="color: #e8d5b7; font-size: 0.9rem;">
          👤 ${safeUsername}
        </span>
        <button onclick="logout()" class="btn" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; background: rgba(139, 0, 0, 0.3); border-color: rgba(139, 0, 0, 0.6);">
          🚪 Logout
        </button>
      </div>
    `;
  }
}

// Update campaign info in nav
function updateNavCampaignInfo() {
  const navInfo = document.getElementById('nav-campaign-info');
  if (!navInfo) return;

  // Check if campaign-manager.js is loaded
  if (typeof getActiveCampaign !== 'function') return;

  const campaign = getActiveCampaign();
  const session = getActiveSession();

  if (!campaign) {
    navInfo.innerHTML = '';
    return;
  }

  if (session) {
    navInfo.innerHTML = `
      <span style="color: #4caf50; font-size: 0.85rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
        <span style="width: 8px; height: 8px; background: #4caf50; border-radius: 50%; animation: pulse 2s infinite;"></span>
        Session Active
      </span>
    `;
  } else {
    // Use textContent for security - prevent XSS injection via campaign name
    const safeCampaignName = typeof escapeHTML === 'function' ? escapeHTML(campaign.name) : campaign.name;
    navInfo.innerHTML = `
      <span style="color: #8b7355; font-size: 0.85rem;">
        ${safeCampaignName}
      </span>
    `;
  }
}

// Export translation function to window for use in inline scripts
window.t = t;
window.getCurrentLanguage = getCurrentLanguage;
window.updateTranslations = updateTranslations;

// Call this after DOM is loaded
document.addEventListener('DOMContentLoaded', initializeNav);
