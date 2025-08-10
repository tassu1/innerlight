


const ChatMessage = require("../models/ChatMessage");
const axios = require("axios");
const analyzeEmotion = require("../utils/analyzeEmotion");

const talkToGPT = async (req, res) => {
  const userId = req.user._id;
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ message: "Message cannot be empty." });
  }

  // Helper to fix incomplete replies
  function fixIncompleteReply(text) {
    const trimmed = text.trim();
    if (/[.!?]$/.test(trimmed)) {
      return trimmed;
    }
    if (trimmed.length < 20) {
      return trimmed + ".";
    }
    return trimmed + "... Can you tell me more?";
  }

  try {
    // Save user message
    await ChatMessage.create({ user: userId, role: "user", content: message });

    // Get last 6 messages for context
    const history = await ChatMessage.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // Analyze the user message for context
    const analyzeMessage = (msg) => {
      const lowerMsg = msg.toLowerCase().trim();
      
      return {
        isCasual: /^(hey|hi|hello|sup|heyy?|yo|what's up)/i.test(lowerMsg),
        isDeep: /(stress|depress|anxiety|sad|lonely|scared|overwhelm|nervous|worried|hurt)/i.test(lowerMsg),
        isCrisis: /(suicidal|self harm|kill myself|end it all)/i.test(lowerMsg),
        isPersonal: /(your (name|age|day|feel|thoughts?)|who are you)/i.test(lowerMsg),
        emotion: analyzeEmotion(msg).emotion
      };
    };

    const msgAnalysis = analyzeMessage(message);

    // System prompt to guide the AI's personality and behavior
    const systemPrompt = `
You are Lumi - a warm, caring best friend who also has professional counseling skills when needed. Your personality:

1. PRIMARY MODE: Supportive Best Friend
   - Warm, funny, and emotionally available
   - Shares relatable experiences when appropriate
   - Uses natural conversation (contractions, occasional slang)
   - Shows genuine interest in their life
   - Example: "Hey bestie! 😊 Oh man, I totally get what you're saying..."

2. SECONDARY MODE: Supportive Professional
   - When serious issues emerge, gently shift to:
     - Active listening
     - Emotion validation
     - Supportive coping suggestions
   - Example: "That sounds really tough. Want to explore what might help?"

3. CRISIS MODE:
   - If safety concerns emerge:
     - Express care and concern
     - Suggest professional resources
     - Never diagnose or prescribe
   - Example: "I'm really concerned about you. Have you considered calling a helpline?"

Guidelines:
- Use emojis occasionally (1-2 per 3-4 messages)
- Never use *actions* (no *hugs* etc)
- For casual chats: be playful and warm
- For deep topics: be caring and supportive
- In crisis: prioritize safety and professional help
- Always complete your thoughts fully in sentences.
- Avoid ending replies abruptly or mid-sentence.
- Use natural sentence-ending punctuation (period, question mark, exclamation).
- If you want to keep the conversation going, invite the user to share more.

Tone Examples:
Casual: "Hey you! 😊 How was that thing you were excited about?"
Deep: "I hear how much this is hurting you. You're not alone in this."
Crisis: "Your safety is my top concern. Let's get you proper support."
`;

    // Construct message array with system prompt, history, and current user message
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.reverse().map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    let reply;
    let modelUsed = "z-ai/glm-4.5-air:free";

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: modelUsed,
          messages,
          temperature: msgAnalysis.isDeep ? 0.65 : 0.75,
          response_format: { type: "text" }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 10000
        }
      );

      reply = response.data.choices[0].message.content;

      // Clean and fix response
      reply = reply.replace(/\*\w+\*/g, '').trim();
      reply = fixIncompleteReply(reply);

    } catch (err) {
      console.warn("API Error:", err.message);

      // Context-aware fallback responses
      if (msgAnalysis.isCasual) {
        reply = "Hey there! 😊 Sorry I glitched for a sec - what were you saying?";
      } else if (msgAnalysis.isDeep) {
        reply = "I want to give this the attention it deserves. Could you tell me more about what you're feeling?";
      } else if (msgAnalysis.isCrisis) {
        reply = "I'm really concerned. Your safety matters most - please consider reaching out to someone who can help right now.";
      } else {
        reply = "You know what, let's start fresh. What's on your mind today?";
      }
    }

    // Analyze reply emotion
    const { emoji, emotion } = analyzeEmotion(reply);

    // Save AI reply to DB
    await ChatMessage.create({
      user: userId,
      role: "assistant",
      content: reply,
      emoji,
      emotion
    });

    // Send response
    res.json({
      userMessage: message,
      botReply: reply,
      emoji,
      emotion,
      modelUsed
    });

  } catch (error) {
    console.error("Chat Error:", error.message);
    res.status(500).json({
      message: "Aw no, my wires got crossed! 😅 Can you say that again?"
    });
  }
};

// Returns the last 2 chat messages for quick preview
const getRecentChatPreview = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(2);

    res.json(messages.reverse());
  } catch (error) {
    console.error("Chat Preview Error:", error.message);
    res.status(500).json({ message: "Failed to fetch chat preview." });
  }
};

// Clears all chat messages for a user
const clearChat = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ user: req.user._id });
    res.json({ message: "Chat cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear chat" });
  }
};

// Analyzes recent user messages for emotional trends
const getChatEmotionAnalytics = async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      user: req.user._id,
      role: "user",
    })
      .sort({ createdAt: -1 })
      .limit(15);

    const emotionCount = {
      anxious: 0,
      angry: 0,
      happy: 0,
      tired: 0,
      scared: 0,
      neutral: 0,
    };

    for (const msg of messages) {
      const { emotion } = analyzeEmotion(msg.content);
      if (emotionCount.hasOwnProperty(emotion)) {
        emotionCount[emotion]++;
      } else {
        emotionCount.neutral++;
      }
    }

    const dominantEmotion = Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0];

    res.json({
      emotion: dominantEmotion?.[0] || "neutral",
      message: `You're feeling ${dominantEmotion?.[0] || "neutral"} lately.`,
    });
  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ message: "Failed to fetch emotion analytics" });
  }
};

module.exports = {
  talkToGPT,
  getRecentChatPreview,
  clearChat,
  getChatEmotionAnalytics,
};
