import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, AlertTriangle, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react'
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


export default function Dashboard() {
  const [form, setForm] = useState(initialForm)
  const [refreshToken, setRefreshToken] = useState(0)
  const [assessment, setAssessment] = useState(null)
  const [isAssessing, setIsAssessing] = useState(false)
  const [assessmentSource, setAssessmentSource] = useState(null)

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

    setIsAssessing(true)
    const timeoutId = window.setTimeout(async () => {
      try {
        const backendResult = await predictRisk(normalizedForm, controller.signal)
        setAssessment(backendResult)
        setAssessmentSource(backendResult.source || 'backend-api')
        saveLatestPrediction({
          prediction: backendResult,
          input: normalizedForm,
          predictedAt: new Date().toISOString(),
        })
      } catch (error) {
        setAssessment({
          riskLevel: 'Error',
          riskState: 'Connection Failed',
          score: 0,
          signals: ['Failed to connect to the backend server. Please ensure the backend is running.'],
          isError: true,
        })
        setAssessmentSource('error')
      } finally {
        setIsAssessing(false)
      }
    }, 600)

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
            <button 
              type="button" 
              className="btn-assess" 
              onClick={() => setRefreshToken((value) => value + 1)}
              disabled={isAssessing}
            >
              {isAssessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Assess Risk</span>
                  <span className="btn-icon">→</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="btn-reset"
              onClick={() => setForm(initialForm)}
              disabled={isAssessing}
            >
              Reset
            </button>
          </div>
        </form>

        <aside className="assessment-result-card">
          <div className="card-heading">
            <h2>Risk Predict</h2>
            <span>Updated from the current values</span>
          </div>

          {isAssessing ? (
            <div className="assessment-loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '16px', color: '#64748b' }}>
              <Loader2 className="animate-spin" size={48} color="#0f766e" />
              <p style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>Processing your risk...</p>
            </div>
          ) : assessment ? (
            assessment.isError ? (
              <div className="assessment-error-state" style={{ padding: '40px 20px', textAlign: 'center', color: '#ef4444' }}>
                <ShieldAlert size={48} style={{ margin: '0 auto 16px', color: '#ef4444' }} />
                <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '600' }}>{assessment.riskState}</h3>
                <p style={{ margin: 0, fontSize: '14px' }}>{assessment.signals[0]}</p>
              </div>
            ) : (
              <>
                <div className={`verdict verdict-${assessment.riskLevel?.toLowerCase()}`}>
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
                    <div className={`risk-meter-fill verdict-${assessment.riskLevel?.toLowerCase()}`} style={{ width: `${assessment.score}%` }} />
                  </div>
                </div>

                <div className="result-summary">
                  <div className="result-badge">
                    {assessment.riskLevel === 'Low' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                    <span>{assessment.riskLevel}</span>
                  </div>

                  <div className="result-text">
                    <h3>{assessment.signals?.length ? 'Key signals' : 'No major CKD signals detected'}</h3>
                    {assessment.signals?.length ? (
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
              </>
            )
          ) : (
            <div className="assessment-empty-state" style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
              <Activity size={48} style={{ margin: '0 auto 16px', color: '#94a3b8' }} />
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '500' }}>No Assessment Yet</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>Enter patient values and click Assess Risk to see results.</p>
            </div>
          )}
        </aside>
      </div>

    </section>
  )
}
