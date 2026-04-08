import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { Mail, Lock, Shield, Stethoscope } from 'lucide-react'

const Login = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Admin') {
      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
      if (data.success) {
        setAToken(data.token)
        localStorage.setItem('aToken', data.token)
      } else {
        toast.error(data.message)
      }
    } else {
      const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
      if (data.success) {
        setDToken(data.token)
        localStorage.setItem('dToken', data.token)
      } else {
        toast.error(data.message)
      }
    }
  }

  const isAdmin = state === 'Admin'

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-gray-100 px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-md'
      >
        {/* Card */}
        <div className='bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden'>
          
          {/* Header */}
          <div className='bg-gradient-to-r from-primary via-secondary to-accent p-8 text-white relative overflow-hidden'>
            <motion.div
              animate={{ float: [0, 20, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className='absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl'
            ></motion.div>
            
            <div className='relative z-10 flex items-center gap-3 mb-2'>
              {isAdmin ? (
                <Shield className='w-8 h-8' />
              ) : (
                <Stethoscope className='w-8 h-8' />
              )}
              <h1 className='text-3xl font-bold'>
                {isAdmin ? 'Admin' : 'Doctor'} Portal
              </h1>
            </div>
            <p className='text-white/90'>Secure access to your dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className='p-8 space-y-6'>
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <label className='block text-text-primary font-medium mb-2 text-sm'>Email Address</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3.5 w-5 h-5 text-text-secondary' />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary'
                  type="email"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <label className='block text-text-primary font-medium mb-2 text-sm'>Password</label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3.5 w-5 h-5 text-text-secondary' />
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary'
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </motion.div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              className='w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-200'
            >
              Sign In
            </motion.button>

            {/* Toggle Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='pt-4 border-t border-gray-100'
            >
              <div className='flex gap-2'>
                {isAdmin ? (
                  <>
                    <p className='text-text-secondary text-sm'>Are you a doctor?</p>
                    <button
                      type='button'
                      onClick={() => setState('Doctor')}
                      className='text-primary font-semibold hover:underline transition-all'
                    >
                      Doctor Login
                    </button>
                  </>
                ) : (
                  <>
                    <p className='text-text-secondary text-sm'>Are you an admin?</p>
                    <button
                      type='button'
                      onClick={() => setState('Admin')}
                      className='text-primary font-semibold hover:underline transition-all'
                    >
                      Admin Login
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </form>

          {/* Security Badge */}
          <div className='px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2'>
            <Shield className='w-4 h-4 text-primary' />
            <p className='text-text-secondary text-xs'>Your data is encrypted and secure</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
