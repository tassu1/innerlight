const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  console.log('\n=== New Request ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Headers:', {
    authorization: req.headers.authorization ? 'present' : 'missing',
    cookie: req.headers.cookie ? 'present' : 'missing'
  });

  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    console.log('Token from Authorization header');
  } else if (req.cookies?.token) {
    token = req.cookies.token;
    console.log('Token from cookie');
  }

  if (!token) {
    console.log('No token found');
    return res.status(401).json({ 
      success: false,
      message: "Not authorized, no token" 
    });
  }

  try {
    console.log('Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', {
      id: decoded.id,
      iat: new Date(decoded.iat * 1000),
      exp: decoded.exp ? new Date(decoded.exp * 1000) : 'none'
    });

    if (!decoded.id) {
      console.log('Token missing id field');
      return res.status(401).json({ 
        success: false,
        message: "Invalid token structure" 
      });
    }

    console.log('Fetching user with ID:', decoded.id);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ 
        success: false,
        message: "User not found" 
      });
    }

    console.log(`User authenticated: ${user.email}`);
    req.user = user;
    next();
  } catch (error) {
    console.error('\nAuth Error:', error.name, '-', error.message);
    
    let message = "Not authorized, token failed";
    let status = 401;
    
    if (error.name === "TokenExpiredError") {
      message = "Token expired, please login again";
      status = 403;
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token";
    } else {
      message = "Authentication error";
      status = 500;
    }
    
    res.status(status).json({ 
      success: false,
      message,
      error: error.message 
    });
  }
};

module.exports = { protect };