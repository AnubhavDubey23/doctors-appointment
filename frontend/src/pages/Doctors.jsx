import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"

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
      <div className="mb-8 px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='mb-8'
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-2">
            Find Your Doctor
          </h1>
          <p className="text-text-secondary text-lg">Browse through our network of specialists and book your appointment.</p>
        </motion.div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search doctors by name, speciality, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-text-primary placeholder-text-secondary"
          />
          <svg
            className="absolute left-4 top-3.5 h-5 w-5 text-text-secondary"
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
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`py-2.5 px-5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                showFilter
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-primary hover:bg-gray-200"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                />
              </svg>
              Filters
            </button>

            <button
              onClick={clearFilters}
              className="py-2.5 px-5 text-sm font-medium text-text-secondary hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
            >
              Clear All
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary bg-white"
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

      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Advanced Filters Panel */}
        <div className={`w-full lg:w-80 ${showFilter ? "block" : "hidden lg:block"}`}>
          <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-6 shadow-soft">
            <h3 className="font-bold text-text-primary text-lg mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
              Filters
            </h3>

            {/* Speciality Filter */}
            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wide">Speciality</h4>
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
                    className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all ${
                      speciality === spec
                        ? "bg-primary text-white font-medium"
                        : "bg-gray-50 text-text-primary hover:bg-gray-100 hover:text-primary"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wide">Availability</h4>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange("availability", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="unavailable">Not Available</option>
              </select>
            </div>

            {/* Experience Filter */}
            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wide">Experience</h4>
              <select
                value={filters.experience}
                onChange={(e) => handleFilterChange("experience", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
              >
                <option value="all">All</option>
                <option value="0-5">0-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="11-15">11-15 years</option>
                <option value="16+">16+ years</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wide">Minimum Rating</h4>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
              >
                <option value="all">All</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>

            {/* Fees Filter */}
            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wide">Consultation Fees</h4>
              <select
                value={filters.fees}
                onChange={(e) => handleFilterChange("fees", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
              >
                <option value="all">All</option>
                <option value="low">Under ₹500</option>
                <option value="medium">₹500 - ₹1000</option>
                <option value="high">Above ₹1000</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div className="border-b border-gray-100 pb-4">
              <h4 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wide">Gender</h4>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
              >
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Location Filter */}
            {locations.length > 0 && (
              <div>
                <h4 className="font-semibold text-text-primary mb-3 text-sm uppercase tracking-wide">Location</h4>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
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
          <div className="mb-6 flex items-center justify-between">
            <p className="text-text-secondary font-medium">
              Showing <span className="text-primary font-bold">{filterDoc.length}</span> doctor{filterDoc.length !== 1 ? "s" : ""}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterDoc.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="flex justify-center mb-4">
                  <svg className="w-16 h-16 text-text-secondary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">No doctors found</h3>
                <p className="text-text-secondary mb-6">Try adjusting your search criteria or filters</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filterDoc.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
                  whileHover={{ y: -8 }}
                  onClick={() => {
                    navigate(`/appointment/${item._id}`)
                    window.scrollTo(0, 0)
                  }}
                  className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-lg border border-gray-100 cursor-pointer transition-all group"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 aspect-square">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                    />
                    
                    {/* Availability Badge */}
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm ${
                      item.available
                        ? 'bg-success/90 text-white animate-pulse-soft'
                        : 'bg-gray-400/90 text-white'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-white' : 'bg-white/50'}`}></span>
                      {item.available ? 'Available' : 'Not Available'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-text-secondary mb-3 font-medium">
                      {item.speciality}
                    </p>

                    {/* Rating and Experience */}
                    <div className="flex items-center justify-between text-xs text-text-secondary mb-3 border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-1">
                        {item.averageRating ? (
                          <>
                            <span className="text-yellow-400">★</span>
                            <span className="font-medium">{item.averageRating}</span>
                            <span>({item.totalReviews || 0})</span>
                          </>
                        ) : (
                          <span className="text-gray-500">No reviews</span>
                        )}
                      </div>
                      {item.experience && <span className="font-medium">{item.experience} yrs</span>}
                    </div>

                    {/* Fees */}
                    {item.fees && (
                      <div className="text-primary font-bold text-lg">
                        ₹{item.fees} <span className="text-text-secondary text-xs font-normal">per session</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Doctors
