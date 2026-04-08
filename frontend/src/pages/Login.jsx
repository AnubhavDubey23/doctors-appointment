import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'

const Login = () => {
  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Sign Up') {
      const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        toast.error(data.message)
      }
    } else {
      const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        toast.error(data.message)
      }
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  const isSignUp = state === 'Sign Up'

  return (
    <div className='min-h-[90vh] flex items-center justify-center px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-md'
      >
        {/* Card Container */}
        <div className='bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden'>
          
          {/* Header */}
          <div className='bg-gradient-to-r from-primary via-secondary to-accent p-8 text-white relative overflow-hidden'>
            <motion.div
              animate={{ float: [0, 20, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className='absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl'
            ></motion.div>
            
            <div className='relative z-10'>
              <h1 className='text-3xl font-bold mb-2 text-balance'>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className='text-white/90'>
                {isSignUp ? 'Join our community and book your first appointment' : 'Login to book your next appointment'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className='p-8 space-y-6'>
            {/* Name Field - Only for Sign Up */}
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <label className='block text-text-primary font-medium mb-2 text-sm'>Full Name</label>
                <div className='relative'>
                  <User className='absolute left-3 top-3.5 w-5 h-5 text-text-secondary' />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary'
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </motion.div>
            )}

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: isSignUp ? 0.1 : 0 }}
            >
              <label className='block text-text-primary font-medium mb-2 text-sm'>Email Address</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3.5 w-5 h-5 text-text-secondary' />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary'
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: isSignUp ? 0.2 : 0.1 }}
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

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              className='w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group'
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
              <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
            </motion.button>

            {/* Toggle Sign Up / Login */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: isSignUp ? 0.3 : 0.2 }}
              className='text-center pt-4 border-t border-gray-100'
            >
              {isSignUp ? (
                <p className='text-text-secondary text-sm'>
                  Already have an account?{' '}
                  <button
                    type='button'
                    onClick={() => setState('Login')}
                    className='text-primary font-semibold hover:underline transition-all'
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p className='text-text-secondary text-sm'>
                  Don&apos;t have an account?{' '}
                  <button
                    type='button'
                    onClick={() => setState('Sign Up')}
                    className='text-primary font-semibold hover:underline transition-all'
                  >
                    Create One
                  </button>
                </p>
              )}
            </motion.div>
          </form>
        </div>

        {/* Additional Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='text-center text-text-secondary text-xs mt-6'
        >
          By {isSignUp ? 'creating an account' : 'signing in'}, you agree to our Terms and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  )
}

export default Login
