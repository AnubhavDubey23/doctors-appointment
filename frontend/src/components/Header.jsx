import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { ArrowDown, Users } from 'lucide-react'

const Header = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className='flex flex-col md:flex-row gap-8 bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl overflow-hidden px-6 md:px-10 lg:px-20 py-10 md:py-0 relative'
        >
            {/* Animated Background Elements */}
            <motion.div
                animate={{ float: [0, 30, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
                className='absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl'
            ></motion.div>

            {/* --------- Header Left --------- */}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-6 py-8 md:py-[8vw] relative z-10'>
                <motion.div variants={itemVariants}>
                    <p className='text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight text-balance'>
                        Book Appointment With Trusted Doctors
                    </p>
                </motion.div>

                <motion.div variants={itemVariants} className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                    <div className='flex -space-x-2'>
                        <img
                            className='w-10 h-10 rounded-full border-2 border-white object-cover'
                            src={assets.group_profiles || "/placeholder.svg"}
                            alt="Patient reviews"
                        />
                    </div>
                    <p className='text-white/90 text-sm md:text-base leading-relaxed'>
                        Join thousands of satisfied patients. Browse our network of experienced doctors and book your appointment in minutes.
                    </p>
                </motion.div>

                <motion.a
                    variants={itemVariants}
                    href='#speciality'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3 rounded-full hover:shadow-lg transition-all group'
                >
                    Book appointment
                    <ArrowDown className='w-4 h-4 group-hover:translate-y-1 transition-transform' />
                </motion.a>
            </div>

            {/* --------- Header Right --------- */}
            <motion.div
                variants={itemVariants}
                className='md:w-1/2 relative flex items-center justify-center md:justify-end'
            >
                <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className='w-full md:w-auto h-auto max-w-md rounded-xl object-cover drop-shadow-2xl'
                    src={assets.header_img}
                    alt="Healthcare professional with patient"
                />
            </motion.div>
        </motion.div>
    )
}

export default Header
