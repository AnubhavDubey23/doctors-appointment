"use client"

import { useState } from "react"
import { assets } from "../assets/assets"

const AddMedicalConditionModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    condition: "",
    diagnosedDate: "",
    status: "active",
    severity: "mild",
    notes: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(formData)
    setFormData({
      condition: "",
      diagnosedDate: "",
      status: "active",
      severity: "mild",
      notes: "",
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Medical Condition</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <img src={assets.cross_icon || "/placeholder.svg"} alt="" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Condition *</label>
            <input
              type="text"
              required
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Hypertension, Diabetes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Diagnosed Date</label>
            <input
              type="date"
              value={formData.diagnosedDate}
              onChange={(e) => setFormData({ ...formData, diagnosedDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="chronic">Chronic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Severity</label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              rows="3"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-blue-600">
              Add Condition
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMedicalConditionModal
