import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import chatRouter from "./routes/chatRoute.js"
import analyticsRouter from "./routes/analyticsRoute.js"
import videoCallRouter from "./routes/videoCallRoute.js"
import medicalRecordRouter from "./routes/medicalRecordRoute.js"
import notificationRouter from "./routes/notificationRoute.js"
import reviewRouter from "./routes/reviewRoute.js"
import cron from "node-cron"
import { sendAppointmentReminders } from "./controllers/notificationController.js"

const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
      'http://localhost:5173',
      'http://localhost:5174'
    ].filter(Boolean)

    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true)

    // Allow if origin matches exactly or is a Vercel preview URL for this project
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true)
    }

    callback(new Error('Not allowed by CORS'))
  }
}))

app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)
app.use("/api/chat", chatRouter)
app.use("/api/analytics", analyticsRouter)
app.use("/api/video-call", videoCallRouter)
app.use("/api/medical-record", medicalRecordRouter)
app.use("/api/notification", notificationRouter)
app.use("/api/review", reviewRouter)

cron.schedule("0 9 * * *", () => {
  console.log("Running appointment reminder job...")
  sendAppointmentReminders()
})

app.get("/", (req, res) => {
  res.send("API Working")
})

app.listen(port, () => console.log(`Server started on PORT:${port}`))
