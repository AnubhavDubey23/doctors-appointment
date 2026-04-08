const StatCard = ({ title, value, icon, trend, trendValue, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    red: "bg-red-50 text-red-600 border-red-200",
  }

  return (
    <div className={`p-6 rounded-lg border-2 ${colorClasses[color]} hover:scale-105 transition-all cursor-pointer`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm font-medium opacity-80">{title}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-xs ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
              <span className="mr-1">{trend === "up" ? "↗" : "↘"}</span>
              {trendValue}
            </div>
          )}
        </div>
        {icon && <div className="text-3xl opacity-60">{icon}</div>}
      </div>
    </div>
  )
}

export default StatCard
