const Post = require("../models/Post");
const Notification = require("../models/Notification");

// Create a new post
const createPost = async (req, res) => {
  const { content, tags } = req.body;
  const imageUrl = req.file?.path || null;

  try {
    const post = await Post.create({
      user: req.user._id,
      content,
      tags,
      imageUrl,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post" });
  }
};


// Get all posts (latest first)
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .populate("comments.user", "name") 
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// Like/unlike a post
const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const liked = post.likes.includes(req.user._id);
    if (liked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);

      // 🔔 Notify post owner if someone else liked
      if (String(post.user) !== String(req.user._id)) {
        await Notification.create({
          user: post.user,
          from: req.user._id,
          type: "like",
          message: `${req.user.name} liked your post`,
          link: `/posts/${post._id}`,
        });
      }
    }

    await post.save();
    res.json({ message: liked ? "Unliked" : "Liked" });
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ message: "Failed to like/unlike post" });
  }
};


// Add a comment to a post
const addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      user: req.user._id,
      text,
    };

    post.comments.push(comment);
    await post.save();

    // 🔔 Notify post owner
    if (String(post.user) !== String(req.user._id)) {
      await Notification.create({
        user: post.user,
        from: req.user._id,
        type: "comment",
        message: `${req.user.name} commented on your post`,
        link: `/posts/${post._id}`,
      });
    }

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// Get comments of a post (from embedded array)
const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("comments.user", "name _id"); // ✅ add this
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post.comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};


// ✅ Get posts created by a specific user
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching user's posts:", err);
    res.status(500).json({ message: "Failed to fetch user's posts" });
  }
};

// Get Friend List
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friends", "name email");
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ message: "Failed to get friends list" });
  }
};

// Get another user's profile posts
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email");
    const posts = await Post.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
};
// Get paginated posts
const getPaginatedPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;

  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    res.json({
      posts,
      hasMore: page * limit < totalPosts,
    });
  } catch (err) {
    console.error("Error fetching paginated posts:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};
const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  post.content = req.body.content || post.content;
  await post.save();
  res.json({ message: "Post updated" });
};

// ✅ Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await post.deleteOne(); // or post.remove()

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting post:", err);
    res.status(500).json({ message: "Server error while deleting post" });
  }
};




module.exports = {
  createPost,
  getAllPosts,
  toggleLikePost,
  addComment,
  getComments,
  getUserPosts,
  getUserProfile,
  getFriends,
  getPaginatedPosts,
  deletePost,
  updatePost
};
