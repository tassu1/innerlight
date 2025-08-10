const User = require("../models/User");
const Notification = require("../models/Notification");

// Send friend request
const sendFriendRequest = async (req, res) => {
  try {
    const receiverId = req.params.receiverId;
    const senderId = req.user._id;

    console.log("Sender ID:", senderId);
    console.log("Receiver ID:", receiverId);

    if (senderId.toString() === receiverId)
      return res.status(400).json({ message: "Cannot add yourself" });

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    console.log("Sender:", sender?.name);
    console.log("Receiver:", receiver?.name);

    if (!receiver) return res.status(404).json({ message: "User not found" });

    if (receiver.friendRequests.some(req => req.from.toString() === senderId.toString())) {
  console.log("Already sent request");
  return res.status(400).json({ message: "Already sent request" });
}


    if (receiver.friends.includes(senderId)) {
      console.log("Already friends");
      return res.status(400).json({ message: "Already friends" });
    }

    receiver.friendRequests.push({
  from: senderId,
  status: "pending",
  requestedAt: new Date(),
});
    sender.sentRequests.push(receiverId);

    await sender.save();
    await receiver.save();

    await Notification.create({
      user: receiverId,
      from: senderId,
      type: "friendRequest",
      message: `${sender.name} sent you a friend request`,
      link: `/profile/${senderId}`,
    });

    console.log("Friend request sent");
    res.json({ message: "Friend request sent" });
  } catch (error) {
    console.error("Send Friend Request Error:", error);
    res.status(500).json({ message: "Server error while sending request" });
  }
};



// Accept friend request
const acceptFriendRequest = async (req, res) => {
  const { senderId } = req.body;
  const receiverId = req.user._id;

  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (!sender || !receiver) return res.status(404).json({ message: "User not found" });

  // Add each other as friends
  sender.friends.push(receiverId);
  receiver.friends.push(senderId);

  // Remove from requests
  sender.sentRequests.pull(receiverId);
  receiver.friendRequests.pull(senderId);

  await Notification.create({
  user: senderId,
  from: receiverId,
  type: "friendRequest",
  message: `${receiver.name} accepted your friend request`,
  link: `/profile/${receiverId}`,
});

  await sender.save();
  await receiver.save();

  res.json({ message: "Friend request accepted" });
};

// Reject friend request
const rejectFriendRequest = async (req, res) => {
  const { senderId } = req.body;
  const receiverId = req.user._id;

  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (!sender || !receiver) return res.status(404).json({ message: "User not found" });

  sender.sentRequests.pull(receiverId);
  receiver.friendRequests.pull(senderId);

  await sender.save();
  await receiver.save();

  res.json({ message: "Friend request rejected" });
};

// Get user's friends
const getFriends = async (req, res) => {
  const user = await User.findById(req.user._id).populate("friends", "name email");
  res.json(user.friends);
};

// Get friend request status
const getFriendStatus = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const currentUserId = req.user._id;

    const me = await User.findById(currentUserId);

    if (!me) return res.status(404).json({ message: "Current user not found" });

    if (currentUserId.toString() === otherUserId) {
      return res.json({ status: "self" });
    }

    // Check status
    const isFriend = me.friends.includes(otherUserId);
    const hasSent = me.sentRequests?.includes(otherUserId); // check friend requests sent by me
    const hasReceived = me.friendRequests.some(
  req => req.from.toString() === otherUserId.toString()
);
 // check requests received

    let status = "not-friends";

    if (isFriend) status = "friends";
    else if (hasSent) status = "pending";
    else if (hasReceived) status = "received";

    res.json({ status });
  } catch (err) {
    console.error("❌ getFriendStatus error:", err);
    res.status(500).json({ message: "Server error while checking friend status" });
  }
};


// @route   GET /api/users/friends
// @access  Private
const getFriendList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friends", "name email");
    res.json(user.friends);
  } catch (error) {
    console.error("Friend list fetch error:", error);
    res.status(500).json({ message: "Server error while fetching friends" });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    console.log("Fetching friend requests for:", req.user._id);
    const user = await User.findById(req.user._id).populate("friendRequests.from", "name email profilePic");
    console.log("Found requests:", user.friendRequests);
    res.json(user.friendRequests);
  } catch (err) {
    console.error("Error fetching friend requests:", err);
    res.status(500).json({ message: "Server error while fetching requests" });
  }
};



// @route   DELETE /api/users/remove-friend/:id
// @access  Private
const removeFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const friendId = req.params.id;

    if (!user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Not in friends list" });
    }

    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    await user.save();

    const friend = await User.findById(friendId);
    friend.friends = friend.friends.filter((id) => id.toString() !== req.user._id.toString());
    await friend.save();

    res.json({ message: "Friend removed successfully" });
  } catch (err) {
    console.error("Remove Friend Error:", err);
    res.status(500).json({ message: "Server error while removing friend" });
  }
};
const getMutualFriends = async (req, res) => {
  try {
    const me = await User.findById(req.user._id).populate("friends");
    const other = await User.findById(req.params.userId).populate("friends");

    const mutual = me.friends.filter(f1 =>
      other.friends.some(f2 => f2._id.equals(f1._id))
    );

    res.json(mutual);
  } catch (err) {
    console.error("Error getting mutual friends:", err);
    res.status(500).json({ message: "Could not fetch mutual friends" });
  }
};
const cancelFriendRequest = async (req, res) => {
  try {
    const receiverId = req.params.receiverId;
    const senderId = req.user._id;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the request from both sides
    receiver.friendRequests.pull({ from: senderId }); // ✅ because it's an object now
    sender.sentRequests.pull(receiverId); // ✅ optional — if you're still tracking sentRequests

    await sender.save();
    await receiver.save();

    res.json({ message: "Friend request cancelled" });
  } catch (err) {
    console.error("Cancel Friend Request Error:", err);
    res.status(500).json({ message: "Server error while cancelling request" });
  }
};


module.exports = {
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
};
