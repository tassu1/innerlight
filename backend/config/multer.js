const multer = require('multer');
const path = require('path');

// Memory storage configuration
const storage = multer.memoryStorage(); // Stores file as Buffer in memory

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/i;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname));

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only images (JPEG, PNG, WEBP) are allowed'));
};

const upload = multer({
  storage: storage, // Using memory storage
  fileFilter: fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB
  }
}).single('profilePic'); // Field name must match frontend

module.exports = upload;