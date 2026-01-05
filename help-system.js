/**
 * help-system.js
 * Manages context-aware help and onboarding guides.
 */

import { t } from './translations.js';

export function initHelpSystem() {
    // expose to window for the nav button
    window.toggleHelp = toggleHelp;
}

function toggleHelp() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    showHelpModal(currentPage);
}

function showHelpModal(page) {
    // Remove existing
    const existing = document.getElementById('help-modal');
    if (existing) existing.remove();

    const helpContent = getHelpContent(page);

    const modal = document.createElement('div');
    modal.id = 'help-modal';
    modal.className = 'modal-overlay fade-in';
    modal.style.display = 'flex';
    modal.style.zIndex = '9999'; // Ensure it's on top

    modal.innerHTML = `
        <div class="modal help-modal-content" style="max-width: 600px;">
            <div class="modal-header" style="border-bottom: 2px solid var(--color-gold); margin-bottom: 1rem; padding-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                <h2 class="text-gold" style="margin: 0;">${helpContent.title}</h2>
                <button class="btn-tiny" onclick="document.getElementById('help-modal').remove()" style="background: none; border: none; font-size: 1.5rem; color: var(--color-gold-light); cursor: pointer;">×</button>
            </div>
            
            <div class="modal-body" style="color: var(--color-parchment-dark); line-height: 1.6;">
                <p class="mb-md" style="font-size: 1.1em;">${helpContent.intro}</p>
                
                ${helpContent.steps.map(step => `
                    <div class="help-step" style="background: rgba(0,0,0,0.05); padding: 1rem; border-radius: var(--border-radius-md); margin-bottom: 1rem; border-left: 3px solid var(--color-gold);">
                        <strong style="display: block; color: var(--color-primary-dark); margin-bottom: 0.25rem;">${step.label}</strong>
                        ${step.text}
                    </div>
                `).join('')}

                <div class="tip-box" style="margin-top: 1.5rem; background: var(--color-primary-light); padding: 1rem; border-radius: var(--border-radius-md); font-style: italic; border: 1px solid var(--color-gold-light);">
                    <strong>💡 Pro Tip:</strong> ${helpContent.tip}
                </div>
            </div>

            <div class="modal-footer" style="margin-top: 1.5rem; text-align: right;">
                <button class="btn btn-primary" onclick="document.getElementById('help-modal').remove()">Got it!</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function getHelpContent(page) {
    const isDashboard = page === 'dashboard.html' || page === 'index.html';

    if (isDashboard) {
        return {
            title: "Welcome to Dungeon Master Forge",
            intro: "This is your command center. From here, you can manage every aspect of your D&D campaign.",
            steps: [
                { label: "1. Start Your Campaign", text: "Create a new campaign to track your world settings and progress." },
                { label: "2. Gather Your Party", text: "Go to <strong>Configuration</strong> to add your players' characters." },
                { label: "3. Run Sessions", text: "Use the <strong>Session</strong> tools to track initiative, combat, and notes in real-time." }
            ],
            tip: "Use the 'End Session' button when you're done to generate a session summary log."
        };
    }

    if (page === 'monsters.html') {
        return {
            title: "Monster Browser Guide",
            intro: "Quickly find and reference any creature from the 5e SRD.",
            steps: [
                { label: "Search", text: "Type a monster's name in the search bar (e.g., 'Goblin')." },
                { label: "Details", text: "Click any card to view full stats, actions, and abilities." },
                { label: "Encounter Builder", text: "Use the 'Add to Encounter' button to pull this monster directly into your active combat." }
            ],
            tip: "You can open multiple monster cards in new tabs by middle-clicking links."
        };
    }

    if (page === 'encounters.html') {
        return {
            title: "Encounter Builder Guide",
            intro: "Design balanced combat encounters for your party.",
            steps: [
                { label: "Create Encounter", text: "Give your encounter a name and description." },
                { label: "Add Creatures", text: "Search and add monsters. The system will calculate total XP and difficulty." },
                { label: "Run It", text: "Click 'Run Encounter' to send all participants to the Initiative Tracker." }
            ],
            tip: "Difficulty is calculated based on your Party size (set in Configuration)."
        };
    }

    // Default Fallback
    return {
        title: "Page Guide",
        intro: "We're still writing the specific guide for this page!",
        steps: [
            { label: "Explore", text: "Try clicking the interactive elements to see what they do." },
            { label: "Feedback", text: "Let us know if you need specific help with this feature." }
        ],
        tip: "Check the Dashboard for the main workflow guides."
    };
}
