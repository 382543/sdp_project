import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Analysis from './pages/Analysis'
import DiseaseDetails from './pages/DiseaseDetails'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} />
      <div className="main-content">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/disease-details" element={<DiseaseDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
