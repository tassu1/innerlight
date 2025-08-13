const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/users/login
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
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        mindGarden: user.mindGarden, // Include mindGarden data
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get current user info
// @route   GET /api/users/me
const getMe = async (req, res) => {
  try {
    // Simply get the user without any population
    const user = await User.findById(req.user.id).select("-password");
    
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

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("following", "name profilePic")
      .populate("followers", "name profilePic");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

const getFriendsByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid friend ID list" });
    }

    const friends = await User.find({ _id: { $in: ids } }).select("name _id profilePic");
    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch friends" });
  }
};

const searchUsersByName = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const regex = new RegExp(query, "i");
    const users = await User.find({ name: regex }).select("_id name profilePic");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

// FOLLOW/UNFOLLOW FUNCTIONALITY

const followUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentUser._id.equals(userToFollow._id)) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    res.json({ 
      message: `You are now following ${userToFollow.name}`,
      following: currentUser.following 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to follow user" });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const userToUnfollow = await User.findById(req.params.id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res.status(400).json({ message: "Not following this user" });
    }

    currentUser.following = currentUser.following.filter(
      id => !id.equals(userToUnfollow._id)
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => !id.equals(currentUser._id)
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ 
      message: `You have unfollowed ${userToUnfollow.name}`,
      following: currentUser.following 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to unfollow user" });
  }
};

const getFollowStatus = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const otherUser = await User.findById(req.params.id);

    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.some(id => 
      id.equals(otherUser._id)
    );

    res.json({ isFollowing });
  } catch (error) {
    res.status(500).json({ message: "Failed to get follow status" });
  }
};


// @desc    Get user profile stats
// @route   GET /api/users/profile/stats
const getProfileStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate days active (example - you might want to track this differently)
    const daysActive = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24));
    
    // Get posts count
    const postsCount = await Post.countDocuments({ user: user._id });
    
    // Get mood logs count (assuming you have a Mood model)
    const moodLogsCount = await Mood.countDocuments({ user: user._id });
    
    // Get completed activities from mind garden
    const completedActivities = user.mindGarden.habits.filter(h => h.completed).length;

    res.json({
      daysActive,
      activitiesCompleted: completedActivities,
      moodLogs: moodLogsCount,
      weeklyAvgMood: 3.8, // You'll need to calculate this from mood logs
      mindGarden: {
        level: user.mindGarden.growth.level,
        xp: user.mindGarden.growth.xp,
        streak: user.mindGarden.growth.streak
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user achievements
// @route   GET /api/users/profile/achievements
const getAchievements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Example achievements - customize based on your requirements
    const achievements = [
      {
        _id: "1",
        name: "7-Day Streak",
        unlocked: user.mindGarden.growth.streak >= 7,
        icon: "award",
        progress: user.mindGarden.growth.streak
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

    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update user bio
// @route   PATCH /api/users/profile/bio
const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { bio },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update bio" });
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
  updateBio
};