import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const chatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    from: { type: String, enum: ["user", "bot"], required: true },
    caseId: { type: String, default: null },
  },
  { timestamps: true }
);


export default mongoose.model("Chat", chatSchema);
