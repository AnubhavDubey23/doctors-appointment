"use client"

import { useState, useEffect, useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from "axios"

const NotificationBell = () => {
  const { token, backendUrl } = useContext(AppContext)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)

  // Get user ID from token
  const getUserId = () => {
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.id
    } catch (error) {
      return null
    }
  }

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const userId = getUserId()
      if (!userId) return

      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/notification/user/${userId}?limit=10`, {
        headers: { token },
      })

      if (data.success) {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${backendUrl}/api/notification/read/${notificationId}`,
        {},
        {
          headers: { token },
        },
      )

      setNotifications((prev) =>
        prev.map((notif) => (notif._id === notificationId ? { ...notif, isRead: true } : notif)),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const userId = getUserId()
      if (!userId) return

      await axios.put(
        `${backendUrl}/api/notification/read-all/${userId}`,
        {},
        {
          headers: { token },
        },
      )

      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  // Format time ago
  const timeAgo = (date) => {
    const now = new Date()
    const notifDate = new Date(date)
    const diffInMinutes = Math.floor((now - notifDate) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment":
        return "📅"
      case "reminder":
        return "⏰"
      case "payment":
        return "💳"
      case "chat":
        return "💬"
      case "video_call":
        return "📹"
      case "medical_record":
        return "📋"
      default:
        return "🔔"
    }
  }

  useEffect(() => {
    if (token) {
      fetchNotifications()
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [token])

  if (!token) return null

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-800">
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification._id)
                    }
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}
                        >
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500">{timeAgo(notification.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      {notification.priority === "urgent" && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                          Urgent
                        </span>
                      )}
                    </div>
                    {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-gray-200">
            <button
              onClick={() => {
                setShowDropdown(false)
                window.location.href = "/notifications"
              }}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>}
    </div>
  )
}

export default NotificationBell
