const AnalyticsChart = ({ data, type = "line", title, color = "#5f72bd" }) => {
  if (!data || data.length === 0) return null

  const maxValue = Math.max(...data.map((item) => item.appointments || item.revenue || 0))
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

            {/* Data line */}
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="3"
              points={data
                .map((item, index) => {
                  const x = (index / (data.length - 1)) * 100
                  const value = item.appointments || item.revenue || 0
                  const y = chartHeight - (value / maxValue) * chartHeight
                  return `${x}%,${y}`
                })
                .join(" ")}
            />

            {/* Data points */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100
              const value = item.appointments || item.revenue || 0
              const y = chartHeight - (value / maxValue) * chartHeight
              return <circle key={index} cx={`${x}%`} cy={y} r="4" fill={color} />
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
            const percentage = ((item.count || item.appointments || 0) / maxValue) * 100
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-600 truncate">{item._id || item.speciality || item.month}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium"
                    style={{
                      width: `${Math.max(percentage, 10)}%`,
                      backgroundColor: color,
                    }}
                  >
                    {item.count || item.appointments || 0}
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
