import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true },
    doctorId: { type: String, required: true },
    appointmentId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, required: true, maxlength: 1000 },
    categories: {
      communication: { type: Number, min: 1, max: 5 },
      punctuality: { type: Number, min: 1, max: 5 },
      expertise: { type: Number, min: 1, max: 5 },
      facilities: { type: Number, min: 1, max: 5 },
    },
    isAnonymous: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true }, // Since it's linked to actual appointments
    helpfulVotes: { type: Number, default: 0 },
    reportCount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "hidden", "reported"], default: "active" },
    doctorResponse: {
      text: { type: String },
      respondedAt: { type: Date },
    },
  },
  { timestamps: true },
)

// Compound index to ensure one review per appointment
reviewSchema.index({ patientId: 1, appointmentId: 1 }, { unique: true })

const reviewModel = mongoose.model("review", reviewSchema)
export default reviewModel
