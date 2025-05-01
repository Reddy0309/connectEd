import express from 'express';
import Mentor from '../models/Mentor.js'; // Ensure you have a Mentor model

const router = express.Router();

// GET all mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await Mentor.find({}, 'name'); // Fetch only names
    res.json(mentors);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const mentor = await Mentor.findOne({ email });

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json(mentor);
  } catch (error) {
    console.error('Error fetching mentor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/mentors/email/:email", async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ email: req.params.email });
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.json(mentor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;
