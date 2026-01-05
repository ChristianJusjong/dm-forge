/**
 * Global Dice Roller Module
 * Injects a Floating Action Button and Modal for dice rolling anywhere in the app.
 */

export class GlobalDiceRoller {
    constructor() {
        this.history = [];
        this.maxHistory = 20;
        this.isOpen = false;

        // Auto-initialize
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        if (document.getElementById('global-dice-roller-fab')) return; // Already exists
        if (window.globalDiceRoller) return; // Prevent double init
        window.globalDiceRoller = this;

        this.injectCSS();
        this.injectHTML();
        this.bindEvents();
        this.loadHistory();
    }

    injectCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'dice-roller.css';
        document.head.appendChild(link);
    }

    injectHTML() {
        const uiHTML = `
            <div id="dice-fab-container" class="dice-fab-container">
                <button id="global-dice-roller-fab" class="dice-fab" aria-label="Open Dice Roller">
                    🎲
                </button>
            </div>

            <div id="dice-modal-overlay" class="dice-modal-overlay">
                <div class="dice-modal">
                    <div class="dice-header">
                        <h2>Dice Roller</h2>
                        <button id="close-dice-modal" class="close-btn">&times;</button>
                    </div>

                    <div class="dice-grid">
                        <button class="dice-btn" data-sides="4">d4</button>
                        <button class="dice-btn" data-sides="6">d6</button>
                        <button class="dice-btn" data-sides="8">d8</button>
                        <button class="dice-btn" data-sides="10">d10</button>
                        <button class="dice-btn" data-sides="12">d12</button>
                        <button class="dice-btn" data-sides="20">d20</button>
                        <button class="dice-btn" data-sides="100">d100</button>
                    </div>
                    
                    <div class="custom-roll-input">
                        <input type="text" id="custom-dice-input" placeholder="e.g. 2d8+5">
                        <button id="roll-custom-btn">Roll</button>
                    </div>

                    <div id="dice-result-display" class="roll-result-display" style="display:none">
                        <div class="result-detail" id="result-detail">Rolling...</div>
                        <div class="result-main" id="result-main">?</div>
                    </div>

                    <div class="roll-history">
                        <h4>History</h4>
                        <div id="dice-history-list"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', uiHTML);
    }

    bindEvents() {
        const fab = document.getElementById('global-dice-roller-fab');
        const overlay = document.getElementById('dice-modal-overlay');
        const closeBtn = document.getElementById('close-dice-modal');
        const diceBtns = document.querySelectorAll('.dice-btn');
        const customBtn = document.getElementById('roll-custom-btn');
        const customInput = document.getElementById('custom-dice-input');

        if (fab) fab.addEventListener('click', () => this.toggleModal(true));
        if (closeBtn) closeBtn.addEventListener('click', () => this.toggleModal(false));
        if (overlay) overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.toggleModal(false);
        });

        diceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn instanceof HTMLElement && btn.dataset.sides) {
                    const sides = parseInt(btn.dataset.sides);
                    this.rollDice(1, sides);
                }
            });
        });

        if (customBtn) customBtn.addEventListener('click', () => this.rollCustom());
        if (customInput) customInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.rollCustom();
        });
    }

    toggleModal(show) {
        this.isOpen = show;
        const overlay = document.getElementById('dice-modal-overlay');
        const input = document.getElementById('custom-dice-input');

        if (show) {
            if (overlay) overlay.classList.add('active');
            if (input) input.focus();
        } else {
            if (overlay) overlay.classList.remove('active');
        }
    }

    rollDice(count, sides, modifier = 0) {
        let total = 0;
        const rolls = [];

        for (let i = 0; i < count; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;
        }

        total += modifier;

        const result = {
            id: Date.now(),
            expression: `${count}d${sides}${modifier ? (modifier > 0 ? '+' + modifier : modifier) : ''}`,
            rolls,
            total,
            timestamp: new Date().toLocaleTimeString()
        };

        this.displayResult(result);
        this.addToHistory(result);
    }

    rollCustom() {
        /** @type {HTMLInputElement|null} */
        const input = document.querySelector('#custom-dice-input');
        if (!input) return;

        const expression = input.value.trim().toLowerCase();

        if (!expression) return;

        // Simple parser regex: (\d*)d(\d+)([+-]\d+)?
        const match = expression.match(/^(\d*)d(\d+)([+-]\d+)?$/);

        if (match) {
            const count = match[1] ? parseInt(match[1]) : 1;
            const sides = parseInt(match[2]);
            const modifier = match[3] ? parseInt(match[3]) : 0;

            this.rollDice(count, sides, modifier);
        } else {
            alert('Invalid dice format. Use format like "2d6+3" or "d20"');
        }
    }

    displayResult(result) {
        const display = document.getElementById('dice-result-display');
        const main = document.getElementById('result-main');
        const detail = document.getElementById('result-detail');

        if (display) display.style.display = 'block';
        if (main) {
            main.textContent = result.total;
            main.style.transform = 'scale(1.5)';
            setTimeout(() => { if (main) main.style.transform = 'scale(1)'; }, 200);
        }

        if (detail) {
            const rollsStr = result.rolls.length > 1 ? `[${result.rolls.join(', ')}]` : '';
            detail.textContent = `${result.expression} = ${result.total} ${rollsStr}`;
        }
    }

    addToHistory(result) {
        this.history.unshift(result);
        if (this.history.length > this.maxHistory) this.history.pop();

        this.renderHistory();
        this.saveHistory();
    }

    renderHistory() {
        const list = document.getElementById('dice-history-list');
        if (!list) return;

        list.innerHTML = this.history.map(item => `
            <div class="history-item">
                <span>${item.expression}</span>
                <strong style="color: #d4af37">${item.total}</strong>
                <span style="font-size: 0.8em; opacity: 0.7">${item.timestamp}</span>
            </div>
        `).join('');
    }

    saveHistory() {
        localStorage.setItem('dice_history', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('dice_history');
        if (saved) {
            this.history = JSON.parse(saved);
            this.renderHistory();
        }
    }
}
