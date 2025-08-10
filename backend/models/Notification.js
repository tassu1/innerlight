const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // The recipient of the notification
    required: true,
  },
  type: {
    type: String,
    enum: ["like", "comment", "friendRequest"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String, // e.g., "/posts/:id"
    default: "",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // The sender (who liked/commented/requested)
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
