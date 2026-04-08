import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { Award, Heart, Users } from 'lucide-react'

const About = () => {
  const benefits = [
    {
      icon: Award,
      title: 'EFFICIENCY',
      description: 'Streamlined appointment scheduling that fits into your busy lifestyle.',
    },
    {
      icon: Heart,
      title: 'CONVENIENCE',
      description: 'Access to a network of trusted healthcare professionals in your area.',
    },
    {
      icon: Users,
      title: 'PERSONALIZATION',
      description: 'Tailored recommendations and reminders to help you stay on top of your health.',
    },
  ]

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
    <div className='px-4 md:px-10'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center py-12 md:py-16'
      >
        <h1 className='text-4xl md:text-5xl font-bold text-text-primary mb-4'>
          About <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary'>Us</span>
        </h1>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className='my-16 flex flex-col md:flex-row gap-12 items-center'
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className='md:flex-shrink-0'
        >
          <img
            className='w-full md:max-w-[400px] rounded-2xl shadow-lg border border-primary/10'
            src={assets.about_image}
            alt="Prescripto team"
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className='flex flex-col justify-center gap-6 md:flex-1'
        >
          <motion.p variants={itemVariants} className='text-lg text-text-secondary leading-relaxed'>
            Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. We understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
          </motion.p>
          <motion.p variants={itemVariants} className='text-lg text-text-secondary leading-relaxed'>
            Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you&apos;re booking your first appointment or managing ongoing care, we&apos;re here to support you.
          </motion.p>
          <motion.div variants={itemVariants} className='pt-4 border-l-4 border-primary pl-6'>
            <h3 className='text-2xl font-bold text-text-primary mb-2'>Our Vision</h3>
            <p className='text-text-secondary leading-relaxed'>
              To create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className='my-20'
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-center mb-12'
        >
          <h2 className='text-4xl font-bold text-text-primary mb-4'>
            Why <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary'>Choose Us</span>
          </h2>
          <p className='text-text-secondary text-lg max-w-2xl mx-auto'>
            We deliver excellence in every aspect of healthcare management
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-20'
        >
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className='bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group'
              >
                <div className='flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r from-primary to-secondary text-white group-hover:scale-110 transition-transform mb-4'>
                  <IconComponent className='w-7 h-7' />
                </div>
                <h3 className='text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors'>
                  {benefit.title}
                </h3>
                <p className='text-text-secondary leading-relaxed'>
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default About
