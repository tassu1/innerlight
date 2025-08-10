const JournalEntry = require("../models/JournalEntry");

// @desc    Add a journal entry
// @route   POST /api/journals
// @access  Private
const addJournalEntry = async (req, res) => {
  const { prompt, entryText } = req.body;

  if (!entryText || entryText.trim() === "") {
    return res.status(400).json({ message: "Entry text is required" });
  }

  const entry = await JournalEntry.create({
    user: req.user._id,
    prompt,
    entryText,
  });

  res.status(201).json(entry);
};

// @desc    Get all journal entries of user
// @route   GET /api/journals
// @access  Private
const getMyJournals = async (req, res) => {
  const entries = await JournalEntry.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(entries);
};

// @desc    Get latest journal entry
// @route   GET /api/journals/latest
// @access  Private
const getLatestJournal = async (req, res) => {
  try {
    const latest = await JournalEntry.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    if (!latest) {
      return res.status(404).json({ message: "No journal entry found" });
    }

    res.json(latest);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch latest journal" });
  }
};

// ✅ @desc    Delete a journal entry
// ✅ @route   DELETE /api/journals/:id
// ✅ @access  Private
const deleteJournalEntry = async (req, res) => {
  const entry = await JournalEntry.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!entry) {
    return res.status(404).json({ message: "Journal not found" });
  }

  await entry.deleteOne();
  res.json({ message: "Journal deleted successfully" });
};

// ✅ @desc    Update a journal entry
// ✅ @route   PUT /api/journals/:id
// ✅ @access  Private
const updateJournalEntry = async (req, res) => {
  const { entryText, prompt } = req.body;

  const entry = await JournalEntry.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!entry) {
    return res.status(404).json({ message: "Journal not found" });
  }

  if (!entryText || entryText.trim() === "") {
    return res.status(400).json({ message: "Updated entry cannot be empty" });
  }

  entry.entryText = entryText;
  if (prompt !== undefined) entry.prompt = prompt;

  const updated = await entry.save();
  res.json(updated);
};

module.exports = {
  addJournalEntry,
  getMyJournals,
  getLatestJournal,
  deleteJournalEntry,
  updateJournalEntry,
};
