const express = require("express");
const { registerUser, loginUser , getMe, getUserById, getFriendsByIds,searchUsersByName,getProfileStats,getAchievements,updateBio} = require("../controllers/userController");
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


// Profile routes
router.get("/profile/stats", protect, getProfileStats);
router.get("/profile/achievements", protect, getAchievements);
router.patch("/profile/bio", protect, updateBio);




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


router.post("/upload-pic", 
  protect, 
  upload.single("profilePicture"), 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          message: "No image file uploaded" 
        });
      }

      // Cloudinary upload with promise
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "profile_pics",
            transformation: [
              { width: 500, height: 500, crop: "limit" },
              { quality: "auto" }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { profilePictureUrl: uploadResult.secure_url },
        { new: true }
      ).select("-password");

      res.status(200).json({
        success: true,
        profilePic: updatedUser.profilePictureUrl,
        message: "Profile picture updated successfully"
      });

    } catch (err) {
      console.error("Upload error:", err);
      
      let status = 500;
      let message = "Internal server error";
      
      if (err.message.includes("File size too large")) {
        status = 413;
        message = "Image size exceeds 5MB limit";
      } else if (err.message.includes("Invalid image file")) {
        status = 415;
        message = "Only JPEG, PNG, or WebP images are allowed";
      }

      res.status(status).json({
        success: false,
        message,
        error: err.message
      });
    }
  }
);


router.get("/search", protect, searchUsersByName);

module.exports = router;
