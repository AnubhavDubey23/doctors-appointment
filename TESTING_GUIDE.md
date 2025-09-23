# 🧪 Complete Testing Guide for Doctor Appointment System

## 📋 Pre-Testing Setup Checklist

### 1. Environment Setup
- [ ] All `.env` files configured with correct credentials
- [ ] MongoDB connection established
- [ ] All npm packages installed in backend, frontend, and admin
- [ ] All three servers running (backend:4000, frontend:5173, admin:5174)

### 2. Database Verification
\`\`\`bash
# Check MongoDB connection
curl http://localhost:4000/api/test
# Should return: "API Working"
\`\`\`

## 🔧 Backend API Testing

### Authentication & User Management
\`\`\`bash
# 1. User Registration
curl -X POST http://localhost:4000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# 2. User Login
curl -X POST http://localhost:4000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Get User Profile (use token from login)
curl -X GET http://localhost:4000/api/user/get-profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
\`\`\`

### Doctor Management
\`\`\`bash
# 1. Get Doctors List
curl -X GET http://localhost:4000/api/doctor/list

# 2. Doctor Login
curl -X POST http://localhost:4000/api/doctor/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@example.com","password":"password123"}'
\`\`\`

### Appointment System
\`\`\`bash
# 1. Book Appointment
curl -X POST http://localhost:4000/api/user/book-appointment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{"docId":"DOCTOR_ID","slotDate":"2024-01-15","slotTime":"10:00 am"}'

# 2. Get User Appointments
curl -X GET http://localhost:4000/api/user/appointments \
  -H "Authorization: Bearer USER_TOKEN"
\`\`\`

### Chat System
\`\`\`bash
# 1. Create Chat
curl -X POST http://localhost:4000/api/chat/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{"doctorId":"DOCTOR_ID"}'

# 2. Send Message
curl -X POST http://localhost:4000/api/chat/send-message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{"chatId":"CHAT_ID","message":"Hello Doctor"}'
\`\`\`

### Video Consultation
\`\`\`bash
# 1. Create Video Call
curl -X POST http://localhost:4000/api/video/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{"doctorId":"DOCTOR_ID","appointmentId":"APPOINTMENT_ID"}'
\`\`\`

### Medical Records
\`\`\`bash
# 1. Get Medical Record
curl -X GET http://localhost:4000/api/medical/get-record \
  -H "Authorization: Bearer USER_TOKEN"

# 2. Add Medical Condition
curl -X POST http://localhost:4000/api/medical/add-condition \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{"condition":"Diabetes","diagnosedDate":"2024-01-01","severity":"Moderate"}'
\`\`\`

### Reviews System
\`\`\`bash
# 1. Create Review
curl -X POST http://localhost:4000/api/review/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{"doctorId":"DOCTOR_ID","appointmentId":"APPOINTMENT_ID","rating":5,"comment":"Great doctor!"}'

# 2. Get Doctor Reviews
curl -X GET http://localhost:4000/api/review/doctor/DOCTOR_ID
\`\`\`

## 🖥️ Frontend Testing Checklist

### User Interface Testing
- [ ] **Home Page** - Load correctly, display specialties and top doctors
- [ ] **Registration** - Form validation, successful registration
- [ ] **Login** - Authentication, redirect to profile
- [ ] **Doctor Listing** - Search, filter by specialty, location
- [ ] **Appointment Booking** - Select doctor, choose slot, payment
- [ ] **Profile Management** - Update profile, upload image
- [ ] **My Appointments** - View appointments, cancel functionality
- [ ] **Chat Interface** - Send/receive messages, real-time updates
- [ ] **Video Consultation** - Start call, video/audio controls
- [ ] **Medical Records** - View records, add conditions/allergies
- [ ] **Notifications** - Receive alerts, mark as read
- [ ] **Reviews** - Submit reviews, view doctor ratings

### Navigation Testing
- [ ] **Navbar** - All links working, responsive design
- [ ] **Mobile Menu** - Hamburger menu functionality
- [ ] **Footer** - Links and contact information
- [ ] **Breadcrumbs** - Navigation path display

### Form Validation Testing
- [ ] **Registration Form** - Email format, password strength
- [ ] **Login Form** - Required fields, error messages
- [ ] **Appointment Form** - Date/time validation
- [ ] **Profile Form** - Phone number, address validation
- [ ] **Review Form** - Rating selection, comment length

## 👨‍💼 Admin Panel Testing

### Admin Dashboard
- [ ] **Login** - Admin authentication
- [ ] **Statistics** - Display correct counts and charts
- [ ] **Add Doctor** - Form submission, image upload
- [ ] **Manage Doctors** - Edit, delete, toggle availability
- [ ] **All Appointments** - View, filter, cancel appointments
- [ ] **Analytics** - Revenue charts, appointment trends

### Doctor Dashboard
- [ ] **Doctor Login** - Authentication and redirect
- [ ] **Appointments** - View scheduled appointments
- [ ] **Profile Management** - Update doctor information
- [ ] **Availability** - Toggle online/offline status
- [ ] **Patient Chat** - Respond to patient messages
- [ ] **Medical Records** - Access patient records (with permission)

## 🔌 Integration Testing

### Payment Gateway
- [ ] **Razorpay Integration** - Test payment flow
- [ ] **Stripe Integration** - Process test payments
- [ ] **Payment Verification** - Confirm successful transactions
- [ ] **Failed Payment Handling** - Error messages and retry

### File Upload
- [ ] **Profile Images** - Upload and display correctly
- [ ] **Medical Documents** - PDF/image upload
- [ ] **Doctor Images** - Admin upload functionality
- [ ] **File Size Limits** - Validation and error handling

### Email Notifications
- [ ] **Registration Email** - Welcome message sent
- [ ] **Appointment Confirmation** - Booking confirmation
- [ ] **Appointment Reminders** - 24-hour reminder emails
- [ ] **Password Reset** - Reset link functionality

### SMS Notifications
- [ ] **Appointment Confirmation** - SMS sent to patient
- [ ] **Appointment Reminders** - SMS alerts
- [ ] **Emergency Notifications** - Critical alerts

### Real-time Features
- [ ] **Chat Messages** - Instant message delivery
- [ ] **Online Status** - Doctor availability updates
- [ ] **Notifications** - Real-time alert system
- [ ] **Video Call Signals** - Call initiation/termination

## 🛡️ Security Testing

### Authentication
- [ ] **JWT Tokens** - Proper token generation and validation
- [ ] **Password Hashing** - Bcrypt implementation
- [ ] **Session Management** - Token expiration handling
- [ ] **Unauthorized Access** - Protected route security

### Data Validation
- [ ] **Input Sanitization** - XSS prevention
- [ ] **SQL Injection** - MongoDB injection prevention
- [ ] **File Upload Security** - Malicious file detection
- [ ] **Rate Limiting** - API abuse prevention

### Privacy & Compliance
- [ ] **Medical Data Protection** - HIPAA compliance measures
- [ ] **User Consent** - Privacy policy acceptance
- [ ] **Data Encryption** - Sensitive data protection
- [ ] **Access Controls** - Role-based permissions

## 📱 Mobile Responsiveness

### Responsive Design
- [ ] **Mobile Navigation** - Hamburger menu functionality
- [ ] **Touch Interactions** - Button sizes and touch targets
- [ ] **Form Inputs** - Mobile-friendly input fields
- [ ] **Image Scaling** - Proper image display on mobile
- [ ] **Chat Interface** - Mobile chat experience
- [ ] **Video Calls** - Mobile video consultation

## 🚨 Error Handling Testing

### Frontend Error Handling
- [ ] **Network Errors** - Offline/connection issues
- [ ] **API Errors** - Server error responses
- [ ] **Form Errors** - Validation error display
- [ ] **Loading States** - Spinner and loading indicators

### Backend Error Handling
- [ ] **Database Errors** - Connection and query failures
- [ ] **Authentication Errors** - Invalid credentials
- [ ] **Validation Errors** - Input validation failures
- [ ] **Server Errors** - 500 error responses

## 📊 Performance Testing

### Load Testing
- [ ] **Concurrent Users** - Multiple user sessions
- [ ] **Database Queries** - Query optimization
- [ ] **File Uploads** - Large file handling
- [ ] **Real-time Features** - WebSocket performance

### Browser Compatibility
- [ ] **Chrome** - Latest version compatibility
- [ ] **Firefox** - Cross-browser functionality
- [ ] **Safari** - iOS/macOS compatibility
- [ ] **Edge** - Windows compatibility

## ✅ Final Verification Checklist

### Complete User Journey
1. [ ] User registers and verifies email
2. [ ] User logs in and completes profile
3. [ ] User searches and books appointment
4. [ ] User makes payment successfully
5. [ ] User chats with doctor
6. [ ] User joins video consultation
7. [ ] User updates medical records
8. [ ] User submits review and rating

### Complete Doctor Journey
1. [ ] Doctor logs in to dashboard
2. [ ] Doctor views and manages appointments
3. [ ] Doctor updates availability
4. [ ] Doctor chats with patients
5. [ ] Doctor conducts video consultation
6. [ ] Doctor updates patient records
7. [ ] Doctor responds to reviews

### Complete Admin Journey
1. [ ] Admin logs in to panel
2. [ ] Admin adds new doctor
3. [ ] Admin views system analytics
4. [ ] Admin manages appointments
5. [ ] Admin monitors system health

## 🐛 Common Issues & Solutions

### Database Connection Issues
\`\`\`bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod
\`\`\`

### Port Conflicts
\`\`\`bash
# Check port usage
lsof -i :4000
lsof -i :5173
lsof -i :5174

# Kill process if needed
kill -9 PID
\`\`\`

### Environment Variables
\`\`\`bash
# Verify environment variables are loaded
node -e "console.log(process.env.MONGODB_URI)"
\`\`\`

### CORS Issues
- Ensure frontend URLs are added to CORS configuration
- Check browser console for CORS errors

This comprehensive testing guide covers all major features and functionality. Follow each section systematically to ensure your doctor appointment system works perfectly!
