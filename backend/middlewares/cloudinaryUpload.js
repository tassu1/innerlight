// middleware/cloudinaryUpload.js
const cloudinary = require("../utils/cloudinary");

const cloudinaryUploadMiddleware = async (req, res, next) => {
  try {
    const fileStr = req.body.data;

    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "profile_pics",
    });

    req.cloudinaryUrl = uploadedResponse.secure_url;
    next();
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
};

module.exports = cloudinaryUploadMiddleware;
