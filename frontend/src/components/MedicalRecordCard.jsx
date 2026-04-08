"use client"

const MedicalRecordCard = ({ title, children, icon, onAdd, addButtonText = "Add New" }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && <img src={icon || "/placeholder.svg"} alt="" className="w-6 h-6" />}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
          >
            {addButtonText}
          </button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

export default MedicalRecordCard
