/**
 * CLOUD STORE ABSTRACTION LAYER
 * 
 * This module provides a unified interface for data persistence.
 * Currently backed by LocalStorage for immediate use on Vercel.
 * Designed to be swapped for Firebase Firestore in the future without changing app code.
 */

// Configuration
const CONFIG = {
    provider: 'local', // 'local' or 'firebase'
    collections: {
        campaigns: 'dm_codex_campaigns',
        users: 'dm_codex_users',
        sessions: 'dm_codex_sessions'
    }
};

class CloudStore {
    constructor() {
        this.provider = CONFIG.provider;
        console.log(`☁️ CloudStore initialized with provider: ${this.provider}`);
    }

    // ==========================================
    // DATA OPERATIONS
    // ==========================================

    /**
     * Get a document by ID from a collection
     * @param {string} collection - Collection name
     * @param {string} id - Document ID
     * @returns {Promise<object|null>} Document data or null
     */
    async getDoc(collection, id) {
        if (this.provider === 'local') {
            return this._localGetDoc(collection, id);
        }
        // Future Firebase implementation here
    }

    /**
     * Set a document (create or overwrite)
     * @param {string} collection - Collection name
     * @param {string} id - Document ID
     * @param {object} data - Data to save
     * @returns {Promise<boolean>} Success status
     */
    async setDoc(collection, id, data) {
        if (this.provider === 'local') {
            return this._localSetDoc(collection, id, data);
        }
    }

    /**
     * Update specific fields in a document
     * @param {string} collection - Collection name
     * @param {string} id - Document ID
     * @param {object} updates - Fields to update
     * @returns {Promise<boolean>} Success status
     */
    async updateDoc(collection, id, updates) {
        if (this.provider === 'local') {
            const current = await this.getDoc(collection, id);
            if (!current) return false;
            const newData = { ...current, ...updates, updatedAt: Date.now() };
            return this.setDoc(collection, id, newData);
        }
    }

    /**
     * Get all documents in a collection (optionally filtered)
     * @param {string} collection - Collection name
     * @param {object} query - Simple filter object { field: value }
     * @returns {Promise<Array>} Array of documents
     */
    async getCollection(collection, query = null) {
        if (this.provider === 'local') {
            return this._localGetCollection(collection, query);
        }
    }

    // ==========================================
    // LOCAL STORAGE IMPLEMENTATION (Private)
    // ==========================================

    _getStorageKey(collection) {
        return CONFIG.collections[collection] || `dm_codex_${collection}`;
    }

    _localGetDoc(collection, id) {
        return new Promise((resolve) => {
            const key = this._getStorageKey(collection);
            const allDocs = safeLocalStorageGet(key, {});
            // Simulate network delay for realism
            setTimeout(() => resolve(allDocs[id] || null), 50);
        });
    }

    _localSetDoc(collection, id, data) {
        return new Promise((resolve) => {
            const key = this._getStorageKey(collection);
            const allDocs = safeLocalStorageGet(key, {});

            // Add metadata
            data.id = id;
            data.updatedAt = Date.now();
            if (!data.createdAt) data.createdAt = Date.now();

            allDocs[id] = data;

            const success = safeLocalStorageSet(key, allDocs);
            setTimeout(() => resolve(success), 50);
        });
    }

    _localGetCollection(collection, query) {
        return new Promise((resolve) => {
            const key = this._getStorageKey(collection);
            const allDocs = safeLocalStorageGet(key, {});
            let results = Object.values(allDocs);

            // Simple client-side filtering
            if (query) {
                results = results.filter(doc => {
                    return Object.entries(query).every(([field, value]) => doc[field] === value);
                });
            }

            setTimeout(() => resolve(results), 50);
        });
    }
}

// Export singleton instance
export const db = new CloudStore();
