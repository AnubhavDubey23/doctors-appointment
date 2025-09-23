import express from "express"
import {
  getUserChats,
  getDoctorChats,
  getChatMessages,
  sendMessage,
  createChat,
  markMessagesRead,
} from "../controllers/chatController.js"
import authUser from "../middleware/authUser.js"
import authDoctor from "../middleware/authDoctor.js"

const chatRouter = express.Router()

// User routes
chatRouter.get("/user-chats", authUser, getUserChats)
chatRouter.post("/create", authUser, createChat)
chatRouter.post("/send-message", authUser, sendMessage)
chatRouter.get("/messages/:chatId", authUser, getChatMessages)
chatRouter.post("/mark-read", authUser, markMessagesRead)

// Doctor routes
chatRouter.get("/doctor-chats", authDoctor, getDoctorChats)
chatRouter.post("/doctor-send", authDoctor, sendMessage)

export default chatRouter
