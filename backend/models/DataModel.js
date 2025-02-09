import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
    studentId: String,
    name: String,
    usn: String,
    email: String
});

export default mongoose.model("UserData", DataSchema);


