// scripts/seed.js or seed.js (depending on your structure)
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import order from "./model/order.js";
import product from "./model/product.js";
import connectDB from "./config/db.js";

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



dotenv.config();

connectDB()

const importData = async () => {
  try {
    const orders = JSON.parse(
      fs.readFileSync(path.join(__dirname, "./order.json"), "utf-8")
    );
    const products = JSON.parse(
      fs.readFileSync(path.join(__dirname, "./product.json"), "utf-8")
    );

    await order.deleteMany();
    await product.deleteMany();

    await order.insertMany(orders);
    await product.insertMany(products);

    console.log("✅ Data seeded successfully.");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

importData();
