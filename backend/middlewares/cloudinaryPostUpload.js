// backend/middleware/cloudinaryPostUpload.js
const cloudinary = require("../utils/cloudinary");

const uploadPostImage = async (req, res, next) => {
  try {
    const { image } = req.body;
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "post_images",
      });
      req.imageUrl = result.secure_url;
    }
    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
};

module.exports = uploadPostImage;
