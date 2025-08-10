const mongoose = require("mongoose");

// MoodEntry schema to track user's daily mood
const moodEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  moodLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  note: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

const MoodEntry = mongoose.model("MoodEntry", moodEntrySchema);
module.exports = MoodEntry;
