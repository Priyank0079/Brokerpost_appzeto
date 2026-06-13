const Posting = require('../models/Posting');
const Notification = require('../models/Notification');
const { sendPushNotification } = require('./notificationService');

// Maps new posting intent to what it seeks in counterpart postings
const intentMatchMap = {
  // Availabilities seek Requirements
  'SALE': 'PURCHASE',
  'RENT': 'WANTED_RENT',
  'RENTALS': 'WANTED_RENT',
  'LEASE': 'WANTED_LEASE',
  
  // Requirements seek Availabilities
  'PURCHASE': 'SALE',
  'WANTED_RENT': 'RENT',
  'WANTED_LEASE': 'LEASE'
};

const calculateMatchScore = (newPost, existingPost) => {
  let score = 0;
  let subTypeMatched = false;
  let locMatched = false;
  let projMatched = false;

  // 1. Vertical
  if (newPost.vertical && existingPost.vertical && newPost.vertical === existingPost.vertical) {
    score++;
  }

  // 2. SubType
  if (newPost.subType && existingPost.subType && newPost.subType === existingPost.subType) {
    score++;
    subTypeMatched = true;
  }

  // 3. City is now evaluated as a prerequisite at the database level, so we don't score it here again.

  // 4. Location (fuzzy word match)
  if (newPost.location && existingPost.location) {
    const words1 = newPost.location.toLowerCase().split(/\s+/);
    const words2 = existingPost.location.toLowerCase().split(/\s+/);
    const hasOverlap = words1.some(w => words2.includes(w) && w.length > 2); // Ignore tiny words if possible
    if (hasOverlap) {
      score++;
      locMatched = true;
    }
  }

  // 4b. Project (fuzzy word match)
  if (newPost.project && existingPost.project) {
    const words1 = newPost.project.toLowerCase().split(/\s+/);
    const words2 = existingPost.project.toLowerCase().split(/\s+/);
    const hasOverlap = words1.some(w => words2.includes(w) && w.length > 2);
    if (hasOverlap) {
      score++;
      projMatched = true;
    }
  }

  // 5. Budget vs Price
  let hasBudgetMatch = false;
  const avail = newPost.postType === 'AVAILABILITY' ? newPost : existingPost;
  const req = newPost.postType === 'REQUIREMENT' ? newPost : existingPost;

  if (avail && req) {
    const price = avail.totalAmount;
    const min = req.budgetMin;
    const max = req.budgetMax;

    // Actually, units might differ (LAKH, CR). Let's do a basic check.
    const getMultiplier = (unit) => {
      if (unit === 'CR') return 10000000;
      if (unit === 'LAKH') return 100000;
      if (unit === 'THOUSAND') return 1000;
      return 1;
    };

    const priceVal = (price || 0) * getMultiplier(avail.totalAmountUnit);
    const minVal = (min || 0) * getMultiplier(req.budgetUnit);
    const maxVal = (max || 0) * getMultiplier(req.budgetUnit);

    if (priceVal > 0 && minVal > 0 && maxVal > 0) {
      // Allow 10% buffer
      if (priceVal >= minVal * 0.9 && priceVal <= maxVal * 1.1) {
        hasBudgetMatch = true;
      }
    }
  }

  if (hasBudgetMatch) {
    score++;
  }

  return { score, subTypeMatched, locMatched, projMatched };
};

exports.findAndNotifyMatches = async (newPosting) => {
  try {
    const targetIntent = intentMatchMap[newPosting.intent];
    if (!targetIntent) return; // No mapping defined

    // We only look for active postings that have the target intent
    // First priority: City MUST match if a city is provided.
    const query = {
      isActive: true,
      intent: targetIntent,
      _id: { $ne: newPosting._id },
      postedBy: { $ne: newPosting.postedBy } // Don't notify yourself
    };

    if (newPosting.city) {
      // Strict case-insensitive city matching
      query.city = { $regex: new RegExp(`^${newPosting.city}$`, 'i') };
    }

    const potentialMatches = await Posting.find(query).populate('postedBy', 'firstName lastName name companyName');

    const matches = [];
    for (const post of potentialMatches) {
      const matchResult = calculateMatchScore(newPosting, post);
      
      // Genuine match criteria: Sub-type, City (from query), Location, AND Project must all match/overlap.
      if (matchResult.subTypeMatched && matchResult.locMatched && matchResult.projMatched) {
        matches.push(post);
      }
    }

    if (matches.length > 0) {
      await sendMatchNotifications(newPosting, matches);
    }

  } catch (error) {
    console.error('Error in matching service:', error);
  }
};

