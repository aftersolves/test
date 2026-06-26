// ===== OFFLINE FALLBACK =====
const OFFLINE_URL = '/offline.html';

// Add offline.html to your cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('aftersolves-offline-v1').then((cache) => {
            return cache.addAll([OFFLINE_URL]);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== 'aftersolves-offline-v1')
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Network-first strategy with offline fallback
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // 1. Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // 2. Skip API calls
    if (requestUrl.hostname.includes('emailsubs.aftersolves.workers.dev')) return;

    // 3. Skip ALL cross-origin requests (external images, fonts, scripts, etc.)
    // This replaces your long list of external URLs and catches new ones automatically
    if (requestUrl.origin !== self.location.origin) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // If the server returns a 5xx, show offline page
                if (response.status >= 500) {
                    return caches.match(OFFLINE_URL);
                }
                return response;
            })
            .catch(() => {
                // Network failed — show offline page
                return caches.match(OFFLINE_URL).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Fallback: generate a basic offline response
                    return new Response(
                        '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline - AfterSolves</title><style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#fafafa;color:#171717;text-align:center;padding:2rem}h1{font-size:2rem;margin-bottom:0.5rem}p{color:#737373;max-width:400px}a{color:#f97316;text-decoration:none;font-weight:500}</style></head><body><div><h1>📱 You\'re Offline</h1><p>AfterSolves is temporarily unreachable. Check your connection and <a href="/">try again</a>.</p></div></body></html>',
                        { headers: { 'Content-Type': 'text/html' } }
                    );
                });
            })
    );
});