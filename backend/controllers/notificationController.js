const Notification = require("../models/Notification");

// ✅ Create a new notification
const createNotification = async (req, res) => {
  try {
    const { user, type, message, link, from } = req.body;

    const notification = await Notification.create({
      user,
      type,
      message,
      link,
      from,
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Create Notification Error:", error.message);
    res.status(500).json({ message: "Failed to create notification" });
  }
};

// ✅ Get all notifications for logged-in user
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("from", "name"); // show sender info

    res.json(notifications);
  } catch (error) {
    console.error("Fetch Notifications Error:", error.message);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// ✅ Mark a single notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    console.error("Mark As Read Error:", error.message);
    res.status(500).json({ message: "Failed to update notification" });
  }
};

// ✅ Clear all notifications for the user
const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("Clear Notifications Error:", error.message);
    res.status(500).json({ message: "Failed to clear notifications" });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  clearNotifications,
};
