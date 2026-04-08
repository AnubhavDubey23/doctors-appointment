import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const SpecialityMenu = () => {
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
            id='speciality'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='flex flex-col items-center gap-8 py-20 px-4'
        >
            <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                className='text-center'
            >
                <h1 className='text-4xl md:text-5xl font-bold text-text-primary mb-4 text-balance'>
                    Find by Speciality
                </h1>
                <p className='text-text-secondary max-w-2xl mx-auto text-lg leading-relaxed'>
                    Browse our network of trusted specialists and find the perfect doctor for your healthcare needs.
                </p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                className='flex justify-center flex-wrap gap-6 w-full pt-4'
            >
                {specialityData.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -8, scale: 1.05 }}
                    >
                        <Link
                            to={`/doctors/${item.speciality}`}
                            onClick={() => window.scrollTo(0, 0)}
                            className='flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border border-primary/20 transition-all duration-300 group cursor-pointer flex-shrink-0'
                        >
                            <div className='w-20 h-20 md:w-28 md:h-28 flex items-center justify-center rounded-xl bg-white group-hover:bg-primary/5 transition-colors mb-3 group-hover:scale-110 duration-300'>
                                <img
                                    className='w-12 md:w-16 h-12 md:h-16 object-contain'
                                    src={item.image}
                                    alt={item.speciality}
                                />
                            </div>
                            <p className='text-text-primary font-semibold text-sm md:text-base group-hover:text-primary transition-colors'>
                                {item.speciality}
                            </p>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}

export default SpecialityMenu
