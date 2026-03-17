import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-functions.js";

const firebaseConfig = {
  apiKey: "AIzaSyDLavOembi_2egjQcshysiWqKZOwMka9aI",
  authDomain: "fcintel-1fa8c.firebaseapp.com",
  projectId: "fcintel-1fa8c",
  storageBucket: "fcintel-1fa8c.firebasestorage.app",
  messagingSenderId: "715533638753",
  appId: "1:715533638753:web:491d17796c411ecab9de20"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const functions = getFunctions(app);

(async () => {
  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log("Service worker registered:", registration);

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn("Notification permission denied.");
      return;
    }
    console.log("Notification permission granted.");

    // Get FCM token — replace with your actual VAPID key from Firebase Console
    const token = await getToken(messaging, {
      vapidKey: "YOUR_VAPID_KEY_HERE", // TODO: Replace with your VAPID key
      serviceWorkerRegistration: registration
    });
    console.log("FCM token:", token);

    // Save token to backend
    const saveToken = httpsCallable(functions, 'saveToken');
    const uid = localStorage.getItem('fcintel_uid');
    if (uid) {
      const result = await saveToken({ userId: uid, token });
      console.log("Token saved:", result.data);
    }

    // Listen for foreground messages
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      if (payload.notification) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/logo/favicon.png'
        });
      }
    });

    console.log("✅ FCM setup complete!");
  } catch (err) {
    console.error("Error in FCM setup:", err);
  }
})();
