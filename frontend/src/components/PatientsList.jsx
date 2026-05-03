import { MoreVertical, CheckCircle, AlertCircle } from 'lucide-react'
import './PatientsList.css'

const patientData = [
  {
    id: 1,
    name: 'John Doe',
    age: 55,
    stage: 3,
    riskScore: 78,
    status: 'High Risk',
    lastVisit: '2 days ago'
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 62,
    stage: 2,
    riskScore: 45,
    status: 'Moderate Risk',
    lastVisit: '5 days ago'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    age: 48,
    stage: 1,
    riskScore: 22,
    status: 'Low Risk',
    lastVisit: '1 week ago'
  },
  {
    id: 4,
    name: 'Sarah Williams',
    age: 71,
    stage: 4,
    riskScore: 92,
    status: 'Critical',
    lastVisit: 'Today'
  },
  {
    id: 5,
    name: 'Robert Brown',
    age: 59,
    stage: 2,
    riskScore: 56,
    status: 'Moderate Risk',
    lastVisit: '3 days ago'
  },
]

const statusConfig = {
  'Low Risk': { icon: CheckCircle, color: 'green' },
  'Moderate Risk': { icon: AlertCircle, color: 'warning' },
  'High Risk': { icon: AlertCircle, color: 'orange' },
  'Critical': { icon: AlertCircle, color: 'danger' },
}

export default function PatientsList() {
  return (
    <div className="patients-container">
      <div className="patients-header">
        <h2>Recent Patient Assessments</h2>
        <a href="#" className="view-all">View All →</a>
      </div>

      <div className="patients-table">
        <div className="table-header">
          <div className="col col-name">Patient Name</div>
          <div className="col col-age">Age</div>
          <div className="col col-stage">CKD Stage</div>
          <div className="col col-risk">Risk Score</div>
          <div className="col col-status">Status</div>
          <div className="col col-visit">Last Visit</div>
          <div className="col col-action">Action</div>
        </div>

        <div className="table-body">
          {patientData.map((patient) => {
            const statusInfo = statusConfig[patient.status]
            const StatusIcon = statusInfo.icon

            return (
              <div key={patient.id} className="table-row">
                <div className="col col-name">
                  <div className="patient-name">
                    <div className="patient-avatar">
                      {patient.name.charAt(0)}
                    </div>
                    {patient.name}
                  </div>
                </div>
                <div className="col col-age">{patient.age}</div>
                <div className="col col-stage">
                  <span className="stage-badge">Stage {patient.stage}</span>
                </div>
                <div className="col col-risk">
                  <div className="risk-meter">
                    <div className="risk-bar" style={{ width: `${patient.riskScore}%` }}></div>
                    <span className="risk-value">{patient.riskScore}%</span>
                  </div>
                </div>
                <div className="col col-status">
                  <span className={`status-badge status-${statusInfo.color}`}>
                    <StatusIcon size={16} />
                    {patient.status}
                  </span>
                </div>
                <div className="col col-visit">{patient.lastVisit}</div>
                <div className="col col-action">
                  <button className="action-btn">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
