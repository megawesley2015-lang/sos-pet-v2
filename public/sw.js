const CACHE_NAME = 'sos-pet-v2';

// Install - sem cache inicial
self.addEventListener('install', () => {
  console.log('[SW] Instalado');
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativado');
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch - apenas network, sem cache por enquanto
self.addEventListener('fetch', (event) => {
  // Deixar todas as requisições passarem normalmente
  return;
});
