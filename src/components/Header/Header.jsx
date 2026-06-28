import { Link, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import logoHeader from '../../assets/logo-header.png'
import './Header.css'

function Header() {
  const location = useLocation()

  const servicioLinks = [
    { to: '/servicios', label: 'Todos los servicios' },
    { to: '/erp', label: 'ERP / SAP Business One' },
    { to: '/desarrollo', label: 'Desarrollo, automatizaciones e IA' }
  ]

  const navItems = [
    { to: '/', label: 'INICIO' },
    { to: '/nosotros', label: 'SOBRE NOSOTROS' },
    { to: '/servicios', label: 'SERVICIOS', children: servicioLinks },
    { to: '/soporte', label: 'SOPORTE 24/7' }
  ]

  const esActivo = (item) => {
    if (location.pathname === item.to) return true
    if (item.children) return item.children.some((c) => c.to === location.pathname)
    return false
  }

  return (
    <header className="header">
      <Link to="/" className="header-left">
        <img src={logoHeader} alt="WileyTEC Logo" className="header-logo" />
        <span className="logo-text">Wiley<span className="logo-accent">TEC</span></span>
      </Link>

      <nav className="header-nav">
        {navItems.map((item) => (
          item.children ? (
            <div className="nav-dropdown" key={item.to}>
              <Link to={item.to} className={`nav-link nav-link--parent ${esActivo(item) ? 'active' : ''}`}>
                {item.label}
                <ChevronDown size={14} className="nav-caret" />
              </Link>
              <div className="nav-submenu">
                {item.children.map((c) => (
                  <Link key={c.to} to={c.to} className={`nav-sublink ${location.pathname === c.to ? 'active' : ''}`}>{c.label}</Link>
                ))}
              </div>
            </div>
          ) : (
            <Link key={item.to} to={item.to} className={`nav-link ${esActivo(item) ? 'active' : ''}`}>
              {item.label}
            </Link>
          )
        ))}
      </nav>

      <div className="header-right">
        <Link to="/soporte#contacto" className="btn-contact">
          <span className="btn-contact-full">PONERSE EN CONTACTO</span>
          <span className="btn-contact-short">CONTACTO</span>
        </Link>
      </div>
    </header>
  )
}

export default Header