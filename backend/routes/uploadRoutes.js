import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import Attendance from '../models/Attendance.js';

const router = express.Router();

// Multer storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

const getAttendanceModel = (className) => {
  const modelName = `Attendance_${className}`; // Example: Attendance_5A
  return mongoose.models[modelName] || mongoose.model(modelName, Attendance.schema);
};

// Upload Route - Process CSV or Excel file and store in MongoDB
router.post('/upload', upload.single('file'), async (req, res) => {
  console.log('Received upload request');
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { collectionName } = req.body;
  if (!collectionName) {
    return res.status(400).json({ message: 'Collection name is required' });
  }

  const filePath = req.file.path;
  const fileExt = path.extname(filePath).toLowerCase();
  console.log(`Processing file: ${filePath}`);

  try {
    let data = [];

    if (fileExt === ".xlsx") {
      // Process Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
    } else {
      return res.status(400).json({ message: "Only .xlsx files are allowed" });
    }

    // console.log("Extracted Data:", data);

    if (data.length === 0) {
      return res.status(400).json({ message: "Uploaded file is empty" });
    }

    // Get the dynamically created model
    const DynamicAttendanceModel = getAttendanceModel(collectionName);

    // Insert the data into the dynamically created collection
    await DynamicAttendanceModel.insertMany(data);

    // Remove the uploaded file after processing
    fs.unlinkSync(filePath);

    res.json({ message: `File uploaded and data stored successfully in collection '${collectionName}'` });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ message: "Error processing file", error: error.message });
  }
});
export default router;
