// routes/selfHelpRoutes.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET /api/selfhelp/search?q=anxiety&type=topic
router.get("/search", async (req, res) => {
  const q = req.query.q || "";
  try {
    const olRes = await axios.get("https://openlibrary.org/search.json", {
      params: { q, limit: 20, fields: "title,author_name,cover_i,first_publish_year,key" }
    });
    res.json(olRes.data.docs);
  } catch (err) {
    console.error("OpenLibrary search error:", err.message);
    res.status(500).json({ message: "Search failed" });
  }
});

module.exports = router;
