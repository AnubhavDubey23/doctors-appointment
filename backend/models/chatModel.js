import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderType: { type: String, enum: ["user", "doctor"], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
})

const chatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "appointment" },
    messages: [messageSchema],
    lastMessage: { type: String },
    lastMessageTime: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

const chatModel = mongoose.models.chat || mongoose.model("chat", chatSchema)

export default chatModel
