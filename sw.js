// Nom du cache (tu peux le changer si tu mets à jour ton site)
const CACHE_NAME = 'mon-app-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  // Ajoute ici tes fichiers CSS ou JS si tu veux qu'ils fonctionnent hors-ligne
];

// Installation du Service Worker et mise en cache des fichiers essentiels
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Intercepter les requêtes pour servir les fichiers depuis le cache si on est hors-ligne
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
