// ⚠️ Incrementer ce numéro à CHAQUE mise à jour de votre site
const CACHE_NAME = 'mon-app-cache-v3';
const ASSETS = [
  '/',
  '/index.html',
  // Ajoute ici tes fichiers CSS ou JS si tu veux qu'ils fonctionnent hors-ligne
];

// Installation : mise en cache + activation immédiate sans attendre
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // ← Force l'activation immédiate
});

// Activation : suppression des anciens caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME) // tous les caches sauf le nouveau
          .map((name) => caches.delete(name))     // on les supprime
      );
    })
  );
  self.clients.claim(); // ← Prend le contrôle immédiat de toutes les pages ouvertes
});

// Requêtes : cache en priorité, sinon réseau
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});