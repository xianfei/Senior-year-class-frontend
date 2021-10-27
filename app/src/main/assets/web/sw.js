//缓存空间名称
var CACHE_VERSION = 'nhm_sw_v1';
//需缓存的文件
var CACHE_FILES = [
  '/naihuangmiao/',
];

//监听安装事件
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION)
    .then(cache => cache.addAll(CACHE_FILES)
      .then(() => self.skipWaiting())
    ));
});

//监听激活事件
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key, i) {
        if (key !== CACHE_VERSION) {
          return caches.delete(keys[i]);
        }
      }));
    })
  );
});

//不缓存策略
self.addEventListener('fetch', function(event) {});