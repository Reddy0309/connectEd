import express from 'express';
import Parent from '../models/parent.js';
import asyncHandler from "express-async-handler";

const router = express.Router();

// Get all parents
router.get('/parents', async (req, res) => {
  try {
    const parents = await Parent.find({});
    res.status(200).json(parents);
  } catch (error) {
    console.error('Error fetching parents:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/parent", asyncHandler(async (req, res) => {
    const { email } = req.query; // Extract email from query parameters

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const parent = await Parent.findOne({ email });

    if (!parent) {
        return res.status(404).json({ message: "Parent not found" });
    }

    res.json({
      name: parent.name,
      email: parent.email,
      usn: parent.usn, // ✅ Ensure this is included in response
    });
}));

export default router;
