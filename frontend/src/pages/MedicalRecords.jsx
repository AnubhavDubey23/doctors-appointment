"use client"

import { useState, useEffect, useContext } from "react"
import { AppContext } from "../context/AppContext"
import MedicalRecordCard from "../components/MedicalRecordCard"
import AddMedicalConditionModal from "../components/AddMedicalConditionModal"
import axios from "axios"
import { toast } from "react-toastify"

const MedicalRecords = () => {
  const [medicalRecord, setMedicalRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConditionModal, setShowConditionModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const { token, backendUrl, userData } = useContext(AppContext)

  useEffect(() => {
    if (token && userData) {
      fetchMedicalRecord()
    }
  }, [token, userData])

  const fetchMedicalRecord = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/medical-record/get-record`, {
        headers: { token },
      })

      if (data.success) {
        setMedicalRecord(data.medicalRecord)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to load medical records")
    } finally {
      setLoading(false)
    }
  }

  const addMedicalCondition = async (conditionData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/medical-record/add-condition`,
        {
          userId: userData._id,
          ...conditionData,
        },
        {
          headers: { token },
        },
      )

      if (data.success) {
        toast.success(data.message)
        fetchMedicalRecord()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to add medical condition")
    }
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "conditions", label: "Conditions", icon: "🏥" },
    { id: "prescriptions", label: "Prescriptions", icon: "💊" },
    { id: "lab-results", label: "Lab Results", icon: "🧪" },
    { id: "documents", label: "Documents", icon: "📄" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <img src="/placeholder.svg?key=medical-record" alt="" className="w-12 h-12" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Medical Records</h1>
              <p className="text-gray-600">Manage your health information and medical history</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary bg-blue-50"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <MedicalRecordCard title="Basic Information" icon="/placeholder.svg?key=info">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Type:</span>
                    <span className="font-medium">{medicalRecord?.bloodType || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Emergency Contact:</span>
                    <span className="font-medium">{medicalRecord?.emergencyContact?.name || "Not specified"}</span>
                  </div>
                </div>
              </MedicalRecordCard>

              {/* Recent Vital Signs */}
              <MedicalRecordCard title="Latest Vital Signs" icon="/placeholder.svg?key=vitals">
                {medicalRecord?.vitalSigns?.length > 0 ? (
                  <div className="space-y-2">
                    {medicalRecord.vitalSigns.slice(-1).map((vital, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          BP: {vital.bloodPressure?.systolic}/{vital.bloodPressure?.diastolic}
                        </div>
                        <div>HR: {vital.heartRate} bpm</div>
                        <div>Weight: {vital.weight} kg</div>
                        <div>BMI: {vital.bmi}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No vital signs recorded</p>
                )}
              </MedicalRecordCard>

              {/* Active Conditions */}
              <MedicalRecordCard title="Active Conditions" icon="/placeholder.svg?key=conditions">
                {medicalRecord?.medicalConditions?.filter((c) => c.status === "active").length > 0 ? (
                  <div className="space-y-2">
                    {medicalRecord.medicalConditions
                      .filter((c) => c.status === "active")
                      .slice(0, 3)
                      .map((condition, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium">{condition.condition}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              condition.severity === "severe"
                                ? "bg-red-100 text-red-800"
                                : condition.severity === "moderate"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {condition.severity}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No active conditions</p>
                )}
              </MedicalRecordCard>

              {/* Current Prescriptions */}
              <MedicalRecordCard title="Current Prescriptions" icon="/placeholder.svg?key=prescriptions">
                {medicalRecord?.prescriptions?.filter((p) => p.status === "active").length > 0 ? (
                  <div className="space-y-2">
                    {medicalRecord.prescriptions
                      .filter((p) => p.status === "active")
                      .slice(0, 3)
                      .map((prescription, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded">
                          <div className="font-medium">{prescription.medication}</div>
                          <div className="text-sm text-gray-600">
                            {prescription.dosage} - {prescription.frequency}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No active prescriptions</p>
                )}
              </MedicalRecordCard>
            </div>
          )}

          {activeTab === "conditions" && (
            <MedicalRecordCard
              title="Medical Conditions"
              icon="/placeholder.svg?key=conditions"
              onAdd={() => setShowConditionModal(true)}
              addButtonText="Add Condition"
            >
              {medicalRecord?.medicalConditions?.length > 0 ? (
                medicalRecord.medicalConditions.map((condition, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{condition.condition}</h4>
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            condition.status === "active"
                              ? "bg-green-100 text-green-800"
                              : condition.status === "resolved"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {condition.status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            condition.severity === "severe"
                              ? "bg-red-100 text-red-800"
                              : condition.severity === "moderate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {condition.severity}
                        </span>
                      </div>
                    </div>
                    {condition.diagnosedDate && (
                      <p className="text-sm text-gray-600 mb-1">
                        Diagnosed: {new Date(condition.diagnosedDate).toLocaleDateString()}
                      </p>
                    )}
                    {condition.notes && <p className="text-sm text-gray-700">{condition.notes}</p>}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No medical conditions recorded</p>
                  <button
                    onClick={() => setShowConditionModal(true)}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Add Your First Condition
                  </button>
                </div>
              )}
            </MedicalRecordCard>
          )}

          {/* Add other tab contents similarly */}
        </div>
      </div>

      {/* Modals */}
      <AddMedicalConditionModal
        isOpen={showConditionModal}
        onClose={() => setShowConditionModal(false)}
        onAdd={addMedicalCondition}
      />
    </div>
  )
}

export default MedicalRecords
