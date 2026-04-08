const AnalyticsChart = ({ data, type = "line", title, color = "#5f72bd" }) => {
  if (!data || data.length === 0) return null

  // Extract the correct value from each data item depending on available fields
  const getValue = (item) => item.count || item.appointments || item.revenue || 0

  const maxValue = Math.max(...data.map(getValue))
  const safeMax = maxValue > 0 ? maxValue : 1 // Prevent division by zero
  const chartHeight = 200

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

      {type === "line" && (
        <div className="relative">
          <svg width="100%" height={chartHeight} className="overflow-visible">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <line
                key={index}
                x1="0"
                y1={chartHeight * ratio}
                x2="100%"
                y2={chartHeight * ratio}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            ))}

            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <text
                key={`label-${index}`}
                x="-5"
                y={chartHeight * (1 - ratio) + 4}
                textAnchor="end"
                fontSize="10"
                fill="#9ca3af"
              >
                {Math.round(safeMax * ratio)}
              </text>
            ))}

            {/* Area fill under the line */}
            <polygon
              fill={color}
              fillOpacity="0.1"
              points={
                data
                  .map((item, index) => {
                    const x = (index / Math.max(data.length - 1, 1)) * 100
                    const value = getValue(item)
                    const y = chartHeight - (value / safeMax) * chartHeight
                    return `${x}%,${y}`
                  })
                  .join(" ") +
                ` 100%,${chartHeight} 0%,${chartHeight}`
              }
            />

            {/* Data line */}
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinejoin="round"
              points={data
                .map((item, index) => {
                  const x = (index / Math.max(data.length - 1, 1)) * 100
                  const value = getValue(item)
                  const y = chartHeight - (value / safeMax) * chartHeight
                  return `${x}%,${y}`
                })
                .join(" ")}
            />

            {/* Data points with value labels */}
            {data.map((item, index) => {
              const x = (index / Math.max(data.length - 1, 1)) * 100
              const value = getValue(item)
              const y = chartHeight - (value / safeMax) * chartHeight
              return (
                <g key={index}>
                  <circle cx={`${x}%`} cy={y} r="5" fill="white" stroke={color} strokeWidth="2" />
                  {value > 0 && (
                    <text x={`${x}%`} y={y - 12} textAnchor="middle" fontSize="11" fontWeight="600" fill="#374151">
                      {value}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            {data.map((item, index) => (
              <span key={index}>{item.month}</span>
            ))}
          </div>
        </div>
      )}

      {type === "bar" && (
        <div className="space-y-3">
          {data.map((item, index) => {
            const value = getValue(item)
            const percentage = (value / safeMax) * 100
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-28 text-sm text-gray-600 truncate" title={item._id || item.speciality || item.month}>
                  {item._id || item.speciality || item.month}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-7 relative">
                  <div
                    className="h-7 rounded-full flex items-center justify-end pr-3 text-white text-xs font-bold transition-all duration-500"
                    style={{
                      width: `${Math.max(percentage, 8)}%`,
                      backgroundColor: color,
                    }}
                  >
                    {value}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AnalyticsChart
