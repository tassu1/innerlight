const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const uploadFromBuffer = async (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'profile-pictures',
        transformation: [{ width: 500, height: 500, crop: 'fill' }],
        ...options
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    
    // Create a stream from the buffer
    const bufferStream = require('stream').Readable.from(buffer);
    bufferStream.pipe(uploadStream);
  });
};

module.exports = { cloudinary, uploadFromBuffer };