// PropellerAds Configuration
self.options = {
    "domain": "3nbf4.com",
    "zoneId": 10496313
}
self.lary = ""
importScripts('https://3nbf4.com/act/files/service-worker.min.js?r=sw')

// Push Notification Handler
self.addEventListener("push", function (event) {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/android-chrome-512x512.png",
      url: "https://manajntuhresults.vercel.app/academicresult",
    }),
  );
});