const sendMatchNotifications = async (newPosting, matches) => {
  const notifications = [];

  const newPostTypeLabel = newPosting.postType === 'AVAILABILITY' ? 'Availability' : 'Requirement';
  const newPostTitle = newPosting.subType ? newPosting.subType.replace(/_/g, ' ') : 'Property';

  const newPostRef = newPosting._id.toString().slice(-6).toUpperCase();
  const newPostLoc = newPosting.location || newPosting.city || 'Location';

  for (const match of matches) {
    const matchPostTypeLabel = match.postType === 'AVAILABILITY' ? 'Availability' : 'Requirement';
    const matchTitle = match.subType ? match.subType.replace(/_/g, ' ') : 'Property';
    const matchRef = match._id.toString().slice(-6).toUpperCase();
    const matchLoc = match.location || match.city || 'Location';

    // 1. Notify the owner of the existing post about the NEW post
    notifications.push({
      recipient: match.postedBy._id,
      sender: newPosting.postedBy, // Just ID
      onModel: newPosting.onModel,
      type: 'POST_MATCH',
      title: 'New Property Match Found!',
      message: `Your existing ${matchPostTypeLabel} (ID: ${matchRef}) at ${matchLoc} matched with a new ${newPostTypeLabel} (ID: ${newPostRef}) at ${newPostLoc}.`,
      relatedId: newPosting._id // Link to the NEW post
    });

    // 2. Notify the owner of the NEW post about the EXISTING post
    notifications.push({
      recipient: newPosting.postedBy,
      sender: match.postedBy._id,
      onModel: match.onModel,
      type: 'POST_MATCH',
      title: 'Existing Match Found!',
      message: `Your new ${newPostTypeLabel} (ID: ${newPostRef}) at ${newPostLoc} matched with an existing ${matchPostTypeLabel} (ID: ${matchRef}) at ${matchLoc}.`,
      relatedId: match._id // Link to the EXISTING post
    });
  }

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);

    // ── Fire push notifications (non-blocking — failure won't break the match flow) ──
    try {
      const pushPromises = [];

      for (const match of matches) {
        const newPostTypeLabel = newPosting.postType === 'AVAILABILITY' ? 'Availability' : 'Requirement';
        const newPostTitle = newPosting.subType ? newPosting.subType.replace(/_/g, ' ') : 'Property';
        const newPostRef = newPosting._id.toString().slice(-6).toUpperCase();
        const newPostLoc = newPosting.location || newPosting.city || 'Location';

        const matchPostTypeLabel = match.postType === 'AVAILABILITY' ? 'Availability' : 'Requirement';
        const matchRef = match._id.toString().slice(-6).toUpperCase();
        const matchLoc = match.location || match.city || 'Location';

        // Push to owner of existing match post
        pushPromises.push(
          sendPushNotification(match.postedBy._id, {
            title: '🏠 New Property Match Found!',
            body: `Your ${matchPostTypeLabel} (${matchRef}) at ${matchLoc} matched with a new ${newPostTypeLabel} at ${newPostLoc}.`,
            data: { type: 'POST_MATCH', relatedId: newPosting._id.toString(), url: '/dashboard/notifications' }
          })
        );

        // Push to owner of new post
        pushPromises.push(
          sendPushNotification(newPosting.postedBy, {
            title: '🏠 Existing Match Found!',
            body: `Your new ${newPostTypeLabel} (${newPostRef}) at ${newPostLoc} matched with an existing ${matchPostTypeLabel} (${matchRef}) at ${matchLoc}.`,
            data: { type: 'POST_MATCH', relatedId: match._id.toString(), url: '/dashboard/notifications' }
          })
        );
      }

      // All push notifications fire in parallel — failures are logged, not thrown
      Promise.allSettled(pushPromises).then(results => {
        const sent = results.filter(r => r.status === 'fulfilled' && r.value?.sent > 0).length;
        console.log(`[FCM] Match push notifications fired: ${sent}/${pushPromises.length}`);
      });

    } catch (pushError) {
      // Push failure is silent — in-app notifications are still saved above
      console.error('[FCM] Push notification error in matchingService:', pushError.message);
    }
  }
};
