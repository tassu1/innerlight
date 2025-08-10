const mongoose = require("mongoose");

// Schema for user's journal entries
const journalEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prompt: {
    type: String,
    default: "", // optional guided prompt
  },
  entryText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const JournalEntry = mongoose.model("JournalEntry", journalEntrySchema);
module.exports = JournalEntry;
