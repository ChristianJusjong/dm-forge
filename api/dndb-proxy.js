/**
 * Vercel Serverless Function to proxy D&D Beyond requests
 * Usage: /api/dndb-proxy?url=[DNDB_URL] or /api/dndb-proxy?charId=[ID]
 */

import https from 'https';

export default async function handler(request, response) {
    // Enable CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') {
        response.status(200).end();
        return;
    }

    const { url, charId } = request.query;
    let targetUrl = '';

    if (charId) {
        targetUrl = `https://character-service.dndbeyond.com/character/v3/character/${charId}`;
    } else if (url) {
        // Extract ID from URL if full URL is provided
        // Formats:
        // https://www.dndbeyond.com/characters/12345
        // https://www.dndbeyond.com/profile/User/characters/12345
        // https://www.dndbeyond.com/characters/145316872/FGrkV2 (Shareable link)

        // Check for shareable link first (has token after ID)
        // Regex: characters/[ID]/[Token]
        const shareableMatch = url.match(/characters\/\d+\/([a-zA-Z0-9]+)/);

        if (shareableMatch && shareableMatch[1]) {
            // If it has a token, we MUST use the public URL + /json to pass the privacy check
            // The API endpoint doesn't trivially accept the token in the URL path.
            // We append /json to the original URL (ensuring no double slash)
            targetUrl = url.endsWith('/') ? `${url}json` : `${url}/json`;
        } else {
            // Standard ID extraction for public characters
            const match = url.match(/characters\/(\d+)/);

            if (match && match[1]) {
                targetUrl = `https://character-service.dndbeyond.com/character/v3/character/${match[1]}`;
            } else if (url.endsWith('.json')) {
                targetUrl = url;
            } else {
                response.status(400).json({ error: 'Invalid URL format. Could not extract Character ID.' });
                return;
            }
        }
    } else {
        response.status(400).json({ error: 'Missing charId or url parameter' });
        return;
    }

    try {
        const data = await fetchJson(targetUrl);
        response.status(200).json(data);
    } catch (error) {
        response.status(500).json({ error: 'Failed to fetch from D&D Beyond', details: error.message });
    }
}

function fetchJson(url, redirectCount = 0) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';

            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // Handle Redirect
                if (redirectCount > 5) {
                    reject(new Error('Too many redirects'));
                    return;
                }
                // Follow redirect
                resolve(fetchJson(res.headers.location, redirectCount + 1));
                return;
            }

            if (res.statusCode >= 400) {
                reject(new Error(`Status Code: ${res.statusCode}`));
                return;
            }

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });

        }).on('error', (err) => {
            reject(err);
        });
    });
}
