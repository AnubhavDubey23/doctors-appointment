import { useContext } from "react"
import { assets } from "../assets/assets"
import { NavLink } from "react-router-dom"
import { DoctorContext } from "../context/DoctorContext"
import { AdminContext } from "../context/AdminContext"
import { LayoutDashboard, Calendar, Plus, Users, BarChart3, User } from "lucide-react"
import { motion } from "framer-motion"

const Sidebar = () => {
  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin-dashboard" },
    { icon: Calendar, label: "Appointments", path: "/all-appointments" },
    { icon: Plus, label: "Add Doctor", path: "/add-doctor" },
    { icon: Users, label: "Doctors List", path: "/doctor-list" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
  ]

  const doctorMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/doctor-dashboard" },
    { icon: Calendar, label: "Appointments", path: "/doctor-appointments" },
    { icon: User, label: "Profile", path: "/doctor-profile" },
  ]

  const menuItems = aToken ? adminMenuItems : doctorMenuItems

  return (
    <div className="min-h-screen bg-white border-r border-gray-100 w-full md:w-72">
      <nav className="pt-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 py-4 px-4 md:px-6 cursor-pointer transition-all relative group ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-gray-50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary"
                    />
                  )}
                  
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
                  <p className={`hidden md:block font-medium text-sm ${isActive ? "font-semibold text-primary" : ""}`}>
                    {item.label}
                  </p>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar
