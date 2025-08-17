const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { cloudinary, uploadFromBuffer } = require('../config/cloudinary');
const Post = require("../models/Post"); // Make sure to require your Post model
const Mood = require("../models/Mood"); // Make sure to require your Mood model

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ 
      name, 
      email, 
      password,
      profilePic: "default-avatar.png" // Set default profile picture
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        mindGarden: user.mindGarden,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get current user info
// @route   GET /api/users/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error fetching user",
      error: error.message 
    });
  }
};

// @desc    Get friends by IDs
// @route   POST /api/users/friends
const getFriendsByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid friend ID list" 
      });
    }

    const friends = await User.find({ _id: { $in: ids } })
      .select("name _id profilePic");

    res.status(200).json({
      success: true,
      data: friends
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch friends",
      error: error.message 
    });
  }
};

// @desc    Search users by name
// @route   GET /api/users/search
const searchUsersByName = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ 
        success: false,
        message: "Search query is required" 
      });
    }

    const regex = new RegExp(query, "i");
    const users = await User.find({ name: regex })
      .select("_id name profilePic")
      .limit(10);

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error searching users",
      error: error.message 
    });
  }
};

// @desc    Follow a user
// @route   POST /api/users/:id/follow
const followUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    if (currentUser._id.equals(userToFollow._id)) {
      return res.status(400).json({ 
        success: false,
        message: "Cannot follow yourself" 
      });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ 
        success: false,
        message: "Already following this user" 
      });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({ 
      success: true,
      message: `You are now following ${userToFollow.name}`,
      following: currentUser.following 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to follow user",
      error: error.message 
    });
  }
};

// @desc    Unfollow a user
// @route   POST /api/users/:id/unfollow
const unfollowUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const userToUnfollow = await User.findById(req.params.id);

    if (!userToUnfollow) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res.status(400).json({ 
        success: false,
        message: "Not following this user" 
      });
    }

    currentUser.following = currentUser.following.filter(
      id => !id.equals(userToUnfollow._id)
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => !id.equals(currentUser._id)
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({ 
      success: true,
      message: `You have unfollowed ${userToUnfollow.name}`,
      following: currentUser.following 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to unfollow user",
      error: error.message 
    });
  }
};

// @desc    Get follow status
// @route   GET /api/users/:id/follow-status
const getFollowStatus = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const otherUser = await User.findById(req.params.id);

    if (!otherUser) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const isFollowing = currentUser.following.some(id => 
      id.equals(otherUser._id)
    );

    res.status(200).json({ 
      success: true,
      isFollowing 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to get follow status",
      error: error.message 
    });
  }
};

// @desc    Get user profile stats
// @route   GET /api/users/profile/stats
const getProfileStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Calculate days active
    const daysActive = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24));
    
    // Get posts count
    const postsCount = await Post.countDocuments({ user: user._id });
    
    // Get mood logs count
    const moodLogsCount = await Mood.countDocuments({ user: user._id });
    
    // Get completed activities from mind garden
    const completedActivities = user.mindGarden.habits.filter(h => h.completed).length;

    res.status(200).json({
      success: true,
      data: {
        daysActive,
        activitiesCompleted: completedActivities,
        moodLogs: moodLogsCount,
        postsCount,
        mindGarden: {
          level: user.mindGarden.growth.level,
          xp: user.mindGarden.growth.xp,
          streak: user.mindGarden.growth.streak
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

// @desc    Get user achievements
// @route   GET /api/users/profile/achievements
const getAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Example achievements
    const achievements = [
      {
        _id: "1",
        name: "7-Day Streak",
        unlocked: user.mindGarden.growth.streak >= 7,
        icon: "award",
        progress: Math.min(user.mindGarden.growth.streak, 7)
      },
      {
        _id: "2",
        name: "First Journal",
        unlocked: user.mindGarden.history.length > 0,
        icon: "book"
      },
      {
        _id: "3",
        name: "Meditation Master",
        unlocked: user.mindGarden.habits.some(h => 
          h.name === "Meditate" && h.completed
        ),
        icon: "mindfulness"
      }
    ];

    res.status(200).json({
      success: true,
      data: achievements
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

// @desc    Update user bio
// @route   PATCH /api/users/profile/bio
const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;
    
    // Validate bio length
    if (bio && bio.length > 250) {
      return res.status(400).json({
        success: false,
        message: "Bio must be less than 250 characters"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { bio },
      { 
        new: true,
        runValidators: true 
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Failed to update bio",
      error: error.message 
    });
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/upload-pic
const uploadProfilePic = async (req, res) => {
  try {
    console.log('Upload request received from user:', req.user._id); // Debug log
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded" 
      });
    }

    // Debug logs
    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Upload directly from buffer
    const result = await uploadFromBuffer(req.file.buffer, {
      public_id: `user_${req.user._id}_${Date.now()}`,
      folder: 'profile-pictures',
      transformation: [{ width: 500, height: 500, crop: 'fill' }]
    });

    console.log('Cloudinary upload result:', result); // Debug log

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: result.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User not found after upload');
    }

    res.json({
      success: true,
      profilePic: result.secure_url
    });

  } catch (error) {
    console.error('Upload error:', {
      message: error.message,
      stack: error.stack,
      user: req.user?._id
    });
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Failed to upload profile picture'
    });
  }
};
module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUserById,
  getFriendsByIds,
  searchUsersByName,
  followUser,
  unfollowUser,
  getFollowStatus,
  getProfileStats,
  getAchievements,
  updateBio,
  uploadProfilePic
};