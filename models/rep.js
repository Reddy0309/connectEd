import { Schema, model } from 'mongoose';

const ReportSchema = new Schema({
  usn: { type: String, required: true },
  mentorName: { type: String, required: true },
  fileData: { type: Buffer, required: true }, // Required field missing in request
  contentType: { type: String, required: true }, // Required field missing in request

  uploadedAt: { type: Date, default: Date.now },
});

export default model('Report', ReportSchema);
