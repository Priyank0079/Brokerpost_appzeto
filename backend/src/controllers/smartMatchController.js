const Posting = require('../models/Posting');

// Intents that map to each other for matching
const intentMatchMap = {
  'SALE': ['PURCHASE'],
  'RENT': ['WANTED_RENT'],
  'RENTALS': ['WANTED_RENT'],
  'LEASE': ['WANTED_LEASE'],
  'PURCHASE': ['SALE'],
  'WANTED_RENT': ['RENT', 'RENTALS'],
  'WANTED_LEASE': ['LEASE']
};

// Utils
const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const kw = (s) => norm(s).split(' ').filter(w => w.length > 2);

const matchRule = (myL, other) => {
  // MANDATORY: Sub-type must match exactly
  if (!myL.subType || !other.subType) return null;
  if (norm(myL.subType) !== norm(other.subType)) return null;

  // Keyword overlap
  const locA = kw(myL.location);
  const locB = kw(other.location);
  const locCommon = locA.filter(w => locB.some(v => v === w || v.startsWith(w) || w.startsWith(v)));

  const projA = kw(myL.project || '');
  const projB = kw(other.project || '');
  let projCommon = [];
  if (projA.length > 0 && projB.length > 0) {
    projCommon = projA.filter(w => projB.some(v => v === w || v.startsWith(w) || w.startsWith(v)));
  }

  const locMatched = locCommon.length > 0;
  const projMatched = projCommon.length > 0;

  // MANDATORY: at least one of location or project must match
  if (!locMatched && !projMatched) return null;

  // Score calculation (sub-type already matched = base 20 pts)
  let score = 20;

  // Location - up to 40 pts
  if (locMatched) {
    const locMax = Math.max(locA.length, locB.length, 1);
    score += Math.min(Math.round((locCommon.length / locMax) * 40), 40);
  }

  // Project - up to 40 pts
  if (projMatched) {
    const projMax = Math.max(projA.length, projB.length, 1);
    score += Math.min(Math.round((projCommon.length / projMax) * 40), 40);
  }

  return {
    score: Math.min(score, 100),
    locCommon,
    projCommon,
    subMatch: true,
    locMatched,
    projMatched
  };
};

exports.getSmartMatches = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch all active listings for the current user
    const myListings = await Posting.find({
      postedBy: userId,
      isActive: true
    }).lean();

    if (myListings.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // 2. We could fetch all active listings from OTHER users here.
    // For large DBs, this would be optimized, but here we can pull them 
    // or run a smart query.
    // To be efficient, we fetch all active postings from other users 
    // that share the same city and subType as AT LEAST ONE of the user's postings.
    
    const myCities = [...new Set(myListings.map(l => l.city))];
    const mySubTypes = [...new Set(myListings.map(l => l.subType))];

    const otherListings = await Posting.find({
      postedBy: { $ne: userId },
      isActive: true,
      city: { $in: myCities },
      subType: { $in: mySubTypes }
    }).populate('postedBy', 'firstName lastName name companyName operatingCity phoneNumber').lean();

    const matchGroups = [];

    // 3. Process matching
    myListings.forEach(myL => {
      const targetIntents = intentMatchMap[myL.intent];
      if (!targetIntents) return;

      const candidates = otherListings.filter(other => 
        targetIntents.includes(other.intent) && 
        norm(other.city) === norm(myL.city)
      );

      const matches = [];

      candidates.forEach(other => {
        // If the broker was deleted but listing exists, skip it
        if (!other.postedBy || !other.postedBy._id) return;

        const result = matchRule(myL, other);
        if (!result || result.score < 20) return;

        // Clean up the nested postedBy structure
        const broker = other.postedBy || {};
        const fName = broker.firstName || '';
        const lName = broker.lastName || '';
        const fullName = broker.name || `${fName} ${lName}`.trim() || 'Unknown Broker';

        matches.push({
          listing: {
            _id: other._id,
            brokerId: broker._id,
            brokerName: fullName,
            brokerCompany: broker.companyName || 'Independent',
            brokerPhone: broker.phoneNumber || broker.phone,
            brokerCity: broker.operatingCity,
            subType: other.subType,
            location: other.location,
            city: other.city,
            projectSociety: other.project,
            bedrooms: other.bedrooms,
            size: other.size ? `${other.size} ${other.sizeUnit}` : undefined,
            price: other.totalAmount,
            budgetMin: other.budgetMin,
            budgetMax: other.budgetMax,
            unit: other.totalAmountUnit || other.budgetUnit,
            postType: other.postType,
            intent: other.intent
          },
          ...result
        });
      });

      if (matches.length > 0) {
        matches.sort((a, b) => b.score - a.score);
        matchGroups.push({
          myL: {
            id: myL._id,
            subType: myL.subType,
            location: myL.location,
            city: myL.city,
            projectSociety: myL.project,
            size: myL.size ? `${myL.size} ${myL.sizeUnit}` : undefined,
            price: myL.totalAmount,
            budgetMin: myL.budgetMin,
            budgetMax: myL.budgetMax,
            unit: myL.totalAmountUnit || myL.budgetUnit,
            postType: myL.postType,
            intent: myL.intent,
            vertical: myL.vertical
          },
          matches,
          isAvail: myL.postType === 'AVAILABILITY'
        });
      }
    });

    // Sort groups by top match score
    matchGroups.sort((a, b) => b.matches[0].score - a.matches[0].score);

    res.status(200).json({
      success: true,
      data: matchGroups
    });

  } catch (error) {
    console.error('Error fetching smart matches:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
