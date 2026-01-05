/**
 * initiative-tracker.js
 * Shared logic for Initiative Tracking across DM Screen and Standalone Page.
 */

/**
 * @typedef {Object} Combatant
 * @property {number} id
 * @property {string} name
 * @property {number} initiative
 * @property {number} hp
 * @property {number} maxHp
 * @property {number} ac
 * @property {string[]} conditions
 * @property {number} [xp]
 * @property {number} [cr]
 * @property {boolean} [monsterInfoVisible]
 */

export class InitiativeTracker {
    constructor(config = {}) {
        this.state = {
            /** @type {Combatant[]} */
            combatants: [],
            round: 1,
            currentTurn: 0
        };

        this.monsterCache = {};
        this.storageKey = config.storageKey || 'initiative_tracker';

        // UI Defaults
        this.containerId = config.containerId || 'combatants-list';
        this.noCombatantsId = config.noCombatantsId || 'no-combatants';

        this.loadData();
    }

    loadData() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.state = { ...this.state, ...data };
            } catch (e) {
                console.error('Failed to load initiative data', e);
            }
        }
    }

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    }

    async fetchMonsterDetails(monsterName) {
        const cacheKey = monsterName.toLowerCase().replace(/\s+/g, '-');
        if (this.monsterCache[cacheKey]) return this.monsterCache[cacheKey];

        try {
            const response = await fetch(`https://api.open5e.com/v1/monsters/?search=${encodeURIComponent(monsterName)}&limit=1`);
            if (!response.ok) return null;
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                this.monsterCache[cacheKey] = data.results[0];
                return data.results[0];
            }
        } catch (error) {
            console.error('Error fetching monster:', error);
        }
        return null;
    }

    addCombatant(data) {
        const combatant = {
            id: Date.now(),
            name: data.name,
            initiative: parseInt(data.initiative) || 0,
            hp: parseInt(data.hp) || 0,
            maxHp: parseInt(data.hp) || 0,
            ac: parseInt(data.ac) || 10,
            xp: data.xp ? parseInt(data.xp) : undefined,
            cr: data.xp ? 0 : undefined, // NPC marker if XP present
            conditions: [],
            monsterInfoVisible: false
        };

        this.state.combatants.push(combatant);
        this.saveData();
        return combatant;
    }

    removeCombatant(id) {
        this.state.combatants = this.state.combatants.filter(c => c.id !== id);

        // Reset turn if needed
        if (this.state.combatants.length === 0) {
            this.state.currentTurn = 0;
            this.state.round = 1;
        } else if (this.state.currentTurn >= this.state.combatants.length) {
            this.state.currentTurn = 0;
        }

        this.saveData();
    }

    adjustHP(id, amount) {
        const combatant = this.state.combatants.find(c => c.id === id);
        if (combatant) {
            combatant.hp = Math.max(0, Math.min(combatant.maxHp, combatant.hp + amount));
            this.saveData();
        }
    }

    nextTurn() {
        if (this.state.combatants.length === 0) return;

        this.state.currentTurn++;
        if (this.state.currentTurn >= this.state.combatants.length) {
            this.state.currentTurn = 0;
            this.state.round++;
        }
        this.saveData();
    }

    resetCombat() {
        this.state.combatants = [];
        this.state.round = 1;
        this.state.currentTurn = 0;
        this.saveData();
    }

    sortCombatants() {
        this.state.combatants.sort((a, b) => b.initiative - a.initiative);
    }

    // Rendering Logic
    render(containerElement) {
        if (!containerElement) return;

        const list = containerElement;

        if (this.state.combatants.length === 0) {
            list.innerHTML = '';
            // Handle empty state visibility externally or pass callback
            return;
        }

        // Sort before render
        const sorted = [...this.state.combatants].sort((a, b) => b.initiative - a.initiative);

        list.innerHTML = sorted.map((combatant, index) => {
            const isActive = index === this.state.currentTurn;
            const hpPercentage = (combatant.hp / combatant.maxHp) * 100;
            const hpColor = hpPercentage > 50 ? 'var(--success)' : hpPercentage > 25 ? 'var(--warning)' : 'var(--danger)';
            const isNPC = combatant.cr !== undefined || combatant.xp !== undefined;

            // Simple template - can be enhanced
            return `
                <div class="combatant-card ${isActive ? 'active' : ''}" data-id="${combatant.id}">
                    <div class="combatant-initiative">${combatant.initiative}</div>
                    <div class="combatant-info">
                        <h4>${combatant.name} ${isNPC ? '<span style="font-size:0.8em;opacity:0.7">(NPC)</span>' : ''}</h4>
                        <div class="combatant-stats-row" style="display:flex; gap:1rem; align-items:center;">
                            <div style="font-weight:bold; color:${hpColor}">
                                HP: ${combatant.hp}/${combatant.maxHp}
                            </div>
                            <div>AC: ${combatant.ac}</div>
                            ${combatant.xp ? `<div>XP: ${combatant.xp}</div>` : ''}
                        </div>
                        
                        <div class="hp-controls" style="margin-top:0.5rem; display:flex; gap:0.25rem;">
                             <button class="btn-tiny damage-btn" data-id="${combatant.id}" data-amount="-5">-5</button>
                             <button class="btn-tiny damage-btn" data-id="${combatant.id}" data-amount="-1">-1</button>
                             <button class="btn-tiny heal-btn" data-id="${combatant.id}" data-amount="1">+1</button>
                             <button class="btn-tiny heal-btn" data-id="${combatant.id}" data-amount="5">+5</button>
                        </div>
                    </div>
                    <button class="btn-tiny btn-danger remove-btn" data-id="${combatant.id}">×</button>
                </div>
            `;
        }).join('');

        // Re-attach listeners would go here or be delegated
    }
}
