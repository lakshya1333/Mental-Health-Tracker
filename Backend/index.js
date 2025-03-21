import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const port = 3000
const app = express()
import { router } from "./routes/index.js"
app.use(cors({
    origin: "http://localhost:8080",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1",router)

app.listen(port,()=>{
    console.log("Running on port 3000")
})