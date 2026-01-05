
const https = require('https');

// The URL the proxy is constructing
const url = 'https://www.dndbeyond.com/characters/145316872/FGrkV2/json';

console.log('Fetching:', url);

function fetchJson(targetUrl, redirectCount = 0) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json'
            }
        };

        https.get(targetUrl, options, (res) => {
            console.log(`[${redirectCount}] Status:`, res.statusCode);
            console.log(`[${redirectCount}] Headers:`, JSON.stringify(res.headers));

            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                console.log(`[${redirectCount}] Redirecting to:`, res.headers.location);
                if (redirectCount > 5) return reject(new Error('Too many redirects'));

                // Handle relative redirects
                let nextUrl = res.headers.location;
                if (!nextUrl.startsWith('http')) {
                    const origin = new URL(targetUrl).origin;
                    nextUrl = origin + nextUrl;
                }

                resolve(fetchJson(nextUrl, redirectCount + 1));
                return;
            }

            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log('--- Body Start ---');
                console.log(data.substring(0, 500)); // Print first 500 chars
                console.log('--- Body End ---');

                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    // console.error('Not JSON');
                    resolve({ error: 'Not JSON', body: data.substring(0, 100) });
                }
            });

        }).on('error', (err) => {
            console.error('Network Error:', err);
            reject(err);
        });
    });
}

fetchJson(url)
    .then(data => console.log('Final Result:', typeof data))
    .catch(err => console.error('Failed:', err.message));
