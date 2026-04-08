"use client"

import { useState, useEffect, useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from "axios"

const Notifications = () => {
  const { token, backendUrl } = useContext(AppContext)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

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
  const fetchNotifications = async (page = 1) => {
    try {
      const userId = getUserId()
      if (!userId) return

      setLoading(true)
      const unreadOnly = filter === "unread" ? "true" : "false"
      const { data } = await axios.get(
        `${backendUrl}/api/notification/user/${userId}?page=${page}&limit=20&unreadOnly=${unreadOnly}`,
        { headers: { token } },
      )

      if (data.success) {
        setNotifications(data.notifications)
        setTotalPages(data.totalPages)
        setCurrentPage(data.currentPage)
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
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`${backendUrl}/api/notification/${notificationId}`, {
        headers: { token },
      })

      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId))
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get notification icon and color
  const getNotificationStyle = (type, priority) => {
    const styles = {
      appointment: { icon: "📅", color: "bg-blue-100 text-blue-800" },
      reminder: { icon: "⏰", color: "bg-yellow-100 text-yellow-800" },
      payment: { icon: "💳", color: "bg-green-100 text-green-800" },
      chat: { icon: "💬", color: "bg-purple-100 text-purple-800" },
      video_call: { icon: "📹", color: "bg-indigo-100 text-indigo-800" },
      medical_record: { icon: "📋", color: "bg-gray-100 text-gray-800" },
      system: { icon: "🔔", color: "bg-gray-100 text-gray-800" },
    }

    const style = styles[type] || styles.system

    if (priority === "urgent") {
      style.color = "bg-red-100 text-red-800"
    }

    return style
  }

  useEffect(() => {
    if (token) {
      fetchNotifications(1)
    }
  }, [token, filter])

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please login to view notifications</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === "unread" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Unread
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">
                {filter === "unread" ? "No unread notifications" : "You have no notifications yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => {
                const style = getNotificationStyle(notification.type, notification.priority)

                return (
                  <div
                    key={notification._id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${!notification.isRead ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-2 rounded-full ${style.color}`}>
                          <span className="text-lg">{style.icon}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3
                              className={`text-sm font-medium ${
                                !notification.isRead ? "text-gray-900" : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                            {notification.priority === "urgent" && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Urgent</span>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

                          <p className="text-xs text-gray-500">{formatDate(notification.createdAt)}</p>

                          {notification.actionUrl && (
                            <button
                              onClick={() => {
                                if (!notification.isRead) {
                                  markAsRead(notification._id)
                                }
                                window.location.href = notification.actionUrl
                              }}
                              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                            >
                              Take Action →
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => fetchNotifications(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => fetchNotifications(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications
