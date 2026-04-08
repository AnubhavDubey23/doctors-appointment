"use client"

import { useState, useEffect, useContext } from "react"
import { AppContext } from "../context/AppContext"
import { assets } from "../assets/assets"
import axios from "axios"
import { toast } from "react-toastify"
import ChatWindow from "./ChatWindow"

const ChatList = () => {
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [loading, setLoading] = useState(false)
  const { token, backendUrl, userData } = useContext(AppContext)

  useEffect(() => {
    if (token && userData) {
      fetchChats()
    }
  }, [token, userData])

  const fetchChats = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/chat/user-chats`, {
        headers: { token },
      })

      if (data.success) {
        setChats(data.chats)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to load chats")
    } finally {
      setLoading(false)
    }
  }

  const openChat = (chat) => {
    setSelectedChat(chat._id)
    setSelectedDoctor(chat.doctorId)
  }

  const closeChat = () => {
    setSelectedChat(null)
    setSelectedDoctor(null)
    fetchChats() // Refresh chats to update last message
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <img src={assets.chats_icon || "/placeholder.svg"} alt="" className="w-8 h-8" />
            <h2 className="text-2xl font-semibold text-gray-800">My Chats</h2>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8">
              <img src={assets.chats_icon || "/placeholder.svg"} alt="" className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500">No chats yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Start a conversation with your doctors after booking an appointment
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => openChat(chat)}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <img
                    src={chat.doctorId.image || assets.profile_pic}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-800">Dr. {chat.doctorId.name}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(chat.lastMessageTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{chat.doctorId.speciality}</p>
                    <p className="text-sm text-gray-500 truncate mt-1">{chat.lastMessage}</p>
                  </div>
                  <img src={assets.arrow_icon || "/placeholder.svg"} alt="" className="w-4 h-4" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedChat && <ChatWindow chatId={selectedChat} onClose={closeChat} doctorInfo={selectedDoctor} />}
    </div>
  )
}

export default ChatList
