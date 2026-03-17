importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDLavOembi_2egjQcshysiWqKZOwMka9aI",
  authDomain: "fcintel-1fa8c.firebaseapp.com",
  projectId: "fcintel-1fa8c",
  storageBucket: "fcintel-1fa8c.firebasestorage.app",
  messagingSenderId: "715533638753",
  appId: "1:715533638753:web:491d17796c411ecab9de20"
});

const messaging = firebase.messaging();
