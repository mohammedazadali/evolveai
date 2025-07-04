// routes/chatRoutes.js
import express from "express";
import { sendMessage, getChatHistory } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();

router.post("/send", protect, sendMessage);
router.get("/history", protect, getChatHistory);

export default router;
