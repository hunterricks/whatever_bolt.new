/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD58Kn-yvzewAT5_VYj4qi60SlQFrCOsdo",
  authDomain: "whateverappv1.firebaseapp.com",
  projectId: "whateverappv1",
  storageBucket: "whateverappv1.appspot.com",
  messagingSenderId: "84286156246",
  appId: "1:84286156246:web:9131aec5335928414c4877",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
