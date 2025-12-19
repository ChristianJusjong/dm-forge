/**
 * D&D Beyond Character Parser
 * Parses the JSON export from D&D Beyond into the app's character format.
 */

const DndBeyondParser = {
    /**
     * Parse D&D Beyond JSON data
     * @param {Object|String} json - The JSON object or string from D&D Beyond
     * @returns {Object} formatted character object
     */
    parse(json) {
        try {
            const data = typeof json === 'string' ? JSON.parse(json) : json;
            // Handle root types:
            // v3 public: root is character
            // v3 wrapped: root has character property
            // v5 internal: root has data property
            const charData = data.character || data.data || data;

            if (!charData || !charData.name) {
                throw new Error('Invalid D&D Beyond JSON: Missing character data');
            }

            // 1. Basic Info
            const name = charData.name || 'Unknown Hero';

            // Race
            let race = 'Unknown Race';
            if (charData.race) {
                race = charData.race.fullName || charData.race.baseName || 'Unknown Race';
            }

            // Class & Level
            let charClass = 'Unknown Class';
            let level = 1;
            let hitDie = 8; // Default

            if (charData.classes && charData.classes.length > 0) {
                // Primary class
                const primary = charData.classes[0];
                if (primary.definition) {
                    charClass = primary.definition.name;
                    hitDie = primary.definition.hitDice || 8;
                }
                // Total Level
                level = charData.classes.reduce((total, c) => total + (c.level || 0), 0);
            }

            // 2. Ability Scores (Stats)
            // D&D Beyond stores stats in order: STR, DEX, CON, INT, WIS, CHA (Ids 1-6)
            // Value = Base + Bonuses
            const stats = {
                STR: this.getStat(charData, 1),
                DEX: this.getStat(charData, 2),
                CON: this.getStat(charData, 3),
                INT: this.getStat(charData, 4),
                WIS: this.getStat(charData, 5),
                CHA: this.getStat(charData, 6)
            };

            // 3. Modifiers
            const mods = {
                STR: Math.floor((stats.STR - 10) / 2),
                DEX: Math.floor((stats.DEX - 10) / 2),
                CON: Math.floor((stats.CON - 10) / 2),
                INT: Math.floor((stats.INT - 10) / 2),
                WIS: Math.floor((stats.WIS - 10) / 2),
                CHA: Math.floor((stats.CHA - 10) / 2)
            };

            // 4. Hit Points
            // baseHp + (conMod * level) + (rolled/fixed per level)
            // Simplified: Use the override or calculated value if available
            let maxHp = charData.baseHitPoints + (mods.CON * level);
            // Add race/feat bonuses if complex (simplified here to use 'removedHitPoints' for current)
            // D&D Beyond JSON is notoriously hard for HP. simpler to rely on base + con * level or explicit overrides
            // Use the "override" if set
            if (charData.overrideHitPoints) maxHp = charData.overrideHitPoints;

            const currentHp = maxHp - (charData.removedHitPoints || 0);

            // 5. Armor Class
            // Calculating AC is complex (Armor + Dex + Shield + Magic + Unarmored Defense).
            // We'll look for an override or perform a basic calc.
            let ac = 10 + mods.DEX; // Base Unarmored
            // To do full AC, we need to iterate inventory. For now, use override or simple base.
            if (charData.overrideStats && charData.overrideStats.find(s => s.id === 2)) {
                // AC override
                ac = charData.overrideStats.find(s => s.id === 2).value;
            }

            // 6. Speed
            const speed = (charData.race && charData.race.weightSpeeds && charData.race.weightSpeeds.normal && charData.race.weightSpeeds.normal.walk) || 30;

            // 7. Initiative
            const initiative = mods.DEX + (charData.initiativeBonus || 0);

            return {
                id: Date.now(),
                name: name,
                race: race,
                class: charClass,
                level: level,
                stats: stats,
                mods: mods,
                hp: {
                    current: currentHp,
                    max: maxHp,
                    temp: charData.temporaryHitPoints || 0
                },
                ac: ac,
                speed: speed,
                initiative: initiative,
                avatarUrl: charData.avatarUrl || null,
                decorations: charData.decorations || {}
            };

        } catch (error) {
            console.error('D&D Beyond Parse Error:', error);
            throw new Error('Failed to parse D&D Beyond data: ' + error.message);
        }
    },

    /**
     * Helper to calculate total stat value
     */
    getStat(data, id) {
        // Base value
        let value = 0;
        const stat = data.stats.find(s => s.id === id);
        if (stat) value = stat.value || 0; // The rolled/buy value

        // Add Racial Bonus
        if (data.modifiers && data.modifiers.race) {
            data.modifiers.race.forEach(mod => {
                if (mod.entityId === id && mod.type === 'bonus') value += mod.value;
            });
        }

        // Add ASI / Feat Bonus
        // (Simplified: D&D Beyond structure is deep. For MVP, base stats often suffice or user edits)
        // Check "bonus-stats"
        if (data.bonusStats) {
            const bonus = data.bonusStats.find(s => s.id === id);
            if (bonus && bonus.value) value += bonus.value;
        }

        // Overrides
        if (data.overrideStats) {
            const override = data.overrideStats.find(s => s.id === id);
            if (override && override.value) return override.value;
        }

        return value;
    }
};

// Export for global use
window.DndBeyondParser = DndBeyondParser;
