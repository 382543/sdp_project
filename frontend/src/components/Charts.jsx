import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import './ChartCard.css'

const lineData = [
  { month: 'Jan', risk: 45, patients: 120 },
  { month: 'Feb', risk: 52, patients: 132 },
  { month: 'Mar', risk: 48, patients: 125 },
  { month: 'Apr', risk: 61, patients: 145 },
  { month: 'May', risk: 55, patients: 138 },
  { month: 'Jun', risk: 67, patients: 155 },
]

const barData = [
  { stage: 'Stage 1', count: 45 },
  { stage: 'Stage 2', count: 67 },
  { stage: 'Stage 3a', count: 89 },
  { stage: 'Stage 3b', count: 72 },
  { stage: 'Stage 4', count: 53 },
  { stage: 'Stage 5', count: 28 },
]

export function LineChartCard() {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Risk Trend Analysis</h3>
        <span className="chart-period">Last 6 months</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <defs>
            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.3)" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip 
            contentStyle={{
              background: 'rgba(255, 255, 255, 0.98)',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              borderRadius: '8px',
              color: '#0f172a'
            }}
          />
          <Legend wrapperStyle={{ color: '#334155' }} />
          <Line 
            type="monotone" 
            dataKey="risk" 
            stroke="#0ea5e9" 
            strokeWidth={3}
            dot={{ fill: '#0ea5e9', r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line 
            type="monotone" 
            dataKey="patients" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function BarChartCard() {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>CKD Stage Distribution</h3>
        <span className="chart-period">Current patients</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.3)" />
          <XAxis dataKey="stage" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip 
            contentStyle={{
              background: 'rgba(255, 255, 255, 0.98)',
              border: '1px solid rgba(148, 163, 184, 0.35)',
              borderRadius: '8px',
              color: '#0f172a'
            }}
          />
          <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ConfusionMatrixCard() {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Model Performance</h3>
        <span className="chart-period">Confusion Matrix</span>
      </div>
      <div className="confusion-matrix">
        <div className="matrix-header"></div>
        <div className="matrix-header-col">Predicted Negative</div>
        <div className="matrix-header-col">Predicted Positive</div>
        
        <div className="matrix-row-label">Actual Negative</div>
        <div className="matrix-cell true-negative">
          <span className="value">156</span>
          <span className="label">TN</span>
        </div>
        <div className="matrix-cell false-positive">
          <span className="value">22</span>
          <span className="label">FP</span>
        </div>
        
        <div className="matrix-row-label">Actual Positive</div>
        <div className="matrix-cell false-negative">
          <span className="value">18</span>
          <span className="label">FN</span>
        </div>
        <div className="matrix-cell true-positive">
          <span className="value">204</span>
          <span className="label">TP</span>
        </div>
      </div>

      <div className="matrix-metrics">
        <div className="metric">
          <span className="label">Accuracy</span>
          <span className="value">90.9%</span>
        </div>
        <div className="metric">
          <span className="label">Precision</span>
          <span className="value">90.3%</span>
        </div>
        <div className="metric">
          <span className="label">Recall</span>
          <span className="value">91.9%</span>
        </div>
        <div className="metric">
          <span className="label">F1-Score</span>
          <span className="value">91.1%</span>
        </div>
      </div>
    </div>
  )
}
