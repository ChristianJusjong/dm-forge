// ==========================================
// CAMPAIGN MANAGER
// ==========================================

// Campaign state
let activeCampaign = null;
let activeSession = null;

// Generate unique campaign code
function generateCampaignCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    if (i === 3) code += '-'; // Format: XXXX-XXXX
  }
  return code;
}

// Create new campaign
function createCampaign(name, settings = {}) {
  const code = generateCampaignCode();
  const campaign = {
    code: code,
    name: name,
    createdAt: Date.now(),
    lastPlayed: Date.now(),
    settings: {
      world: settings.world || 'forgotten-realms',
      edition: settings.edition || '5e',
      ...settings
    },
    party: [],
    sessions: [],
    currentSession: null
  };

  // Save to localStorage
  localStorage.setItem(`campaign_${code}`, JSON.stringify(campaign));

  // Set as active
  activeCampaign = campaign;
  localStorage.setItem('activeCampaignCode', code);

  return campaign;
}

// Load campaign by code
function loadCampaign(code) {
  const normalizedCode = code.toUpperCase().replace(/\s/g, '');
  const campaignData = localStorage.getItem(`campaign_${normalizedCode}`);

  if (!campaignData) {
    return null;
  }

  const campaign = JSON.parse(campaignData);
  campaign.lastPlayed = Date.now();

  // Save updated last played
  localStorage.setItem(`campaign_${normalizedCode}`, JSON.stringify(campaign));

  // Set as active
  activeCampaign = campaign;
  localStorage.setItem('activeCampaignCode', normalizedCode);

  return campaign;
}

// Get active campaign
function getActiveCampaign() {
  if (activeCampaign) return activeCampaign;

  const code = localStorage.getItem('activeCampaignCode');
  if (!code) return null;

  const campaignData = localStorage.getItem(`campaign_${code}`);
  if (!campaignData) {
    localStorage.removeItem('activeCampaignCode');
    return null;
  }

  activeCampaign = JSON.parse(campaignData);
  return activeCampaign;
}

// Save campaign
function saveCampaign() {
  if (!activeCampaign) return;

  activeCampaign.lastPlayed = Date.now();
  localStorage.setItem(`campaign_${activeCampaign.code}`, JSON.stringify(activeCampaign));
}

// Start new session
function startSession() {
  if (!activeCampaign) return null;

  const session = {
    id: Date.now(),
    startedAt: Date.now(),
    endedAt: null,
    notes: '',
    encounters: [],
    npcs: []
  };

  activeCampaign.currentSession = session;
  activeSession = session;

  saveCampaign();

  return session;
}

// End session
function endSession(notes = '') {
  if (!activeCampaign || !activeCampaign.currentSession) return;

  activeCampaign.currentSession.endedAt = Date.now();
  activeCampaign.currentSession.notes = notes;

  // Move to sessions history
  activeCampaign.sessions.push(activeCampaign.currentSession);
  activeCampaign.currentSession = null;
  activeSession = null;

  saveCampaign();
}

// Get active session
function getActiveSession() {
  if (activeSession) return activeSession;

  const campaign = getActiveCampaign();
  if (!campaign || !campaign.currentSession) return null;

  activeSession = campaign.currentSession;
  return activeSession;
}

// Check if campaign is active and session is running
function isCampaignActive() {
  const campaign = getActiveCampaign();
  return campaign !== null;
}

function isSessionActive() {
  const session = getActiveSession();
  return session !== null;
}

// Update party
function updateParty(party) {
  if (!activeCampaign) return;

  activeCampaign.party = party;
  saveCampaign();
}

// Get party
function getParty() {
  const campaign = getActiveCampaign();
  return campaign ? campaign.party : [];
}

// Get campaign settings
function getCampaignSettings() {
  const campaign = getActiveCampaign();
  return campaign && campaign.settings ? campaign.settings : {
    world: 'forgotten-realms',
    edition: '5e'
  };
}

// Get campaign edition
function getCampaignEdition() {
  const settings = getCampaignSettings();
  return settings.edition;
}

// Get campaign world
function getCampaignWorld() {
  const settings = getCampaignSettings();
  return settings.world;
}

// Clear active campaign (logout)
function clearActiveCampaign() {
  activeCampaign = null;
  activeSession = null;
  localStorage.removeItem('activeCampaignCode');
}

// Check if user should be redirected to campaign start
function requireCampaign() {
  const campaign = getActiveCampaign();

  // Allow access to these pages without campaign
  const allowedPages = ['campaign-start.html', 'index.html', 'welcome.html', 'dashboard.html', 'privacy-policy.html', 'terms-of-service.html', 'support.html'];
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  if (allowedPages.includes(currentPage)) {
    return; // Don't redirect
  }

  // Redirect if no campaign
  if (!campaign) {
    window.location.href = 'campaign-start.html';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  requireCampaign();
});

// Export functions to window for use in inline scripts
window.getActiveCampaign = getActiveCampaign;
window.createCampaign = createCampaign;
window.loadCampaign = loadCampaign;
window.saveCampaign = saveCampaign;
window.updateParty = updateParty;
window.startSession = startSession;
window.endSession = endSession;
window.getActiveSession = getActiveSession;
window.getCampaignSettings = getCampaignSettings;
window.getCampaignEdition = getCampaignEdition;
window.getCampaignWorld = getCampaignWorld;
window.clearActiveCampaign = clearActiveCampaign;
window.requireCampaign = requireCampaign;
window.isCampaignActive = isCampaignActive;
window.isSessionActive = isSessionActive;
window.getParty = getParty;
