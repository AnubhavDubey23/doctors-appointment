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

import Stripe from "stripe"
import Razorpay from "razorpay"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors())

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

app.get("/test-stripe", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, // ₹10
      currency: "inr",
    })
    res.json(paymentIntent)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/test-razorpay", async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: 5000, // ₹50
      currency: "INR",
      receipt: "receipt#1",
    })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(port, () => console.log(`Server started on PORT:${port}`))
