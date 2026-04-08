import React from 'react'
import { assets } from '../assets/assets'
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='bg-gradient-to-b from-card-bg to-background border-t border-gray-100 mt-40'>
      <div className='max-w-7xl mx-auto px-4 md:px-10 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 mb-12'>
          {/* Brand Section */}
          <div>
            <img className='mb-6 w-40 hover:opacity-80 transition-opacity' src={assets.logo} alt="Prescripto" />
            <p className='text-text-secondary leading-7'>
              Your trusted healthcare partner. Book appointments with experienced doctors and take control of your health journey.
            </p>
            <div className='flex gap-4 mt-6'>
              <a href="#" className='text-primary hover:text-secondary transition-colors p-2 hover:bg-primary/10 rounded-lg'>
                <Facebook className='w-5 h-5' />
              </a>
              <a href="#" className='text-primary hover:text-secondary transition-colors p-2 hover:bg-primary/10 rounded-lg'>
                <Twitter className='w-5 h-5' />
              </a>
              <a href="#" className='text-primary hover:text-secondary transition-colors p-2 hover:bg-primary/10 rounded-lg'>
                <Linkedin className='w-5 h-5' />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-lg font-semibold text-text-primary mb-6 flex items-center gap-2'>
              <div className='w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full'></div>
              Quick Links
            </h3>
            <ul className='flex flex-col gap-3'>
              <li><a href="/" className='text-text-secondary hover:text-primary transition-colors hover:translate-x-1 inline-block'>Home</a></li>
              <li><a href="/about" className='text-text-secondary hover:text-primary transition-colors hover:translate-x-1 inline-block'>About us</a></li>
              <li><a href="/doctors" className='text-text-secondary hover:text-primary transition-colors hover:translate-x-1 inline-block'>Find Doctors</a></li>
              <li><a href="#" className='text-text-secondary hover:text-primary transition-colors hover:translate-x-1 inline-block'>Privacy Policy</a></li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className='text-lg font-semibold text-text-primary mb-6 flex items-center gap-2'>
              <div className='w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full'></div>
              Get in Touch
            </h3>
            <ul className='flex flex-col gap-4'>
              <li className='flex items-center gap-2 text-text-secondary hover:text-primary transition-colors'>
                <Phone className='w-5 h-5 text-primary' />
                <span>+1-212-456-7890</span>
              </li>
              <li className='flex items-center gap-2 text-text-secondary hover:text-primary transition-colors cursor-pointer'>
                <Mail className='w-5 h-5 text-primary' />
                <span>hello@prescripto.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-gray-200'></div>

        {/* Copyright */}
        <div className='py-8 text-center'>
          <p className='text-text-secondary text-sm'>
            © 2024 Prescripto. All rights reserved. Built with care for your health.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

// Fix import
const Phone = ({ className }) => (
  <svg className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
  </svg>
)
