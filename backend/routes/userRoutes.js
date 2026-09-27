const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUserById,
  getFriendsByIds,
  searchUsersByName,
  getProfileStats,
  getAchievements,
  updateBio
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");


// Authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// User profile routes
router.get("/me", protect, getMe);
router.get("/:id", protect, getUserById);
router.post("/friends", protect, getFriendsByIds);

// Profile management routes
router.get("/profile/stats", protect, getProfileStats);
router.get("/profile/achievements", protect, getAchievements);
router.patch("/profile/bio", protect, updateBio);


// Search route
router.get("/search", protect, searchUsersByName);

module.exports = router;