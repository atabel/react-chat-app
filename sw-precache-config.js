module.exports = {
    stripPrefix: 'build/',
    staticFileGlobs: ['build/*.html', 'build/manifest.json', 'build/static/**/!(*map*)'],
    dontCacheBustUrlsMatching: /\.\w{8}\./,
    swFilePath: 'build/service-worker.js',
    navigateFallback: 'index.html',
    runtimeCaching: [
        // roboto fonts
        {
            urlPattern: '/(.*)',
            handler: 'cacheFirst',
            options: {
                origin: /fonts\.gstatic\.com/,
                cache: {
                    name: 'static-vendor-cache-v1',
                    maxEntries: 10,
                },
            },
        },
        // roboto css
        {
            urlPattern: '/css',
            handler: 'fastest',
            options: {
                origin: /fonts\.googleapis\.com/,
                cache: {
                    name: 'dynamic-vendor-cache-v1',
                    maxEntries: 5,
                },
            },
        },
        // reset css
        {
            urlPattern: '/ajax/libs/meyer-reset/2.0/reset.css',
            handler: 'fastest',
            options: {
                origin: /cdnjs\.cloudflare\.com/,
                cache: {
                    name: 'dynamic-vendor-cache-v1',
                    maxEntries: 5,
                },
            },
        },
    ],
};
