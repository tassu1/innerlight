const axios = require("axios");
const JournalEntry = require("../models/JournalEntry");

const getSmartSuggestion = async (req, res) => {
  try {
    const latest = await JournalEntry.findOne({ user: req.user._id })
      .sort({ createdAt: -1 });

    const promptText = latest?.entryText || "I'm feeling down and unmotivated.";

    const aiPrompt = `
You are a kind mental health assistant. A user has shared this journal entry:

"${promptText}"

Based on this, give a short, caring and motivational suggestion or activity they can try today.
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [{ role: "user", content: aiPrompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const suggestion = response.data.choices[0].message.content;
    res.json({ message: suggestion });
  } catch (error) {
    console.error("AI suggestion error:", error.message);
    res.status(500).json({ message: "Could not generate suggestion" });
  }
};

module.exports = { getSmartSuggestion };
