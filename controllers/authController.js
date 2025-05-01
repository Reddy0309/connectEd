import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Mentor from '../models/Mentor.js';
import Parent from '../models/parent.js';

export const registerUser = async (req, res) => {
  const { name, email, password, role, usn, mentorName } = req.body;

  try {
    // Check if user already exists
    const mentorExists = await Mentor.findOne({ email });
    const parentExists = await Parent.findOne({ email });

    if (mentorExists || parentExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === 'mentor') {
      newUser = new Mentor({ name, email, password: hashedPassword, role });
    } else if (role === 'parent') {
      if (!usn ||!mentorName) {
        return res.status(400).json({ message: 'Mentor name is required for parents' });
      }
      newUser = new Parent({ name, email, password: hashedPassword, role, usn, mentorName });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({}, 'name'); // Fetch only names of mentors
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentors' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user in both collections
    let user = await Mentor.findOne({ email });
    if (!user) {
      user = await Parent.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.status(200).json({ 
      message: 'User logged in successfully', 
      token,
      email: user.email // ✅ Add email to response
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
