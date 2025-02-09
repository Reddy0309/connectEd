//attendanceRoutes.js

import express from "express";
import mongoose from "mongoose";


const router = express.Router();



// Fetch attendance data by collection name
router.get("/:collectionName", async (req, res) => {
  const { collectionName } = req.params;

  if (!collectionName) {
    return res.status(400).json({ message: "Collection name is required" });
  }

  try {
    const collection = mongoose.connection.collection(collectionName);
    const data = await collection.find().toArray(); // Fetch all data

    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error retrieving data", error });
  }
});

// router.get("/:className", async (req, res) => {
//   const { className } = req.params;

//   if (!className) {
//     return res.status(400).json({ message: "Class name is required" });
//   }

//   try {
//     const formattedCollectionName = `attendance_${className.toLowerCase()}s`; // Ensure correct collection format
//     const collection = mongoose.connection.collection(formattedCollectionName);
//     const data = await collection.find().toArray(); // Fetch all data
// console.log(data)
//     if (!data.length) {
//       return res.status(404).json({ message: "No records found" });
//     }

//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ message: "Error retrieving data", error });
//   }
// });


export default router;
