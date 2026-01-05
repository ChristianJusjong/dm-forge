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

// Groq Translation function - Uses user-provided API key
async function translateWithGroq(text, targetLang = null) {
  // Get API key from campaign settings
  const apiKey = typeof window.getGroqApiKey === 'function' ? window.getGroqApiKey() : null;

  if (!apiKey) {
    console.warn('Translation feature disabled - No Groq API key configured. Add your API key in Configuration > AI Settings');
    return text; // Return original text if no API key
  }

  try {
    const lang = targetLang || currentLanguage;

    const requestBody = {
      model: 'llama-3.1-8b-instant',  // Changed to match other pages
      messages: [
        {
          role: 'system',
          content: `You are a translator. Translate the following text to ${lang}. Only return the translated text, nothing else.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    };

    console.log('🌐 Translation request:', { lang, textLength: text.length });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Translation API error:', response.status, errorData);
      return text;
    }

    console.log('✅ Translation successful');

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
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
import { initHelpSystem } from './help-system.js';
import { GlobalDiceRoller } from './dice-roller.js';

function initializeNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Initialize Help System
  initHelpSystem();

  // Initialize Global Dice Roller
  new GlobalDiceRoller();

  const navHTML = `
    <nav class="main-nav">
      <div class="nav-container">
        <!-- Brand/Logo -->
        <a href="dashboard.html" class="nav-brand">
          <img src="logo-icon.svg" alt="Dungeon Master Forge" class="nav-logo" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDRhZjM3IiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTUtMTAtNXpNMiAxN2wxMCA1IDEwLTVNMTIgMTJsLTEwIDUgMTAgNSAxMC01LTEwLTV6Ii8+PC9zdmc+'">
          <span class="brand-text">DM Forge</span>
        </a>

        <!-- Mobile Toggle -->
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
          ☰
        </button>

        <!-- Navigation Links -->
        <div class="nav-links" id="nav-links">
          <a href="dashboard.html" class="nav-link ${currentPage === 'dashboard.html' ? 'active' : ''}">
            <span class="icon">📊</span> ${t('dashboard')}
          </a>
          <a href="monsters.html" class="nav-link ${currentPage === 'monsters.html' ? 'active' : ''}">
            <span class="icon">🐉</span> ${t('monsters')}
          </a>
          <a href="encounters.html" class="nav-link ${currentPage === 'encounters.html' ? 'active' : ''}">
            <span class="icon">⚔️</span> ${t('encounters')}
          </a>
          <a href="dm-screen.html" class="nav-link ${currentPage === 'dm-screen.html' ? 'active' : ''}">
            <span class="icon">🛡️</span> ${t('dmScreen')}
          </a>
          <a href="player-dashboard.html" class="nav-link ${currentPage === 'player-dashboard.html' || currentPage === 'character-sheet.html' || currentPage === 'character-creator.html' ? 'active' : ''}">
             <span class="icon">👤</span> Characters
          </a>
          <a href="notes.html" class="nav-link ${currentPage === 'notes.html' ? 'active' : ''}">
             <span class="icon">📝</span> ${t('notes')}
          </a>
        </div>

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
  window.changeLanguage = function (lang) {
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

// Export translation functions to window for use in inline scripts
window.t = t;
window.getCurrentLanguage = getCurrentLanguage;
window.updateTranslations = updateTranslations;
window.translateWithGroq = translateWithGroq;

// Call this after DOM is loaded
// Call this after DOM is loaded or if it's already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeNav);
} else {
  initializeNav();
}
