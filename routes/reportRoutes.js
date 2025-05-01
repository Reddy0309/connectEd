import express from "express";
import multer from "multer";
import Report from "../models/rep.js"; // MongoDB model for storing reports
import Parent from "../models/parent.js";
const router = express.Router();
import cloudinary from "../utils/cloudinary.js"; // Make sure path is correct
import axios from "axios";

// Multer Storage Configuration (for handling file uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Mentor Uploads Report

router.post('/upload-report1', upload.single('file'), async (req, res) => {
    try {
        const { usn, mentorName } = req.body;
        const { buffer, mimetype } = req.file;

        // Create a new report with binary file data
        const report = new Report({
            usn,
            mentorName,
            fileData: buffer, // Save the file buffer
            contentType: mimetype, // Save content type (e.g., application/pdf)
        });

        await report.save();
        res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
        console.error("Error saving report:", error);
        res.status(500).json({ error: "Server error while saving report" });
    }
});


// Fetch Report by USN
// Parent Fetches Report
// Backend (Express.js)
router.get("/fetch-report/:usn", async (req, res) => {
  try {
    const { usn } = req.params;
    const report = await Report.findOne({ usn }).sort({ uploadedAt: -1 });

    if (!report || !report.fileData) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.set("Content-Type", report.contentType || "application/pdf");
    res.set("Content-Disposition", "attachment; filename=report.pdf");
    res.send(report.fileData);
  } catch (err) {
    console.error("Error fetching report:", err);
    res.status(500).json({ error: "Server error while fetching report" });
  }
});






// Fetch all reports from Cloudinary by USN
// router.get("/fetch-all-reports/:usn", async (req, res) => {
//   try {
//     const { usn } = req.params;

//     const result = await cloudinary.search
//       .expression(`resource_type:raw AND public_id:student_reports/${usn}*`)
//       .sort_by("uploaded_at", "desc")
//       .max_results(10) // adjust limit as needed
//       .execute();

//     const pdfUrls = result.resources.map(file => file.secure_url);

//     res.json({ pdfUrls });
//   } catch (error) {
//     console.error("Cloudinary fetch error:", error);
//     res.status(500).json({ error: "Failed to fetch reports" });
//   }
// });

// router.get('/download-report/:usn/:index', async (req, res) => {
//   const { usn, index } = req.params;
//   try {
//     console.log("Fetching report for:", usn, "Index:", index);

//     const student = await Report.findOne({ usn: usn });
//     if (!student) {
//       console.error("Student not found");
//       return res.status(404).send("Student not found");
//     }

//     console.log("Student record found:", student);

//     const pdfUrl = student.cloudinaryUrls[index];
//     if (!pdfUrl) {
//       console.error("PDF URL not found for index", index);
//       return res.status(404).send("PDF not found");
//     }

//     console.log("Fetching PDF from:", pdfUrl);

//     const response = await axios.get(pdfUrl, {
//       responseType: 'stream',
//     });

//     res.setHeader("Content-Disposition", `attachment; filename=Student_Report_${usn}_${index}.pdf`);
//     res.setHeader("Content-Type", "application/pdf");

//     response.data.pipe(res);
//   } catch (error) {
//     console.error("Error downloading PDF:", error.message);
//     res.status(500).send("Error downloading PDF");
//   }
// });


export default router;
