const responses = [
  {
    keywords: ["anxious", "panic", "worried", "scared"],
    reply: "I'm here for you. It's okay to feel anxious — would you like to try a breathing exercise?",
  },
  {
    keywords: ["sad", "depressed", "down", "low"],
    reply: "I'm really sorry you're feeling this way. You're not alone, and I’m here to listen.",
  },
  {
    keywords: ["angry", "frustrated", "irritated"],
    reply: "It’s okay to feel anger. Want to try journaling to release those feelings?",
  },
  {
    keywords: ["lonely", "alone", "abandoned"],
    reply: "You’re not alone. I’m right here if you want to talk or express anything.",
  },
  {
    keywords: ["happy", "good", "better", "hopeful"],
    reply: "That’s beautiful to hear 💙 Keep doing what lifts you up!",
  }
];

// Main logic to get a matching response
function getBotResponse(message) {
  const lower = message.toLowerCase();
  for (let item of responses) {
    if (item.keywords.some(word => lower.includes(word))) {
      return item.reply;
    }
  }

  return "I'm listening... Tell me more about how you're feeling 💙";
}

module.exports = { getBotResponse };
