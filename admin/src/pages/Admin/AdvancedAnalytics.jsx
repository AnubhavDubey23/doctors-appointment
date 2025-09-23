"use client"

import { useState, useEffect, useContext } from "react"
import { AdminContext } from "../../context/AdminContext"
import AnalyticsChart from "../../components/AnalyticsChart"
import StatCard from "../../components/StatCard"
import axios from "axios"
import { toast } from "react-toastify"

const AdvancedAnalytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const { aToken, backendUrl } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      fetchAnalytics()
    }
  }, [aToken])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/analytics/admin`, {
        headers: { aToken },
      })

      if (data.success) {
        setAnalytics(data.analytics)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Advanced Analytics</h1>
        <button
          onClick={fetchAnalytics}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Doctors" value={analytics.overview.totalDoctors} icon="👨‍⚕️" color="blue" />
        <StatCard title="Total Patients" value={analytics.overview.totalPatients} icon="👥" color="green" />
        <StatCard title="Total Appointments" value={analytics.overview.totalAppointments} icon="📅" color="purple" />
        <StatCard title="Total Revenue" value={`$${analytics.overview.totalRevenue}`} icon="💰" color="orange" />
      </div>

      {/* Appointment Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Completed" value={analytics.overview.completedAppointments} color="green" />
        <StatCard title="Pending" value={analytics.overview.pendingAppointments} color="orange" />
        <StatCard title="Cancelled" value={analytics.overview.cancelledAppointments} color="red" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart data={analytics.monthlyAppointments} type="line" title="Monthly Appointments" color="#3b82f6" />
        <AnalyticsChart data={analytics.monthlyRevenue} type="line" title="Monthly Revenue" color="#10b981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart data={analytics.specialityStats} type="bar" title="Popular Specialities" color="#8b5cf6" />

        {/* Top Doctors */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Doctors</h3>
          <div className="space-y-4">
            {analytics.topDoctors.map((doctor, index) => (
              <div key={doctor._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <img
                  src={doctor.doctorImage || "/placeholder.svg"}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{doctor.doctorName}</p>
                  <p className="text-sm text-gray-600">{doctor.speciality}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{doctor.count}</p>
                  <p className="text-xs text-gray-500">appointments</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Demographics */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Age Demographics</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {analytics.patientAgeGroups.map((group, index) => {
            const ageLabels = ["0-17", "18-29", "30-44", "45-59", "60+"]
            return (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{group.count}</p>
                <p className="text-sm text-gray-600">{ageLabels[index] || "Unknown"}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Appointments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Doctor</th>
                <th className="text-left py-2">Patient</th>
                <th className="text-left py-2">Date & Time</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentAppointments.map((appointment, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3">{appointment.docData.name}</td>
                  <td className="py-3">{appointment.userData.name}</td>
                  <td className="py-3">
                    {appointment.slotDate} {appointment.slotTime}
                  </td>
                  <td className="py-3">${appointment.amount}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        appointment.cancelled
                          ? "bg-red-100 text-red-800"
                          : appointment.isCompleted
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.cancelled ? "Cancelled" : appointment.isCompleted ? "Completed" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdvancedAnalytics
