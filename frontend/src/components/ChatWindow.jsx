"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { AppContext } from "../context/AppContext"
import { assets } from "../assets/assets"
import axios from "axios"
import { toast } from "react-toastify"

const ChatWindow = ({ chatId, onClose, doctorInfo }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const { token, backendUrl, userData } = useContext(AppContext)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (chatId) {
      fetchMessages()
      // Mark messages as read
      markMessagesRead()
    }
  }, [chatId])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/chat/messages/${chatId}`, {
        headers: { token },
      })

      if (data.success) {
        setMessages(data.chat.messages)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/chat/send-message`,
        {
          chatId,
          senderId: userData._id,
          senderType: "user",
          message: newMessage,
        },
        {
          headers: { token },
        },
      )

      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage])
        setNewMessage("")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to send message")
    }
  }

  const markMessagesRead = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/chat/mark-read`,
        {
          chatId,
          userId: userData._id,
        },
        {
          headers: { token },
        },
      )
    } catch (error) {
      console.log(error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-primary text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <img src={doctorInfo?.image || assets.profile_pic} alt="" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h3 className="font-medium">{doctorInfo?.name}</h3>
              <p className="text-sm opacity-90">{doctorInfo?.speciality}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1">
            <img src={assets.cross_icon || "/placeholder.svg"} alt="" className="w-5 h-5 invert" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <img src={assets.chats_icon || "/placeholder.svg"} alt="" className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Start a conversation with Dr. {doctorInfo?.name}</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex ${message.senderType === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.senderType === "user" ? "bg-primary text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className={`text-xs mt-1 ${message.senderType === "user" ? "text-blue-100" : "text-gray-500"}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="2"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow
