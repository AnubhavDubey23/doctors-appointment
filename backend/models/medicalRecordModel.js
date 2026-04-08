import mongoose from "mongoose"

const vitalSignsSchema = new mongoose.Schema({
  bloodPressure: { systolic: Number, diastolic: Number },
  heartRate: Number,
  temperature: Number,
  weight: Number,
  height: Number,
  bmi: Number,
  oxygenSaturation: Number,
  recordedAt: { type: Date, default: Date.now },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "doctor" },
})

const prescriptionSchema = new mongoose.Schema({
  medication: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  instructions: { type: String },
  prescribedBy: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },
  prescribedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "completed", "discontinued"], default: "active" },
})

const labResultSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  testType: { type: String, required: true },
  result: { type: String, required: true },
  normalRange: { type: String },
  unit: { type: String },
  status: { type: String, enum: ["normal", "abnormal", "critical"], default: "normal" },
  labName: { type: String },
  testDate: { type: Date, required: true },
  reportUrl: { type: String }, // Cloudinary URL for report file
  orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "doctor" },
})

const allergySchema = new mongoose.Schema({
  allergen: { type: String, required: true },
  reaction: { type: String, required: true },
  severity: { type: String, enum: ["mild", "moderate", "severe"], required: true },
  diagnosedDate: { type: Date },
  notes: { type: String },
})

const medicalConditionSchema = new mongoose.Schema({
  condition: { type: String, required: true },
  diagnosedDate: { type: Date },
  status: { type: String, enum: ["active", "resolved", "chronic"], default: "active" },
  diagnosedBy: { type: mongoose.Schema.Types.ObjectId, ref: "doctor" },
  notes: { type: String },
  severity: { type: String, enum: ["mild", "moderate", "severe"] },
})

const medicalRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },

    // Basic Information
    bloodType: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },

    // Medical History
    medicalConditions: [medicalConditionSchema],
    allergies: [allergySchema],
    familyHistory: [
      {
        condition: String,
        relationship: String,
        notes: String,
      },
    ],

    // Current Health Data
    vitalSigns: [vitalSignsSchema],
    prescriptions: [prescriptionSchema],
    labResults: [labResultSchema],

    // Consultation History
    consultationNotes: [
      {
        doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor", required: true },
        appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "appointment" },
        date: { type: Date, default: Date.now },
        chiefComplaint: String,
        diagnosis: String,
        treatment: String,
        notes: String,
        followUpRequired: { type: Boolean, default: false },
        followUpDate: Date,
      },
    ],

    // Documents
    documents: [
      {
        title: String,
        type: { type: String, enum: ["lab_report", "prescription", "imaging", "discharge_summary", "other"] },
        fileUrl: String, // Cloudinary URL
        uploadedBy: { type: mongoose.Schema.Types.ObjectId },
        uploadedByType: { type: String, enum: ["user", "doctor"] },
        uploadedAt: { type: Date, default: Date.now },
        description: String,
      },
    ],

    // Privacy Settings
    shareWithDoctors: { type: Boolean, default: true },
    shareWithFamily: { type: Boolean, default: false },
  },
  { timestamps: true },
)

const medicalRecordModel = mongoose.models.medicalrecord || mongoose.model("medicalrecord", medicalRecordSchema)

export default medicalRecordModel
