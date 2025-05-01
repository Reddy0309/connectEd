import mongoose from "mongoose";

const TimetableSchema = new mongoose.Schema({
  term: String,
  semester: String,
  section: String,
  schedule: Object, // Stores the generated timetable
});

export default mongoose.model("Timetable", TimetableSchema);
