import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { motion } from 'framer-motion'
import { Users, Calendar, User, X, Check } from 'lucide-react'

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const statCards = [
    {
      icon: Users,
      label: 'Doctors',
      value: dashData?.doctors || 0,
      color: 'from-primary to-secondary',
    },
    {
      icon: Calendar,
      label: 'Appointments',
      value: dashData?.appointments || 0,
      color: 'from-secondary to-accent',
    },
    {
      icon: User,
      label: 'Patients',
      value: dashData?.patients || 0,
      color: 'from-accent to-primary',
    },
  ]

  return dashData && (
    <div className='px-4 md:px-8 py-8'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='mb-8'
      >
        <h1 className='text-4xl font-bold text-text-primary mb-2'>Dashboard</h1>
        <p className='text-text-secondary'>Welcome back to your admin panel</p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all`}
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-white/80 text-sm font-medium mb-2'>{stat.label}</p>
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className='text-4xl font-bold'
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className='w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center'
                >
                  <Icon className='w-8 h-8' />
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Latest Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden'
      >
        <div className='flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white'>
          <Calendar className='w-5 h-5 text-primary' />
          <h2 className='text-xl font-bold text-text-primary'>Latest Appointments</h2>
        </div>

        <div className='divide-y divide-gray-100'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className='flex items-center px-6 py-4 hover:bg-gray-50 transition-colors group'
            >
              {/* Doctor Image */}
              <div className='w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20 flex-shrink-0 mr-4'>
                <img
                  className='w-full h-full object-cover'
                  src={item.docData.image}
                  alt={item.docData.name}
                />
              </div>

              {/* Info */}
              <div className='flex-1 min-w-0'>
                <p className='text-text-primary font-semibold group-hover:text-primary transition-colors'>
                  {item.docData.name}
                </p>
                <p className='text-text-secondary text-sm'>
                  Booking on {slotDateFormat(item.slotDate)}
                </p>
              </div>

              {/* Status Badge */}
              <div className='flex-shrink-0 ml-4'>
                {item.cancelled ? (
                  <span className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-danger/10 text-danger rounded-full text-xs font-medium'>
                    <X className='w-3 h-3' />
                    Cancelled
                  </span>
                ) : item.isCompleted ? (
                  <span className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-success/10 text-success rounded-full text-xs font-medium'>
                    <Check className='w-3 h-3' />
                    Completed
                  </span>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => cancelAppointment(item._id)}
                    className='p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors group/btn'
                    title='Cancel appointment'
                  >
                    <X className='w-5 h-5' />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
