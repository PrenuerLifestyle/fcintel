// Firebase SDK (loaded from CDN in HTML)

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLavOembi_2egjQcshysiWqKZOwMka9aI",
  authDomain: "fcintel-1fa8c.firebaseapp.com",
  projectId: "fcintel-1fa8c",
  storageBucket: "fcintel-1fa8c.firebasestorage.app",
  messagingSenderId: "715533638753",
  appId: "1:715533638753:web:491d17796c411ecab9de20"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const messaging = firebase.messaging();

