import express from "express";
import jwt from "jsonwebtoken";

const authRouter = express.Router();
const JWT_SECRET = "lakshya";

authRouter.get("/check", (req, res) => {
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Cookies:", req.cookies);

  const token = req.body?.token || req.headers.authorization?.split(" ")[1] || req.cookies?.token;
  
  console.log("Extracted Token:", token);

  if (!token) {
    return res.json({ authenticated: false, message: "No token provided" });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true });
  } catch (error) {
    res.json({ authenticated: false, message: "Invalid token" });
  }
});

export default authRouter;
