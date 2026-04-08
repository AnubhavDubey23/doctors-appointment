import mongoose from "mongoose"

const videoCallSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "appointment", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },
    roomId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["scheduled", "active", "ended", "cancelled"],
      default: "scheduled",
    },
    startTime: { type: Date },
    endTime: { type: Date },
    duration: { type: Number }, // in minutes
    recordingUrl: { type: String },
    participants: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId },
        userType: { type: String, enum: ["user", "doctor"] },
        joinedAt: { type: Date },
        leftAt: { type: Date },
      },
    ],
    callNotes: { type: String },
    prescription: { type: String },
    followUpRequired: { type: Boolean, default: false },
    followUpDate: { type: Date },
  },
  { timestamps: true },
)

const videoCallModel = mongoose.models.videocall || mongoose.model("videocall", videoCallSchema)

export default videoCallModel
