import { TrendingUp, AlertCircle } from 'lucide-react'
import './StatsCard.css'

export default function StatsCard({ 
  title, 
  value, 
  unit = '', 
  trend = null, 
  icon: Icon = AlertCircle, 
  color = 'blue',
  status = 'normal' 
}) {
  return (
    <div className={`stats-card stats-card-${color} stats-card-${status}`}>
      <div className="card-header">
        <div className="card-title">{title}</div>
        <div className="card-icon">
          <Icon size={24} />
        </div>
      </div>

      <div className="card-value">
        <span className="value">{value}</span>
        {unit && <span className="unit">{unit}</span>}
      </div>

      {trend && (
        <div className={`trend ${trend > 0 ? 'positive' : 'negative'}`}>
          <TrendingUp size={16} />
          <span>{Math.abs(trend)}% {trend > 0 ? 'increase' : 'decrease'}</span>
        </div>
      )}
    </div>
  )
}
