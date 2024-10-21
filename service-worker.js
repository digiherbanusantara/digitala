self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('my-cache').then(cache => {
      return cache.addAll([
        '/digitala/',
        '/digitala/index.html',
        '/digitala/about.html',
        '/digitala/login.html',
        '/digitala/css/style.css',
        '/digitala/js/main.js',
        '/digitala/codcrm.html',
        '/digitala/tfcrm.html',
        '/digitala/images/pwa.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
