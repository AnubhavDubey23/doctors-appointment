import express from "express"
import { getAnalytics, getDoctorAnalytics } from "../controllers/analyticsController.js"
import authAdmin from "../middleware/authAdmin.js"
import authDoctor from "../middleware/authDoctor.js"

const analyticsRouter = express.Router()

// Admin analytics
analyticsRouter.get("/admin", authAdmin, getAnalytics)

// Doctor analytics
analyticsRouter.get("/doctor", authDoctor, getDoctorAnalytics)

export default analyticsRouter
