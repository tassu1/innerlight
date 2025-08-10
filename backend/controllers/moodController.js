const MoodEntry = require("../models/MoodEntry");

// @desc    Add mood for current day
// @route   POST /api/moods
// @access  Private
const addMood = async (req, res) => {
  const { moodLevel, note } = req.body;
  
  // Check for existing entry in last 24 hours
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const existingMood = await MoodEntry.findOne({
    user: req.user._id,
    date: { $gte: yesterday },
  });

  if (existingMood) {
    return res.status(400).json({ 
      message: "You can only log mood once per 24 hours",
      existingMood // Return existing entry to show in UI
    });
  }

  // Save new entry
  try {
    const mood = await MoodEntry.create({
      user: req.user._id,
      moodLevel,
      note,
      date: new Date(),
    });

    res.status(201).json(mood);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: "Failed to save mood entry",
      error: err.message 
    });
  }
};

// @desc    Get all mood entries (recent first)
// @route   GET /api/moods
// @access  Private
const getMyMoods = async (req, res) => {
  try {
    const moods = await MoodEntry.find({ user: req.user._id }).sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: "Failed to fetch mood entries",
      error: err.message 
    });
  }
};

// @desc    Get mood history for last 7 days
// @route   GET /api/moods/history
// @access  Private
// In moodController.js
const getMoodHistory = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    // Get existing entries
    const moods = await MoodEntry.find({
      user: req.user._id,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    // Create complete 7-day response
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      const existingEntry = moods.find(m => 
        m.date.toISOString().split('T')[0] === dateString
      );

      result.push({
        date: dateString,
        moodLevel: existingEntry?.moodLevel ?? null,
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        fullDate: date.toISOString()
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Failed to fetch mood history',
      error: err.message 
    });
  }
};
// @desc    Check if mood was logged today
// @route   GET /api/moods/today
// @access  Private
const checkTodayMood = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingMood = await MoodEntry.findOne({
      user: req.user._id, // Changed from id to _id for consistency
      date: { $gte: today }
    });

    res.json({ 
      logged: !!existingMood,
      mood: existingMood?.moodLevel || null,
      existingEntry: existingMood // Return full entry if exists
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: "Failed to check today's mood",
      error: err.message 
    });
  }
};

module.exports = {
  addMood,
  getMyMoods,
  getMoodHistory,
  checkTodayMood
};