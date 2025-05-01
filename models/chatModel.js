import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
