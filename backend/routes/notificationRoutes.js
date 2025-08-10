const express = require("express");
const router = express.Router();
const {
  createNotification,
  getNotifications,
  markAsRead,
  clearNotifications,
} = require("../controllers/notificationController");

const { protect } = require("../middlewares/authMiddleware");

// Routes
router.post("/", protect, createNotification);           // Create new
router.get("/", protect, getNotifications);              // Fetch all for user
router.put("/:id/read", protect, markAsRead);            // Mark one as read
router.delete("/", protect, clearNotifications);         // Delete all

module.exports = router;
