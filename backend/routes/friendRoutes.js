const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getFriendStatus,
  removeFriend,
  getFriendList,
  getMutualFriends,
  cancelFriendRequest,
  getFriendRequests
} = require("../controllers/friendController");

const { protect } = require("../middlewares/authMiddleware");

router.post("/request/:receiverId", protect, sendFriendRequest);
router.post("/accept", protect, acceptFriendRequest);
router.post("/reject", protect, rejectFriendRequest);
router.get("/list", protect, getFriends);
router.get("/status/:userId", protect, getFriendStatus);
router.get("/friends", protect, getFriendList);
router.delete("/friends/:id", protect, removeFriend);
router.get("/mutual/:userId", protect, getMutualFriends);
// Cancel friend request
router.delete("/cancel/:receiverId", protect, cancelFriendRequest);
router.get("/requests", protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate("friendRequests.from", "name email profilePic");
  res.json(user.friendRequests);
});
router.get("/requests", protect, getFriendRequests);


module.exports = router;
