const express = require("express");
const {
  addJournalEntry,
  getMyJournals,
  getLatestJournal,
  deleteJournalEntry,
  updateJournalEntry,
} = require("../controllers/journalController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", protect, addJournalEntry);
router.get("/", protect, getMyJournals);
router.get("/latest", protect, getLatestJournal);
router.delete("/:id", protect, deleteJournalEntry);
router.put("/:id", protect, updateJournalEntry);

module.exports = router;
