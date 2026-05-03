import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react'
import { predictRisk } from '../lib/ckdApi'
import { saveLatestPrediction } from '../lib/predictionStore'
import './Dashboard.css'

const initialForm = {
  time_step: 1,
  glucose: 110,
  diabetes: 'no',
  wbc: 7,
  rbc: 4.6,
  age: 45,
  gender: 'female',
  egfr: 90,
  creatinine_rate: 1,
}

function toNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizeForm(form) {
  return {
    ...form,
    time_step: form.time_step === '' ? null : toNumber(form.time_step),
    glucose: form.glucose === '' ? null : toNumber(form.glucose),
    wbc: form.wbc === '' ? null : toNumber(form.wbc),
    rbc: form.rbc === '' ? null : toNumber(form.rbc),
    age: form.age === '' ? null : toNumber(form.age),
    egfr: form.egfr === '' ? null : toNumber(form.egfr),
    creatinine_rate: form.creatinine_rate === '' ? null : toNumber(form.creatinine_rate),
  }
}

function assessCkdRisk(form) {
  const signals = []
  let score = 0

  if (form.egfr < 15) {
    score += 6
    signals.push('eGFR is critically low.')
  } else if (form.egfr < 30) {
    score += 5
    signals.push('eGFR is in a severe range.')
  } else if (form.egfr < 45) {
    score += 4
    signals.push('eGFR suggests reduced kidney function.')
  } else if (form.egfr < 60) {
    score += 3
    signals.push('eGFR is below the healthy threshold.')
  }

  if (form.creatinine_rate >= 1.8) {
    score += 4
    signals.push('Creatinine is markedly elevated.')
  } else if (form.creatinine_rate >= 1.4) {
    score += 3
    signals.push('Creatinine is above the usual range.')
  } else if (form.creatinine_rate >= 1.2) {
    score += 2
    signals.push('Creatinine is slightly elevated.')
  }

  if (form.glucose >= 200) {
    score += 3
    signals.push('Glucose is very high.')
  } else if (form.glucose >= 140) {
    score += 2
    signals.push('Glucose is above the target range.')
  }

  if (form.diabetes === 'yes') {
    score += 2
    signals.push('Diabetes increases CKD risk.')
  }

  if (form.age >= 75) {
    score += 2
    signals.push('Age is in a higher risk group.')
  } else if (form.age >= 60) {
    score += 1
    signals.push('Age contributes to baseline risk.')
  }

  if (form.wbc >= 11) {
    score += 2
    signals.push('WBC suggests inflammation or infection.')
  } else if (form.wbc > 8.5) {
    score += 1
    signals.push('WBC is mildly elevated.')
  }

  if (form.rbc < 4.0) {
    score += 2
    signals.push('RBC is low.')
  } else if (form.rbc < 4.5) {
    score += 1
    signals.push('RBC is slightly low.')
  }

  if (form.time_step >= 7) {
    score += 1
    signals.push('Longer observation period indicates persistent tracking.')
  }

  let riskLevel = 'Low'
  if (form.egfr < 30 || score >= 8) {
    riskLevel = 'Critical'
  } else if (score >= 6) {
    riskLevel = 'High'
  } else if (score >= 3) {
    riskLevel = 'Moderate'
  }

  return {
    riskLevel,
    riskState: riskLevel === 'Low' ? 'Not at risk' : 'At risk',
    score: Math.min(score * 10, 100),
    signals,
  }
}

