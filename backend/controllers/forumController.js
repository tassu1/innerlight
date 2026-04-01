const Post = require('../models/Post');

// ✅ GET all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });

    const userId = req.user?._id;

    const postsWithOwnership = posts.map(post => ({
      ...post.toObject(),
      isOwner: userId && post.user._id.toString() === userId.toString(),
    }));

    res.json({ success: true, posts: postsWithOwnership });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch posts' });
  }
};
const createPost = async (req, res) => {
  try {
    const { content } = req.body;
   console.log(content)
  console.log(req.user)

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Post cannot be empty' });
    }

    const post = await Post.create({
      content: content.trim(),
      user: req.user._id,
    });
console.log("aaaaaaaaaaaaa")
    res.status(201).json({
      success: true,
      post: {
        ...post.toObject(),
        isOwner: true,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not create post' });
  }
};
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not your post' });
    }

    await post.deleteOne();

    res.json({ success: true, message: 'Post removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not delete post' });
  }
};
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Comment cannot be empty' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.comments.push({
      text: text.trim(),
      user: req.user._id,
    });

    await post.save();

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      comment: newComment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not add comment' });
  }
};
module.exports = { getAllPosts, createPost, deletePost, addComment };