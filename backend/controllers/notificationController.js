import notificationModel from "../models/notificationModel.js"
import userModel from "../models/userModel.js"
import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js" // Import appointmentModel
import nodemailer from "nodemailer"
import twilio from "twilio"

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Twilio setup for SMS
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

// Create notification
const createNotification = async (req, res) => {
  try {
    const { userId, userType, title, message, type, priority, actionUrl, metadata, scheduledFor, channels } = req.body

    const notification = new notificationModel({
      userId,
      userType,
      title,
      message,
      type,
      priority,
      actionUrl,
      metadata,
      scheduledFor,
      channels: channels || ["in-app"],
    })

    await notification.save()

    // Send immediately if not scheduled
    if (!scheduledFor || new Date(scheduledFor) <= new Date()) {
      await sendNotification(notification._id)
    }

    res.json({ success: true, message: "Notification created successfully", notificationId: notification._id })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Send notification through various channels
const sendNotification = async (notificationId) => {
  try {
    const notification = await notificationModel.findById(notificationId)
    if (!notification) return

    let user
    if (notification.userType === "doctor") {
      user = await doctorModel.findById(notification.userId)
    } else {
      user = await userModel.findById(notification.userId)
    }

    if (!user) return

    const promises = []

    // Send through each specified channel
    for (const channel of notification.channels) {
      switch (channel) {
        case "email":
          promises.push(sendEmailNotification(user, notification))
          break
        case "sms":
          promises.push(sendSMSNotification(user, notification))
          break
        case "push":
          promises.push(sendPushNotification(user, notification))
          break
        case "in-app":
          // In-app notifications are stored in database and fetched by frontend
          break
      }
    }

    await Promise.all(promises)

    // Update notification status
    notification.status = "sent"
    notification.sentAt = new Date()
    await notification.save()
  } catch (error) {
    console.log("Error sending notification:", error)
    await notificationModel.findByIdAndUpdate(notificationId, { status: "failed" })
  }
}

// Send email notification
const sendEmailNotification = async (user, notification) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: notification.title,
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Prescripto</h1>
                </div>
                <div style="padding: 20px; background: #f9f9f9;">
                    <h2 style="color: #333;">${notification.title}</h2>
                    <p style="color: #666; line-height: 1.6;">${notification.message}</p>
                    ${notification.actionUrl ? `<a href="${notification.actionUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Take Action</a>` : ""}
                </div>
                <div style="padding: 15px; text-align: center; color: #999; font-size: 12px;">
                    <p>This is an automated message from Prescripto. Please do not reply to this email.</p>
                </div>
            </div>
        `,
  }

  return transporter.sendMail(mailOptions)
}

// Send SMS notification
const sendSMSNotification = async (user, notification) => {
  if (!user.phone) return

  return twilioClient.messages.create({
    body: `${notification.title}\n\n${notification.message}${notification.actionUrl ? `\n\nView: ${notification.actionUrl}` : ""}`,
    from: process.env.TWILIO_PHONE,
    to: user.phone,
  })
}

// Send push notification (placeholder for web push)
const sendPushNotification = async (user, notification) => {
  // Implementation for web push notifications would go here
  // This would typically use a service like Firebase Cloud Messaging
  console.log(`Push notification sent to ${user.name}: ${notification.title}`)
}

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 20, unreadOnly = false } = req.query

    const query = { userId }
    if (unreadOnly === "true") {
      query.isRead = false
    }

    const notifications = await notificationModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const totalCount = await notificationModel.countDocuments(query)
    const unreadCount = await notificationModel.countDocuments({ userId, isRead: false })

    res.json({
      success: true,
      notifications,
      totalCount,
      unreadCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params

    await notificationModel.findByIdAndUpdate(notificationId, { isRead: true })

    res.json({ success: true, message: "Notification marked as read" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params

    await notificationModel.updateMany({ userId, isRead: false }, { isRead: true })

    res.json({ success: true, message: "All notifications marked as read" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params

    await notificationModel.findByIdAndDelete(notificationId)

    res.json({ success: true, message: "Notification deleted" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Send appointment reminders
const sendAppointmentReminders = async () => {
  try {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    // Find appointments for tomorrow
    const appointments = await appointmentModel
      .find({
        slotDate: {
          $gte: tomorrow.toISOString().split("T")[0],
          $lt: dayAfterTomorrow.toISOString().split("T")[0],
        },
        cancelled: false,
      })
      .populate("docId userId")

    for (const appointment of appointments) {
      // Send reminder to patient
      await createNotification({
        body: {
          userId: appointment.userId._id,
          userType: "patient",
          title: "Appointment Reminder",
          message: `You have an appointment tomorrow at ${appointment.slotTime} with Dr. ${appointment.docId.name}`,
          type: "reminder",
          priority: "high",
          actionUrl: `/my-appointments`,
          channels: ["in-app", "email", "sms"],
          metadata: { appointmentId: appointment._id },
        },
      })

      // Send reminder to doctor
      await createNotification({
        body: {
          userId: appointment.docId._id,
          userType: "doctor",
          title: "Appointment Reminder",
          message: `You have an appointment tomorrow at ${appointment.slotTime} with ${appointment.userData.name}`,
          type: "reminder",
          priority: "high",
          actionUrl: `/doctor-appointments`,
          channels: ["in-app", "email"],
          metadata: { appointmentId: appointment._id },
        },
      })
    }

    console.log(`Sent ${appointments.length * 2} appointment reminders`)
  } catch (error) {
    console.log("Error sending appointment reminders:", error)
  }
}

export {
  createNotification,
  sendNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendAppointmentReminders,
}
