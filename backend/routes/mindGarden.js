const express = require('express');
const router = express.Router();
const User = require('../models/User');
const dayjs = require('dayjs');

// Get complete Mind Garden state
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('mindGarden')
      .lean();
      
    // Calculate XP to next level
    const xpToNextLevel = 100 - (user.mindGarden.growth.xp % 100);
    
    res.json({
      ...user.mindGarden,
      xpToNextLevel,
      progressPercentage: (user.mindGarden.growth.xp % 100)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update habits
router.post('/update', async (req, res) => {
  try {
    const { habitUpdates } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await user.updateMindGarden(habitUpdates);
    
    // Return relevant growth data
    res.json({
      habits: updatedUser.mindGarden.habits,
      growth: updatedUser.mindGarden.growth,
      xpToNextLevel: 100 - (updatedUser.mindGarden.growth.xp % 100)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get weekly summary
router.get('/weekly', async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('mindGarden.history mindGarden.growth')
      .lean();
      
    const weekAgo = dayjs().subtract(7, 'day').toDate();
    const weeklyData = user.mindGarden.history
      .filter(entry => new Date(entry.date) >= weekAgo)
      .map(entry => ({
        date: entry.date,
        completedCount: entry.completedHabits.length,
        totalXp: entry.totalXp
      }));
      
    res.json({
      weeklyData,
      currentStreak: user.mindGarden.growth.streak
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;