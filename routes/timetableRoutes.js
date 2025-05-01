import express from "express";
import Timetable from "../models/timetable.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { term, semester, section, subjects } = req.body;

    // 🔴 Check if subjects exist before using forEach
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ error: "Subjects data is missing or invalid!" });
    }

    let schedule = {};
    let facultyLoad = {}; // Track faculty hours

    subjects.forEach((subject) => {
      const { subCredits, subFaculty } = subject;
      let hoursRequired = 0;

      if (subCredits === "3") hoursRequired = 4;
      else if (subCredits === "2") hoursRequired = 3;
      else if (subCredits === "4") hoursRequired = 4 + 3; // 4 theory + 3-hour lab
      else if (subCredits === "1") hoursRequired = 3; // Lab session

      if (!facultyLoad[subFaculty]) facultyLoad[subFaculty] = 0;

      if (facultyLoad[subFaculty] + hoursRequired > 21) {
        return res.status(400).json({ error: `Faculty ${subFaculty} is overloaded!` });
      }

      facultyLoad[subFaculty] += hoursRequired;
    });

    const newTimetable = new Timetable({ term, semester, section, schedule });
    await newTimetable.save();

    res.json({ message: "Timetable Generated!", schedule });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
