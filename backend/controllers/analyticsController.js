import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"
import doctorModel from "../models/doctorModel.js"
import chatModel from "../models/chatModel.js"

// Get comprehensive analytics data
const getAnalytics = async (req, res) => {
  try {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Basic counts
    const totalDoctors = await doctorModel.countDocuments()
    const totalPatients = await userModel.countDocuments()
    const totalAppointments = await appointmentModel.countDocuments()
    const totalChats = await chatModel.countDocuments()

    // Monthly appointments for the last 12 months
    const monthlyAppointments = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1)
      const nextDate = new Date(currentYear, currentMonth - i + 1, 1)

      const count = await appointmentModel.countDocuments({
        date: { $gte: date, $lt: nextDate },
      })

      monthlyAppointments.push({
        month: date.toLocaleString("default", { month: "short" }),
        appointments: count,
      })
    }

    // Appointments by status
    const completedAppointments = await appointmentModel.countDocuments({ isCompleted: true })
    const cancelledAppointments = await appointmentModel.countDocuments({ cancelled: true })
    const pendingAppointments = await appointmentModel.countDocuments({
      cancelled: false,
      isCompleted: false,
    })

    // Revenue analytics
    const totalRevenue = await appointmentModel.aggregate([
      { $match: { payment: true, cancelled: false } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    const monthlyRevenue = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1)
      const nextDate = new Date(currentYear, currentMonth - i + 1, 1)

      const revenue = await appointmentModel.aggregate([
        {
          $match: {
            date: { $gte: date, $lt: nextDate },
            payment: true,
            cancelled: false,
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])

      monthlyRevenue.push({
        month: date.toLocaleString("default", { month: "short" }),
        revenue: revenue[0]?.total || 0,
      })
    }

    // Top specialities
    const specialityStats = await appointmentModel.aggregate([
      { $match: { cancelled: false } },
      { $group: { _id: "$docData.speciality", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ])

    // Top doctors by appointments
    const topDoctors = await appointmentModel.aggregate([
      { $match: { cancelled: false } },
      {
        $group: {
          _id: "$docId",
          count: { $sum: 1 },
          doctorName: { $first: "$docData.name" },
          doctorImage: { $first: "$docData.image" },
          speciality: { $first: "$docData.speciality" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ])

    // Patient demographics (age groups)
    const currentYear2 = new Date().getFullYear()
    const patientAgeGroups = await userModel.aggregate([
      {
        $addFields: {
          age: {
            $subtract: [currentYear2, { $year: { $dateFromString: { dateString: "$dob" } } }],
          },
        },
      },
      {
        $bucket: {
          groupBy: "$age",
          boundaries: [0, 18, 30, 45, 60, 100],
          default: "Unknown",
          output: { count: { $sum: 1 } },
        },
      },
    ])

    // Recent activity
    const recentAppointments = await appointmentModel
      .find()
      .sort({ date: -1 })
      .limit(10)
      .select("docData userData slotDate slotTime cancelled isCompleted amount")

    res.json({
      success: true,
      analytics: {
        overview: {
          totalDoctors,
          totalPatients,
          totalAppointments,
          totalChats,
          totalRevenue: totalRevenue[0]?.total || 0,
          completedAppointments,
          cancelledAppointments,
          pendingAppointments,
        },
        monthlyAppointments,
        monthlyRevenue,
        specialityStats,
        topDoctors,
        patientAgeGroups,
        recentAppointments,
      },
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get doctor-specific analytics
const getDoctorAnalytics = async (req, res) => {
  try {
    const { docId } = req.body
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Basic stats for this doctor
    const totalAppointments = await appointmentModel.countDocuments({ docId })
    const completedAppointments = await appointmentModel.countDocuments({
      docId,
      isCompleted: true,
    })
    const cancelledAppointments = await appointmentModel.countDocuments({
      docId,
      cancelled: true,
    })

    // Monthly appointments for last 6 months
    const monthlyAppointments = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1)
      const nextDate = new Date(currentYear, currentMonth - i + 1, 1)

      const count = await appointmentModel.countDocuments({
        docId,
        date: { $gte: date, $lt: nextDate },
      })

      monthlyAppointments.push({
        month: date.toLocaleString("default", { month: "short" }),
        appointments: count,
      })
    }

    // Revenue for this doctor
    const totalRevenue = await appointmentModel.aggregate([
      { $match: { docId, payment: true, cancelled: false } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    // Patient satisfaction (if reviews exist)
    const averageRating = 4.5 // Placeholder - would come from reviews

    res.json({
      success: true,
      analytics: {
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyAppointments,
        averageRating,
      },
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { getAnalytics, getDoctorAnalytics }
