// utils/analyzeEmotion.js

function analyzeEmotion(text) {
  const lower = text.toLowerCase();

  if (/sad|anxious|worried|lonely|depressed/.test(lower))
    return { emotion: "anxious", emoji: "😟" };

  if (/angry|frustrated|irritated/.test(lower))
    return { emotion: "angry", emoji: "😠" };

  if (/happy|grateful|joy|excited|love/.test(lower))
    return { emotion: "happy", emoji: "😊" };

  if (/tired|exhausted|drained/.test(lower))
    return { emotion: "tired", emoji: "😴" };

  if (/scared|fear|nervous/.test(lower))
    return { emotion: "scared", emoji: "😨" };

  return { emotion: "neutral", emoji: "🙂" };
}

module.exports = analyzeEmotion;
