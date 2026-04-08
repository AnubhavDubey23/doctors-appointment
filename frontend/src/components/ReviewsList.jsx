"use client"

import { useState, useEffect, useContext } from "react"
import { AppContext } from "../context/AppContext"
import axios from "axios"

const ReviewsList = ({ doctorId }) => {
  const { backendUrl } = useContext(AppContext)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("newest")
  const [stats, setStats] = useState({})

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/review/doctor/${doctorId}?sortBy=${sortBy}`)

      if (data.success) {
        setReviews(data.reviews)
        setStats({
          totalReviews: data.totalReviews,
          ratingDistribution: data.ratingDistribution,
          categoryAverages: data.categoryAverages,
        })
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const markHelpful = async (reviewId) => {
    try {
      await axios.put(`${backendUrl}/api/review/helpful/${reviewId}`)
      fetchReviews() // Refresh to show updated helpful count
    } catch (error) {
      console.error("Error marking review as helpful:", error)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const StarDisplay = ({ rating }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-lg ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}>
          ★
        </span>
      ))}
    </div>
  )

  useEffect(() => {
    if (doctorId) {
      fetchReviews()
    }
  }, [doctorId, sortBy])

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading reviews...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Reviews Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Patient Reviews ({stats.totalReviews})</h3>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {/* Rating Distribution */}
        {stats.ratingDistribution && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Rating Distribution</h4>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution.find((r) => r._id === rating)?.count || 0
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0

                return (
                  <div key={rating} className="flex items-center mb-2">
                    <span className="w-8 text-sm">{rating}★</span>
                    <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <span className="w-8 text-sm text-gray-600">{count}</span>
                  </div>
                )
              })}
            </div>

            {/* Category Averages */}
            {stats.categoryAverages && Object.keys(stats.categoryAverages).length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Category Ratings</h4>
                {Object.entries(stats.categoryAverages).map(([key, value]) => {
                  if (key === "_id" || !value) return null
                  const categoryName = key
                    .replace("avg", "")
                    .replace(/([A-Z])/g, " $1")
                    .trim()

                  return (
                    <div key={key} className="flex items-center justify-between mb-2">
                      <span className="text-sm capitalize">{categoryName}</span>
                      <div className="flex items-center">
                        <StarDisplay rating={Math.round(value)} />
                        <span className="ml-2 text-sm text-gray-600">{value.toFixed(1)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-200">
        {reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">📝</div>
            <p>No reviews yet. Be the first to review this doctor!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {!review.isAnonymous && review.patientId && (
                    <>
                      <img
                        src={review.patientId.image || "/placeholder.svg"}
                        alt={review.patientId.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{review.patientId.name}</p>
                        <p className="text-sm text-gray-500">Verified Patient</p>
                      </div>
                    </>
                  )}
                  {review.isAnonymous && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600">👤</span>
                      </div>
                      <div>
                        <p className="font-medium">Anonymous</p>
                        <p className="text-sm text-gray-500">Verified Patient</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <StarDisplay rating={review.rating} />
                  <p className="text-sm text-gray-500 mt-1">{formatDate(review.createdAt)}</p>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.reviewText}</p>

              {/* Category Ratings */}
              {review.categories && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  {Object.entries(review.categories).map(([category, rating]) => (
                    <div key={category} className="text-center">
                      <p className="text-xs text-gray-600 capitalize mb-1">{category}</p>
                      <StarDisplay rating={rating} />
                    </div>
                  ))}
                </div>
              )}

              {/* Doctor Response */}
              {review.doctorResponse && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="flex items-center mb-2">
                    <span className="font-medium text-blue-800">Doctor's Response</span>
                    <span className="ml-2 text-sm text-blue-600">{formatDate(review.doctorResponse.respondedAt)}</span>
                  </div>
                  <p className="text-blue-700">{review.doctorResponse.text}</p>
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => markHelpful(review._id)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 6v4m-2 4h2m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v11a2 2 0 002 2h2l3-3 3-3a2 2 0 002-2z"
                    />
                  </svg>
                  <span>Helpful ({review.helpfulVotes})</span>
                </button>

                <button className="text-sm text-gray-400 hover:text-gray-600">Report</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ReviewsList
