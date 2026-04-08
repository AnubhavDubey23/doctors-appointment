import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Briefcase, ExternalLink } from 'lucide-react'

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Office',
      details: ['54709 Willms Station', 'Suite 350, Washington, USA'],
      color: 'from-primary to-secondary',
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['+1 (415) 555-0132', 'Available 24/7'],
      color: 'from-secondary to-accent',
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['hello@prescripto.com', 'We respond within 24 hours'],
      color: 'from-accent to-primary',
    },
  ]

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
          Get in <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary'>Touch</span>
        </h1>
        <p className='text-text-secondary text-lg max-w-2xl mx-auto'>
          Have questions? We&apos;d love to hear from you. Send us a message anytime!
        </p>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className='my-16 flex flex-col md:flex-row gap-12 items-center'
      >
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className='md:flex-shrink-0'
        >
          <img
            className='w-full md:max-w-[400px] rounded-2xl shadow-lg border border-primary/10 object-cover'
            src={assets.contact_image}
            alt="Contact us"
          />
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delayChildren: 0.1 }}
          className='flex-1 grid grid-cols-1 gap-6'
        >
          {contactInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className='bg-white rounded-2xl p-6 border border-gray-100 shadow-soft hover:shadow-medium transition-all'
              >
                <div className='flex items-start gap-4'>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${info.color} text-white flex-shrink-0`}>
                    <Icon className='w-6 h-6' />
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold text-text-primary mb-2'>
                      {info.title}
                    </h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className='text-text-secondary text-sm mb-1'>
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Careers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 border border-primary/20 mt-20 mb-20'
      >
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
          <div>
            <div className='flex items-center gap-3 mb-3'>
              <div className='w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center'>
                <Briefcase className='w-6 h-6' />
              </div>
              <h3 className='text-2xl font-bold text-text-primary'>
                Join Our Team
              </h3>
            </div>
            <p className='text-text-secondary text-lg max-w-2xl'>
              Be part of a mission to transform healthcare. Explore exciting career opportunities and grow with us.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-semibold px-8 py-3 rounded-full hover:shadow-lg transition-all whitespace-nowrap flex-shrink-0'
          >
            Explore Jobs
            <ExternalLink className='w-4 h-4' />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default Contact
