import express from "express";
import { getChat, saveMessage } from "../controllers/chatController.js";

const router = express.Router();

router.get("/:mentorId/:studentId", getChat);
router.post("/message", saveMessage);

export default router;
