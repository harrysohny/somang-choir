/* Somang Choir V14-D3.14 push-only service worker */
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) { data = { body: event.data ? event.data.text() : '' }; }
  const title = data.title || '소망찬양대';
  const options = { body: data.body || '새 알림이 있습니다.', icon: './assets/icon-192.png', badge: './assets/icon-192.png', data: { url: data.url || './' }, tag: data.tag || 'somang-choir', renotify: true };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || './', self.registration.scope).href;
  event.waitUntil((async () => {
    const list = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of list) { if ('focus' in client) { await client.focus(); if ('navigate' in client) await client.navigate(target); return; } }
    if (clients.openWindow) return clients.openWindow(target);
  })());
});
