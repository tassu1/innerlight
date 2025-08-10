const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary"); // Your configured Cloudinary instance

// Set up multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profilePics",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 400, height: 400, crop: "limit" }],
  },
});

const parser = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadProfilePic = parser.single("image"); // 👈 match frontend field name

// Middleware handler
const handleUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = req.file.path;
  const userId = req.user._id;

  // Save image URL to the user
  const User = require("../models/User");
  User.findByIdAndUpdate(
    userId,
    { profilePic: imageUrl },
    { new: true }
  )
    .then((user) => {
      res.json({ url: imageUrl });
    })
    .catch((err) => {
      console.error("Failed to update user profilePic", err);
      res.status(500).json({ message: "Upload failed" });
    });
};

module.exports = {
  uploadProfilePic: [parser.single("image"), handleUpload],
};
