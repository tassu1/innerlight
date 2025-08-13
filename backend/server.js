const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const User = require("./models/User");
const Message = require("./models/Message");

// Routes
const userRoutes = require("./routes/userRoutes");
const moodRoutes = require("./routes/moodRoutes");
const journalRoutes = require("./routes/journalRoutes");
const selfHelpRoutes = require("./routes/selfHelpRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const forumRoutes = require("./routes/forumRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const aiRoutes = require("./routes/aiRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const friendRoutes = require("./routes/friendRoutes");
const chatRoutes = require("./routes/chatRoutes");
const mindGardenRoutes = require('./routes/mindGarden');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  },
});

// ✅ Track online users
const onlineUsers = new Map(); // userId => socket.id

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Mark user online
  socket.on("goOnline", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

  // Mark user offline (manual call)
  socket.on("goOffline", async (userId) => {
    onlineUsers.delete(userId);
    await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

  // Join room
  socket.on("joinRoom", ({ userId, friendId }) => {
    const room = [userId, friendId].sort().join("-");
    socket.join(room);
  });

  // Leave room
  socket.on("leaveRoom", ({ userId, friendId }) => {
    const room = [userId, friendId].sort().join("-");
    socket.leave(room);
  });

  // Chat messaging
  socket.on("sendMessage", async (data) => {
    const room = [data.senderId, data.receiverId].sort().join("-");
    const isReceiverOnline = onlineUsers.has(data.receiverId);

    // Emit message to room
    io.to(room).emit("receiveMessage", data);

    // Save to DB
    try {
      await Message.create({
        sender: data.senderId,
        receiver: data.receiverId,
        text: data.text,
        timestamp: new Date(),
        read: isReceiverOnline,
      });
    } catch (err) {
      console.error("❌ Message save failed:", err.message);
    }
  });

  // Global notifications
  socket.on("sendNotification", (data) => {
    io.emit("receiveNotification", data);
  });

  socket.on("sendFriendRequest", (data) => {
    io.emit("receiveFriendRequest", data);
  });

  // Disconnect event
  socket.on("disconnect", async () => {
    const disconnectedUserId = [...onlineUsers.entries()].find(([_, sid]) => sid === socket.id)?.[0];

    if (disconnectedUserId) {
      onlineUsers.delete(disconnectedUserId);
      await User.findByIdAndUpdate(disconnectedUserId, { lastSeen: new Date() });
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    }

    console.log("🔴 User disconnected:", socket.id);
  });
});

// 🔁 Share io instance globally
app.set("io", io);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/selfhelp", selfHelpRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/chat", chatRoutes);
app.use('/api/mindgarden', mindGardenRoutes);


// Root route
app.get("/", (req, res) => {
  res.send("🌿 InnerLight API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
