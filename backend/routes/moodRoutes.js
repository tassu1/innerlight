const express = require('express');
const router = express.Router();
const {
  addMood,
  getMyMoods,
  getMoodHistory,
  checkTodayMood // Make sure this is imported
} = require('../controllers/moodController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, addMood)
  .get(protect, getMyMoods);

router.get('/history', protect, getMoodHistory);
router.get('/today', protect, checkTodayMood); 

module.exports= router;