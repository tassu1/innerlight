const express = require("express");
const { registerUser, loginUser , getMe, getUserById, getFriendsByIds,searchUsersByName} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const {upload}= require("../utils/upload");
const uploadPostImage = require("../middlewares/cloudinaryPostUpload");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");
const router = express.Router();
const User = require("../models/User");


// Registration Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);

// User dashboard info
router.get("/me",protect, getMe);

// getuser and friendList
router.get("/:id", protect, getUserById);
router.post("/friends", protect, getFriendsByIds);




router.post("/create", protect, uploadPostImage, async (req, res) => {
  try {
    const { content } = req.body;

    const newPost = new Post({
      content,
      image: req.imageUrl || null,
      user: req.user._id,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
});


router.post("/upload-pic", protect, upload.single("profilePicture"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const stream = cloudinary.uploader.upload_stream(
      { folder: "profile_pics" },
      async (error, result) => {
        if (error) return res.status(500).json({ message: "Cloudinary error", error });

        const updatedUser = await User.findByIdAndUpdate(
          req.user._id,
          { profilePictureUrl: result.secure_url },
          { new: true }
        );

        res.json({ profilePic: updatedUser.profilePictureUrl });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (err) {
    console.error("Profile upload failed", err);
    res.status(500).json({ message: "Internal error" });
  }
});


router.get("/search", protect, searchUsersByName);

module.exports = router;
