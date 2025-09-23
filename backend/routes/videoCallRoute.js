import express from "express"
import {
  createVideoCall,
  joinVideoCall,
  endVideoCall,
  getVideoCall,
  getUserVideoCalls,
  getDoctorVideoCalls,
} from "../controllers/videoCallController.js"
import authUser from "../middleware/authUser.js"
import authDoctor from "../middleware/authDoctor.js"

const videoCallRouter = express.Router()

// User routes
videoCallRouter.post("/create", authUser, createVideoCall)
videoCallRouter.post("/join", authUser, joinVideoCall)
videoCallRouter.post("/end", authUser, endVideoCall)
videoCallRouter.get("/user-calls", authUser, getUserVideoCalls)
videoCallRouter.get("/:callId", authUser, getVideoCall)

// Doctor routes
videoCallRouter.post("/doctor-join", authDoctor, joinVideoCall)
videoCallRouter.post("/doctor-end", authDoctor, endVideoCall)
videoCallRouter.get("/doctor-calls", authDoctor, getDoctorVideoCalls)

export default videoCallRouter
