const MoodEntry = require("../models/MoodEntry");

// @desc    Add or update today's mood
// @route   POST /api/moods
// @access  Private
const addOrUpdateMood = async (req, res) => {
  const { moodLevel, note } = req.body;
  
  // Validation
  if (typeof moodLevel !== 'number' || moodLevel < 1 || moodLevel > 5) {
    return res.status(400).json({ 
      message: "Please provide a valid mood level (1-5)",
      field: "moodLevel"
    });
  }

  try {
    // Find or create mood entry for today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const mood = await MoodEntry.findOneAndUpdate(
      {
        user: req.user._id,
        date: { $gte: todayStart, $lte: todayEnd }
      },
      {
        moodLevel,
        note,
        date: new Date()
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      message: mood.createdAt.getTime() === mood.updatedAt.getTime() 
        ? "Mood logged successfully" 
        : "Mood updated successfully",
      mood
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: "Failed to save mood entry",
      error: err.message 
    });
  }
};

// @desc    Update specific mood entry
// @route   PATCH /api/moods/:id
// @access  Private
const updateMood = async (req, res) => {
  try {
    const { moodLevel, note } = req.body;

    // Validate at least one field is provided
    if (!moodLevel && !note) {
      return res.status(400).json({ 
        message: "Please provide moodLevel or note to update"
      });
    }

    // Validate mood level range if provided
    if (moodLevel && (moodLevel < 1 || moodLevel > 5)) {
      return res.status(400).json({
        message: "Mood level must be between 1-5",
        field: "moodLevel"
      });
    }

    const updateFields = {};
    if (moodLevel) updateFields.moodLevel = moodLevel;
    if (note !== undefined) updateFields.note = note;

    const updatedMood = await MoodEntry.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedMood) {
      return res.status(404).json({ message: "Mood entry not found" });
    }

    res.json({
      message: "Mood updated successfully",
      mood: updatedMood
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: "Failed to update mood entry",
      error: err.message 
    });
  }
};

// @desc    Get all mood entries (recent first)
// @route   GET /api/moods
// @access  Private
const getMyMoods = async (req, res) => {
  try {
    const moods = await MoodEntry.find({ user: req.user._id })
      .sort({ date: -1 });
    res.json(moods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: "Failed to fetch mood entries",
      error: err.message 
    });
  }
};

// @desc    Get mood history for last 7 days (including empty days)
// @route   GET /api/moods/history
// @access  Private
const getMoodHistory = async (req, res) => {
  try {
    // Get start of 7 days ago (including today = 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 6 days back + today = 7 days
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Get all mood entries for the last 7 days
    const moods = await MoodEntry.find({
      user: req.user._id,
      date: { $gte: sevenDaysAgo, $lte: todayEnd }
    }).sort({ date: 1 });

    // Create complete 7-day array with default values for missing days
    const result = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(sevenDaysAgo);
      currentDate.setDate(currentDate.getDate() + i);
      
      const dateString = currentDate.toISOString().split('T')[0];
      const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Find if we have a mood entry for this date
      const existingEntry = moods.find(mood => {
        const moodDate = new Date(mood.date);
        return moodDate.toDateString() === currentDate.toDateString();
      });

      result.push({
        day: dayName,
        mood: existingEntry ? existingEntry.moodLevel : null, // Use null for no data
        fullDate: currentDate.toISOString(),
        hasData: !!existingEntry
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

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingMood = await MoodEntry.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow }
    });

    res.json({ 
      logged: !!existingMood,
      mood: existingMood?.moodLevel || null,
      existingEntry: existingMood
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
  addOrUpdateMood,
  updateMood,
  getMyMoods,
  getMoodHistory,
  checkTodayMood
};