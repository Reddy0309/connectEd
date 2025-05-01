import mongoose from 'mongoose';

const parentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['parent'],
    required: true,
  },
  mentorName: {
    type: String,
    required: true,
  },
  usn: {
      type: String,
      required: true,
      unique: true,
      match: [/^1KS\d{2}CS\d{3}$/, "Invalid USN format"], // Ensures USN follows the pattern
    },
}, { timestamps: true });

const Parent = mongoose.models.Parent || mongoose.model('Parent', parentSchema);

export default Parent;
