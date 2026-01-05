
const https = require('https');

const charId = '145316872';
const token = 'FGrkV2';

const v3Url = `https://character-service.dndbeyond.com/character/v3/character/${charId}?key=${token}`;
const v5Url = `https://character-service.dndbeyond.com/character/v5/character/${charId}?key=${token}`;

console.log('Testing v3 URL:', v3Url);
console.log('Testing v5 URL:', v5Url);

function fetchJson(url, label) {
    return new Promise((resolve) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json'
            }
        };

        https.get(url, options, (res) => {
            console.log(`[${label}] Status:`, res.statusCode);
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    console.log(`[${label}] Success! Name:`, json.name || json.data?.name || 'Unknown');
                    resolve(true);
                } catch (e) {
                    console.log(`[${label}] Failed to parse JSON. Body preview:`, data.substring(0, 100));
                    resolve(false);
                }
            });
        }).on('error', err => {
            console.error(`[${label}] Error:`, err.message);
            resolve(false);
        });
    });
}

(async () => {
    console.log('--- STARTING TEST ---');
    await fetchJson(v3Url, 'v3');
    await fetchJson(v5Url, 'v5');
    console.log('--- TEST COMPLETE ---');
})();
