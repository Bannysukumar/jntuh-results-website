// Push Notification Handler
self.addEventListener("push", function (event) {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/android-chrome-512x512.png",
      badge: "/android-chrome-192x192.png",
      data: {
        url: data.url || "https://manajntuhresults.vercel.app/academicresult",
      },
    }),
  );
});

// Notification Click Handler
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || "https://manajntuhresults.vercel.app/academicresult";
  
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // If no existing window, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
