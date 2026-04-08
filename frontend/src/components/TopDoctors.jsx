import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const TopDoctors = () => {
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

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
            transition: { duration: 0.4 },
        },
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='flex flex-col items-center gap-8 my-20 px-4 md:mx-10'
        >
            <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                className='text-center'
            >
                <h1 className='text-4xl md:text-5xl font-bold text-text-primary mb-4 text-balance'>
                    Top Doctors to Book
                </h1>
                <p className='text-text-secondary max-w-2xl mx-auto text-lg'>
                    Meet our most-requested healthcare professionals, carefully selected for their expertise and patient care.
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                className='w-full grid grid-cols-auto gap-6 pt-8'
            >
                {doctors.slice(0, 10).map((item, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -8 }}
                        onClick={() => {
                            navigate(`/appointment/${item._id}`)
                            window.scrollTo(0, 0)
                        }}
                        className='bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 group'
                    >
                        {/* Image Container */}
                        <div className='relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 aspect-square'>
                            <img
                                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                                src={item.image}
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
                        <div className='p-5'>
                            <h3 className='text-lg font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors'>
                                {item.name}
                            </h3>
                            <p className='text-sm text-text-secondary mb-4 font-medium'>
                                {item.speciality}
                            </p>
                            <p className='text-primary font-bold text-lg'>
                                ₹{item.fees} <span className='text-text-secondary text-sm font-normal'>per session</span>
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                    navigate('/doctors')
                    window.scrollTo(0, 0)
                }}
                className='mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-8 py-3 rounded-full hover:shadow-lg transition-all group'
            >
                View all doctors
                <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
            </motion.button>
        </motion.div>
    )
}

export default TopDoctors
