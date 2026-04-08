import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, Shield, Stethoscope } from 'lucide-react'
import { motion } from 'framer-motion'

const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  const isAdmin = aToken && !dToken

  return (
    <nav className='sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-soft'>
      <div className='flex justify-between items-center px-4 sm:px-10 py-4'>
        {/* Logo and Badge */}
        <div className='flex items-center gap-3'>
          <img
            onClick={() => navigate('/')}
            className='w-32 sm:w-40 cursor-pointer hover:opacity-80 transition-opacity'
            src={assets.admin_logo}
            alt="Prescripto Admin"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 ${
              isAdmin
                ? 'bg-primary/10 text-primary'
                : 'bg-secondary/10 text-secondary'
            }`}
          >
            {isAdmin ? (
              <>
                <Shield className='w-4 h-4' />
                Admin
              </>
            ) : (
              <>
                <Stethoscope className='w-4 h-4' />
                Doctor
              </>
            )}
          </motion.div>
        </div>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className='bg-gradient-to-r from-danger to-danger/80 text-white text-sm px-6 py-2.5 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2'
        >
          <LogOut className='w-4 h-4' />
          Logout
        </motion.button>
      </div>
    </nav>
  )
}

export default Navbar
