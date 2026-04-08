import express from "express"
import {
  createReview,
  getDoctorReviews,
  getPatientReviews,
  updateReview,
  respondToReview,
  markHelpful,
  reportReview,
  getReviewableAppointments,
} from "../controllers/reviewController.js"
import authUser from "../middleware/authUser.js"
import authDoctor from "../middleware/authDoctor.js"

const reviewRouter = express.Router()

// Create review (patients only)
reviewRouter.post("/create", authUser, createReview)

// Get doctor reviews (public)
reviewRouter.get("/doctor/:doctorId", getDoctorReviews)

// Get patient reviews
reviewRouter.get("/patient/:patientId", authUser, getPatientReviews)

// Get reviewable appointments
reviewRouter.get("/reviewable/:patientId", authUser, getReviewableAppointments)

// Update review (patients only)
reviewRouter.put("/update/:reviewId", authUser, updateReview)

// Doctor response to review
reviewRouter.put("/respond/:reviewId", authDoctor, respondToReview)

// Mark review as helpful
reviewRouter.put("/helpful/:reviewId", markHelpful)

// Report review
reviewRouter.put("/report/:reviewId", reportReview)

export default reviewRouter
