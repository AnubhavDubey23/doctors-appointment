import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userType: { type: String, enum: ["patient", "doctor", "admin"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["appointment", "reminder", "payment", "system", "chat", "video_call", "medical_record"],
      required: true,
    },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    isRead: { type: Boolean, default: false },
    actionUrl: { type: String },
    metadata: { type: Object, default: {} },
    scheduledFor: { type: Date },
    sentAt: { type: Date },
    channels: [
      {
        type: String,
        enum: ["in-app", "email", "sms", "push"],
      },
    ],
    status: { type: String, enum: ["pending", "sent", "failed", "cancelled"], default: "pending" },
  },
  { timestamps: true },
)

const notificationModel = mongoose.model("notification", notificationSchema)
export default notificationModel
