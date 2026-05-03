import React, { useState } from 'react'
import './DiseaseDetails.css'

export default function DiseaseDetails() {
  const [activeStage, setActiveStage] = useState(1)

  const stages = [
    {
      id: 1,
      name: 'Stage 1: At Risk',
      gfr: 'GFR ≥ 90',
      description: 'Kidney filtering is still normal, but risk factors or early kidney injury markers are present.',
      symptoms: ['Usually no obvious symptoms', 'Urine test may show protein or albumin', 'Blood pressure and sugar control become very important'],
      color: '#10b981',
    },
    {
      id: 2,
      name: 'Stage 2: Early Damage',
      gfr: 'GFR 60-89',
      description: 'Mild decline in kidney function with early structural or laboratory changes.',
      symptoms: ['Most people still feel well', 'Mild protein loss in urine may appear', 'Regular follow-up helps prevent progression'],
      color: '#f59e0b',
    },
    {
      id: 3,
      name: 'Stage 3: Moderate Damage',
      gfr: 'GFR 30-59',
      description: 'Moderate kidney damage where waste removal becomes less efficient.',
      symptoms: ['Tiredness or low energy', 'Swelling in ankles, hands, or face', 'Blood pressure may rise and need tighter control'],
      color: '#f97316',
    },
    {
      id: 4,
      name: 'Stage 4: Severe Damage',
      gfr: 'GFR 15-29',
      description: 'Severe reduction in kidney function with high risk of progressing to kidney failure.',
      symptoms: ['Weakness and poor appetite', 'Bone and mineral imbalance symptoms', 'Difficulty focusing or mental fatigue'],
      color: '#dc2626',
    },
    {
      id: 5,
      name: 'Stage 5: Kidney Failure',
      gfr: 'GFR < 15',
      description: 'Kidney failure (ESRD). Kidney replacement therapy such as dialysis or transplant is usually required.',
      symptoms: ['Severe nausea, vomiting, or appetite loss', 'Fluid overload and breathlessness', 'Uremic symptoms from toxin buildup'],
      color: '#7f1d1d',
    },
  ]

  const riskFactors = [
    { name: 'Diabetes', icon: '🩺', risk: 'Very High', detail: 'High blood sugar can damage kidney filters over time.' },
    { name: 'High Blood Pressure', icon: '💓', risk: 'Very High', detail: 'Persistent pressure injures kidney blood vessels.' },
    { name: 'Obesity', icon: '⚖️', risk: 'High', detail: 'Raises risk of diabetes, hypertension, and CKD progression.' },
    { name: 'Smoking', icon: '🚬', risk: 'High', detail: 'Reduces kidney blood flow and worsens vascular damage.' },
    { name: 'Age (65+)', icon: '👴', risk: 'Medium', detail: 'Kidney function naturally declines with age in many people.' },
    { name: 'Family History', icon: '👨‍👩‍👧', risk: 'High', detail: 'Genetic and shared lifestyle factors can increase risk.' },
  ]

  const preventionTips = [
    { title: 'Control Blood Sugar', description: 'Follow your diabetes plan to keep glucose near target and protect kidney filters.' },
    { title: 'Monitor Blood Pressure', description: 'Aim for clinician-recommended BP goals (often below 130/80 mmHg).' },
    { title: 'Kidney-Friendly Diet', description: 'Reduce sodium, avoid excess processed foods, and follow protein guidance from your doctor.' },
    { title: 'Stay Physically Active', description: 'Target at least 150 minutes of moderate activity each week, based on your fitness level.' },
    { title: 'Stop Smoking', description: 'Quitting smoking improves blood vessel health and slows kidney decline.' },
    { title: 'Use Medicines Safely', description: 'Avoid unnecessary painkillers (NSAIDs) and review medications with your provider.' },
  ]

  const kidneyCharacters = [
    {
      id: 'healthy',
      title: 'Healthy Kidney',
      subtitle: 'Good filtration and stable function',
      color: '#f87171',
      accent: '#22c55e',
      mood: 'healthy',
    },
    {
      id: 'mild',
      title: 'Mild CKD',
      subtitle: 'Early decline, usually manageable',
      color: '#fb7185',
      accent: '#f59e0b',
      mood: 'mild',
    },
    {
      id: 'severe',
      title: 'Severe CKD',
      subtitle: 'Advanced damage needs close care',
      color: '#ef4444',
      accent: '#8b5cf6',
      mood: 'severe',
    },
  ]

  const activeKidney = activeStage <= 2 ? kidneyCharacters[0] : activeStage === 3 ? kidneyCharacters[1] : kidneyCharacters[2]

  return (
    <section className="disease-details">
      {/* Header */}
      <div className="disease-header">
        <div>
          <p className="eyebrow">Understanding CKD</p>
          <h1>Chronic Kidney Disease (CKD) Explained</h1>
          <p>A simple guide to how CKD progresses, what signs to watch for, and how to reduce risk early.</p>
        </div>
      </div>

      {/* CKD Stage Animation */}
      <div className="disease-container">
        <div className="stage-animation">
          <h2>CKD Progression Stages</h2>
          <div className="stage-layout">
            {/* Animated Kidney Visualization */}
            <div className="kidney-visualization">
              <div className="kidney-strip kidney-strip-transparent">
                <div className={`kidney-card kidney-card-single ${activeKidney.id === 'healthy' ? 'mood-healthy' : activeKidney.id === 'mild' ? 'mood-mild' : 'mood-severe'}`}>
                  <svg viewBox="0 0 140 170" className="kidney-card-svg kidney-cartoon-svg" aria-hidden="true">
                    <ellipse cx="70" cy="150" rx="34" ry="7" fill="rgba(17,24,39,0.08)" />
                    <g className="kidney-cartoon-figure">
                      <path
                        d="M 70 18 C 52 18 39 32 36 49 C 33 66 38 84 49 96 C 61 109 79 113 92 106 C 104 99 107 85 103 72 C 100 60 100 49 106 39 C 112 28 106 18 92 17 C 86 16 78 17 70 18 Z"
                        fill={activeKidney.color}
                        stroke="#ffffff"
                        strokeWidth="3"
                        strokeLinejoin="round"
                      />

                      {activeKidney.id === 'healthy' && (
                        <>
                          <circle cx="58" cy="54" r="5" fill="#fff" />
                          <circle cx="83" cy="54" r="5" fill="#fff" />
                          <circle cx="58" cy="55" r="1.8" fill="#111827" />
                          <circle cx="83" cy="55" r="1.8" fill="#111827" />
                          <path d="M 58 69 Q 70 79 82 69" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                          <path d="M 52 33 Q 59 24 66 30" fill="none" stroke="#fef3c7" strokeWidth="3" strokeLinecap="round" />
                          <path d="M 96 28 L 100 20 L 104 28 L 112 32 L 104 36 L 100 44 L 96 36 L 88 32 Z" fill="#fef08a" opacity="0.95" />
                        </>
                      )}

                      {activeKidney.id === 'mild' && (
                        <>
                          <path d="M 52 29 Q 58 24 62 28" fill="none" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
                          <path d="M 78 29 Q 84 24 88 28" fill="none" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
                          <ellipse cx="57" cy="52" rx="4.5" ry="3.8" fill="#fff" />
                          <ellipse cx="84" cy="52" rx="4.5" ry="3.8" fill="#fff" />
                          <circle cx="57" cy="53" r="1.6" fill="#111827" />
                          <circle cx="84" cy="53" r="1.6" fill="#111827" />
                          <path d="M 58 68 Q 70 74 82 68" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
                          <path d="M 90 66 Q 100 70 104 80" fill="none" stroke="#fde68a" strokeWidth="4" strokeLinecap="round" />
                          <path d="M 46 38 Q 38 44 40 54" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2.4" strokeLinecap="round" />
                        </>
                      )}

                      {activeKidney.id === 'severe' && (
                        <>
                          <path d="M 52 30 Q 58 36 54 41" fill="none" stroke="#7f1d1d" strokeWidth="3" strokeLinecap="round" />
                          <path d="M 79 30 Q 85 36 81 41" fill="none" stroke="#7f1d1d" strokeWidth="3" strokeLinecap="round" />
                          <circle cx="57" cy="53" r="4.3" fill="#fff" />
                          <circle cx="84" cy="53" r="4.3" fill="#fff" />
                          <circle cx="57" cy="54" r="1.5" fill="#111827" />
                          <circle cx="84" cy="54" r="1.5" fill="#111827" />
                          <path d="M 58 70 Q 70 62 82 70" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                          <path d="M 48 44 L 52 48 L 48 52 L 52 56" fill="none" stroke="#fff7ed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
                          <path d="M 94 42 L 98 46 L 94 50 L 98 54" fill="none" stroke="#fff7ed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
                          <path d="M 44 80 L 35 93" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
                          <path d="M 95 82 L 106 95" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
                          <rect x="17" y="68" width="22" height="10" rx="4" fill="#fde68a" opacity="0.95" transform="rotate(-14 17 68)" />
                        </>
                      )}

                      <path d="M 51 41 Q 39 34 31 40" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 89 41 Q 101 34 109 40" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="3" strokeLinecap="round" />

                      <path d="M 40 67 Q 28 61 22 52" fill="none" stroke="#7dd3fc" strokeWidth="5.5" strokeLinecap="round" />
                      <path d="M 100 67 Q 112 61 118 52" fill="none" stroke="#fde68a" strokeWidth="5.5" strokeLinecap="round" />
                    </g>
                  </svg>
                  <div className="kidney-caption">
                    <strong>{activeKidney.title}</strong>
                    <span>{activeKidney.subtitle}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage Details */}
            <div className="stage-details">
              {stages.map((stage) => (
                activeStage === stage.id && (
                  <div key={stage.id} className="stage-info">
                    <h3>{stage.name}</h3>
                    <div className="gfr-badge">{stage.gfr}</div>
                    <p className="stage-description">{stage.description}</p>
                    <div className="symptoms">
                      <h4>What this stage may look like:</h4>
                      <ul>
                        {stage.symptoms.map((symptom, idx) => (
                          <li key={idx}>{symptom}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Stage Buttons */}
          <div className="stage-buttons">
            {stages.map((stage) => (
              <button
                key={stage.id}
                className={`stage-btn ${activeStage === stage.id ? 'active' : ''}`}
                onClick={() => setActiveStage(stage.id)}
                style={activeStage === stage.id ? { backgroundColor: stage.color } : {}}
              >
                Stage {stage.id}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Factors */}
        <div className="risk-factors">
          <h2>Risk Factors for CKD</h2>
          <div className="factors-grid">
            {riskFactors.map((factor, idx) => (
              <div key={idx} className="factor-card">
                <div className="factor-icon">{factor.icon}</div>
                <h4>{factor.name}</h4>
                <p>{factor.detail}</p>
                <span className={`risk-badge risk-${factor.risk.toLowerCase().replace(' ', '-')}`}>
                  {factor.risk}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Prevention Tips */}
        <div className="prevention-tips">
          <h2>How to Prevent or Slow CKD</h2>
          <div className="tips-grid">
            {preventionTips.map((tip, idx) => (
              <div key={idx} className="tip-card">
                <div className="tip-number">{idx + 1}</div>
                <h4>{tip.title}</h4>
                <p>{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notice */}
        <div className="notice">
          <h3>⚠️ Important Information</h3>
          <p>
            This educational content is for informational purposes only and should not be used as a substitute for professional medical advice.
            Always consult with a healthcare provider for diagnosis and treatment.
          </p>
        </div>
      </div>
    </section>
  )
}
