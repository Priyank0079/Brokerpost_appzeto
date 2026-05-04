const Group = require('../models/Group');
const User = require('../models/User');

// @desc    Create a new group
// @route   POST /api/v1/groups
// @access  Private/Admin
exports.createGroup = async (req, res, next) => {
  try {
    const { name, description, members } = req.body;
    const Notification = require('../models/Notification');

    const group = await Group.create({
      name,
      description,
      members,
      createdBy: req.user._id
    });

    // Send notifications to members
    if (members && members.length > 0) {
      const notifications = members.map(memberId => ({
        recipient: memberId,
        sender: req.user._id,
        onModel: req.userModel,
        type: 'GROUP_ADDED',
        title: 'New Group Membership',
        message: `You have been added to the official group: ${name}`,
        relatedId: group._id
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all groups
// @route   GET /api/v1/groups
// @access  Private
exports.getGroups = async (req, res, next) => {
  try {
    let query;
    
    // If Admin, get all. If Broker, get groups they are member of.
    if (req.userModel === 'Admin') {
      query = Group.find().populate('members', 'firstName lastName email companyName');
    } else {
      query = Group.find({ members: req.user._id }).populate('members', 'firstName lastName email companyName');
    }

    const groups = await query;

    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single group
// @route   GET /api/v1/groups/:id
// @access  Private
exports.getGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'firstName lastName email companyName');

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update group
// @route   PUT /api/v1/groups/:id
// @access  Private/Admin
exports.updateGroup = async (req, res, next) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete group
// @route   DELETE /api/v1/groups/:id
// @access  Private/Admin
exports.deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Group deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Add members to group
// @route   POST /api/v1/groups/:id/members
// @access  Private/Admin
exports.addMembers = async (req, res, next) => {
  try {
    const { memberIds } = req.body;
    const Notification = require('../models/Notification');
    
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    const newMembers = [];
    memberIds.forEach(id => {
      if (!group.members.includes(id)) {
        group.members.push(id);
        newMembers.push(id);
      }
    });

    await group.save();

    // Send notifications to new members
    if (newMembers.length > 0) {
      const notifications = newMembers.map(memberId => ({
        recipient: memberId,
        sender: req.user._id,
        onModel: req.userModel,
        type: 'GROUP_ADDED',
        title: 'New Group Membership',
        message: `You have been added to the official group: ${group.name}`,
        relatedId: group._id
      }));
      await Notification.insertMany(notifications);
    }

    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from group
// @route   DELETE /api/v1/groups/:id/members/:memberId
// @access  Private/Admin
exports.removeMember = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    group.members = group.members.filter(
      memberId => memberId.toString() !== req.params.memberId
    );

    await group.save();

    res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      data: group
    });
  } catch (error) {
    next(error);
  }
};


