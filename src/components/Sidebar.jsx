import { Home, LayoutDashboard, BarChart3, BookOpen } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import kidneyIcon from '../assets/kidney.webp'
import './Sidebar.css'

export default function Sidebar({ isOpen }) {
  const menuItems = [
    { icon: Home, label: 'Home', to: '/home' },
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard', end: true },
    { icon: BarChart3, label: 'Analysis', to: '/analysis' },
    { icon: BookOpen, label: 'Disease Info', to: '/disease-details' },
  ]

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <img src={kidneyIcon} alt="CKD Pro" style={{ width: '36px', height: '36px' }} />
          </div>
          <span>CKD Pro</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>


    </div>
  )
}
