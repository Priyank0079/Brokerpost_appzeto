const { getMessaging } = require('../config/firebase');
const User = require('../models/User');

/**
 * Send a push notification to a single user by their userId.
 * Automatically cleans up invalid/expired tokens.
 *
 * @param {string} userId - MongoDB ObjectId of the recipient user
 * @param {Object} payload
 * @param {string} payload.title - Notification title
 * @param {string} payload.body - Notification body
 * @param {Object} [payload.data] - Optional key-value data to send with notification
 * @returns {Promise<{ sent: number, failed: number }>}
 */
exports.sendPushNotification = async (userId, { title, body, data = {} }) => {
  let sent = 0;
  let failed = 0;

  try {
    // Fetch only the fcmTokens field
    const user = await User.findById(userId).select('fcmTokens firstName').lean();

    if (!user || !user.fcmTokens || user.fcmTokens.length === 0) {
      return { sent: 0, failed: 0 };
    }

    const tokens = user.fcmTokens.map(t => t.token);
    const invalidTokens = [];

    // Send to each token individually for fine-grained error handling
    const sendPromises = tokens.map(async (token) => {
      try {
        const message = {
          token,
          notification: { title, body },
          data: {
            ...data,
            // Always include click_action so the SW knows where to navigate
            click_action: data.url || '/',
            timestamp: String(Date.now())
          },
          webpush: {
            notification: {
              title,
              body,
              icon: '/favicon.svg',
              badge: '/favicon.svg',
              click_action: data.url || '/'
            },
            fcmOptions: {
              link: data.url || '/'
            }
          }
        };

        await getMessaging().send(message);
        sent++;
      } catch (err) {
        failed++;
        // These error codes indicate the token is no longer valid
        const invalidCodes = [
          'messaging/invalid-registration-token',
          'messaging/registration-token-not-registered',
          'messaging/invalid-argument'
        ];
        if (invalidCodes.includes(err.code)) {
          invalidTokens.push(token);
          console.warn(`[FCM] Invalid token removed for user ${userId}: ${err.code}`);
        } else {
          console.error(`[FCM] Failed to send to token for user ${userId}:`, err.message);
        }
      }
    });

    await Promise.allSettled(sendPromises);

    // Clean up invalid tokens from DB in background (non-blocking)
    if (invalidTokens.length > 0) {
      User.findByIdAndUpdate(userId, {
        $pull: { fcmTokens: { token: { $in: invalidTokens } } }
      }).catch(e => console.error('[FCM] Failed to clean invalid tokens:', e.message));
    }

  } catch (error) {
    console.error('[FCM] sendPushNotification error:', error.message);
  }

  return { sent, failed };
};

/**
 * Send a push notification to multiple users.
 *
 * @param {string[]} userIds - Array of MongoDB ObjectIds
 * @param {Object} payload - { title, body, data }
 */
exports.sendPushToMultiple = async (userIds, payload) => {
  if (!userIds || userIds.length === 0) return;

  const results = await Promise.allSettled(
    userIds.map(id => exports.sendPushNotification(id, payload))
  );

  const totalSent = results.reduce((acc, r) => acc + (r.value?.sent || 0), 0);
  const totalFailed = results.reduce((acc, r) => acc + (r.value?.failed || 0), 0);

  console.log(`[FCM] Batch send complete — sent: ${totalSent}, failed: ${totalFailed}`);
};
