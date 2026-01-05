// Wait for modules to load
import { InitiativeTracker } from './initiative-tracker.js';

window.addEventListener('load', () => {
    // Check Tutorial Prerequisites
    // @ts-ignore
    if (typeof window.checkPrerequisites === 'function') {
        // @ts-ignore
        if (!window.checkPrerequisites('combat')) {
            return;
        }
    }

    // Require authentication
    // @ts-ignore
    if (typeof window.requireAuth === 'function' && !window.requireAuth()) {
        throw new Error('Authentication required');
    }

    initTracker();
});

function initTracker() {
    const tracker = new InitiativeTracker();
    const listEl = document.getElementById('combatants-list');
    const noCombatantsEl = document.getElementById('no-combatants');
    const roundEl = document.getElementById('round-number');

    function render() {
        if (listEl) tracker.render(listEl);

        if (noCombatantsEl) {
            if (tracker.state.combatants.length === 0) {
                noCombatantsEl.style.display = 'block';
            } else {
                noCombatantsEl.style.display = 'none';
            }
        }

        if (roundEl) roundEl.textContent = String(tracker.state.round);

        // Re-attach listeners
        attachListeners();

        // Scroll to active
        if (listEl) {
            const active = listEl.querySelector('.active');
            if (active) active.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function attachListeners() {
        if (!listEl) return;

        listEl.querySelectorAll('.damage-btn, .heal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target instanceof HTMLElement ? e.target : null;
                if (!target) return;

                const id = parseFloat(target.dataset.id || '0');
                const amt = parseInt(target.dataset.amount || '0');
                tracker.adjustHP(id, amt);
                render();
            });
        });

        listEl.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target instanceof HTMLElement ? e.target : null;
                if (!target) return;

                const id = parseFloat(target.dataset.id || '0');
                tracker.removeCombatant(id);
                render();
            });
        });
    }

    // Global Controls
    const addBtn = document.getElementById('add-combatant-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            /** @type {HTMLInputElement | null} */
            const nameEl = document.querySelector('#combatant-name');
            /** @type {HTMLInputElement | null} */
            const initEl = document.querySelector('#combatant-initiative');
            /** @type {HTMLInputElement | null} */
            const hpEl = document.querySelector('#combatant-hp');
            /** @type {HTMLInputElement | null} */
            const acEl = document.querySelector('#combatant-ac');
            /** @type {HTMLInputElement | null} */
            const xpEl = document.querySelector('#combatant-xp');

            if (!nameEl || !initEl || !hpEl) return;

            const name = nameEl.value;
            const init = initEl.value;
            const hp = hpEl.value;

            if (name && init && hp) {
                tracker.addCombatant({
                    name,
                    initiative: init,
                    hp,
                    ac: acEl ? acEl.value : '',
                    xp: xpEl ? xpEl.value : ''
                });

                // Clear inputs
                nameEl.value = '';
                initEl.value = '';
                hpEl.value = '';
                if (acEl) acEl.value = '';
                if (xpEl) xpEl.value = '';

                render();
            }
        });
    }

    const nextBtn = document.getElementById('next-turn-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            tracker.nextTurn();
            render();
        });
    }

    const resetBtn = document.getElementById('reset-combat-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Reset combat?')) {
                tracker.resetCombat();
                render();
            }
        });
    }

    // Initial Render
    render();
}
