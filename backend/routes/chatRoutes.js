const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");

// Get conversation with specific user
router.get("/conversation/:friendId", protect, chatController.getConversation);

// Get all conversations
router.get("/conversations", protect, chatController.getConversations);

// Send message
router.post("/send", protect, chatController.sendMessage);

// Mark messages as read
router.post("/mark-read/:friendId", protect, chatController.markMessagesAsRead);

// Get unread message count
router.get("/unread-count/:friendId", protect, chatController.getUnreadCount);

module.exports = router;