import User from "../model/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("📩 Username:", username);

    const user = await User.findOne({ username });
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Incorrect password");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = { user: { id: user._id } };

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing from environment");
      return res.status(500).json({ msg: "Server configuration error: JWT_SECRET not set" });
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "2d" },
      (err, token) => {
        if (err) {
          console.error("❌ Token signing error:", err);
          return res.status(500).json({ msg: "Token generation failed" });
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).send("Server error");
  }
};

export default Login;
