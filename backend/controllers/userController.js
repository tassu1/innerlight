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
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id); // ✅ only once

      // ✅ Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // ✅ Send token in response
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token, // ✅ reuse the same one
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ @desc    Get current user info
// ✅ @route   GET /api/users/me
// ✅ @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

// ✅ Get friends by IDs
const getFriendsByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid friend ID list" });
    }

    const friends = await User.find({ _id: { $in: ids } }).select("name _id");
    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch friends" });
  }
};
const searchUsersByName = async (req, res) => {
  try {
    const { query } = req.query;
    console.log("🔍 Search query received:", query);

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const regex = new RegExp(query, "i"); // case-insensitive search
    const users = await User.find({ name: regex }).select("_id name profilePic");

    console.log("✅ Users found:", users.length);
    res.json(users);
  } catch (error) {
    console.error("❌ Full error stack trace:");
    console.error(error); // print the complete error object
    res.status(500).json({ message: "Error fetching user" });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUserById,
  getFriendsByIds,
  searchUsersByName
};