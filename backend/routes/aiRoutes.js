const express = require("express");
const router = express.Router();
const { getSmartSuggestion } = require("../controllers/aiController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/suggestion", protect, getSmartSuggestion);

module.exports = router;
