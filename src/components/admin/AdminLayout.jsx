import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Inbox,
  Server,
  Database,
  HardDrive,
  Users,
  MessageCircle,
  HelpCircle,
  Clock,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAdminTheme } from '../../context/AdminThemeContext'
import ThemeToggle from './ThemeToggle'
import logoWiley from '../../assets/logo-header.png'
import logoWileyDark from '../../assets/logo-header-dark.png'
import '../../styles/admin-theme.css'
import './AdminLayout.css'

function AdminLayout() {
  const { admin, logout } = useAuth()
  const { theme } = useAdminTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Variante del logo segun el tema activo. Para cambiar el diseno oficial
  // del logo claro basta reemplazar el archivo assets/logo-header-dark.png.
  const logoSrc = theme === 'light' ? logoWileyDark : logoWiley

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/mensajes', icon: Inbox, label: 'Mensajes' },
    { path: '/admin/planes-hosting', icon: Server, label: 'Planes Hosting' },
    { path: '/admin/planes-vps', icon: HardDrive, label: 'Planes VPS' },
    { path: '/admin/planes-bigdata', icon: Database, label: 'Planes Big Data' },
    { path: '/admin/equipo', icon: Users, label: 'Equipo' },
    { path: '/admin/whatsapp', icon: MessageCircle, label: 'WhatsApp' },
    { path: '/admin/faqs', icon: HelpCircle, label: 'FAQs' },
    { path: '/admin/historial', icon: Clock, label: 'Historial' }
  ]

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="admin-layout" data-theme={theme}>

      {/* ========== SIDEBAR ========== */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>

        {/* Logo y nombre */}
        <div className="sidebar-header">
          <Link to="/admin/dashboard" className="sidebar-logo">
            <img src={logoSrc} alt="WileyTEC" className="sidebar-logo-img" />
            {sidebarOpen && (
              <span className="sidebar-logo-text">
                Wiley<span className="accent">TEC</span>
              </span>
            )}
          </Link>
        </div>

        {/* Menu de navegacion */}
        <nav className="sidebar-nav">
          <span className="sidebar-section-title">{sidebarOpen ? 'PRINCIPAL' : ''}</span>
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                title={item.label}
              >
                <Icon size={20} className="sidebar-icon" />
                {sidebarOpen && <span className="sidebar-label">{item.label}</span>}
                {isActive(item.path) && <span className="sidebar-active-indicator"></span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer del sidebar */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout" title="Cerrar sesion">
            <LogOut size={18} />
            {sidebarOpen && <span>Cerrar sesion</span>}
          </button>
        </div>
      </aside>

      {/* ========== AREA PRINCIPAL ========== */}
      <div className="admin-main">

        {/* HEADER */}
        <header className="admin-header">

          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="header-title">
            <h1>Panel Administrativo</h1>
            <p>Gestiona todo el contenido de WileyTEC</p>
          </div>

          <div className="header-actions">

            <ThemeToggle />

            <button className="header-notifications" aria-label="Notificaciones">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>

            <div className="header-user">
              <button
                className="user-menu-trigger"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="user-avatar">
                  {admin?.nombre?.charAt(0) || 'A'}
                </div>
                <div className="user-info">
                  <span className="user-name">{admin?.nombre || 'Admin'}</span>
                  <span className="user-role">{admin?.rol || 'admin'}</span>
                </div>
                <ChevronDown size={16} className={`user-chevron ${userMenuOpen ? 'open' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-info">
                    <span className="dropdown-name">{admin?.nombre}</span>
                    <span className="dropdown-email">{admin?.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item">
                    <LogOut size={16} />
                    <span>Cerrar sesion</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </header>

        {/* CONTENIDO PRINCIPAL (cambia segun la ruta) */}
        <main className="admin-content">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default AdminLayout