import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const Banner = () => {
    const navigate = useNavigate()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='relative flex items-center overflow-hidden rounded-2xl my-20 mx-4 md:mx-10'
        >
            {/* Gradient Background */}
            <div className='absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-90'></div>
            
            {/* Animated Background Elements */}
            <motion.div
                animate={{ float: [0, 20, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className='absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl'
            ></motion.div>
            <motion.div
                animate={{ float: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                className='absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl'
            ></motion.div>

            {/* Content */}
            <div className='relative z-10 flex flex-1 flex-col md:flex-row items-center py-12 md:py-20 px-6 md:px-14'>
                {/* Left Side */}
                <div className='flex-1 md:pr-8'>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight'
                    >
                        <p className='text-pretty'>Book Appointment</p>
                        <p className='mt-2 text-white/90'>With 100+ Trusted Doctors</p>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            navigate('/login')
                            window.scrollTo(0, 0)
                        }}
                        className='mt-8 inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3 rounded-full hover:shadow-lg transition-all group'
                    >
                        Create account
                        <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                    </motion.button>
                </div>

                {/* Right Side Image */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className='hidden md:block md:w-1/2 lg:w-[370px] relative'
                >
                    <img
                        className='w-full max-w-md drop-shadow-2xl'
                        src={assets.appointment_img}
                        alt="Appointment booking illustration"
                    />
                </motion.div>
            </div>
        </motion.div>
    )
}

export default Banner
