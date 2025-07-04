// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: String,
  status: String, // "In Transit", "Delivered", etc.
  estimatedDelivery: String,
  trackingLink: String,
});

export default mongoose.model("Order", orderSchema);
