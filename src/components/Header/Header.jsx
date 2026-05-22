import { Link, useLocation } from 'react-router-dom'
import logoHeader from '../../assets/logo-header.png'
import './Header.css'

function Header() {
  const location = useLocation()

  const navItems = [
    { to: '/', label: 'INICIO' },
    { to: '/nosotros', label: 'SOBRE NOSOTROS' },
    { to: '/servicios', label: 'SERVICIOS' },
    { to: '/soporte', label: 'SOPORTE 24/7' }
  ]

  return (
    <header className="header">
      <Link to="/" className="header-left">
        <img src={logoHeader} alt="WileyTEC Logo" className="header-logo" />
        <span className="logo-text">Wiley<span className="logo-accent">TEC</span></span>
      </Link>

      <nav className="header-nav">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`nav-link ${location.pathname === item.to ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-right">
        <Link to="/soporte#contacto" className="btn-contact">
  PONERSE EN CONTACTO
</Link>
      </div>
    </header>
  )
}

export default Header