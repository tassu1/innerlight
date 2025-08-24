const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  post: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  direction: { 
    type: Number, 
    enum: [1, -1], 
    required: true 
  } // 1=upvote, -1=downvote
}, { 
  timestamps: true,
  // Ensure one vote per user per post
  index: { post: 1, user: 1 }, 
  unique: true 
});

module.exports = mongoose.model('Vote', voteSchema);