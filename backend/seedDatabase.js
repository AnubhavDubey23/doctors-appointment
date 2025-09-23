import mongoose from "mongoose"
import bcrypt from "bcrypt"
import "dotenv/config"
import connectDB from "./config/mongodb.js"
import userModel from "./models/userModel.js"
import doctorModel from "./models/doctorModel.js"
import appointmentModel from "./models/appointmentModel.js"
import chatModel from "./models/chatModel.js"
import medicalRecordModel from "./models/medicalRecordModel.js"
import reviewModel from "./models/reviewModel.js"
import notificationModel from "./models/notificationModel.js"
import videoCallModel from "./models/videoCallModel.js"

// Connect to database
await connectDB()

// Helper function to hash passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

// Helper function to get random date
const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Helper function to get random element from array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)]

const seedDatabase = async () => {
  try {
    console.log("🗑️  Clearing existing data...")
    
    // Clear existing data
    await userModel.deleteMany({})
    await doctorModel.deleteMany({})
    await appointmentModel.deleteMany({})
    await chatModel.deleteMany({})
    await medicalRecordModel.deleteMany({})
    await reviewModel.deleteMany({})
    await notificationModel.deleteMany({})
    await videoCallModel.deleteMany({})

    console.log("👥 Creating test users...")

    // Create 15 test users
    const users = []
    const userNames = [
      "John Smith", "Emma Johnson", "Michael Brown", "Sarah Davis", "David Wilson",
      "Lisa Anderson", "James Taylor", "Jennifer Martinez", "Robert Garcia", "Maria Rodriguez",
      "William Lee", "Ashley Thompson", "Christopher White", "Amanda Clark", "Daniel Lewis"
    ]

    for (let i = 0; i < 15; i++) {
      const hashedPassword = await hashPassword("password123")
      const user = new userModel({
        name: userNames[i],
        email: `user${i + 1}@example.com`,
        password: hashedPassword,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        address: {
          line1: `${Math.floor(Math.random() * 999) + 1} ${getRandomElement(['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Cedar Ln'])}`,
          line2: `${getRandomElement(['Apt 101', 'Suite 200', 'Unit 5', 'Floor 3', 'Building A'])}`
        },
        gender: getRandomElement(['Male', 'Female']),
        dob: getRandomDate(new Date(1970, 0, 1), new Date(2000, 11, 31)).toISOString().split('T')[0],
        image: `https://images.pexels.com/photos/${getRandomElement([1239291, 1222271, 1181686, 1181690, 1181391])}/pexels-photo-${getRandomElement([1239291, 1222271, 1181686, 1181690, 1181391])}.jpeg?auto=compress&cs=tinysrgb&w=400`
      })
      await user.save()
      users.push(user)
    }

    console.log("👨‍⚕️ Creating test doctors...")

    // Create 12 test doctors
    const doctors = []
    const doctorData = [
      {
        name: "Dr. Sarah Wilson",
        email: "sarah.wilson@hospital.com",
        speciality: "General physician",
        degree: "MBBS, MD Internal Medicine",
        experience: "8 Years",
        about: "Dr. Wilson is a dedicated general physician with extensive experience in preventive care and chronic disease management. She believes in building strong doctor-patient relationships.",
        fees: 75,
        image: "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Dr. Michael Chen",
        email: "michael.chen@hospital.com",
        speciality: "Cardiologist",
        degree: "MBBS, MD Cardiology",
        experience: "12 Years",
        about: "Specialist in cardiovascular diseases with expertise in interventional cardiology and heart failure management. Published researcher in cardiac care.",
        fees: 150,
        image: "https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Dr. Emily Rodriguez",
        email: "emily.rodriguez@hospital.com",
        speciality: "Gynecologist",
        degree: "MBBS, MS Obstetrics & Gynecology",
        experience: "10 Years",
        about: "Experienced gynecologist specializing in women's health, prenatal care, and minimally invasive surgical procedures.",
        fees: 120,
        image: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Dr. James Thompson",
        email: "james.thompson@hospital.com",
        speciality: "Dermatologist",
        degree: "MBBS, MD Dermatology",
        experience: "7 Years",
        about: "Board-certified dermatologist with expertise in medical and cosmetic dermatology, skin cancer screening, and advanced laser treatments.",
        fees: 100,
        image: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Dr. Lisa Park",
        email: "lisa.park@hospital.com",
        speciality: "Pediatricians",
        degree: "MBBS, MD Pediatrics",
        experience: "9 Years",
        about: "Compassionate pediatrician dedicated to providing comprehensive healthcare for children from infancy through adolescence.",
        fees: 90,
        image: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Dr. Robert Kumar",
        email: "robert.kumar@hospital.com",
        speciality: "Neurologist",
        degree: "MBBS, DM Neurology",
        experience: "15 Years",
        about: "Leading neurologist specializing in stroke care, epilepsy management, and neurodegenerative diseases with cutting-edge treatment approaches.",
        fees: 180,
        image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Dr. Amanda Foster",
        email: "amanda.foster@hospital.com",
        speciality: "Gastroenterologist",
        degree: "MBBS, DM Gastroenterology",
        experience: "11 Years",
        about: "Expert gastroenterologist with specialization in digestive disorders, liver diseases, and advanced endoscopic procedures.",
        fees: 140,
        image: "https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Dr. Kevin Martinez",
        email: "kevin.martinez@hospital.com",
        speciality: "General physician",
        degree: "MBBS, MD Family Medicine",
        experience: "6 Years",
        about: "Family medicine physician focused on comprehensive primary care, health promotion, and disease prevention for patients of all ages.",
        fees: 80,
        image: "https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Dr. Rachel Green",
        email: "rachel.green@hospital.com",
        speciality: "Dermatologist",
        degree: "MBBS, MD Dermatology, Fellowship in Mohs Surgery",
        experience: "13 Years",
        about: "Advanced dermatologist and Mohs surgeon specializing in skin cancer treatment, dermatopathology, and reconstructive surgery.",
        fees: 160,
        image: "https://images.pexels.com/photos/5452290/pexels-photo-5452290.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Dr. Thomas Anderson",
        email: "thomas.anderson@hospital.com",
        speciality: "Pediatricians",
        degree: "MBBS, MD Pediatrics, Fellowship in Pediatric Cardiology",
        experience: "14 Years",
        about: "Pediatric cardiologist with expertise in congenital heart diseases, pediatric interventional cardiology, and heart failure in children.",
        fees: 170,
        image: "https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Dr. Michelle Wong",
        email: "michelle.wong@hospital.com",
        speciality: "Neurologist",
        degree: "MBBS, DM Neurology, Fellowship in Movement Disorders",
        experience: "16 Years",
        about: "Movement disorders specialist with expertise in Parkinson's disease, dystonia, and deep brain stimulation procedures.",
        fees: 200,
        image: "https://images.pexels.com/photos/5452297/pexels-photo-5452297.jpeg?auto=compress&cs=tinysrgb&w=400"
      },
      {
        name: "Dr. Christopher Lee",
        email: "christopher.lee@hospital.com",
        speciality: "Gastroenterologist",
        degree: "MBBS, DM Gastroenterology, Fellowship in Hepatology",
        experience: "18 Years",
        about: "Hepatologist and gastroenterologist with extensive experience in liver diseases, inflammatory bowel disease, and therapeutic endoscopy.",
        fees: 190,
        image: "https://images.pexels.com/photos/5327532/pexels-photo-5327532.jpeg?auto=compress&cs=tinysrgb&w=400"
      }
    ]

    for (let i = 0; i < doctorData.length; i++) {
      const hashedPassword = await hashPassword("doctor123")
      const doctor = new doctorModel({
        ...doctorData[i],
        password: hashedPassword,
        address: {
          line1: `${Math.floor(Math.random() * 999) + 1} Medical Center Dr`,
          line2: `Suite ${Math.floor(Math.random() * 500) + 100}`
        },
        available: Math.random() > 0.2, // 80% available
        slots_booked: {},
        date: Date.now(),
        averageRating: Math.random() * 2 + 3, // 3-5 rating
        totalReviews: Math.floor(Math.random() * 50) + 5
      })
      await doctor.save()
      doctors.push(doctor)
    }

    console.log("📅 Creating test appointments...")

    // Create 25 appointments with various statuses
    const appointments = []
    const appointmentStatuses = [
      { cancelled: false, isCompleted: false, payment: false }, // Pending
      { cancelled: false, isCompleted: false, payment: true },  // Paid
      { cancelled: false, isCompleted: true, payment: true },   // Completed
      { cancelled: true, isCompleted: false, payment: false }   // Cancelled
    ]

    const timeSlots = ["09:00 am", "10:00 am", "11:00 am", "02:00 pm", "03:00 pm", "04:00 pm", "05:00 pm"]

    for (let i = 0; i < 25; i++) {
      const user = getRandomElement(users)
      const doctor = getRandomElement(doctors)
      const status = getRandomElement(appointmentStatuses)
      const appointmentDate = getRandomDate(new Date(2024, 0, 1), new Date(2024, 11, 31))
      
      const appointment = new appointmentModel({
        userId: user._id.toString(),
        docId: doctor._id.toString(),
        slotDate: `${appointmentDate.getDate()}_${appointmentDate.getMonth() + 1}_${appointmentDate.getFullYear()}`,
        slotTime: getRandomElement(timeSlots),
        userData: {
          name: user.name,
          email: user.email,
          image: user.image,
          phone: user.phone,
          address: user.address,
          gender: user.gender,
          dob: user.dob
        },
        docData: {
          name: doctor.name,
          email: doctor.email,
          image: doctor.image,
          speciality: doctor.speciality,
          degree: doctor.degree,
          experience: doctor.experience,
          about: doctor.about,
          fees: doctor.fees,
          address: doctor.address
        },
        amount: doctor.fees,
        date: appointmentDate.getTime(),
        ...status
      })
      await appointment.save()
      appointments.push(appointment)
    }

    console.log("💬 Creating test chats...")

    // Create 10 chat conversations
    const chats = []
    for (let i = 0; i < 10; i++) {
      const user = getRandomElement(users)
      const doctor = getRandomElement(doctors)
      const appointment = appointments.find(apt => 
        apt.userId === user._id.toString() && apt.docId === doctor._id.toString()
      ) || getRandomElement(appointments)

      const messages = []
      const messageCount = Math.floor(Math.random() * 8) + 2 // 2-10 messages

      for (let j = 0; j < messageCount; j++) {
        const isUserMessage = j % 2 === 0
        const messageTexts = isUserMessage ? [
          "Hello Doctor, I have some questions about my appointment",
          "I'm experiencing some symptoms, could you help?",
          "Thank you for the consultation",
          "When should I take the prescribed medication?",
          "I'm feeling much better now",
          "Do I need to schedule a follow-up?",
          "What are the side effects of this medicine?",
          "Can I exercise with this condition?"
        ] : [
          "Hello! I'm here to help you with your concerns",
          "Please describe your symptoms in detail",
          "Based on your condition, I recommend the following",
          "Take the medication twice daily with food",
          "That's great to hear! Keep following the treatment plan",
          "Yes, let's schedule a follow-up in 2 weeks",
          "The side effects are generally mild and temporary",
          "Light exercise is fine, but avoid strenuous activities"
        ]

        messages.push({
          senderId: isUserMessage ? user._id : doctor._id,
          senderType: isUserMessage ? "user" : "doctor",
          message: getRandomElement(messageTexts),
          timestamp: getRandomDate(new Date(2024, 0, 1), new Date()),
          isRead: Math.random() > 0.3 // 70% read
        })
      }

      const chat = new chatModel({
        userId: user._id,
        doctorId: doctor._id,
        appointmentId: appointment._id,
        messages,
        lastMessage: messages[messages.length - 1].message,
        lastMessageTime: messages[messages.length - 1].timestamp,
        isActive: true
      })
      await chat.save()
      chats.push(chat)
    }

    console.log("🏥 Creating medical records...")

    // Create medical records for 10 users
    const conditions = [
      "Hypertension", "Diabetes Type 2", "Asthma", "Arthritis", "Migraine",
      "Anxiety", "Depression", "High Cholesterol", "Thyroid Disorder", "Allergic Rhinitis"
    ]

    const allergies = [
      { allergen: "Peanuts", reaction: "Hives and swelling", severity: "severe" },
      { allergen: "Penicillin", reaction: "Skin rash", severity: "moderate" },
      { allergen: "Dust mites", reaction: "Sneezing and congestion", severity: "mild" },
      { allergen: "Shellfish", reaction: "Digestive issues", severity: "moderate" },
      { allergen: "Latex", reaction: "Contact dermatitis", severity: "mild" }
    ]

    const medications = [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      { name: "Albuterol", dosage: "90mcg", frequency: "As needed" },
      { name: "Ibuprofen", dosage: "400mg", frequency: "Three times daily" },
      { name: "Levothyroxine", dosage: "50mcg", frequency: "Once daily morning" }
    ]

    for (let i = 0; i < 10; i++) {
      const user = users[i]
      const doctor = getRandomElement(doctors)

      const medicalRecord = new medicalRecordModel({
        userId: user._id,
        bloodType: getRandomElement(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
        emergencyContact: {
          name: `${user.name.split(' ')[0]} Emergency Contact`,
          relationship: getRandomElement(["Spouse", "Parent", "Sibling", "Friend"]),
          phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
        },
        medicalConditions: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
          condition: getRandomElement(conditions),
          diagnosedDate: getRandomDate(new Date(2020, 0, 1), new Date()),
          status: getRandomElement(["active", "resolved", "chronic"]),
          diagnosedBy: doctor._id,
          severity: getRandomElement(["mild", "moderate", "severe"]),
          notes: "Patient responding well to treatment"
        })),
        allergies: Array.from({ length: Math.floor(Math.random() * 3) }, () => {
          const allergy = getRandomElement(allergies)
          return {
            ...allergy,
            diagnosedDate: getRandomDate(new Date(2020, 0, 1), new Date()),
            notes: "Confirmed through allergy testing"
          }
        }),
        prescriptions: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => {
          const med = getRandomElement(medications)
          return {
            medication: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            duration: `${Math.floor(Math.random() * 30) + 7} days`,
            instructions: "Take with food",
            prescribedBy: doctor._id,
            prescribedAt: getRandomDate(new Date(2024, 0, 1), new Date()),
            status: getRandomElement(["active", "completed"])
          }
        }),
        vitalSigns: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
          bloodPressure: {
            systolic: Math.floor(Math.random() * 40) + 110,
            diastolic: Math.floor(Math.random() * 20) + 70
          },
          heartRate: Math.floor(Math.random() * 40) + 60,
          temperature: Math.random() * 2 + 97,
          weight: Math.floor(Math.random() * 50) + 50,
          height: Math.floor(Math.random() * 30) + 150,
          oxygenSaturation: Math.floor(Math.random() * 5) + 95,
          recordedAt: getRandomDate(new Date(2024, 0, 1), new Date()),
          recordedBy: doctor._id
        })),
        consultationNotes: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
          doctorId: doctor._id,
          appointmentId: getRandomElement(appointments)._id,
          date: getRandomDate(new Date(2024, 0, 1), new Date()),
          chiefComplaint: getRandomElement([
            "Chest pain and shortness of breath",
            "Persistent headaches",
            "Abdominal pain and nausea",
            "Joint pain and stiffness",
            "Skin rash and itching"
          ]),
          diagnosis: getRandomElement([
            "Hypertension with cardiac involvement",
            "Tension headache",
            "Gastritis",
            "Osteoarthritis",
            "Contact dermatitis"
          ]),
          treatment: "Prescribed medication and lifestyle modifications",
          notes: "Patient advised to follow up in 2 weeks",
          followUpRequired: Math.random() > 0.5,
          followUpDate: getRandomDate(new Date(), new Date(2024, 11, 31))
        }))
      })

      await medicalRecord.save()
    }

    console.log("⭐ Creating test reviews...")

    // Create 20 reviews
    const reviewTexts = [
      "Excellent doctor! Very professional and caring. Explained everything clearly.",
      "Great experience. Doctor was punctual and thorough in examination.",
      "Highly recommend! The doctor listened to all my concerns patiently.",
      "Professional service. Clean facilities and friendly staff.",
      "Doctor was knowledgeable and provided effective treatment.",
      "Good consultation. Doctor explained the condition well.",
      "Very satisfied with the care received. Will visit again.",
      "Excellent bedside manner. Made me feel comfortable throughout.",
      "Quick and efficient service. Doctor was very helpful.",
      "Outstanding medical expertise. Solved my long-standing issue."
    ]

    for (let i = 0; i < 20; i++) {
      const completedAppointments = appointments.filter(apt => apt.isCompleted)
      if (completedAppointments.length === 0) continue

      const appointment = getRandomElement(completedAppointments)
      
      // Check if review already exists
      const existingReview = await reviewModel.findOne({
        patientId: appointment.userId,
        appointmentId: appointment._id
      })
      
      if (existingReview) continue

      const rating = Math.floor(Math.random() * 2) + 4 // 4-5 stars mostly
      
      const review = new reviewModel({
        patientId: appointment.userId,
        doctorId: appointment.docId,
        appointmentId: appointment._id,
        rating,
        reviewText: getRandomElement(reviewTexts),
        categories: {
          communication: Math.floor(Math.random() * 2) + 4,
          punctuality: Math.floor(Math.random() * 2) + 4,
          expertise: Math.floor(Math.random() * 2) + 4,
          facilities: Math.floor(Math.random() * 2) + 4
        },
        isAnonymous: Math.random() > 0.7, // 30% anonymous
        helpfulVotes: Math.floor(Math.random() * 10),
        status: "active"
      })

      // Add doctor response to some reviews
      if (Math.random() > 0.6) {
        review.doctorResponse = {
          text: "Thank you for your kind words! I'm glad I could help with your treatment.",
          respondedAt: getRandomDate(new Date(appointment.date), new Date())
        }
      }

      await review.save()
    }

    console.log("🔔 Creating test notifications...")

    // Create 30 notifications
    const notificationTypes = ["appointment", "reminder", "payment", "chat", "video_call", "medical_record", "system"]
    const priorities = ["low", "medium", "high", "urgent"]
    
    const notificationTemplates = {
      appointment: {
        title: "Appointment Confirmed",
        message: "Your appointment has been confirmed for {date} at {time}"
      },
      reminder: {
        title: "Appointment Reminder",
        message: "You have an appointment tomorrow at {time} with Dr. {doctor}"
      },
      payment: {
        title: "Payment Successful",
        message: "Your payment of ₹{amount} has been processed successfully"
      },
      chat: {
        title: "New Message",
        message: "You have a new message from Dr. {doctor}"
      },
      video_call: {
        title: "Video Call Scheduled",
        message: "Your video consultation is scheduled for {date} at {time}"
      },
      medical_record: {
        title: "Medical Record Updated",
        message: "Your medical record has been updated with new information"
      },
      system: {
        title: "System Maintenance",
        message: "Scheduled maintenance will occur tonight from 2 AM to 4 AM"
      }
    }

    for (let i = 0; i < 30; i++) {
      const user = getRandomElement(users)
      const doctor = getRandomElement(doctors)
      const type = getRandomElement(notificationTypes)
      const template = notificationTemplates[type]
      
      const notification = new notificationModel({
        userId: user._id.toString(),
        userType: "patient",
        title: template.title,
        message: template.message
          .replace("{date}", "Jan 15, 2024")
          .replace("{time}", getRandomElement(timeSlots))
          .replace("{doctor}", doctor.name)
          .replace("{amount}", doctor.fees),
        type,
        priority: getRandomElement(priorities),
        isRead: Math.random() > 0.4, // 60% read
        actionUrl: type === "appointment" ? "/my-appointments" : 
                  type === "chat" ? "/my-chats" : 
                  type === "medical_record" ? "/medical-records" : null,
        metadata: {
          doctorId: doctor._id,
          appointmentId: getRandomElement(appointments)._id
        },
        channels: ["in-app", "email"],
        status: "sent",
        sentAt: getRandomDate(new Date(2024, 0, 1), new Date())
      })
      await notification.save()
    }

    console.log("🎥 Creating test video calls...")

    // Create 8 video call records
    for (let i = 0; i < 8; i++) {
      const completedAppointment = getRandomElement(appointments.filter(apt => apt.isCompleted))
      if (!completedAppointment) continue

      const startTime = getRandomDate(new Date(2024, 0, 1), new Date())
      const endTime = new Date(startTime.getTime() + (Math.random() * 45 + 15) * 60000) // 15-60 min calls

      const videoCall = new videoCallModel({
        appointmentId: completedAppointment._id,
        userId: new mongoose.Types.ObjectId(completedAppointment.userId),
        doctorId: new mongoose.Types.ObjectId(completedAppointment.docId),
        roomId: `room_${Date.now()}_${i}`,
        status: "ended",
        startTime,
        endTime,
        duration: Math.floor((endTime - startTime) / (1000 * 60)),
        participants: [
          {
            userId: new mongoose.Types.ObjectId(completedAppointment.userId),
            userType: "user",
            joinedAt: startTime,
            leftAt: endTime
          },
          {
            userId: new mongoose.Types.ObjectId(completedAppointment.docId),
            userType: "doctor",
            joinedAt: new Date(startTime.getTime() + 30000), // Doctor joins 30s later
            leftAt: endTime
          }
        ],
        callNotes: getRandomElement([
          "Patient responded well to treatment recommendations",
          "Discussed medication adjustments and lifestyle changes",
          "Follow-up required in 2 weeks to monitor progress",
          "Patient education provided regarding condition management",
          "Prescription updated based on current symptoms"
        ]),
        prescription: getRandomElement([
          "Continue current medication for 2 more weeks",
          "Increase dosage to twice daily, monitor for side effects",
          "New prescription: Take with food, avoid alcohol",
          "Reduce dosage gradually over next month",
          "Add vitamin D supplement to current regimen"
        ]),
        followUpRequired: Math.random() > 0.5
      })
      await videoCall.save()
    }

    // Update doctor ratings based on reviews
    console.log("📊 Updating doctor ratings...")
    for (const doctor of doctors) {
      const doctorReviews = await reviewModel.find({ doctorId: doctor._id.toString() })
      if (doctorReviews.length > 0) {
        const avgRating = doctorReviews.reduce((sum, review) => sum + review.rating, 0) / doctorReviews.length
        await doctorModel.findByIdAndUpdate(doctor._id, {
          averageRating: Math.round(avgRating * 10) / 10,
          totalReviews: doctorReviews.length
        })
      }
    }

    console.log("✅ Database seeding completed successfully!")
    console.log(`
📊 Summary:
- Users: ${users.length}
- Doctors: ${doctors.length}
- Appointments: ${appointments.length}
- Chats: ${chats.length}
- Medical Records: 10
- Reviews: 20
- Notifications: 30
- Video Calls: 8

🔑 Test Credentials:
Admin: admin@prescripto.com / admin123
Doctor: sarah.wilson@hospital.com / doctor123
User: user1@example.com / password123

🌐 Access URLs:
- Patient Portal: http://localhost:5173
- Admin Panel: http://localhost:5174
- Backend API: http://localhost:4000
    `)

  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    mongoose.connection.close()
  }
}

// Run the seeding
seedDatabase()