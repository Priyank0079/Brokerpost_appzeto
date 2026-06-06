const Posting = require('../models/Posting');
const User = require('../models/User');
const Group = require('../models/Group');
const Admin = require('../models/Admin');
const { findAndNotifyMatches } = require('../services/matchingService');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a new posting (Requirement or Availability)
// @route   POST /api/v1/postings
// @access  Private (Broker)
// ─────────────────────────────────────────────────────────────────────────────
exports.createPosting = async (req, res, next) => {
  try {
    // Enforce listing limit
    const currentUser = await User.findById(req.user._id);
    const activeListingsCount = await Posting.countDocuments({ 
      postedBy: req.user._id, 
      isActive: true 
    });

    if (activeListingsCount >= currentUser.listingLimit) {
      return res.status(400).json({
        success: false,
        message: `You have reached your maximum limit of ${currentUser.listingLimit} active listings.`
      });
    }

    const {
      vertical, postType, intent, subType,
      location, project,
      size, sizeUnit,
      bedrooms,
      priceRate, priceRateType,
      totalAmount, totalAmountUnit,
      budgetMin, budgetMax, budgetUnit,
      occupancy, constructionStatus,
      tenantPreference, shortDescription, remarks, images, videos, city
    } = req.body;

    const posting = await Posting.create({
      postedBy: req.user._id,
      onModel: req.userModel,

      vertical, postType, intent, subType,
      location, project,
      size, sizeUnit,
      bedrooms,
      priceRate, priceRateType,
      totalAmount, totalAmountUnit,
      budgetMin, budgetMax, budgetUnit,
      occupancy, constructionStatus,
      tenantPreference, shortDescription, remarks, images, videos, city
    });

    // Fire and forget matching process
    findAndNotifyMatches(posting).catch(err => {
      console.error('Failed to run matching service:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Posting created successfully',
      data: posting
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all active postings (with filters)
// @route   GET /api/v1/postings
// @access  Private (Broker)
// Query params: vertical, postType, intent, subType, location, bedrooms,
//               constructionStatus, occupancy, page, limit
// ─────────────────────────────────────────────────────────────────────────────
exports.getPostings = async (req, res, next) => {
  try {
    const {
      vertical, postType, intent, subType,
      location, bedrooms, constructionStatus, occupancy,
      groupId, city,
      page = 1, limit = 20
    } = req.query;

    const filter = { isActive: true };

    if (vertical)           filter.vertical           = vertical;
    if (postType)           filter.postType           = postType;
    if (intent)             filter.intent             = intent;
    if (subType)            filter.subType            = new RegExp(`^${subType}$`, 'i');
    if (bedrooms)           filter.bedrooms           = bedrooms;
    if (constructionStatus) filter.constructionStatus = constructionStatus;
    if (occupancy)          filter.occupancy          = occupancy;
    if (city)               filter.city               = city;

    if (location) {
      const searchRegex = { $regex: location.trim(), $options: 'i' };
      filter.$or = [
        { location: searchRegex },
        { project: searchRegex },
        { $expr: { $regexMatch: { input: { $toString: '$_id' }, regex: location.trim(), options: 'i' } } }
      ];
    }

    // If groupId is provided, filter by its members
    if (groupId) {
      const group = await Group.findById(groupId);
      if (group) {
        let membersToSearch = group.members;
        if (req.user && req.userModel !== 'Admin') {
          // Exclude the current user's own postings from the group view
          membersToSearch = membersToSearch.filter(m => m.toString() !== req.user._id.toString());
        }
        filter.postedBy = { $in: membersToSearch };
      }
    }

    if (req.query.scope === 'network' && req.userModel !== 'Admin' && req.user) {
      const Group = require('../models/Group');
      const userGroups = await Group.find({ members: req.user._id });
      const memberIds = [...new Set(userGroups.flatMap(g => g.members.map(m => m.toString())))];
      if (!memberIds.includes(req.user._id.toString())) {
        memberIds.push(req.user._id.toString());
      }
      filter.postedBy = { $in: memberIds };
    }

    const skip = (Number(page) - 1) * Number(limit);

    let postings;
    let total;

    if (req.userModel === 'Admin') {
      [postings, total] = await Promise.all([
        Posting.find(filter)
          .populate('postedBy', 'firstName lastName name phoneNumber companyName operatingCity')
          .sort({ boostedAt: -1, createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        Posting.countDocuments(filter)
      ]);
    } else {

      [postings, total] = await Promise.all([
        Posting.find(filter)
          .populate('postedBy', 'firstName lastName name phoneNumber companyName operatingCity')
          .sort({ boostedAt: -1, createdAt: -1 })
          .skip(skip)
          .limit(Number(limit)),
        Posting.countDocuments(filter)
      ]);
    }

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      count: postings.length,
      data: postings
    });
  } catch (error) {
    next(error);
  }
};


// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get postings created by the currently logged-in broker
// @route   GET /api/v1/postings/my
// @access  Private (Broker)
// ─────────────────────────────────────────────────────────────────────────────
exports.getMyPostings = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User context missing' });
    }

    const { postType, intent, subType, vertical, isActive, page = 1, limit = 20 } = req.query;

    const filter = { postedBy: req.user._id };

    if (postType)           filter.postType           = postType;
    if (intent)             filter.intent             = intent;
    if (subType)            filter.subType            = new RegExp(`^${subType}$`, 'i');
    if (vertical)           filter.vertical           = vertical;
    // Allow fetching inactive postings for "my postings" view
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [postings, total] = await Promise.all([
      Posting.find(filter)
        .sort({ boostedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean()
        .catch(e => { console.error('getMyPostings find failed', e); return []; }),
      Posting.countDocuments(filter).catch(e => { console.error('getMyPostings count failed', e); return 0; })
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      count: postings.length,
      data: postings
    });
  } catch (error) {
    console.error('Error in getMyPostings:', error);
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get a single posting by ID
// @route   GET /api/v1/postings/:id
// @access  Private (Broker)
// ─────────────────────────────────────────────────────────────────────────────
exports.getPostingById = async (req, res, next) => {
  try {
    const posting = await Posting.findById(req.params.id)
      .populate('postedBy', 'firstName lastName name phoneNumber companyName operatingCity');


    if (!posting) {
      return res.status(404).json({ success: false, message: 'Posting not found' });
    }

    res.status(200).json({ success: true, data: posting });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update a posting (owner only)
// @route   PATCH /api/v1/postings/:id
// @access  Private (Owner Broker)
// ─────────────────────────────────────────────────────────────────────────────
exports.updatePosting = async (req, res, next) => {
  try {
    const posting = await Posting.findById(req.params.id);

    if (!posting) {
      return res.status(404).json({ success: false, message: 'Posting not found' });
    }

    // Only the owner or an admin can update
    const isOwner = posting.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.userModel === 'Admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this posting' });
    }

    // Whitelist updatable fields (classification fields are NOT updatable — create a new posting instead)
    const allowedUpdates = [
      'vertical', 'postType', 'intent', 'subType',
      'location', 'project',
      'size', 'sizeUnit',
      'bedrooms',
      'priceRate', 'priceRateType',
      'totalAmount', 'totalAmountUnit',
      'budgetMin', 'budgetMax', 'budgetUnit',
      'occupancy', 'constructionStatus',
      'tenantPreference', 'shortDescription', 'remarks', 'images', 'videos',
      'isActive', 'city'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updated = await Posting.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Posting updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Soft-delete a posting (set isActive = false)
// @route   DELETE /api/v1/postings/:id
// @access  Private (Owner Broker or Admin)
// ─────────────────────────────────────────────────────────────────────────────
exports.deletePosting = async (req, res, next) => {
  try {
    const posting = await Posting.findById(req.params.id);

    if (!posting) {
      return res.status(404).json({ success: false, message: 'Posting not found' });
    }

    const isOwner = posting.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.userModel === 'Admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this posting' });
    }

    posting.isActive = false;
    await posting.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Posting removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Refresh (Boost) a posting
// @route   PATCH /api/v1/postings/:id/refresh
// @access  Private (Owner Broker)
// ─────────────────────────────────────────────────────────────────────────────
exports.refreshPosting = async (req, res, next) => {
  try {
    const posting = await Posting.findById(req.params.id);

    if (!posting) {
      return res.status(404).json({ success: false, message: 'Posting not found' });
    }

    // Only owner can refresh their posting
    if (posting.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to refresh this posting' });
    }

    const LandingPageConfig = require('../models/LandingPageConfig');
    const config = await LandingPageConfig.findOne();
    const dailyLimit = config?.platformSettings?.dailyBoostLimit || 5;

    const user = await User.findById(req.user._id);

    const now = new Date();
    // Midnight reset check
    if (user.lastBoostDate) {
      const lastBoost = new Date(user.lastBoostDate);
      if (
        lastBoost.getDate() !== now.getDate() ||
        lastBoost.getMonth() !== now.getMonth() ||
        lastBoost.getFullYear() !== now.getFullYear()
      ) {
        user.dailyBoostUsed = 0;
      }
    }

    if (user.dailyBoostUsed >= dailyLimit) {
      return res.status(400).json({ 
        success: false, 
        message: `Daily refresh limit reached (${dailyLimit}/${dailyLimit}). Try again tomorrow.`
      });
    }

    // Apply boost
    user.dailyBoostUsed += 1;
    user.lastBoostDate = now;
    await user.save({ validateBeforeSave: false });

    posting.boostedAt = now;
    posting.boostCount += 1;
    await posting.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Listing refreshed successfully!',
      boostsUsed: user.dailyBoostUsed,
      dailyLimit: dailyLimit
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get dashboard statistics (aggregated counts)
// @route   GET /api/v1/postings/stats
// @access  Private
// ─────────────────────────────────────────────────────────────────────────────
exports.getPostingStats = async (req, res, next) => {
  try {
    if (!req.user) {
      console.error('Stats request failed: req.user is missing');
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const userId = req.user.id || req.user._id;

    // Use imported models directly instead of mongoose.model() to avoid MissingSchemaError
    const PostingModel = Posting;
    const UserModel = User;
    const GroupModel = Group;

    // Build the group filter dynamically
    const groupQuery = { isActive: true };
    const groupOrConditions = [];
    
    if (req.user && req.user._id) {
      groupOrConditions.push({ members: req.user._id });
    }
    if (req.user && req.user.id) {
      groupOrConditions.push({ members: req.user.id });
    }
    
    // Defensive check for associatedGroup - might be undefined in production
    if (req.user && req.user.associatedGroup) {
      groupOrConditions.push({ name: req.user.associatedGroup });
      groupOrConditions.push({ name: req.user.associatedGroup.trim() });
    }
    
    if (groupOrConditions.length > 0) {
      groupQuery.$or = groupOrConditions;
    }

    const networkBaseQuery = { isActive: true };
    const myBaseQuery = { isActive: true };
    if (req.userModel !== 'Admin') {
      myBaseQuery.postedBy = userId;
      
      // Calculate network visibility (own posts + group members' posts)
      const userGroups = await GroupModel.find({ members: userId });
      const memberIds = [...new Set(userGroups.flatMap(g => g.members.map(m => m.toString())))];
      if (!memberIds.includes(userId.toString())) {
        memberIds.push(userId.toString());
      }
      networkBaseQuery.postedBy = { $in: memberIds };
    } else {
      // Admins see all for "myBaseQuery" in stats, or we can restrict it if needed
    }

    // Run basic counts first (these are fast)
    const [
      totalListings,
      myListings,
      availabilityCount,
      requirementCount
    ] = await Promise.all([
      PostingModel.countDocuments(networkBaseQuery).catch(e => { console.error('Count totalListings failed:', e.message); return 0; }),
      PostingModel.countDocuments(myBaseQuery).catch(e => { console.error('Count myListings failed:', e.message); return 0; }),
      PostingModel.countDocuments({ ...networkBaseQuery, postType: 'AVAILABILITY' }).catch(e => { console.error('Count availabilityCount failed:', e.message); return 0; }),
      PostingModel.countDocuments({ ...networkBaseQuery, postType: 'REQUIREMENT' }).catch(e => { console.error('Count requirementCount failed:', e.message); return 0; })
    ]);

    // Run breakdown and recent listings - wrapped in try-catch to prevent single query failure from crashing
    let breakdownResults = {
      resSale: 0, resRent: 0, resPurchase: 0, resWantedRent: 0,
      comSale: 0, comLease: 0, comPurchase: 0, comWantedLease: 0,
      recentListings: [], totalBrokers: 0, groupCount: 0
    };

    try {
      const [
        resSale,
        resRent,
        resPurchase,
        resWantedRent,
        comSale,
        comLease,
        comPurchase,
        comWantedLease,
        recentListings,
        totalBrokers,
        groupCount
      ] = await Promise.all([
        // Residential Breakdown
        PostingModel.countDocuments({ ...myBaseQuery, vertical: 'RESIDENTIAL', intent: 'SALE' }).catch(() => 0),
        PostingModel.countDocuments({ ...myBaseQuery, vertical: 'RESIDENTIAL', intent: 'RENT' }).catch(() => 0),
        PostingModel.countDocuments({ ...myBaseQuery, vertical: 'RESIDENTIAL', intent: 'PURCHASE' }).catch(() => 0),
        PostingModel.countDocuments({ ...myBaseQuery, vertical: 'RESIDENTIAL', intent: 'WANTED_RENT' }).catch(() => 0),
        // Commercial Breakdown
        PostingModel.countDocuments({ ...myBaseQuery, vertical: 'COMMERCIAL', intent: 'SALE' }).catch(() => 0),
        PostingModel.countDocuments({ ...myBaseQuery, vertical: 'COMMERCIAL', intent: 'LEASE' }).catch(() => 0),
        PostingModel.countDocuments({ ...myBaseQuery, vertical: 'COMMERCIAL', intent: 'PURCHASE' }).catch(() => 0),
        PostingModel.countDocuments({ ...myBaseQuery, vertical: 'COMMERCIAL', intent: 'WANTED_LEASE' }).catch(() => 0),
        
        // Recent listings - separate try-catch for populate
        (async () => {
          try {
            return await PostingModel.find(myBaseQuery)
              .populate('postedBy', 'firstName lastName companyName name')
              .sort({ createdAt: -1 })
              .limit(5)
              .lean();
          } catch (e) {
            console.error('Recent listings fetch failed:', e.message);
            return [];
          }
        })(),
        UserModel.countDocuments({ role: 'Broker' }).catch(() => 0),
        (async () => {
          try {
            if (req.userModel === 'Admin') {
              return await GroupModel.countDocuments({ isActive: true });
            } else {
              return await GroupModel.countDocuments(groupQuery);
            }
          } catch (e) {
            console.error('Group count failed:', e.message);
            return 0;
          }
        })()
      ]);

      breakdownResults = {
        resSale, resRent, resPurchase, resWantedRent,
        comSale, comLease, comPurchase, comWantedLease,
        recentListings: recentListings || [],
        totalBrokers,
        groupCount
      };
    } catch (breakdownError) {
      console.error('Dashboard breakdown query failed:', breakdownError.message);
      // Continue with default values
    }

    let adminStats = {};
    if (req.userModel === 'Admin') {
      try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const [brokersByCityAgg, listingsByCityAgg, monthWiseAgg] = await Promise.all([
          UserModel.aggregate([
            { $match: { role: 'Broker' } },
            { $unwind: { path: '$operatingCity', preserveNullAndEmptyArrays: false } },
            { $match: { operatingCity: { $type: 'string', $ne: '' } } },
            { $group: { _id: { $toLower: '$operatingCity' }, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ]),
          PostingModel.aggregate([
            { $match: { isActive: true, city: { $type: 'string', $ne: '' } } },
            { $group: { _id: { $toLower: '$city' }, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ]),
          PostingModel.aggregate([
            { $match: { isActive: true, createdAt: { $gte: sixMonthsAgo } } },
            {
              $group: {
                _id: {
                  month: { $month: '$createdAt' },
                  year: { $year: '$createdAt' },
                  vertical: '$vertical',
                  intent: '$intent'
                },
                count: { $sum: 1 }
              }
            }
          ])
        ]);

        adminStats = {
          brokersByCity: brokersByCityAgg.map(i => ({ city: i._id ? (i._id.charAt(0).toUpperCase() + i._id.slice(1)) : 'Unknown', count: i.count })),
          listingsByCity: listingsByCityAgg.map(i => ({ city: i._id ? (i._id.charAt(0).toUpperCase() + i._id.slice(1)) : 'Unknown', count: i.count })),
          monthWiseListings: monthWiseAgg.map(i => ({
            month: i._id.month,
            year: i._id.year,
            vertical: i._id.vertical,
            intent: i._id.intent,
            count: i.count
          }))
        };
      } catch (adminAggErr) {
        console.error('Admin aggregations failed:', adminAggErr);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalListings,
        myListings,
        availabilityCount,
        requirementCount,
        groupCount: breakdownResults.groupCount,
        breakdown: {
          residential: {
            sale: breakdownResults.resSale,
            rent: breakdownResults.resRent,
            purchase: breakdownResults.resPurchase,
            wantedRent: breakdownResults.resWantedRent
          },
          commercial: {
            sale: breakdownResults.comSale,
            lease: breakdownResults.comLease,
            purchase: breakdownResults.comPurchase,
            wantedLease: breakdownResults.comWantedLease
          }
        },
        recentListings: breakdownResults.recentListings,
        totalBrokers: breakdownResults.totalBrokers,
        ...adminStats
      }
    });
  } catch (error) {
    console.error('CRITICAL ERROR in getPostingStats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to aggregate dashboard statistics',
      error: error.message
    });
  }
};

