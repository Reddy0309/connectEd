import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  USN: { type: String, required: true },
  NAME: { type: String, required: true },
  EMAIL: { type: String, required: true },
  STATUS: { type: Boolean, default: false }, // False = Present, True = Absent
  VALIDITY: { type: Boolean, default: false }, // Always "Submitted"
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
