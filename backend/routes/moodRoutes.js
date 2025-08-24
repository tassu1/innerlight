const express = require('express');
const router = express.Router();
const {
  addOrUpdateMood,
  updateMood,
  getMyMoods,
  getMoodHistory,
  checkTodayMood
} = require('../controllers/moodController');
const { protect } = require('../middlewares/authMiddleware');

// Main moods endpoint
router.route('/')
  .post(protect, addOrUpdateMood) // Create or update today's mood
  .get(protect, getMyMoods);      // Get all moods

// Specific mood entry endpoint
router.route('/:id')
  .patch(protect, updateMood);    // Update specific mood

// Additional mood endpoints
router.get('/history', protect, getMoodHistory); // 7-day history
router.get('/today', protect, checkTodayMood);   // Check today's mood

module.exports = router;