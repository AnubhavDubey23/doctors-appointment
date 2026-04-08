"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { AppContext } from "../context/AppContext"
import { assets } from "../assets/assets"
import axios from "axios"
import { toast } from "react-toastify"

const VideoCall = ({ callId, onClose, isDoctor = false }) => {
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [callNotes, setCallNotes] = useState("")
  const [prescription, setPrescription] = useState("")
  const [showNotes, setShowNotes] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const callStartTime = useRef(null)

  const { token, backendUrl, userData } = useContext(AppContext)

  useEffect(() => {
    initializeCall()
    return () => {
      endCall()
    }
  }, [])

  useEffect(() => {
    let interval
    if (isCallActive) {
      callStartTime.current = Date.now()
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime.current) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isCallActive])

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      setLocalStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Initialize WebRTC peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
      })

      peerConnectionRef.current = peerConnection

      // Add local stream to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream)
      })

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams
        setRemoteStream(remoteStream)
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream
        }
      }

      // Join the call
      await joinCall()
      setIsCallActive(true)
    } catch (error) {
      console.error("Error initializing call:", error)
      toast.error("Failed to initialize video call")
    }
  }

  const joinCall = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/video-call/join`,
        {
          callId,
          userId: userData._id,
          userType: isDoctor ? "doctor" : "user",
        },
        {
          headers: { token },
        },
      )

      if (!data.success) {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error joining call:", error)
      toast.error("Failed to join call")
    }
  }

  const endCall = async () => {
    try {
      // Stop local stream
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop())
      }

      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }

      // End call on server
      await axios.post(
        `${backendUrl}/api/video-call/end`,
        {
          callId,
          userId: userData._id,
          callNotes: isDoctor ? callNotes : undefined,
          prescription: isDoctor ? prescription : undefined,
        },
        {
          headers: { token },
        },
      )

      setIsCallActive(false)
      onClose()
    } catch (error) {
      console.error("Error ending call:", error)
      toast.error("Failed to end call")
    }
  }

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOff(!videoTrack.enabled)
      }
    }
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="w-full h-full max-w-6xl mx-auto p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 text-white">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Video Consultation</h2>
            {isCallActive && (
              <div className="bg-red-600 px-3 py-1 rounded-full text-sm">🔴 {formatDuration(callDuration)}</div>
            )}
          </div>
          <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2">
            <img src={assets.cross_icon || "/placeholder.svg"} alt="" className="w-6 h-6 invert" />
          </button>
        </div>

        {/* Video Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Remote Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            {!remoteStream && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <p>Waiting for {isDoctor ? "patient" : "doctor"} to join...</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              {isDoctor ? "Patient" : "Doctor"}
            </div>
          </div>

          {/* Local Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            {isVideoOff && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white">👤</span>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">You</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full ${isMuted ? "bg-red-600" : "bg-gray-600"} text-white hover:opacity-80`}
          >
            {isMuted ? "🔇" : "🎤"}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full ${isVideoOff ? "bg-red-600" : "bg-gray-600"} text-white hover:opacity-80`}
          >
            {isVideoOff ? "📹" : "📷"}
          </button>

          {isDoctor && (
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="p-4 rounded-full bg-blue-600 text-white hover:opacity-80"
            >
              📝
            </button>
          )}

          <button onClick={endCall} className="p-4 rounded-full bg-red-600 text-white hover:opacity-80">
            📞
          </button>
        </div>

        {/* Doctor Notes Panel */}
        {isDoctor && showNotes && (
          <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
            <h3 className="font-semibold mb-3">Consultation Notes</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Call Notes</label>
                <textarea
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  rows="3"
                  placeholder="Enter consultation notes..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prescription</label>
                <textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  rows="3"
                  placeholder="Enter prescription details..."
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoCall
