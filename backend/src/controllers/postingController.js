const Posting = require('../models/Posting');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Create a new posting (Requirement or Availability)
// @route   POST /api/v1/postings
// @access  Private (Broker)
// ─────────────────────────────────────────────────────────────────────────────
exports.createPosting = async (req, res, next) => {
  try {
    const {
      vertical, postType, intent, subType,
      location, project,
      size, sizeUnit,
      bedrooms,
      priceRate, priceRateType,
      totalAmount, totalAmountUnit,
      budgetMin, budgetMax, budgetUnit,
      occupancy, constructionStatus,
      tenantPreference, shortDescription, images
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
      tenantPreference, shortDescription, images
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
      groupId,
      page = 1, limit = 20
    } = req.query;

    const filter = { isActive: true };

    if (vertical)           filter.vertical           = vertical;
    if (postType)           filter.postType           = postType;
    if (intent)             filter.intent             = intent;
    if (subType)            filter.subType            = subType;
    if (bedrooms)           filter.bedrooms           = bedrooms;
    if (constructionStatus) filter.constructionStatus = constructionStatus;
    if (occupancy)          filter.occupancy          = occupancy;

    if (location) {
      filter.location = { $regex: location.trim(), $options: 'i' };
    }

    // If groupId is provided, filter by its members
    if (groupId) {
      const Group = require('../models/Group');
      const group = await Group.findById(groupId);
      if (group) {
        filter.postedBy = { $in: group.members };
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    // If user is a broker, we might want to prioritize their group members
    let postings;
    let total;

    if (req.userModel === 'User' && !groupId) {
      const Group = require('../models/Group');
      const userGroups = await Group.find({ members: req.user._id });
      const memberIds = [...new Set(userGroups.flatMap(g => g.members.map(m => m.toString())))];
      
      // Use aggregation to prioritize
      const aggregation = [
        { $match: filter },
        {
          $addFields: {
            isGroupMember: {
              $cond: {
                if: { $in: [{ $toString: "$postedBy" }, memberIds] },
                then: 1,
                else: 0
              }
            }
          }
        },
        { $sort: { isGroupMember: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: Number(limit) }
      ];

      [postings, total] = await Promise.all([
        Posting.aggregate(aggregation),
        Posting.countDocuments(filter)
      ]);

      // Manually populate since aggregate doesn't do it as easily as find
      postings = await Posting.populate(postings, {
        path: 'postedBy',
        select: 'firstName lastName name phoneNumber companyName operatingCity'
      });
    } else {
      [postings, total] = await Promise.all([
        Posting.find(filter)
          .populate('postedBy', 'firstName lastName name phoneNumber companyName operatingCity')
          .sort({ createdAt: -1 })
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
    const { postType, intent, subType, isActive, page = 1, limit = 20 } = req.query;

    const filter = { postedBy: req.user._id };

    if (postType)           filter.postType           = postType;
    if (intent)             filter.intent             = intent;
    if (subType)            filter.subType            = subType;
    // Allow fetching inactive postings for "my postings" view
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [postings, total] = await Promise.all([
      Posting.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Posting.countDocuments(filter)
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

    // Only the owner can update
    if (posting.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this posting' });
    }

    // Whitelist updatable fields (classification fields are NOT updatable — create a new posting instead)
    const allowedUpdates = [
      'location', 'project',
      'size', 'sizeUnit',
      'bedrooms',
      'priceRate', 'priceRateType',
      'totalAmount', 'totalAmountUnit',
      'budgetMin', 'budgetMax', 'budgetUnit',
      'occupancy', 'constructionStatus',
      'tenantPreference', 'shortDescription',
      'isActive'
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
    const isAdmin = ['Administrator', 'Super Admin'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this posting' });
    }

    posting.isActive = false;
    await posting.save();

    res.status(200).json({
      success: true,
      message: 'Posting removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
