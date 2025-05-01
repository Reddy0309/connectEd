//server.js
import setupSocket from "./socket/socket.js";
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js'; // Import the upload routes
import attendanceRoutes from "./routes/attendanceRoutes.js";
import path from "path";
import cookieParser from "cookie-parser";
import mentorRoutes from './routes/mentorRoutes.js';
import parentRoutes from './routes/parentRoutes.js';
import chatRoutes from "./routes/chatRoutes.js";
import http from "http";
import uploadStudentRoute from "./routes/uploadStudentsRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import fileUpload from "express-fileupload";
import timetableRoutes from "./routes/timetableRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
})
);
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use(fileUpload());
app.use("/api/chat", chatRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes); 
app.use("/api/upload-students", uploadStudentRoute);
app.use("/api/attendance", attendanceRoutes);
app.use('/api', parentRoutes);
app.use("/api/msg", pdfRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/timetable", timetableRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).json({ message: 'Internal Server Error', error: err.message });
// });
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

setupSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
