const { setGlobalOptions } = require("firebase-functions");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getMessaging } = require("firebase-admin/messaging");
const { getFirestore } = require("firebase-admin/firestore");
const { initializeApp } = require("firebase-admin/app");

initializeApp();
setGlobalOptions({ maxInstances: 10 });

const db = getFirestore();
const messaging = getMessaging();

/**
 * Save FCM token for a user
 */
exports.saveToken = onCall(async (request) => {
  const { userId, token } = request.data;
  if (!userId || !token) {
    throw new HttpsError("invalid-argument", "userId and token are required.");
  }
  await db.collection("users").doc(userId).set(
    { fcmToken: token, updatedAt: new Date() },
    { merge: true }
  );
  return { success: true };
});

/**
 * Subscribe a token to a topic
 */
exports.subscribeToTopic = onCall(async (request) => {
  const { token, topic } = request.data;
  if (!token || !topic) {
    throw new HttpsError("invalid-argument", "token and topic are required.");
  }
  const sanitizedTopic = topic.replace(/[^a-zA-Z0-9_-]/g, "_");
  await messaging.subscribeToTopic([token], sanitizedTopic);
  return { success: true, topic: sanitizedTopic };
});

/**
 * Unsubscribe a token from a topic
 */
exports.unsubscribeFromTopic = onCall(async (request) => {
  const { token, topic } = request.data;
  if (!token || !topic) {
    throw new HttpsError("invalid-argument", "token and topic are required.");
  }
  const sanitizedTopic = topic.replace(/[^a-zA-Z0-9_-]/g, "_");
  await messaging.unsubscribeFromTopic([token], sanitizedTopic);
  return { success: true };
});

/**
 * Send a notification to a topic (admin only)
 */
exports.sendNotification = onCall(async (request) => {
  // Verify admin claim
  if (!request.auth || !request.auth.token.admin) {
    throw new HttpsError("permission-denied", "Admin access required.");
  }
  const { title, body, topic, imageUrl, linkUrl } = request.data;
  if (!title || !body) {
    throw new HttpsError("invalid-argument", "title and body are required.");
  }
  const sanitizedTopic = topic
    ? topic.replace(/[^a-zA-Z0-9_-]/g, "_")
    : "general";

  const message = {
    notification: { title, body, ...(imageUrl && { imageUrl }) },
    ...(linkUrl && { webpush: { fcmOptions: { link: linkUrl } } }),
    topic: sanitizedTopic,
  };
  const response = await messaging.send(message);

  // Log to Firestore
  await db.collection("notifications").add({
    title, body, topic: sanitizedTopic,
    imageUrl: imageUrl || null,
    linkUrl: linkUrl || null,
    sentAt: new Date(),
    messageId: response,
  });

  return { success: true, messageId: response };
});
