import express from "express"
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js"
import authUser from "../middleware/authUser.js"
import authDoctor from "../middleware/authDoctor.js"

const notificationRouter = express.Router()

// Create notification (admin only)
notificationRouter.post("/create", createNotification)

// Get user notifications
notificationRouter.get("/user/:userId", authUser, getUserNotifications)

// Get doctor notifications
notificationRouter.get("/doctor/:userId", authDoctor, getUserNotifications)

// Mark notification as read
notificationRouter.put("/read/:notificationId", markAsRead)

// Mark all notifications as read
notificationRouter.put("/read-all/:userId", markAllAsRead)

// Delete notification
notificationRouter.delete("/:notificationId", deleteNotification)

export default notificationRouter
