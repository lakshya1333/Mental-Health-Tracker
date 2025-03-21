import mongoose from "mongoose";
const db = mongoose

db.connect("mongodb+srv://admin:lakshya1234@cluster0.6eli8.mongodb.net/mental")

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

export const MoodEntry = mongoose.model("MoodEntry", moodEntrySchema);
export const User = db.model("User",userSchema)