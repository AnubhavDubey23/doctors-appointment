"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import VideoCall from "../components/VideoCall"
import axios from "axios"
import { toast } from "react-toastify"

const VideoConsultation = () => {
  const { appointmentId } = useParams()
  const [callId, setCallId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [appointment, setAppointment] = useState(null)
  const { token, backendUrl, userData } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (appointmentId && token) {
      initializeVideoCall()
    }
  }, [appointmentId, token])

  const initializeVideoCall = async () => {
    try {
      setLoading(true)

      // Get appointment details first
      const appointmentResponse = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      })

      if (appointmentResponse.data.success) {
        const currentAppointment = appointmentResponse.data.appointments.find((apt) => apt._id === appointmentId)

        if (!currentAppointment) {
          toast.error("Appointment not found")
          navigate("/my-appointments")
          return
        }

        setAppointment(currentAppointment)

        // Create or get video call
        const { data } = await axios.post(
          `${backendUrl}/api/video-call/create`,
          {
            appointmentId,
            userId: userData._id,
            doctorId: currentAppointment.docId,
          },
          {
            headers: { token },
          },
        )

        if (data.success) {
          setCallId(data.callId)
        } else {
          toast.error(data.message)
          navigate("/my-appointments")
        }
      }
    } catch (error) {
      console.error("Error initializing video call:", error)
      toast.error("Failed to initialize video call")
      navigate("/my-appointments")
    } finally {
      setLoading(false)
    }
  }

  const handleCloseCall = () => {
    navigate("/my-appointments")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing video call...</p>
        </div>
      </div>
    )
  }

  if (!callId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to initialize video call</p>
          <button
            onClick={() => navigate("/my-appointments")}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    )
  }

  return <VideoCall callId={callId} onClose={handleCloseCall} isDoctor={false} />
}

export default VideoConsultation