export default function Dashboard() {
  const [form, setForm] = useState(initialForm)
  const [refreshToken, setRefreshToken] = useState(0)
  const [assessment, setAssessment] = useState(() => ({
    ...assessCkdRisk(initialForm),
    source: 'local-fallback',
  }))
  const [isAssessing, setIsAssessing] = useState(false)
  const [assessmentSource, setAssessmentSource] = useState('local-fallback')

  useEffect(() => {
    const controller = new AbortController()
    const normalizedForm = normalizeForm(form)

    if (
      normalizedForm.time_step === null ||
      normalizedForm.glucose === null ||
      normalizedForm.wbc === null ||
      normalizedForm.rbc === null ||
      normalizedForm.age === null ||
      normalizedForm.egfr === null ||
      normalizedForm.creatinine_rate === null
    ) {
      setIsAssessing(false)
      return () => controller.abort()
    }

    const timeoutId = window.setTimeout(async () => {
      setIsAssessing(true)
      try {
        const backendResult = await predictRisk(normalizedForm, controller.signal)
        setAssessment(backendResult)
        setAssessmentSource(backendResult.source || 'backend-api')
        saveLatestPrediction({
          prediction: backendResult,
          input: normalizedForm,
          predictedAt: new Date().toISOString(),
        })
      } catch {
        const fallbackResult = {
          ...assessCkdRisk(normalizedForm),
          source: 'local-fallback',
        }

        setAssessment(fallbackResult)
        setAssessmentSource('local-fallback')
        saveLatestPrediction({
          prediction: fallbackResult,
          input: normalizedForm,
          predictedAt: new Date().toISOString(),
        })
      } finally {
        setIsAssessing(false)
      }
    }, 150)

    return () => {
      controller.abort()
      window.clearTimeout(timeoutId)
    }
  }, [form, refreshToken])

  const updateField = (field) => (event) => {
    const value = event.target.value
    setForm((current) => ({
      ...current,
      [field]: field === 'diabetes' || field === 'gender' ? value : value === '' ? '' : toNumber(value),
    }))
  }

  return (
    <section className="dashboard dashboard-assessment" id="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">CKD dashboard</p>
          <h1>Enter patient values to check CKD risk</h1>
          <p>Fill the inputs, then the dashboard updates with a risk verdict and the main signals behind it.</p>
        </div>
        <div className="header-actions">
          <div className="assessment-pill">
          </div>
          <Link className="analysis-link" to="/analysis">
            View analysis graphs
          </Link>
        </div>
      </div>

      <div className="assessment-layout">
        <form className="assessment-form-card">
          <div className="card-heading">
            <h2>Patient Inputs</h2>
            <span>Required fields for the CKD check</span>
          </div>

          <div className="form-grid">
            <label>
              <span>Time Step</span>
              <input type="number" min="0" value={form.time_step} onChange={updateField('time_step')} />
            </label>

            <label>
              <span>Glucose</span>
              <input type="number" min="0" step="0.1" value={form.glucose} onChange={updateField('glucose')} />
            </label>

            <label>
              <span>Diabetes</span>
              <select value={form.diabetes} onChange={updateField('diabetes')}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </label>

            <label>
              <span>WBC</span>
              <input type="number" min="0" step="0.1" value={form.wbc} onChange={updateField('wbc')} />
            </label>

            <label>
              <span>RBC</span>
              <input type="number" min="0" step="0.1" value={form.rbc} onChange={updateField('rbc')} />
            </label>

            <label>
              <span>Age</span>
              <input type="number" min="0" value={form.age} onChange={updateField('age')} />
            </label>

            <label>
              <span>Gender</span>
              <select value={form.gender} onChange={updateField('gender')}>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>
              <span>eGFR</span>
              <input type="number" min="0" step="0.1" value={form.egfr} onChange={updateField('egfr')} />
            </label>

            <label>
              <span>Creatinine Rate</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.creatinine_rate}
                onChange={updateField('creatinine_rate')}
              />
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-assess" onClick={() => setRefreshToken((value) => value + 1)}>
              <span>Assess Risk</span>
              <span className="btn-icon">→</span>
            </button>
            <button
              type="button"
              className="btn-reset"
              onClick={() => setForm(initialForm)}
            >
              Reset
            </button>
          </div>
        </form>

        <aside className="assessment-result-card">
          <div className="card-heading">
            <h2>Risk Verdict</h2>
            <span>Updated from the current values</span>
          </div>

          <div className={`verdict verdict-${assessment.riskLevel.toLowerCase()}`}>
            {assessment.riskLevel === 'Low' ? <CheckCircle2 size={24} /> : <ShieldAlert size={24} />}
            <div>
              <strong>{assessment.riskState}</strong>
              <span>{assessment.riskLevel} CKD risk</span>
            </div>
          </div>

          <div className="risk-meter-block">
            <div className="risk-meter-label">
              <span>Risk score</span>
              <strong>{assessment.score}%</strong>
            </div>
            <div className="risk-meter-track">
              <div className={`risk-meter-fill verdict-${assessment.riskLevel.toLowerCase()}`} style={{ width: `${assessment.score}%` }} />
            </div>
          </div>

          <div className="result-summary">
            <div className="result-badge">
              {assessment.riskLevel === 'Low' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              <span>{assessment.riskLevel}</span>
            </div>

            <div className="result-text">
              <h3>{assessment.signals.length ? 'Key signals' : 'No major CKD signals detected'}</h3>
              {assessment.signals.length ? (
                <ul>
                  {assessment.signals.map((signal) => (
                    <li key={signal}>{signal}</li>
                  ))}
                </ul>
              ) : (
                <p>The current values do not cross the simple risk thresholds in this dashboard.</p>
              )}
            </div>
          </div>
        </aside>
      </div>

    </section>
  )
}
