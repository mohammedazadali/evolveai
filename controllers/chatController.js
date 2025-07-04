import axios from "axios";
import mongoose from "mongoose";
import stringSimilarity from "string-similarity";
import chat from "../model/chat.js";
import orders from "../model/order.js";
import products from "../model/product.js";
import { generateCaseId } from "../utils/caseIdGenerator.js";

// Predefined intent keyword groups
const intents = {
  greeting: [
    "hi",
    "hello",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
  ],
  product: [
    "product",
    "available",
    "availability",
    "is available",
    "is availabel",
    "do you have",
    "have you",
    "i want",
    "price of",
    "show product",
    "product available",
    "in stock",
    "find product",
    "what is",
    "how much",
    "is abc product available",
  ],

  order: ["where is my order", "track my order", "where is my product"],
  return: ["return", "refund"],
};

// Intent detection using fuzzy match
const detectIntent = (msg) => {
  const threshold = 0.6;

  for (const [intentType, phrases] of Object.entries(intents)) {
    const match = stringSimilarity.findBestMatch(msg, phrases).bestMatch;
    if (match.rating >= threshold) return intentType;
  }

  // 🛠 Fallback based on keyword detection
  if (/product|available|price|have|stock|find/i.test(msg)) {
    return "product";
  }
  if (/order|track|status/i.test(msg)) {
    return "order";
  }
  if (/return|refund/i.test(msg)) {
    return "return";
  }

  return null;
};

export const sendMessage = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const lowerMsg = message.toLowerCase().trim();
    let reply = null;
    let caseId = null;

    await chat.create({ userId: userObjectId, message, from: "user" });

    const intent = detectIntent(lowerMsg);

    // Rule: Greetings
    if (intent === "greeting") {
      reply =
        "👋 Hello! I’m your assistant. I can help you check product availability or track orders. How can I help you today?";
      await chat.create({
        userId: userObjectId,
        message: reply,
        from: "bot",
        caseId,
      });
      return res.json({ reply, caseId });
    }

    // Rule: Order Tracking Intent
    if (intent === "order") {
      reply = "📦 Please provide your order ID to check its status.";
      caseId = generateCaseId();
    }

    // Rule: Valid Order ID
    else if (/^\d{6,}$/.test(lowerMsg)) {
      const order = await orders.findOne({ orderId: lowerMsg });
      if (order) {
        reply = `🧾 Order #${order.orderId} is ${order.status}.\nEstimated delivery: ${order.estimatedDelivery}\nTrack link: ${order.trackingLink}`;

        caseId = generateCaseId();
      } else {
        reply = "❌ Sorry, no order found with that ID.";
      }
    }

    // Rule: Return or Refund
    else if (intent === "return") {
      if (lowerMsg.includes("refund")) {
        reply =
          "💸 Refunds take 5–7 business days. For issues, contact Support: https://yourdomain.com/contact";

        reply =
          "📝 To return a product, please visit: https://yourdomain.com/returns";
      } else {
        reply =
          "📝 To return a product, please visit our [Return Center](https://yourdomain.com/returns).";
      }
      caseId = generateCaseId();
    }

    // Rule: Product Availability
    else if (intent === "product") {
      const extractedName = message
        .replace(
          /(is|available|availability|in stock|find|product|products|i want|do you have|s)/gi,
          ""
        )
        .trim();

      const searchRegex = new RegExp(extractedName.split(" ").join("|"), "i");

      // First try: partial regex match
      let product = await products.findOne({ name: { $regex: searchRegex } });

      // Fuzzy match if not found
      if (!product && extractedName.length > 0) {
        const allProducts = await products.find({}, "name available price");
        const productNames = allProducts.map((p) => p.name);
        const fuzzyMatch = stringSimilarity.findBestMatch(
          extractedName,
          productNames
        ).bestMatch;

        if (fuzzyMatch.rating > 0.6) {
          product = allProducts.find((p) => p.name === fuzzyMatch.target);
        }
      }

      if (product) {
        reply = `✅ ${product.name} is ${
          product.available ? "available" : "currently out of stock"
        }.\nPrice: ₹${product.price}`;
        caseId = generateCaseId();
      } else {
        reply = `🔍 I couldn't find a product related to "${extractedName}".\nPlease provide the exact product name for better results.`;
      }

      await chat.create({
        userId: userObjectId,
        message: reply,
        from: "bot",
        caseId,
      });
      return res.json({ reply, caseId });
    }

    // Default fallback if no rule matched
    if (!reply) {
      reply =
        "🤖 I’m trained only to assist with product availability and order tracking. Please ask about a product or provide your order ID.";
    }

    await chat.create({
      userId: userObjectId,
      message: reply,
      from: "bot",
      caseId,
    });
    res.json({ reply, caseId });
  } catch (err) {
    console.error("Chat error:", err.response?.data || err.message);
    res
      .status(500)
      .json({ reply: "⚠️ Something went wrong. Please try again later." });
  }
};

export const getChatHistory = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const messages = await chat
      .find({ userId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const formatted = messages.map((msg) => ({
      id: msg._id,
      from: msg.from,
      text: msg.message,
      time: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Chat history error:", err);
    res.status(500).json({ message: "Server error retrieving chat history" });
  }
};
