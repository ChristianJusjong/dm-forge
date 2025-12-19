import { db } from './cloud-store.js';

/**
 * SESSION MANAGER
 * Orchestrates saving/loading of the entire game table state.
 * Bundles: Initiative Tracker, Session Notes, Active Campaign state.
 */

export class SessionManager {
    constructor() {
        console.log('📜 SessionManager initialized');
    }

    /**
     * Save the current active session state completely
     * @param {string} sessionId - ID of the session
     * @param {string} notes - Optional closing notes
     */
    async saveSessionState(sessionId, notes = '') {
        console.log(`💾 Saving session state for ${sessionId}...`);

        // 1. Gather all local state
        const initiativeData = safeLocalStorageGet('initiative_tracker', { combatants: [], round: 1 });
        const encounterData = safeLocalStorageGet('encounters', []); // All saved encounters
        const partyData = safeLocalStorageGet('party_members', []);
        const sessionNotesData = safeLocalStorageGet('session_notes', []); // Capture the actual notes

        // 2. Identify active campaign
        const currentUser = safeLocalStorageGet('dm_codex_current_user');
        if (!currentUser) throw new Error('User not logged in');

        const campaigns = safeLocalStorageGet('dm_codex_campaigns', []);
        const activeCampaign = campaigns.find(c => c.dmId === currentUser.id); // Simplified lookup

        // 3. Construct the session bundle
        const sessionSnapshot = {
            id: sessionId,
            campaignId: activeCampaign ? activeCampaign.id : 'unknown',
            dmId: currentUser.id,
            timestamp: Date.now(),
            status: 'active', // or 'closed'
            closingNotes: notes,

            // The "State"
            state: {
                initiative: initiativeData,
                party: partyData,
                sessionNotes: sessionNotesData,
                // We don't save ALL encounters, just the potentially active ones or reference to them
                // For simplicity in Vercel/Local version, we snapshot pending combat
                activeCombat: initiativeData.combatants.length > 0
            }
        };

        // 4. Persist via CloudStore (abstraction)
        await db.setDoc('sessions', sessionId, sessionSnapshot);
        console.log('✅ Session saved successfully');
        return true;
    }

    /**
     * Close the current session (Save & Reset)
     */
    async closeSession(sessionId, summaryNotes) {
        // 1. Final Save
        const sessionData = await this.saveSessionState(sessionId, summaryNotes);

        // 2. Mark as closed
        await db.updateDoc('sessions', sessionId, { status: 'closed', endedAt: Date.now() });

        // 3. Update Campaign "Last Session" pointer
        // (In a real DB this would be a transaction)

        // 4. Clear the "Board" (Initiative Tracker) but keep Party
        localStorage.removeItem('initiative_tracker');
        // We DO want to clear session notes so the next session starts fresh (or user creates a new one)
        // However, users might prefer to keep them. "Closing" implies wrapping up.
        // Let's clear them to enforce the "Episode" structure requested.
        localStorage.removeItem('session_notes');
        // We keep 'party_members' because the party persists between sessions
        // We keep 'encounters' library because that's a library, not state

        console.log('🚪 Session closed and board cleared');
        return true;
    }

    /**
     * Restore a previous session
     * @param {string} sessionId 
     */
    async restoreSession(sessionId) {
        console.log(`📂 Restoring session ${sessionId}...`);

        // 1. Fetch data
        const session = await db.getDoc('sessions', sessionId);
        if (!session) throw new Error('Session not found');

        // 2. Hydrate LocalStorage
        if (session.state.initiative) {
            safeLocalStorageSet('initiative_tracker', session.state.initiative);
        }

        if (session.state.party) {
            // Optional: Ask if they want to overwrite current party?
            // For now, we restore it to ensure consistency with that session
            safeLocalStorageSet('party_members', session.state.party);
        }

        if (session.state.sessionNotes) {
            safeLocalStorageSet('session_notes', session.state.sessionNotes);
        }

        console.log('✅ Session restored. Redirecting...');
        return true;
    }

    /**
     * Get list of all sessions for current campaign
     */
    async getSessionHistory() {
        // This query filter relies on the simple implementation in cloud-store.js
        // In a real DB, we'd query by 'campaignId'
        const allSessions = await db.getCollection('sessions');
        return allSessions.sort((a, b) => b.timestamp - a.timestamp);
    }
}

export const sessionManager = new SessionManager();
