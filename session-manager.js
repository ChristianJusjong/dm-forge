/**
 * session-manager.js
 * Handles real-time synchronization between DM and Players using PeerJS (WebRTC).
 * Enables cross-device connection without a custom backend.
 */

// Import PeerJS from ESM CDN
import Peer from 'https://esm.sh/peerjs@1.5.4?bundle-deps';

export class SessionManager {
    constructor(role, campaignCode) {
        this.role = role; // 'host' (DM) or 'client' (Player)
        this.campaignCode = campaignCode;
        this.peer = null;
        this.conn = null; // For Client: connection to Host
        this.connections = []; // For Host: list of Player connections
        this.listeners = [];

        // Generate a clean ID for the host based on campaign code
        // ID must be alphanumeric/dashes. Campaign code is already XXXX-XXXX.
        // Prefix with 'dm-forge-' to ensure uniqueness in PeerJS public server
        this.hostId = `dm-forge-${this.campaignCode.replace(/[^a-zA-Z0-9-]/g, '')}`;
    }

    async connect() {
        if (!this.campaignCode) {
            console.error("SessionManager: No campaign code provided.");
            return;
        }

        console.log(`📡 [${this.role}] Initializing PeerJS...`);

        if (this.role === 'host') {
            await this.initHost();
        } else {
            await this.initClient();
        }
    }

    initHost() {
        // Host tries to open the specific Peer ID
        this.peer = new Peer(this.hostId, {
            debug: 2
        });

        this.peer.on('open', (id) => {
            console.log(`✅ [Host] Session Active. Peer ID: ${id}`);
            console.log(`🔗 Players can join with Campaign Code: ${this.campaignCode}`);
        });

        this.peer.on('connection', (conn) => {
            console.log(`🤝 [Host] Incoming connection from: ${conn.peer}`);
            this.handleConnection(conn);
        });

        this.peer.on('error', (err) => {
            console.error('PeerJS Error:', err);
            if (err.type === 'unavailable-id') {
                console.warn('⚠️ Session ID already taken. Are you already hosting in another tab?');
            }
        });
    }

    initClient() {
        // Client gets a random ID
        this.peer = new Peer(null, {
            debug: 2
        });

        this.peer.on('open', (id) => {
            console.log(`👤 [Client] Peer ID: ${id}`);
            console.log(`⏳ Connecting to Host: ${this.hostId}...`);

            const conn = this.peer.connect(this.hostId, {
                reliable: true
            });

            this.handleConnection(conn);
        });

        this.peer.on('error', (err) => {
            console.error('PeerJS Error:', err);
            if (err.type === 'peer-unavailable') {
                alert('❌ Could not find the Session Host. \n\nEnsure the DM has the Campaign open and the code is correct.');
            }
        });
    }

    handleConnection(conn) {
        if (this.role === 'host') {
            this.connections.push(conn);
        } else {
            this.conn = conn; // Client only has one connection (to host)
        }

        conn.on('open', () => {
            console.log(`🔗 Connected to: ${conn.peer}`);

            // If Client, send JOIN message immediately
            if (this.role === 'client') {
                this.send('PLAYER_JOIN', {
                    peerId: this.peer.id,
                    userAgent: navigator.userAgent
                });
            }
        });

        conn.on('data', (data) => {
            console.log(`📥 Received:`, data);

            // If Host receives data, verify/broadcast it?
            // For now, Host just listens.
            // But if Host wants to echo to other players, it could.

            if (data && data.type) {
                this.notifyListeners(data.type, data.payload);
            }
        });

        conn.on('close', () => {
            console.log(`🔌 Connection closed: ${conn.peer}`);
            if (this.role === 'host') {
                this.connections = this.connections.filter(c => c !== conn);
            }
        });
    }

    send(type, payload = {}) {
        const message = {
            type,
            payload,
            timestamp: Date.now()
        };

        if (this.role === 'client') {
            if (this.conn && this.conn.open) {
                this.conn.send(message);
            } else {
                console.warn('⚠️ Cannot send, connection not open.');
            }
        } else {
            // Host Broadcasts to ALL
            this.connections.forEach(conn => {
                if (conn.open) {
                    conn.send(message);
                }
            });
        }
    }

    onMessage(callback) {
        this.listeners.push(callback);
    }

    notifyListeners(type, payload) {
        this.listeners.forEach(cb => cb(type, payload));
    }

    disconnect() {
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
        this.connections = [];
        this.conn = null;
    }
}
