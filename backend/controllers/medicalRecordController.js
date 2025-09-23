import medicalRecordModel from "../models/medicalRecordModel.js"
import { v2 as cloudinary } from "cloudinary"

// Get or create medical record for user
const getMedicalRecord = async (req, res) => {
  try {
    const { userId } = req.body

    let medicalRecord = await medicalRecordModel
      .findOne({ userId })
      .populate("consultationNotes.doctorId", "name speciality")
      .populate("prescriptions.prescribedBy", "name speciality")
      .populate("labResults.orderedBy", "name speciality")
      .populate("vitalSigns.recordedBy", "name speciality")

    if (!medicalRecord) {
      // Create new medical record
      medicalRecord = new medicalRecordModel({ userId })
      await medicalRecord.save()
    }

    res.json({ success: true, medicalRecord })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Update basic medical information
const updateBasicInfo = async (req, res) => {
  try {
    const { userId, bloodType, emergencyContact } = req.body

    const medicalRecord = await medicalRecordModel.findOneAndUpdate(
      { userId },
      { bloodType, emergencyContact },
      { new: true, upsert: true },
    )

    res.json({ success: true, message: "Basic information updated successfully" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Add medical condition
const addMedicalCondition = async (req, res) => {
  try {
    const { userId, condition, diagnosedDate, status, diagnosedBy, notes, severity } = req.body

    const medicalRecord = await medicalRecordModel.findOne({ userId })
    if (!medicalRecord) {
      return res.json({ success: false, message: "Medical record not found" })
    }

    medicalRecord.medicalConditions.push({
      condition,
      diagnosedDate: diagnosedDate ? new Date(diagnosedDate) : undefined,
      status,
      diagnosedBy,
      notes,
      severity,
    })

    await medicalRecord.save()
    res.json({ success: true, message: "Medical condition added successfully" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Add allergy
const addAllergy = async (req, res) => {
  try {
    const { userId, allergen, reaction, severity, diagnosedDate, notes } = req.body

    const medicalRecord = await medicalRecordModel.findOne({ userId })
    if (!medicalRecord) {
      return res.json({ success: false, message: "Medical record not found" })
    }

    medicalRecord.allergies.push({
      allergen,
      reaction,
      severity,
      diagnosedDate: diagnosedDate ? new Date(diagnosedDate) : undefined,
      notes,
    })

    await medicalRecord.save()
    res.json({ success: true, message: "Allergy added successfully" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Add prescription (by doctor)
const addPrescription = async (req, res) => {
  try {
    const { userId, medication, dosage, frequency, duration, instructions, prescribedBy } = req.body

    const medicalRecord = await medicalRecordModel.findOne({ userId })
    if (!medicalRecord) {
      return res.json({ success: false, message: "Medical record not found" })
    }

    medicalRecord.prescriptions.push({
      medication,
      dosage,
      frequency,
      duration,
      instructions,
      prescribedBy,
    })

    await medicalRecord.save()
    res.json({ success: true, message: "Prescription added successfully" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Add lab result
const addLabResult = async (req, res) => {
  try {
    const { userId, testName, testType, result, normalRange, unit, status, labName, testDate, orderedBy } = req.body

    const medicalRecord = await medicalRecordModel.findOne({ userId })
    if (!medicalRecord) {
      return res.json({ success: false, message: "Medical record not found" })
    }

    medicalRecord.labResults.push({
      testName,
      testType,
      result,
      normalRange,
      unit,
      status,
      labName,
      testDate: new Date(testDate),
      orderedBy,
    })

    await medicalRecord.save()
    res.json({ success: true, message: "Lab result added successfully" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Add vital signs
const addVitalSigns = async (req, res) => {
  try {
    const { userId, vitalSigns, recordedBy } = req.body

    const medicalRecord = await medicalRecordModel.findOne({ userId })
    if (!medicalRecord) {
      return res.json({ success: false, message: "Medical record not found" })
    }

    // Calculate BMI if height and weight are provided
    if (vitalSigns.height && vitalSigns.weight) {
      const heightInMeters = vitalSigns.height / 100
      vitalSigns.bmi = (vitalSigns.weight / (heightInMeters * heightInMeters)).toFixed(1)
    }

    medicalRecord.vitalSigns.push({
      ...vitalSigns,
      recordedBy,
    })

    await medicalRecord.save()
    res.json({ success: true, message: "Vital signs added successfully" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Add consultation note (by doctor)
const addConsultationNote = async (req, res) => {
  try {
    const {
      userId,
      doctorId,
      appointmentId,
      chiefComplaint,
      diagnosis,
      treatment,
      notes,
      followUpRequired,
      followUpDate,
    } = req.body

    const medicalRecord = await medicalRecordModel.findOne({ userId })
    if (!medicalRecord) {
      return res.json({ success: false, message: "Medical record not found" })
    }

    medicalRecord.consultationNotes.push({
      doctorId,
      appointmentId,
      chiefComplaint,
      diagnosis,
      treatment,
      notes,
      followUpRequired,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
    })

    await medicalRecord.save()
    res.json({ success: true, message: "Consultation note added successfully" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Upload medical document
const uploadDocument = async (req, res) => {
  try {
    const { userId, title, type, description, uploadedBy, uploadedByType } = req.body

    if (!req.file) {
      return res.json({ success: false, message: "No file uploaded" })
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "medical_documents",
    })

    const medicalRecord = await medicalRecordModel.findOne({ userId })
    if (!medicalRecord) {
      return res.json({ success: false, message: "Medical record not found" })
    }

    medicalRecord.documents.push({
      title,
      type,
      fileUrl: result.secure_url,
      uploadedBy,
      uploadedByType,
      description,
    })

    await medicalRecord.save()
    res.json({ success: true, message: "Document uploaded successfully" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Get medical record for doctor (with patient consent)
const getDoctorAccessRecord = async (req, res) => {
  try {
    const { userId, doctorId } = req.body

    const medicalRecord = await medicalRecordModel
      .findOne({ userId })
      .populate("consultationNotes.doctorId", "name speciality")
      .populate("prescriptions.prescribedBy", "name speciality")
      .populate("labResults.orderedBy", "name speciality")
      .populate("vitalSigns.recordedBy", "name speciality")

    if (!medicalRecord) {
      return res.json({ success: false, message: "Medical record not found" })
    }

    if (!medicalRecord.shareWithDoctors) {
      return res.json({ success: false, message: "Patient has not granted access to medical records" })
    }

    res.json({ success: true, medicalRecord })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// Update privacy settings
const updatePrivacySettings = async (req, res) => {
  try {
    const { userId, shareWithDoctors, shareWithFamily } = req.body

    await medicalRecordModel.findOneAndUpdate(
      { userId },
      { shareWithDoctors, shareWithFamily },
      { new: true, upsert: true },
    )

    res.json({ success: true, message: "Privacy settings updated successfully" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export {
  getMedicalRecord,
  updateBasicInfo,
  addMedicalCondition,
  addAllergy,
  addPrescription,
  addLabResult,
  addVitalSigns,
  addConsultationNote,
  uploadDocument,
  getDoctorAccessRecord,
  updatePrivacySettings,
}
