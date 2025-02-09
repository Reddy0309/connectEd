//authController.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ message: 'User registered', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'User logged in', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// export const getMentorDetails = async (req, res) => {
//   try {
//     const userId = req.user.id; // Get user ID from JWT token
//     const user = await User.findById(userId).select("name email role"); // Fetch only name, email, and role
//     if (!user) return res.status(404).json({ message: "User not found" });
//     if (user.role !== "mentor") return res.status(403).json({ message: "Not authorized" }); // Ensure the user is a mentor

//     res.status(200).json(user); // Send user data back as response
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
