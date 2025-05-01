import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import Parent from "../models/parent.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// ✅ Ensure 'uploads/' directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

// ✅ POST Route to Upload and Store Parents in MongoDB
router.post("/", upload.single("file"), async (req, res) => {
  console.log("Received upload request:", req.file);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = req.file.path;
  const fileExt = path.extname(filePath).toLowerCase();

  try {
    let data = [];

    if (fileExt === ".xlsx") {
      // ✅ Read Excel File
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
    } else {
      return res.status(400).json({ message: "Only .xlsx files are allowed" });
    }

    if (data.length === 0) {
      return res.status(400).json({ message: "Uploaded file is empty" });
    }

    // ✅ Validate & Insert Data into MongoDB
    const parentRecords = [];
    for (const row of data) {
      const { name, email, password, mentorName, usn } = row;

      // ✅ Validate Required Fields
      if (!name || !email || !password || !mentorName || !usn) {
        return res.status(400).json({ message: "Missing required fields in Excel" });
      }

      // ✅ Check for Duplicate Email or USN
      const existingParent = await Parent.findOne({ $or: [{ email }, { usn }] });
      if (existingParent) {
        return res.status(400).json({ message: `Duplicate Email or USN found: ${email}, ${usn}` });
      }

      // ✅ USN Validation using Regex
      const usnPattern = /^1KS\d{2}CS\d{3}$/;
      if (!usnPattern.test(usn)) {
        return res.status(400).json({ message: `Invalid USN format: ${usn}` });
      }

      // ✅ Create Parent Object
      parentRecords.push({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: "parent",
        mentorName,
        usn,
      });
    }

    // ✅ Insert Data into MongoDB
    await Parent.insertMany(parentRecords);

    // ✅ Remove File After Processing
    fs.unlinkSync(filePath);

    res.json({ message: `File uploaded and ${parentRecords.length} parents added successfully!` });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ message: "Error processing file", error: error.message });
  }
});

export default router;
