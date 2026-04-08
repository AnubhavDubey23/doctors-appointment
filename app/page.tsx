"use client"

import { useState } from "react"
import { Calendar, Users, Star, MessageCircle, Video, FileText, Bell, Shield } from "lucide-react"

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Easy Appointment Booking",
      description: "Book appointments with top doctors in just a few clicks",
      color: "bg-blue-500",
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Telemedicine Consultations",
      description: "Connect with doctors via secure video calls from anywhere",
      color: "bg-green-500",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Real-time Chat",
      description: "Instant messaging with healthcare providers",
      color: "bg-purple-500",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Medical Records",
      description: "Secure digital storage of your health information",
      color: "bg-orange-500",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Notifications",
      description: "Never miss an appointment with automated reminders",
      color: "bg-red-500",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Reviews & Ratings",
      description: "Rate and review doctors to help others make informed choices",
      color: "bg-yellow-500",
    },
  ]

  const stats = [
    { number: "10,000+", label: "Happy Patients" },
    { number: "500+", label: "Expert Doctors" },
    { number: "50+", label: "Specialties" },
    { number: "24/7", label: "Support" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">HealthCare Pro</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="https://main.d254ex9ucnrxen.amplifyapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Patient Portal
              </a>
              <a
                href="https://main.dbxrmz4cah3xb.amplifyapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Admin Panel
              </a>
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                About
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Your Health, Our Priority</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience the future of healthcare with our comprehensive doctor appointment system. Book appointments,
              consult via video, manage records, and more - all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://main.d254ex9ucnrxen.amplifyapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block text-center"
              >
                Book Appointment Now
              </a>
              <a
                href="https://main.d254ex9ucnrxen.amplifyapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors inline-block text-center"
              >
                View Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Healthcare Solutions</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform offers everything you need for modern healthcare management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setActiveFeature(index)}
              >
                <div
                  className={`${feature.color} w-16 h-16 rounded-lg flex items-center justify-center text-white mb-6`}
                >
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Links Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Access Your Portal</h3>
            <p className="text-lg text-gray-600">Choose your role to access the appropriate dashboard</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Patient Portal */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <Users className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">Patient Portal</h4>
              <p className="text-gray-600 mb-6">
                Book appointments, chat with doctors, manage your medical records, and access telemedicine services.
              </p>
              <a
                href="https://main.d254ex9ucnrxen.amplifyapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
              >
                Open Patient Portal
              </a>
            </div>

            {/* Admin Panel */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <Shield className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h4 className="text-2xl font-semibold text-gray-900 mb-4">Admin Panel</h4>
              <p className="text-gray-600 mb-6">
                Manage doctors, view analytics, handle appointments, and oversee the entire healthcare system.
              </p>
              <a
                href="https://main.dbxrmz4cah3xb.amplifyapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block"
              >
                Open Admin Panel
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Built with Modern Technology</h3>
            <p className="text-lg text-gray-600">
              Powered by cutting-edge technologies for optimal performance and security
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              "React",
              "Node.js",
              "MongoDB",
              "Express",
              "Socket.io",
              "WebRTC",
              "Stripe",
              "Cloudinary",
              "Twilio",
              "JWT",
              "Bcrypt",
              "Multer",
            ].map((tech, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-2">
                  <span className="text-sm font-medium text-gray-700">{tech}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-blue-400 mr-2" />
                <span className="text-xl font-bold">HealthCare Pro</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing healthcare with technology-driven solutions for better patient care.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Appointment Booking</li>
                <li>Telemedicine</li>
                <li>Medical Records</li>
                <li>Real-time Chat</li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Contact</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@healthcarepro.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Health St, Medical City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HealthCare Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
