import { Activity, BarChart3, BookOpen, LogIn, UserPlus, Droplets, HeartPulse } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <section className="home-page">
      <div className="home-hero-banner">
        <div className="hero-icon hero-icon-one" aria-hidden="true">
          <Droplets size={80} />
        </div>
        <div className="hero-icon hero-icon-two" aria-hidden="true">
          <HeartPulse size={120} />
        </div>
        <div className="hero-icon hero-icon-three" aria-hidden="true">
          <Activity size={96} />
        </div>

        <div className="home-hero-left">
          <p className="home-eyebrow">Kidney Care Platform</p>
          <h1>Healthy Kidney</h1>
          <span className="hero-line" />
          <p>
            Understand CKD stages, review patient risk clearly, and make better decisions with
            organized medical insights.
          </p>

          <div className="home-hero-actions">
            <Link className="home-btn learn" to="/disease-details">
              Learn More
            </Link>
            <Link className="home-btn auth" to="/login">
              <LogIn size={18} />
              Login
            </Link>
          </div>
        </div>

        <div className="home-hero-right">
          <div className="animated-ui-container">
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay"></div>
            
            <div className="floating-stat stat-1">
              <HeartPulse size={28} className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">98 bpm</span>
                <span className="stat-label">Heart Rate</span>
              </div>
            </div>
            
            <div className="floating-stat stat-2">
              <Activity size={28} className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">120/80</span>
                <span className="stat-label">Blood Pressure</span>
              </div>
            </div>

            <div className="floating-stat stat-3">
              <Droplets size={28} className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">95%</span>
                <span className="stat-label">Hydration Level</span>
              </div>
            </div>
            
            <div className="center-medical-icon">
              <Activity size={80} color="#0284c7" />
            </div>
          </div>
        </div>

      </div>

      <div className="home-grid">
        <article className="home-card">
          <div className="home-card-icon">
            <Activity size={18} />
          </div>
          <h3>Live Risk Assessment</h3>
          <p>
            Enter patient values such as eGFR, glucose, RBC, and creatinine to generate
            an immediate risk result.
          </p>
        </article>

        <article className="home-card">
          <div className="home-card-icon">
            <BarChart3 size={18} />
          </div>
          <h3>Interpretable Analysis</h3>
          <p>
            Review trend charts, stage distribution, and model quality metrics with
            easy explanations.
          </p>
        </article>

        <article className="home-card">
          <div className="home-card-icon">
            <BookOpen size={18} />
          </div>
          <h3>Disease Education</h3>
          <p>
            Explore CKD stages, risk factors, and prevention steps in a clear, guided format.
          </p>
        </article>
      </div>
    </section>
  )
}
