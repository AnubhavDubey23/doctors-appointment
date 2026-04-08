import { useContext, useState } from "react"
import { assets } from "../assets/assets"
import { NavLink, useNavigate } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import NotificationBell from "./NotificationBell"
import { Menu, X, ChevronDown } from "lucide-react"

const Navbar = () => {
  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem("token")
    setToken(false)
    navigate("/login")
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
      <div className="flex items-center justify-between px-4 md:px-10 py-4">
        <img
          onClick={() => navigate("/")}
          className="w-32 md:w-40 cursor-pointer hover:opacity-80 transition-opacity"
          src={assets.logo || "/placeholder.svg"}
          alt="Prescripto"
        />
        
        {/* Desktop Navigation */}
        <ul className="md:flex items-center gap-8 font-medium hidden">
          <NavLink to="/" className="group">
            <li className="py-2 text-text-primary hover:text-primary transition-colors relative">
              HOME
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </li>
          </NavLink>
          <NavLink to="/doctors" className="group">
            <li className="py-2 text-text-primary hover:text-primary transition-colors relative">
              ALL DOCTORS
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </li>
          </NavLink>
          <NavLink to="/about" className="group">
            <li className="py-2 text-text-primary hover:text-primary transition-colors relative">
              ABOUT
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </li>
          </NavLink>
          <NavLink to="/contact" className="group">
            <li className="py-2 text-text-primary hover:text-primary transition-colors relative">
              CONTACT
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </li>
          </NavLink>
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {token && <NotificationBell />}

          {token && userData ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={userData.image || "/placeholder.svg"}
                  alt={userData.name || "User"}
                />
                <ChevronDown className="w-4 h-4 text-text-secondary" />
              </button>
              
              {showDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                  <div className="flex flex-col">
                    <button
                      onClick={() => {
                        navigate("/my-profile")
                        setShowDropdown(false)
                      }}
                      className="px-4 py-3 text-left text-text-primary hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("/my-appointments")
                        setShowDropdown(false)
                      }}
                      className="px-4 py-3 text-left text-text-primary hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      My Appointments
                    </button>
                    <button
                      onClick={() => {
                        navigate("/my-chats")
                        setShowDropdown(false)
                      }}
                      className="px-4 py-3 text-left text-text-primary hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      My Chats
                    </button>
                    <button
                      onClick={() => {
                        navigate("/medical-records")
                        setShowDropdown(false)
                      }}
                      className="px-4 py-3 text-left text-text-primary hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      Medical Records
                    </button>
                    <button
                      onClick={() => {
                        navigate("/notifications")
                        setShowDropdown(false)
                      }}
                      className="px-4 py-3 text-left text-text-primary hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      Notifications
                    </button>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={() => {
                        logout()
                        setShowDropdown(false)
                      }}
                      className="px-4 py-3 text-left text-danger hover:bg-danger/5 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-full font-medium hidden md:block hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Create account
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMenu(true)}
            className="md:hidden text-text-primary hover:text-primary transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Mobile Menu */}
          {showMenu && (
            <div className="fixed inset-0 z-20 md:hidden">
              <div className="fixed inset-0 bg-black/50" onClick={() => setShowMenu(false)}></div>
              <div className="fixed right-0 top-0 bottom-0 w-64 bg-white">
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                  <img src={assets.logo || "/placeholder.svg"} className="w-28" alt="Prescripto" />
                  <button
                    onClick={() => setShowMenu(false)}
                    className="text-text-primary hover:text-primary transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <ul className="flex flex-col gap-2 p-4">
                  <NavLink
                    onClick={() => setShowMenu(false)}
                    to="/"
                    className="px-4 py-3 rounded-lg hover:bg-primary/5 text-text-primary hover:text-primary transition-colors"
                  >
                    HOME
                  </NavLink>
                  <NavLink
                    onClick={() => setShowMenu(false)}
                    to="/doctors"
                    className="px-4 py-3 rounded-lg hover:bg-primary/5 text-text-primary hover:text-primary transition-colors"
                  >
                    ALL DOCTORS
                  </NavLink>
                  <NavLink
                    onClick={() => setShowMenu(false)}
                    to="/about"
                    className="px-4 py-3 rounded-lg hover:bg-primary/5 text-text-primary hover:text-primary transition-colors"
                  >
                    ABOUT
                  </NavLink>
                  <NavLink
                    onClick={() => setShowMenu(false)}
                    to="/contact"
                    className="px-4 py-3 rounded-lg hover:bg-primary/5 text-text-primary hover:text-primary transition-colors"
                  >
                    CONTACT
                  </NavLink>
                  {token && (
                    <>
                      <NavLink
                        onClick={() => setShowMenu(false)}
                        to="/my-chats"
                        className="px-4 py-3 rounded-lg hover:bg-primary/5 text-text-primary hover:text-primary transition-colors"
                      >
                        MY CHATS
                      </NavLink>
                      <NavLink
                        onClick={() => setShowMenu(false)}
                        to="/medical-records"
                        className="px-4 py-3 rounded-lg hover:bg-primary/5 text-text-primary hover:text-primary transition-colors"
                      >
                        MEDICAL RECORDS
                      </NavLink>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
