"use client"

import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import { useNavigate, useParams } from "react-router-dom"

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    availability: "all",
    experience: "all",
    rating: "all",
    fees: "all",
    gender: "all",
    location: "all",
  })
  const [sortBy, setSortBy] = useState("name")
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  // Get unique values for filter options
  const getFilterOptions = () => {
    const locations = [...new Set(doctors.map((doc) => doc.address?.city).filter(Boolean))]
    const experiences = [...new Set(doctors.map((doc) => doc.experience).filter(Boolean))].sort((a, b) => a - b)

    return { locations, experiences }
  }

  const applyFilters = () => {
    let filtered = [...doctors]

    // Apply speciality filter
    if (speciality) {
      filtered = filtered.filter((doc) => doc.speciality === speciality)
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(query) ||
          doc.speciality.toLowerCase().includes(query) ||
          doc.about?.toLowerCase().includes(query) ||
          doc.address?.city?.toLowerCase().includes(query),
      )
    }

    // Apply availability filter
    if (filters.availability !== "all") {
      const isAvailable = filters.availability === "available"
      filtered = filtered.filter((doc) => doc.available === isAvailable)
    }

    // Apply experience filter
    if (filters.experience !== "all") {
      const expRange = filters.experience
      filtered = filtered.filter((doc) => {
        const exp = doc.experience || 0
        switch (expRange) {
          case "0-5":
            return exp >= 0 && exp <= 5
          case "6-10":
            return exp >= 6 && exp <= 10
          case "11-15":
            return exp >= 11 && exp <= 15
          case "16+":
            return exp >= 16
          default:
            return true
        }
      })
    }

    // Apply rating filter
    if (filters.rating !== "all") {
      const minRating = Number.parseFloat(filters.rating)
      filtered = filtered.filter((doc) => (doc.averageRating || 0) >= minRating)
    }

    // Apply fees filter
    if (filters.fees !== "all") {
      const feeRange = filters.fees
      filtered = filtered.filter((doc) => {
        const fee = doc.fees || 0
        switch (feeRange) {
          case "low":
            return fee <= 500
          case "medium":
            return fee > 500 && fee <= 1000
          case "high":
            return fee > 1000
          default:
            return true
        }
      })
    }

    // Apply gender filter
    if (filters.gender !== "all") {
      filtered = filtered.filter((doc) => doc.gender?.toLowerCase() === filters.gender)
    }

    // Apply location filter
    if (filters.location !== "all") {
      filtered = filtered.filter((doc) => doc.address?.city === filters.location)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "experience":
          return (b.experience || 0) - (a.experience || 0)
        case "rating":
          return (b.averageRating || 0) - (a.averageRating || 0)
        case "fees-low":
          return (a.fees || 0) - (b.fees || 0)
        case "fees-high":
          return (b.fees || 0) - (a.fees || 0)
        default:
          return 0
      }
    })

    setFilterDoc(filtered)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilters({
      availability: "all",
      experience: "all",
      rating: "all",
      fees: "all",
      gender: "all",
      location: "all",
    })
    setSortBy("name")
  }

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  useEffect(() => {
    applyFilters()
  }, [doctors, speciality, searchQuery, filters, sortBy])

  const { locations, experiences } = getFilterOptions()

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600 mb-4">Browse through the doctors specialist.</p>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search doctors by name, speciality, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Sort and Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`py-2 px-4 border rounded-lg text-sm transition-all ${showFilter ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
            >
              <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                />
              </svg>
              Filters
            </button>

            <button onClick={clearFilters} className="py-2 px-4 text-sm text-gray-600 hover:text-gray-800">
              Clear All
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="experience">Experience</option>
              <option value="rating">Rating</option>
              <option value="fees-low">Fees (Low to High)</option>
              <option value="fees-high">Fees (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-5">
        {/* Advanced Filters Panel */}
        <div className={`w-full lg:w-80 ${showFilter ? "block" : "hidden lg:block"}`}>
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-800 mb-4">Filters</h3>

            {/* Speciality Filter */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Speciality</h4>
              <div className="space-y-2">
                {[
                  "General physician",
                  "Gynecologist",
                  "Dermatologist",
                  "Pediatricians",
                  "Neurologist",
                  "Gastroenterologist",
                ].map((spec) => (
                  <button
                    key={spec}
                    onClick={() => (speciality === spec ? navigate("/doctors") : navigate(`/doctors/${spec}`))}
                    className={`w-full text-left px-3 py-2 text-sm border border-gray-300 rounded transition-all ${
                      speciality === spec ? "bg-blue-50 text-blue-700 border-blue-300" : "hover:bg-gray-50"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Availability</h4>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange("availability", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="unavailable">Not Available</option>
              </select>
            </div>

            {/* Experience Filter */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Experience</h4>
              <select
                value={filters.experience}
                onChange={(e) => handleFilterChange("experience", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="0-5">0-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="11-15">11-15 years</option>
                <option value="16+">16+ years</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Minimum Rating</h4>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>

            {/* Fees Filter */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Consultation Fees</h4>
              <select
                value={filters.fees}
                onChange={(e) => handleFilterChange("fees", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="low">Under ₹500</option>
                <option value="medium">₹500 - ₹1000</option>
                <option value="high">Above ₹1000</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Gender</h4>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Location Filter */}
            {locations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Location</h4>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-600">
              Showing {filterDoc.length} doctor{filterDoc.length !== 1 ? "s" : ""}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6">
            {filterDoc.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filterDoc.map((item, index) => (
                <div
                  onClick={() => {
                    navigate(`/appointment/${item._id}`)
                    scrollTo(0, 0)
                  }}
                  className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300"
                  key={index}
                >
                  <img
                    className="bg-gray-50 w-full h-48 object-cover"
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                  />
                  <div className="p-4">
                    <div
                      className={`flex items-center gap-2 text-sm mb-2 ${item.available ? "text-green-600" : "text-gray-500"}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${item.available ? "bg-green-500" : "bg-gray-400"}`}></div>
                      <span>{item.available ? "Available" : "Not Available"}</span>
                    </div>

                    <h3 className="text-gray-900 text-lg font-semibold mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.speciality}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        {item.averageRating ? (
                          <>
                            <span className="text-yellow-400">★</span>
                            <span>{item.averageRating}</span>
                            <span>({item.totalReviews || 0})</span>
                          </>
                        ) : (
                          <span>No reviews</span>
                        )}
                      </div>

                      {item.experience && <span>{item.experience} yrs exp</span>}
                    </div>

                    {item.fees && (
                      <div className="mt-2 text-right">
                        <span className="text-lg font-semibold text-green-600">₹{item.fees}</span>
                        <span className="text-sm text-gray-500 ml-1">consultation</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Doctors
