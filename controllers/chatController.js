import Chat from "../models/chatModel.js";

// Get chat messages between mentor and student
export const getChat = async (req, res) => {
    const { mentorId, studentId } = req.params;
    try {
        const messages = await Chat.find({ mentorId, studentId }).sort({ timestamp: 1 }); // Sorted by time
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

// Save a new message as a separate document
export const saveMessage = async (req, res) => {
    const { mentorId, studentId, senderId, text } = req.body;
    if (!mentorId || !studentId || !senderId || !text) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newMessage = new Chat({ mentorId, studentId, senderId, message: text });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};
