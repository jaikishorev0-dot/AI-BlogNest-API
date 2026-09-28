const { validationResult } = require('express-validator');
const Comment = require('../models/commentModel');
const Blog = require('../models/blog');
// Create a comment
const createComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findById(req.body.blog);

    if (!blog) {
      return res.status(404).json({
        message: 'Blog not found'
      });
    }

    const comment = await Comment.create({
      blog: req.body.blog,
      user: req.user._id,
      content: req.body.content
    });

    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });

  } catch (error) {
    next(error);
  }
};

// Get comments for a blog
const getBlogComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      blog: req.params.blogId
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(comments);

  } catch (error) {
    next(error);
  }
};

// Update comment moderation status
const updateCommentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'spam'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid comment status'
      });
    }

    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found'
      });
    }

    res.json({
      message: 'Comment status updated successfully',
      comment
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getBlogComments,
  updateCommentStatus
};