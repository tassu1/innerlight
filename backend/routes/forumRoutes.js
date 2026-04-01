const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  createPost,
  deletePost,
  addComment,
} = require('../controllers/forumController');
const {protect} = require('../middlewares/authMiddleware');

router.get('/posts', protect,getAllPosts);
router.post('/posts',protect, createPost);
router.delete('/posts/:id',protect, deletePost);
router.post('/posts/:id/comments',protect, addComment);

module.exports = router;