const mongoose = require('mongoose');

const savedPostSchema = new mongoose.Schema({
  post: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { 
  timestamps: true,
  // Ensure one save record per user per post
  index: { post: 1, user: 1 }, 
  unique: true 
});

module.exports = mongoose.model('SavedPost', savedPostSchema);