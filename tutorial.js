/**
 * tutorial.js
 * Handles onboarding flow and feature gating validation.
 * Depends on campaign-manager.js being loaded first (globals).
 */

// Tutorial State Keys
const TUTORIAL_KEY = 'dm_forge_tutorial_progress';

const STEPS = {
    WELCOME: 'welcome',
    CAMPAIGN_SETUP: 'campaign_setup',
    PARTY_SETUP: 'party_setup',
    FIRST_SESSION: 'first_session',
    COMPLETED: 'completed'
};

// Integration with Help System
import { initHelpSystem } from './help-system.js';

// Get current state
function getTutorialState() {
    return localStorage.getItem(TUTORIAL_KEY) || STEPS.WELCOME;
}

// Set state
function setTutorialState(step) {
    localStorage.setItem(TUTORIAL_KEY, step);
    console.log(`Tutorial State Advanced: ${step}`);
    runTutorial(); // Re-evaluate immediately
}

// Show Tooltip
function showTutorialTooltip(targetElement, message, position = 'bottom') {
    // Remove existing
    const existing = document.getElementById('tutorial-tooltip');
    if (existing) existing.remove();

    if (!targetElement) return;

    const tooltip = document.createElement('div');
    tooltip.id = 'tutorial-tooltip';
    tooltip.className = 'tutorial-tooltip fade-in';
    tooltip.innerHTML = `
        <div class="tooltip-header">
            <span class="tooltip-icon">🧙‍♂️</span>
            <span class="tooltip-title">Guide</span>
            <button class="tooltip-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="tooltip-content">
            <p>${message}</p>
        </div>
        <div class="tooltip-arrow"></div>
    `;

    document.body.appendChild(tooltip);

    // Position logic
    const rect = targetElement.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Use Popper.js logic simplified
    // Default to bottom center
    let top = rect.bottom + scrollY + 10;
    let left = rect.left + scrollX + (rect.width / 2) - 150; // Center 300px wide tooltip

    // Prevent off-screen left
    if (left < 10) left = 10;

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
}

// Check Prerequisites (Guardrails)
window.checkPrerequisites = function (feature) {
    // Ensure campaign manager is loaded
    if (typeof window.getActiveCampaign !== 'function') return true;

    const campaign = window.getActiveCampaign();
    const party = window.getParty ? window.getParty() : [];

    if (feature === 'combat' || feature === 'encounters') {
        if (!campaign) {
            alert('⚠️ No Campaign Found\n\nYou need to create a campaign before you can run encounters.');
            window.location.href = 'campaign-start.html';
            return false;
        }
        if (!party || party.length === 0) {
            if (confirm('⚠️ No Party Found\n\nCombat requires at least one party member.\n\nGo to Configuration > Party to add them now?')) {
                window.location.href = 'configuration.html';
            }
            return false;
        }
    }

    if (feature === 'session') {
        if (!campaign) {
            alert('⚠️ No Campaign Found\n\nPlease create a campaign first.');
            window.location.href = 'campaign-start.html';
            return false;
        }
    }

    return true;
};

// Main Run Function
function runTutorial() {
    // Check if we are in a valid environment
    if (typeof window.getActiveCampaign !== 'function') return;

    const state = getTutorialState();
    const campaign = window.getActiveCampaign();
    const party = window.getParty ? window.getParty() : [];

    // 1. State Machine Transitions
    // If no campaign, force WELCOME state
    if (!campaign && state !== STEPS.WELCOME) {
        setTutorialState(STEPS.WELCOME);
        return;
    }

    // If campaign exists but was in WELCOME, advance to PARTY_SETUP
    if (campaign && state === STEPS.WELCOME) {
        setTutorialState(STEPS.PARTY_SETUP);
        return;
    }

    // If party exists and in PARTY_SETUP, advance to FIRST_SESSION
    if (party.length > 0 && state === STEPS.PARTY_SETUP) {
        setTutorialState(STEPS.FIRST_SESSION);
        return;
    }

    // If session active and in FIRST_SESSION, complete
    if (window.isSessionActive() && state === STEPS.FIRST_SESSION) {
        setTutorialState(STEPS.COMPLETED);
        return;
    }

    // 2. UI Rendering based on current Page & State
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    // DASHBOARD / INDEX
    if (page === 'dashboard.html' || page === 'index.html') {
        if (state === STEPS.WELCOME) {
            // Point to "Start Campaign"
            setTimeout(() => {
                const btn = document.querySelector('button[onclick*="campaign-start.html"]');
                if (btn) showTutorialTooltip(btn, "Welcome! Click here to create your first Campaign.");
            }, 800);
        }
        else if (state === STEPS.PARTY_SETUP) {
            // Point to Configuration
            setTimeout(() => {
                const configCard = document.querySelector('a[href="configuration.html"]');
                if (configCard) showTutorialTooltip(configCard, "Next step: Go to <strong>Configuration</strong> to add your adventurers (Party Members).");
            }, 800);
        }
        else if (state === STEPS.FIRST_SESSION) {
            // Point to Start Session
            setTimeout(() => {
                const startBtn = document.querySelector('button[onclick*="startNewSession"]');
                if (startBtn) showTutorialTooltip(startBtn, "You are ready! Click <strong>Start New Session</strong> to begin playing.");
            }, 800);
        }
    }

    // CONFIGURATION
    if (page === 'configuration.html') {
        if (state === STEPS.PARTY_SETUP && party.length === 0) {
            // Point to Party Tab
            setTimeout(() => {
                const partyTab = document.querySelector('button[data-tab="party"]');
                if (partyTab) showTutorialTooltip(partyTab, "Click the <strong>Party</strong> tab to add your players.");
            }, 800);
        }
    }
}

// Initial Run
document.addEventListener('DOMContentLoaded', () => {
    // Delay slightly to ensure other scripts loaded
    setTimeout(runTutorial, 500);
});

// Expose to window
window.runTutorial = runTutorial;
window.setTutorialState = setTutorialState;
