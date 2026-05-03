import React, { useEffect, useState } from 'react'
import { LineChartCard, BarChartCard, ConfusionMatrixCard } from '../components/Charts'
import { loadLatestPrediction } from '../lib/predictionStore'
import './Analysis.css'

export default function Analysis() {
  const [latestPrediction, setLatestPrediction] = useState(null)

  useEffect(() => {
    setLatestPrediction(loadLatestPrediction())
  }, [])

  const prediction = latestPrediction?.prediction
  const input = latestPrediction?.input
  const predictedAt = latestPrediction?.predictedAt

  return (
    <section className="analysis-board" id="analysis-board">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Analysis board</p>
          <h1>Analysis graphs and explanations</h1>
          <p>Interpretability plots and plain-language explanations to help non-technical users.</p>
        </div>
      </div>

      <article className="analysis-latest-card">
        <div className="analysis-latest-head">
          <h2>Latest Dashboard Prediction</h2>
          <span>{predictedAt ? new Date(predictedAt).toLocaleString() : 'No prediction yet'}</span>
        </div>

        {prediction ? (
          <>
            <div className="analysis-latest-metrics">
              <div>
                <span>Risk State</span>
                <strong>{prediction.riskState}</strong>
              </div>
              <div>
                <span>Risk Level</span>
                <strong>{prediction.riskLevel}</strong>
              </div>
              <div>
                <span>Risk Score</span>
                <strong>{prediction.score}%</strong>
              </div>
              <div>
                <span>Source</span>
                <strong>{prediction.source || 'unknown'}</strong>
              </div>
            </div>

            <div className="analysis-latest-signals">
              <h3>Signals</h3>
              {prediction.signals?.length ? (
                <ul>
                  {prediction.signals.map((signal) => (
                    <li key={signal}>{signal}</li>
                  ))}
                </ul>
              ) : (
                <p>No major CKD signals were found in the latest assessment.</p>
              )}
            </div>

            {input ? (
              <div className="analysis-latest-inputs">
                <h3>Input Snapshot</h3>
                <div className="analysis-input-grid">
                  {Object.entries(input).map(([key, value]) => (
                    <div key={key} className="analysis-input-item">
                      <span>{key.replaceAll('_', ' ')}</span>
                      <strong>{String(value)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <p className="analysis-empty">Run an assessment in Dashboard to see the latest prediction details here.</p>
        )}
      </article>

      <div className="analysis-grid">
        <article className="analysis-card">
          <LineChartCard />
          <div className="analysis-explainer">
            <h3>Risk Trend Analysis</h3>
            <p>
              The blue line shows risk movement over time, while the green line shows patient volume.
              If the blue line goes up, the model is seeing more concerning values.
            </p>
            <ul>
              <li>Rising blue points mean higher overall risk.</li>
              <li>Green points help compare risk against the number of patients.</li>
              <li>A steady blue line usually means the risk pattern is stable.</li>
            </ul>
          </div>
        </article>

        <article className="analysis-card">
          <BarChartCard />
          <div className="analysis-explainer">
            <h3>CKD Stage Distribution</h3>
            <p>
              This bar chart shows how many patients are in each stage. Taller bars mean more
              patients fall into that stage.
            </p>
            <ul>
              <li>More patients in Stage 1 or 2 means earlier detection.</li>
              <li>More patients in Stage 4 or 5 means more advanced kidney disease.</li>
              <li>The distribution helps doctors see which stage is most common.</li>
            </ul>
          </div>
        </article>

        <article className="analysis-card analysis-card-wide">
          <ConfusionMatrixCard />
          <div className="analysis-explainer">
            <h3>Model Performance</h3>
            <p>
              The confusion matrix shows how often the model predicted correctly and where it made
              mistakes. Green boxes are correct predictions and red boxes are mistakes.
            </p>
            <ul>
              <li>TN and TP are correct predictions.</li>
              <li>FP means the model predicted risk when there was none.</li>
              <li>FN means the model missed a risky patient, which is the most important error to reduce.</li>
            </ul>
          </div>
        </article>
      </div>
    </section>
  )
}
