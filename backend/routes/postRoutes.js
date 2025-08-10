const express = require("express");
const Post = require("../models/Post");
const { protect } = require("../middlewares/authMiddleware");
const { upload } = require("../utils/upload");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

const router = express.Router();

// ✅ Create Post (with optional image)
router.post("/create", protect, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = null;

    if (req.file) {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "post_images" },
        async (error, result) => {
          if (error) return res.status(500).json({ error: "Upload failed" });

          imageUrl = result.secure_url;

          const post = new Post({
            content: req.body.content,
            image: imageUrl,
            user: req.user._id,
          });

          await post.save();
          res.status(201).json(post);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } else {
      const post = new Post({
        content: req.body.content,
        user: req.user._id,
      });

      await post.save();
      res.status(201).json(post);
    }
  } catch (err) {
    console.error("Post creation failed", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

module.exports = router;
