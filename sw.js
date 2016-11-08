var staticCacheName = 'coffee-static-v1';

self.addEventListener('install', function (event) {
    caches.open(staticCacheName).then(function (cache) {
        return cache.addAll([
            '/',
            '/index.html',
            '/src/css/style.css',
            '/src/js/app.js',
            '/src/js/libs/angular.min.js',
            '/src/img/favicon.png',
            '/src/kana.json'
        ]);
    });
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('caltrain-') &&
                        cacheName != staticCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});