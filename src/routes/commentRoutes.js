const express = require('express');
const { body } = require('express-validator');

const {
  createComment,
  getBlogComments,
  updateCommentStatus
} = require('../controllers/commentController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a comment
router.post(
  '/',
  authMiddleware,
  [
    body('blog')
      .notEmpty()
      .withMessage('Blog ID is required'),

    body('content')
      .notEmpty()
      .withMessage('Comment content is required')
  ],
  createComment
);

// Get comments for a blog
router.get(
  '/blog/:blogId',
  getBlogComments
);

// Update comment moderation status
router.put(
  '/:id/status',
  authMiddleware,
  [
    body('status')
      .isIn(['pending', 'approved', 'spam'])
      .withMessage('Status must be pending, approved, or spam')
  ],
  updateCommentStatus
);

module.exports = router;