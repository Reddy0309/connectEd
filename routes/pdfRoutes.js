import express from "express";
import { google } from "googleapis";
import fs from "fs";
import path from 'path';
import multer from "multer";
import Report from "../models/rep.js"; // MongoDB model for storing reports
// import { uploadReport } from "../controllers/pdfController.js";
const router = express.Router();
import dotenv from "dotenv";

dotenv.config();

const upload = multer({ dest: "uploads/" });

const KEYFILEPATH = path.join(process.cwd(), "credentials.json");
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});



const uploadFileToDrive = async (req, res) => {
  try {
    const drive = google.drive({ version: "v3", auth });

    const fileMetadata = {
      name: "example.pdf", // Change file name as needed
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Replace with actual folder ID
    };

    const media = {
      mimeType: "application/pdf",
      body: fs.createReadStream("path/to/your/file.pdf"),
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    res.status(200).json({ fileId: file.data.id });
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

// Mentor Uploads Report
router.post("/upload-reportdrive", upload.single("reportFile"), async (req, res) => {
 

    try {
        if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Upload to Google Drive
    const driveResponse = await uploadFileToDrive(filePath, fileName);

    // Remove local file after upload
    fs.unlinkSync(filePath);

    res.json({
      message: "Report uploaded successfully to Google Drive",
      fileId: driveResponse.id,
      fileName: driveResponse.name,
    });
  } catch (error) {
    res.status(500).json({ error: "Error uploading report to Google Drive" });
  }
});

// Parent Fetches Report
// router.get("/fetch-report/:usn", async (req, res) => {
//     try {
//         const { usn } = req.params;
//         const report = await Report.findOne({ usn }).sort({ uploadedAt: -1 });

//         if (!report) {
//             return res.status(404).json({ error: "Report not found" });
//         }

//         res.set("Content-Type", report.fileType);
//         res.set("Content-Disposition", `attachment; filename=${report.fileName}`);
//         res.send(report.fileData);
//     } catch (error) {
//         console.error("Error fetching report:", error);
//         res.status(500).json({ error: "Server error while fetching report" });
//     }
// });

export default router;
