import express from "express"
import multer from "multer"
import {
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
} from "../controllers/medicalRecordController.js"
import authUser from "../middleware/authUser.js"
import authDoctor from "../middleware/authDoctor.js"

const medicalRecordRouter = express.Router()

// Multer configuration for file uploads
const storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname)
  },
})
const upload = multer({ storage })

// User routes
medicalRecordRouter.get("/get-record", authUser, getMedicalRecord)
medicalRecordRouter.post("/update-basic", authUser, updateBasicInfo)
medicalRecordRouter.post("/add-condition", authUser, addMedicalCondition)
medicalRecordRouter.post("/add-allergy", authUser, addAllergy)
medicalRecordRouter.post("/add-lab-result", authUser, addLabResult)
medicalRecordRouter.post("/upload-document", authUser, upload.single("document"), uploadDocument)
medicalRecordRouter.post("/update-privacy", authUser, updatePrivacySettings)

// Doctor routes
medicalRecordRouter.post("/doctor-access", authDoctor, getDoctorAccessRecord)
medicalRecordRouter.post("/add-prescription", authDoctor, addPrescription)
medicalRecordRouter.post("/add-vital-signs", authDoctor, addVitalSigns)
medicalRecordRouter.post("/add-consultation-note", authDoctor, addConsultationNote)

export default medicalRecordRouter
