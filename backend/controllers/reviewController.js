import reviewModel from "../models/reviewModel.js"
import appointmentModel from "../models/appointmentModel.js"
import doctorModel from "../models/doctorModel.js"

// Create a review
const createReview = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentId, rating, reviewText, categories, isAnonymous } = req.body

    // Verify appointment exists and is completed
    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" })
    }

    if (appointment.userId !== patientId || appointment.docId !== doctorId) {
      return res.json({ success: false, message: "Invalid appointment details" })
    }

    if (!appointment.isCompleted) {
      return res.json({ success: false, message: "Can only review completed appointments" })
    }

    // Check if review already exists
    const existingReview = await reviewModel.findOne({ patientId, appointmentId })
    if (existingReview) {
      return res.json({ success: false, message: "Review already exists for this appointment" })
    }

    // Create review
    const review = new reviewModel({
      patientId,
      doctorId,
      appointmentId,
      rating,
      reviewText,
      categories,
      isAnonymous,
    })

    await review.save()

    // Update doctor's average rating
    await updateDoctorRating(doctorId)

    res.json({ success: true, message: "Review submitted successfully", reviewId: review._id })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get reviews for a doctor
const getDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params
    const { page = 1, limit = 10, sortBy = "newest" } = req.query

    let sortOption = { createdAt: -1 } // Default: newest first

    switch (sortBy) {
      case "oldest":
        sortOption = { createdAt: 1 }
        break
      case "highest":
        sortOption = { rating: -1 }
        break
      case "lowest":
        sortOption = { rating: 1 }
        break
      case "helpful":
        sortOption = { helpfulVotes: -1 }
        break
    }

    const reviews = await reviewModel
      .find({ doctorId, status: "active" })
      .populate("patientId", "name image")
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const totalReviews = await reviewModel.countDocuments({ doctorId, status: "active" })

    // Calculate rating distribution
    const ratingDistribution = await reviewModel.aggregate([
      { $match: { doctorId, status: "active" } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ])

    // Calculate category averages
    const categoryAverages = await reviewModel.aggregate([
      { $match: { doctorId, status: "active" } },
      {
        $group: {
          _id: null,
          avgCommunication: { $avg: "$categories.communication" },
          avgPunctuality: { $avg: "$categories.punctuality" },
          avgExpertise: { $avg: "$categories.expertise" },
          avgFacilities: { $avg: "$categories.facilities" },
        },
      },
    ])

    res.json({
      success: true,
      reviews,
      totalReviews,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit),
      ratingDistribution,
      categoryAverages: categoryAverages[0] || {},
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get patient's reviews
const getPatientReviews = async (req, res) => {
  try {
    const { patientId } = req.params
    const { page = 1, limit = 10 } = req.query

    const reviews = await reviewModel
      .find({ patientId })
      .populate("doctorId", "name speciality image")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const totalReviews = await reviewModel.countDocuments({ patientId })

    res.json({
      success: true,
      reviews,
      totalReviews,
      currentPage: page,
      totalPages: Math.ceil(totalReviews / limit),
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Update review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const { rating, reviewText, categories } = req.body

    const review = await reviewModel.findById(reviewId)
    if (!review) {
      return res.json({ success: false, message: "Review not found" })
    }

    // Update review
    review.rating = rating
    review.reviewText = reviewText
    review.categories = categories

    await review.save()

    // Update doctor's average rating
    await updateDoctorRating(review.doctorId)

    res.json({ success: true, message: "Review updated successfully" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Doctor response to review
const respondToReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const { responseText, doctorId } = req.body

    const review = await reviewModel.findById(reviewId)
    if (!review) {
      return res.json({ success: false, message: "Review not found" })
    }

    if (review.doctorId !== doctorId) {
      return res.json({ success: false, message: "Unauthorized to respond to this review" })
    }

    review.doctorResponse = {
      text: responseText,
      respondedAt: new Date(),
    }

    await review.save()

    res.json({ success: true, message: "Response added successfully" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Mark review as helpful
const markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params

    await reviewModel.findByIdAndUpdate(reviewId, {
      $inc: { helpfulVotes: 1 },
    })

    res.json({ success: true, message: "Review marked as helpful" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Report review
const reportReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const { reason } = req.body

    const review = await reviewModel.findByIdAndUpdate(reviewId, {
      $inc: { reportCount: 1 },
    })

    // Auto-hide if too many reports
    if (review.reportCount >= 5) {
      review.status = "reported"
      await review.save()
    }

    res.json({ success: true, message: "Review reported successfully" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Helper function to update doctor's average rating
const updateDoctorRating = async (doctorId) => {
  try {
    const stats = await reviewModel.aggregate([
      { $match: { doctorId, status: "active" } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ])

    const { averageRating = 0, totalReviews = 0 } = stats[0] || {}

    await doctorModel.findByIdAndUpdate(doctorId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews,
    })
  } catch (error) {
    console.log("Error updating doctor rating:", error)
  }
}

// Get reviewable appointments for a patient
const getReviewableAppointments = async (req, res) => {
  try {
    const { patientId } = req.params

    // Find completed appointments that haven't been reviewed
    const appointments = await appointmentModel
      .find({
        userId: patientId,
        isCompleted: true,
      })
      .populate("docId", "name speciality image")

    // Filter out appointments that already have reviews
    const reviewedAppointments = await reviewModel
      .find({
        patientId,
      })
      .distinct("appointmentId")

    const reviewableAppointments = appointments.filter(
      (appointment) => !reviewedAppointments.includes(appointment._id.toString()),
    )

    res.json({
      success: true,
      appointments: reviewableAppointments,
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export {
  createReview,
  getDoctorReviews,
  getPatientReviews,
  updateReview,
  respondToReview,
  markHelpful,
  reportReview,
  getReviewableAppointments,
}
