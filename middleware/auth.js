import jwt from "jsonwebtoken";
import User from "../model/user.js"; // Or your user model

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Attach user ID
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
