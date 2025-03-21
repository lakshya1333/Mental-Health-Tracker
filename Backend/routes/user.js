import express from "express";
import { User , MoodEntry } from "../db.js";
import zod from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AuthMiddleware } from "../middleware.js";
import mongoose from "mongoose";
const JWT_SECRET = "lakshya";
export const userRoute = express.Router();
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

const signupBody = zod.object({
  username: zod.string().email(),
  name: zod.string(),
  password: zod.string(),
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});


userRoute.post("/register", async (req, res) => {
  try {
    const { success } = signupBody.safeParse(req.body);

    if (!success) {
      return res.status(411).json({ error: "Invalid Input" });
    }

    const { username, name, password } = req.body;
    const found = await User.findOne({ username });

    if (found) {
      return res.status(411).json({ error: "User already present. Please sign in" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const usercreated = await User.create({ username, name, password: hashedPass });

    const userId = usercreated._id;
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });


    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, 
        sameSite: "None",
        maxAge: 3600000, 
      })
      .json({ message: "User created successfully" });

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


userRoute.post("/signin", async (req, res) => {
  try {
    const { success } = signinBody.safeParse(req.body);

    if (!success) {
      return res.status(411).json({ error: "Invalid Input" });
    }

    const { username, password } = req.body;
    const found = await User.findOne({ username });

    if (!found) {
      return res.status(411).json({ error: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, found.password);

    if (isPasswordCorrect) {
      const userId = found._id;
      const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
      console.log(token)
    
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 3600000, 
        })
        .json({ message: "User signed in" });

    } else {
      return res.status(401).json({ error: "Incorrect Password" });
    }

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

userRoute.post("/moodentry/add", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { id, date, mood, note } = req.body;

    if (!mood || !note || !userId) {
      return res.status(400).json({ error: "Missing required fields: mood, note, or userId" });
    }
    const objectId = new mongoose.Types.ObjectId(userId)
    const found = await User.findById(objectId);
    if (!found) {
      return res.status(404).json({ error: "User not found" });
    }

    const newMoodEntry = new MoodEntry({
      id,
      date: new Date(date),
      mood,
      note,
      userId,
    });

    await newMoodEntry.save();

    return res.status(201).json({ message: "Mood entry added successfully", moodEntry: newMoodEntry });
  } catch (error) {
    console.error("Error adding mood entry:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

userRoute.get("/moodentry/fetch", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    console.log("Fetching mood entries for userId:", userId);

    const objectId = new mongoose.Types.ObjectId(userId)
    const found = await User.findById(objectId);
    console.log("Fetching mood entries for userId:", found);
    if (!found) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    const data = await MoodEntry.find({ userId: new mongoose.Types.ObjectId(userId) });

    if (!data.length) { 
      console.log("No mood entries found");
      return res.status(404).json({ message: "No mood entries found for this user" });
    }

    console.log("Mood entries found:", data);
    res.status(200).json({ data });

  } catch (error) {
    console.error("Error fetching mood entries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

