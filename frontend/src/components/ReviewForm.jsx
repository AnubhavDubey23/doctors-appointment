"use client"

import { useState } from "react"
import axios from "axios"

const ReviewForm = ({ appointment, backendUrl, token, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    reviewText: "",
    categories: {
      communication: 5,
      punctuality: 5,
      expertise: 5,
      facilities: 5,
    },
    isAnonymous: false,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/review/create`,
        {
          patientId: appointment.userId,
          doctorId: appointment.docId._id,
          appointmentId: appointment._id,
          ...formData,
        },
        { headers: { token } },
      )

      if (data.success) {
        onSubmit()
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  const StarRating = ({ value, onChange, label }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-2xl ${star <= value ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <img
                src={appointment.docId.image || "/placeholder.svg"}
                alt={appointment.docId.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">Dr. {appointment.docId.name}</h3>
                <p className="text-gray-600">{appointment.docId.speciality}</p>
                <p className="text-sm text-gray-500">
                  Appointment: {appointment.slotDate} at {appointment.slotTime}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Overall Rating */}
            <StarRating
              value={formData.rating}
              onChange={(rating) => setFormData((prev) => ({ ...prev, rating }))}
              label="Overall Rating"
            />

            {/* Category Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <StarRating
                value={formData.categories.communication}
                onChange={(rating) =>
                  setFormData((prev) => ({
                    ...prev,
                    categories: { ...prev.categories, communication: rating },
                  }))
                }
                label="Communication"
              />
              <StarRating
                value={formData.categories.punctuality}
                onChange={(rating) =>
                  setFormData((prev) => ({
                    ...prev,
                    categories: { ...prev.categories, punctuality: rating },
                  }))
                }
                label="Punctuality"
              />
              <StarRating
                value={formData.categories.expertise}
                onChange={(rating) =>
                  setFormData((prev) => ({
                    ...prev,
                    categories: { ...prev.categories, expertise: rating },
                  }))
                }
                label="Medical Expertise"
              />
              <StarRating
                value={formData.categories.facilities}
                onChange={(rating) =>
                  setFormData((prev) => ({
                    ...prev,
                    categories: { ...prev.categories, facilities: rating },
                  }))
                }
                label="Facilities"
              />
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
              <textarea
                value={formData.reviewText}
                onChange={(e) => setFormData((prev) => ({ ...prev, reviewText: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience with this doctor..."
                required
                maxLength={1000}
              />
              <p className="text-sm text-gray-500 mt-1">{formData.reviewText.length}/1000 characters</p>
            </div>

            {/* Anonymous Option */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isAnonymous: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Post this review anonymously</span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReviewForm
