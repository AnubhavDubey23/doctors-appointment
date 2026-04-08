import chatModel from "../models/chatModel.js"

// Get all chats for a user
const getUserChats = async (req, res) => {
  try {
    const { userId } = req.body

    const chats = await chatModel
      .find({ userId, isActive: true })
      .populate("doctorId", "name image speciality")
      .sort({ lastMessageTime: -1 })

    res.json({ success: true, chats })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get all chats for a doctor
const getDoctorChats = async (req, res) => {
  try {
    const { docId } = req.body

    const chats = await chatModel
      .find({ doctorId: docId, isActive: true })
      .populate("userId", "name image")
      .sort({ lastMessageTime: -1 })

    res.json({ success: true, chats })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get messages for a specific chat
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params

    const chat = await chatModel
      .findById(chatId)
      .populate("userId", "name image")
      .populate("doctorId", "name image speciality")

    if (!chat) {
      return res.json({ success: false, message: "Chat not found" })
    }

    res.json({ success: true, chat })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, senderType, message } = req.body

    const chat = await chatModel.findById(chatId)

    if (!chat) {
      return res.json({ success: false, message: "Chat not found" })
    }

    const newMessage = {
      senderId,
      senderType,
      message,
      timestamp: new Date(),
      isRead: false,
    }

    chat.messages.push(newMessage)
    chat.lastMessage = message
    chat.lastMessageTime = new Date()

    await chat.save()

    res.json({ success: true, message: "Message sent successfully", newMessage })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Create or get existing chat
const createChat = async (req, res) => {
  try {
    const { userId, doctorId, appointmentId } = req.body

    // Check if chat already exists
    const existingChat = await chatModel.findOne({ userId, doctorId })

    if (existingChat) {
      return res.json({ success: true, chatId: existingChat._id })
    }

    // Create new chat
    const newChat = new chatModel({
      userId,
      doctorId,
      appointmentId,
      messages: [],
      lastMessage: "Chat started",
      lastMessageTime: new Date(),
    })

    await newChat.save()

    res.json({ success: true, chatId: newChat._id })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Mark messages as read
const markMessagesRead = async (req, res) => {
  try {
    const { chatId, userId } = req.body

    await chatModel.updateOne(
      { _id: chatId },
      { $set: { "messages.$[elem].isRead": true } },
      { arrayFilters: [{ "elem.senderId": { $ne: userId } }] },
    )

    res.json({ success: true, message: "Messages marked as read" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { getUserChats, getDoctorChats, getChatMessages, sendMessage, createChat, markMessagesRead }
