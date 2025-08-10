const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://zenquotes.io/api/random");
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching quote:", error.message);
    res.status(500).json({ message: "Failed to fetch quote" });
  }
});

module.exports = router;
