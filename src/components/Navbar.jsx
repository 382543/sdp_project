import { Menu } from 'lucide-react'
import './Navbar.css'

export default function Navbar({ onToggleSidebar }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onToggleSidebar}>
          <Menu size={24} />
        </button>
      </div>


    </nav>
  )
}
