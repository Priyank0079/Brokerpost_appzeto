const express = require('express');
const router = express.Router();
const {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  addMembers,
  removeMember
} = require('../controllers/groupController');

const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(authorize('Admin'), createGroup)
  .get(getGroups);

router.route('/:id')
  .get(getGroup)
  .put(authorize('Admin'), updateGroup)
  .delete(authorize('Admin'), deleteGroup);

router.post('/:id/members', authorize('Admin'), addMembers);
router.delete('/:id/members/:memberId', authorize('Admin'), removeMember);

module.exports = router;

