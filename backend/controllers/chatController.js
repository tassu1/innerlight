const Message = require("../models/Message");
const User = require("../models/User");

const chatController = {
  // Get conversation between two users
  async getConversation(req, res) {
    try {
      const { friendId } = req.params;
      const userId = req.user._id;

      const messages = await Message.find({
        $or: [
          { sender: userId, receiver: friendId },
          { sender: friendId, receiver: userId }
        ]
      })
      .sort({ timestamp: 1 })
      .populate('sender receiver', 'username avatar');

      res.json(messages);
    } catch (error) {
      console.error("Fetch conversation error:", error);
      res.status(500).json({ message: "Failed to load conversation" });
    }
  },

  // Get all conversations for current user
  async getConversations(req, res) {
    try {
      const userId = req.user._id;

      const conversations = await Message.aggregate([
        {
          $match: {
            $or: [
              { sender: userId },
              { receiver: userId }
            ]
          }
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$sender", userId] },
                "$receiver",
                "$sender"
              ]
            },
            lastMessage: { $last: "$$ROOT" },
            unreadCount: {
              $sum: {
                $cond: [
                  { $and: [
                    { $eq: ["$receiver", userId] },
                    { $eq: ["$read", false] }
                  ]},
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        { 
          $project: {
            userId: "$user._id",
            username: "$user.username",
            avatar: "$user.avatar",
            lastMessage: 1,
            unreadCount: 1
          }
        },
        { $sort: { "lastMessage.timestamp": -1 } }
      ]);

      res.json(conversations);
    } catch (error) {
      console.error("Fetch conversations error:", error);
      res.status(500).json({ message: "Failed to load conversations" });
    }
  },

  // Send a new message
  async sendMessage(req, res) {
    try {
      const { receiver, text } = req.body;
      const sender = req.user._id;

      const newMessage = new Message({
        sender,
        receiver,
        text
      });

      const savedMessage = await newMessage.save();
      const populatedMessage = await Message.populate(savedMessage, [
        { path: 'sender', select: 'username avatar' },
        { path: 'receiver', select: 'username avatar' }
      ]);

      // Emit via Socket.IO
      const io = req.app.get('io');
      const room = [sender, receiver].sort().join('-');
      io.to(room).emit('receiveMessage', populatedMessage);

      res.status(201).json(populatedMessage);
    } catch (error) {
      console.error("Message send error:", error);
      res.status(400).json({ 
        message: "Message send failed",
        error: error.message 
      });
    }
  },

  // Mark messages as read
  async markMessagesAsRead(req, res) {
    try {
      const { friendId } = req.params;
      const userId = req.user._id;

      await Message.updateMany(
        { sender: friendId, receiver: userId, read: false },
        { $set: { read: true } }
      );

      res.json({ message: "Messages marked as read" });
    } catch (error) {
      console.error("Mark read error:", error);
      res.status(500).json({ message: "Failed to mark messages as read" });
    }
  },

  // Get unread message count
  async getUnreadCount(req, res) {
    try {
      const { friendId } = req.params;
      const userId = req.user._id;

      const count = await Message.countDocuments({
        sender: friendId,
        receiver: userId,
        read: false
      });

      res.json({ unreadCount: count });
    } catch (error) {
      console.error("Unread count error:", error);
      res.status(500).json({ message: "Failed to get unread count" });
    }
  }
};

module.exports = chatController;