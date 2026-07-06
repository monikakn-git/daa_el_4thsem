// Minimal no-op service worker to prevent 404s during development
// Replace this with a full service worker if you intend to use PWA features.

self.addEventListener('install', (event) => {
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Take control of uncontrolled clients
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // No-op fetch handler; let the network handle requests as usual
  return; // intentionally do nothing
});
