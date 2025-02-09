import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// The verifyToken function
export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token with the secret
    const user = await User.findById(decoded.id);
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    req.user = user; // Attach the user object to the request
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ message: "Invalid token" });
  }
};
