/**
 * character-model.js
 * Core logic for D&D 5e Character data.
 * Handles stats, modifiers, proficiency, and derived attributes.
 */

export class Character {
    constructor(data = {}) {
        this.id = data.id || Date.now();
        this.name = data.name || 'New Character';
        this.race = data.race || '';
        this.class = data.class || '';
        this.level = data.level || 1;
        this.background = data.background || '';
        this.alignment = data.alignment || '';
        this.xp = data.xp || 0;

        // Core Stats
        this.stats = data.stats || {
            str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10
        };

        // Proficiency & Expertise (Set of strings, e.g., 'perception', 'str-save')
        this.proficiencies = new Set(data.proficiencies || []);
        this.expertise = new Set(data.expertise || []);

        // Vitals
        this.hp = {
            current: data.hp?.current || 10,
            max: data.hp?.max || 10,
            temp: data.hp?.temp || 0,
            hitDice: data.hp?.hitDice || '1d10',
            hitDiceAvailable: data.hp?.hitDiceAvailable || 1
        };

        this.ac = data.ac || 10;
        this.speed = data.speed || 30;
        this.initiativeBonus = data.initiativeBonus || 0;

        // Inventory & Spells
        this.equipment = data.equipment || []; // Array of objects
        this.spells = data.spells || {
            slots: { 1: { max: 0, current: 0 } },
            known: []
        };

        // Bio
        this.bio = data.bio || {
            traits: '', ideals: '', bonds: '', flaws: '', appearance: '', backstory: ''
        };

        this.currency = data.currency || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
    }

    // ==========================================
    // GETTERS & DERIVED STATS
    // ==========================================

    get proficiencyBonus() {
        return Math.ceil(1 + (this.level / 4));
    }

    getModifier(stat) {
        const value = this.stats[stat.toLowerCase()] || 10;
        return Math.floor((value - 10) / 2);
    }

    getSaveModifier(stat) {
        let mod = this.getModifier(stat);
        if (this.proficiencies.has(`${stat}Save`)) {
            mod += this.proficiencyBonus;
        }
        return mod;
    }

    getSkillModifier(skill, stat) {
        let mod = this.getModifier(stat);
        if (this.proficiencies.has(skill)) {
            mod += this.proficiencyBonus;
        }
        if (this.expertise.has(skill)) {
            mod += this.proficiencyBonus; // Add again for expertise
        }
        return mod;
    }

    getPassivePerception() {
        return 10 + this.getSkillModifier('perception', 'wis');
    }

    // ==========================================
    // ACTIONS
    // ==========================================

    takeDamage(amount) {
        let remaining = amount;

        // Temp HP first
        if (this.hp.temp > 0) {
            if (this.hp.temp >= remaining) {
                this.hp.temp -= remaining;
                remaining = 0;
            } else {
                remaining -= this.hp.temp;
                this.hp.temp = 0;
            }
        }

        this.hp.current = Math.max(0, this.hp.current - remaining);
    }

    heal(amount) {
        if (this.hp.current <= 0 && amount > 0) {
            // Revived
            this.hp.current = 0;
        }
        this.hp.current = Math.min(this.hp.max, this.hp.current + amount);
    }

    addTempHp(amount) {
        // D&D rules: Temp HP doesn't stack, take higher
        this.hp.temp = Math.max(this.hp.temp, amount);
    }

    levelUp() {
        this.level++;
        // Hit dice logic would go here (add 1 die)
        this.hp.hitDiceAvailable++;
        // Note: Logic for increasing proficiency bonus is automatic via getter

        return {
            newLevel: this.level,
            proficiencyBonus: this.proficiencyBonus
        };
    }

    longRest() {
        this.hp.current = this.hp.max;
        this.hp.temp = 0;
        // Regain half hit dice (min 1)
        const regainedDice = Math.max(1, Math.floor(this.level / 2));
        this.hp.hitDiceAvailable = Math.min(this.level, this.hp.hitDiceAvailable + regainedDice);

        // Reset spell slots (naive implementation, needs class specific logic)
        for (const level in this.spells.slots) {
            this.spells.slots[level].current = this.spells.slots[level].max;
        }
    }

    // ==========================================
    // SERIALIZATION
    // ==========================================

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            race: this.race,
            class: this.class,
            level: this.level,
            background: this.background,
            alignment: this.alignment,
            xp: this.xp,
            stats: this.stats,
            proficiencies: Array.from(this.proficiencies),
            expertise: Array.from(this.expertise),
            hp: this.hp,
            ac: this.ac,
            speed: this.speed,
            equipment: this.equipment,
            spells: this.spells,
            bio: this.bio,
            currency: this.currency,
            lastModified: Date.now()
        };
    }

    static fromJSON(json) {
        return new Character(json);
    }
}
