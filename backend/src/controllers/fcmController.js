const User = require('../models/User');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Save (register) an FCM token for the authenticated user
// @route   POST /api/v1/fcm/token
// @access  Private (Broker)
// Body: { token: String, device?: String }
// ─────────────────────────────────────────────────────────────────────────────
exports.saveFcmToken = async (req, res, next) => {
  try {
    const { token, device = 'web' } = req.body;

    if (!token || typeof token !== 'string' || token.trim() === '') {
      return res.status(400).json({ success: false, message: 'FCM token is required' });
    }

    const trimmedToken = token.trim();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Deduplicate: remove any existing entry with this exact token
    user.fcmTokens = (user.fcmTokens || []).filter(t => t.token !== trimmedToken);

    // Add the new token (max 10 tokens per user to avoid stale token buildup)
    user.fcmTokens.push({ token: trimmedToken, device, createdAt: new Date() });

    // Keep only the 10 most recent tokens
    if (user.fcmTokens.length > 10) {
      user.fcmTokens = user.fcmTokens.slice(-10);
    }

    await user.save({ validateBeforeSave: false });

    console.log(`[FCM] Token saved for user ${user._id} (device: ${device})`);

    return res.status(200).json({
      success: true,
      message: 'FCM token registered successfully'
    });
  } catch (error) {
    console.error('[FCM] Error saving token:', error.message);
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Remove an FCM token (called on logout or token refresh)
// @route   DELETE /api/v1/fcm/token
// @access  Private (Broker)
// Body: { token: String }
// ─────────────────────────────────────────────────────────────────────────────
exports.removeFcmToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token || typeof token !== 'string' || token.trim() === '') {
      return res.status(400).json({ success: false, message: 'FCM token is required' });
    }

    const trimmedToken = token.trim();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const originalCount = (user.fcmTokens || []).length;
    user.fcmTokens = (user.fcmTokens || []).filter(t => t.token !== trimmedToken);

    if (user.fcmTokens.length !== originalCount) {
      await user.save({ validateBeforeSave: false });
      console.log(`[FCM] Token removed for user ${user._id}`);
    }

    return res.status(200).json({
      success: true,
      message: 'FCM token removed successfully'
    });
  } catch (error) {
    console.error('[FCM] Error removing token:', error.message);
    next(error);
  }
};
