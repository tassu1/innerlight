const express = require("express");
const router = express.Router();
const { upload } = require("../utils/upload"); // ✅ fixed import
const {
  createPost,
  getAllPosts,
  toggleLikePost,
  addComment,
  getComments,
  getUserPosts,
  getPaginatedPosts,
  updatePost,
  deletePost
} = require("../controllers/forumController");

const { protect } = require("../middlewares/authMiddleware");

// ✅ Create Post with Image
router.post("/", protect, upload.single("image"), createPost);

// ✅ Get All Posts (Public)
router.get("/", getAllPosts);

// ✅ My Posts
router.get("/myposts", protect, async (req, res) => {
  req.params.userId = req.user._id;
  return getUserPosts(req, res);
});

// ✅ Posts by User ID
router.get("/user/:userId", protect, getUserPosts);

// ✅ Like / Unlike
router.put("/:id/like", protect, toggleLikePost);

// ✅ Comments
router.post("/:id/comments", protect, addComment);
router.get("/:id/comments", getComments);

// ✅ Pagination
router.get("/paginated", getPaginatedPosts);

// ✅ Update & Delete
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;
