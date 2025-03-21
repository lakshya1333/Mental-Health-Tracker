import express from "express"
export const router = express.Router()
import cookieParser from "cookie-parser"
const app = express()
import cors from "cors"
import { userRoute } from "./user.js"
import authRouter from "./auth.js"
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

app.use(
    cors({
      origin: "http://localhost:8080", 
      credentials: true,
    })
  );
  

router.use("/auth",authRouter)
router.use("/user",userRoute)