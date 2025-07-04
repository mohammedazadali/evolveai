// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  available: Boolean,
  price: Number,
  stock: Number
});

export default mongoose.model("Product", productSchema);
