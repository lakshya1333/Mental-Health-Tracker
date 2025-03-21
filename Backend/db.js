import mongoose from "mongoose";
const db = mongoose
import dotenv from 'dotenv';

dotenv.config();
db.connect(process.env.MONGO_URL)

const userSchema = new db.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 30 
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }
})

const moodEntrySchema = new mongoose.Schema({
    id: {
      type: String,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    mood: {
      type: String,
      required: true,
      enum: ["good", "great", "okay", "bad", "terrible"],
    },
    note: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  });

const PostSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments_count: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now }
});

export const MoodEntry = mongoose.model("MoodEntry", moodEntrySchema);
export const User = db.model("User",userSchema)
export const Post = db.model("Post",PostSchema)