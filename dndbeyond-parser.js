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

            // Handle both direct character object and wrapped "character" object
            const charData = data.character || data;

            if (!charData || !charData.name) {
                throw new Error('Invalid D&D Beyond JSON: Missing character data');
            }

            // Extract basic info
            const name = charData.name || 'Unknown Hero';

            // Extract Race
            let race = 'Unknown Race';
            if (charData.race) {
                race = charData.race.fullName || charData.race.baseName || 'Unknown Race';
            }

            // Extract Class & Level
            let charClass = 'Unknown Class';
            let level = 1;

            if (charData.classes && charData.classes.length > 0) {
                // Use primary class (first one)
                const primaryClass = charData.classes[0];

                if (primaryClass.definition) {
                    charClass = primaryClass.definition.name || 'Unknown Class';
                }

                // Calculate total level if multiclassing, or just use primary
                level = charData.classes.reduce((total, c) => total + (c.level || 0), 0);
            }

            return {
                id: Date.now(),
                name: name,
                race: race,
                class: charClass,
                level: level
            };

        } catch (error) {
            console.error('D&D Beyond Parse Error:', error);
            throw new Error('Failed to parse D&D Beyond data: ' + error.message);
        }
    }
};

// Export for global use
window.DndBeyondParser = DndBeyondParser;
