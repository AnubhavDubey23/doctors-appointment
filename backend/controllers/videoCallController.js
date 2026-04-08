import videoCallModel from "../models/videoCallModel.js"
import appointmentModel from "../models/appointmentModel.js"
import { v4 as uuidv4 } from "uuid"

// Create video call room
const createVideoCall = async (req, res) => {
  try {
    const { appointmentId, userId, doctorId } = req.body

    // Check if appointment exists
    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" })
    }

    // Check if video call already exists for this appointment
    const existingCall = await videoCallModel.findOne({ appointmentId })
    if (existingCall) {
      return res.json({
        success: true,
        roomId: existingCall.roomId,
        callId: existingCall._id,
      })
    }

    // Generate unique room ID
    const roomId = uuidv4()

    const videoCall = new videoCallModel({
      appointmentId,
      userId,
      doctorId,
      roomId,
      status: "scheduled",
    })

    await videoCall.save()

    res.json({
      success: true,
      roomId: videoCall.roomId,
      callId: videoCall._id,
      message: "Video call room created successfully",
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Join video call
const joinVideoCall = async (req, res) => {
  try {
    const { callId, userId, userType } = req.body

    const videoCall = await videoCallModel.findById(callId)
    if (!videoCall) {
      return res.json({ success: false, message: "Video call not found" })
    }

    // Add participant
    const participant = {
      userId,
      userType,
      joinedAt: new Date(),
    }

    videoCall.participants.push(participant)

    // Update call status to active if first participant joins
    if (videoCall.status === "scheduled") {
      videoCall.status = "active"
      videoCall.startTime = new Date()
    }

    await videoCall.save()

    res.json({
      success: true,
      roomId: videoCall.roomId,
      message: "Joined video call successfully",
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// End video call
const endVideoCall = async (req, res) => {
  try {
    const { callId, userId, callNotes, prescription } = req.body

    const videoCall = await videoCallModel.findById(callId)
    if (!videoCall) {
      return res.json({ success: false, message: "Video call not found" })
    }

    // Update participant left time
    const participant = videoCall.participants.find((p) => p.userId.toString() === userId)
    if (participant) {
      participant.leftAt = new Date()
    }

    // End call if doctor ends it
    videoCall.status = "ended"
    videoCall.endTime = new Date()

    if (videoCall.startTime) {
      videoCall.duration = Math.round((videoCall.endTime - videoCall.startTime) / (1000 * 60))
    }

    if (callNotes) videoCall.callNotes = callNotes
    if (prescription) videoCall.prescription = prescription

    await videoCall.save()

    // Mark appointment as completed
    await appointmentModel.findByIdAndUpdate(videoCall.appointmentId, {
      isCompleted: true,
    })

    res.json({
      success: true,
      message: "Video call ended successfully",
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get video call details
const getVideoCall = async (req, res) => {
  try {
    const { callId } = req.params

    const videoCall = await videoCallModel
      .findById(callId)
      .populate("userId", "name image")
      .populate("doctorId", "name image speciality")
      .populate("appointmentId")

    if (!videoCall) {
      return res.json({ success: false, message: "Video call not found" })
    }

    res.json({ success: true, videoCall })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get user's video calls
const getUserVideoCalls = async (req, res) => {
  try {
    const { userId } = req.body

    const videoCalls = await videoCallModel
      .find({ userId })
      .populate("doctorId", "name image speciality")
      .populate("appointmentId", "slotDate slotTime")
      .sort({ createdAt: -1 })

    res.json({ success: true, videoCalls })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get doctor's video calls
const getDoctorVideoCalls = async (req, res) => {
  try {
    const { docId } = req.body

    const videoCalls = await videoCallModel
      .find({ doctorId: docId })
      .populate("userId", "name image")
      .populate("appointmentId", "slotDate slotTime")
      .sort({ createdAt: -1 })

    res.json({ success: true, videoCalls })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { createVideoCall, joinVideoCall, endVideoCall, getVideoCall, getUserVideoCalls, getDoctorVideoCalls }
