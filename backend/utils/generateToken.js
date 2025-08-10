const jwt = require("jsonwebtoken");

// Generate a JWT token with the user ID
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "365d",
  });
};

module.exports = generateToken;
