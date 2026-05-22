import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Inbox,
  Server,
  Users,
  Clock,
  TrendingUp,
  ArrowRight,
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Loader,
  HelpCircle,
  Database,
  HardDrive
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  contactosAPI,
  planesHostingAPI,
  planesVPSAPI,
  planesBigDataAPI,
  equipoAPI,
  faqsAPI,
  historialAPI
} from '../../services/api'
import './AdminDashboard.css'

// Helper para tiempo relativo
const tiempoRelativo = (fecha) => {
  const ahora = new Date()
  const fechaObj = new Date(fecha)
  const diffMs = ahora - fechaObj
  const diffMin = Math.floor(diffMs / 60000)
  const diffHrs = Math.floor(diffMs / 3600000)
  const diffDias = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'hace un momento'
  if (diffMin < 60) return `hace ${diffMin} min`
  if (diffHrs < 24) return `hace ${diffHrs}h`
  if (diffDias === 1) return 'ayer'
  if (diffDias < 7) return `hace ${diffDias}d`
  return fechaObj.toLocaleDateString('es-PE')
}

const iconoPorAccion = {
  crear: Plus,
  actualizar: Edit,
  eliminar: Trash2
}

const colorPorAccion = {
  crear: '#2ecc71',
  actualizar: '#4a9eff',
  eliminar: '#ef4444'
}

const nombreTabla = {
  planes_hosting: 'Planes Hosting',
  planes_vps: 'Planes VPS',
  planes_bigdata: 'Planes Big Data',
  equipo: 'Equipo',
  faqs: 'FAQs',
  contactos: 'Mensajes'
}

function AdminDashboard() {
  const { admin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Datos
  const [mensajes, setMensajes] = useState([])
  const [planesHosting, setPlanesHosting] = useState([])
  const [planesVPS, setPlanesVPS] = useState([])
  const [planesBigData, setPlanesBigData] = useState([])
  const [equipo, setEquipo] = useState([])
  const [faqs, setFaqs] = useState([])
  const [historial, setHistorial] = useState([])

  useEffect(() => {
    cargarDashboard()
  }, [])

  const cargarDashboard = async () => {
    try {
      setLoading(true)

      // Cargar TODO en paralelo (más rápido)
      const [
        msgData,
        hostingData,
        vpsData,
        bigDataData,
        equipoData,
        faqsData,
        histData
      ] = await Promise.all([
        contactosAPI.listar(),
        planesHostingAPI.listar(),
        planesVPSAPI.listar(),
        planesBigDataAPI.listar(),
        equipoAPI.listar(),
        faqsAPI.listar(),
        historialAPI.listar()
      ])

      setMensajes(msgData.contactos || [])
      setPlanesHosting(hostingData.planes || [])
      setPlanesVPS(vpsData.planes || [])
      setPlanesBigData(bigDataData.planes || [])
      setEquipo(equipoData.equipo || equipoData.miembros || [])
      setFaqs(faqsData.faqs || [])
      setHistorial(histData.historial || histData.cambios || [])

    } catch (err) {
      console.error('Error cargando dashboard:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Calculos
  const mensajesNuevos = mensajes.filter(m => m.estado === 'nuevo').length
  const mensajesHoy = mensajes.filter(m => {
    const hoy = new Date().toDateString()
    return new Date(m.fecha_recibido).toDateString() === hoy
  }).length

  const totalPlanes = planesHosting.length + planesVPS.length + planesBigData.length

  // Mensajes recientes (los 5 mas recientes)
  const mensajesRecientes = [...mensajes]
    .sort((a, b) => new Date(b.fecha_recibido) - new Date(a.fecha_recibido))
    .slice(0, 5)

  // Cambios recientes (los 5 mas recientes)
  const cambiosRecientes = [...historial]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5)

  // Mensajes por servicio (para grafico)
  const mensajesPorServicio = mensajes.reduce((acc, msg) => {
    acc[msg.servicio] = (acc[msg.servicio] || 0) + 1
    return acc
  }, {})

  const totalMensajesGrafico = Object.values(mensajesPorServicio).reduce((a, b) => a + b, 0)

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader size={48} className="spin" style={{ color: '#F0A815' }} />
        <p>Cargando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">

      {/* WELCOME BANNER */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1>Bienvenido, <span className="accent-gold">{admin?.nombre || 'Admin'}</span> </h1>
          <p>Aqui tienes un resumen del estado actual de WileyTEC</p>
        </div>
        <div className="welcome-decoration">
          <TrendingUp size={64} />
        </div>
      </div>

      {error && (
        <div className="dashboard-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI CARDS - 4 metricas principales */}
      <div className="kpi-grid">

        <Link to="/admin/mensajes" className="kpi-card">
          <div className="kpi-icon kpi-gold">
            <Inbox size={26} />
          </div>
          <div className="kpi-content">
            <span className="kpi-number">{mensajes.length}</span>
            <span className="kpi-label">Mensajes recibidos</span>
            {mensajesNuevos > 0 && (
              <span className="kpi-badge">
                <AlertCircle size={12} /> {mensajesNuevos} sin atender
              </span>
            )}
          </div>
          <ArrowRight size={18} className="kpi-arrow" />
        </Link>

        <Link to="/admin/planes-hosting" className="kpi-card">
          <div className="kpi-icon kpi-blue">
            <Server size={26} />
          </div>
          <div className="kpi-content">
            <span className="kpi-number">{totalPlanes}</span>
            <span className="kpi-label">Planes activos</span>
            <span className="kpi-sub">
              {planesHosting.length} Hosting · {planesVPS.length} VPS · {planesBigData.length} BigData
            </span>
          </div>
          <ArrowRight size={18} className="kpi-arrow" />
        </Link>

        <Link to="/admin/equipo" className="kpi-card">
          <div className="kpi-icon kpi-purple">
            <Users size={26} />
          </div>
          <div className="kpi-content">
            <span className="kpi-number">{equipo.length}</span>
            <span className="kpi-label">Miembros del equipo</span>
            <span className="kpi-sub">{faqs.length} FAQs publicadas</span>
          </div>
          <ArrowRight size={18} className="kpi-arrow" />
        </Link>

        <Link to="/admin/historial" className="kpi-card">
          <div className="kpi-icon kpi-green">
            <Clock size={26} />
          </div>
          <div className="kpi-content">
            <span className="kpi-number">{historial.length}</span>
            <span className="kpi-label">Cambios registrados</span>
            <span className="kpi-sub">Auditoria completa</span>
          </div>
          <ArrowRight size={18} className="kpi-arrow" />
        </Link>

      </div>

      {/* PANELES PRINCIPALES */}
      <div className="dashboard-grid">

        {/* PANEL: Mensajes recientes */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2><Mail size={20} /> Mensajes recientes</h2>
              <p>Ultimas consultas del formulario de contacto</p>
            </div>
            <Link to="/admin/mensajes" className="panel-link">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>

          {mensajesRecientes.length === 0 ? (
            <div className="panel-empty">
              <MessageSquare size={32} />
              <p>Aun no hay mensajes</p>
            </div>
          ) : (
            <div className="messages-list">
              {mensajesRecientes.map(msg => (
                <div className="message-item" key={msg.id}>
                  <div className="message-avatar">
                    {msg.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="message-info">
                    <div className="message-top">
                      <span className="message-name">{msg.nombre}</span>
                      <span className="message-time">{tiempoRelativo(msg.fecha_recibido)}</span>
                    </div>
                    <div className="message-bottom">
                      <span className="message-service">{msg.servicio}</span>
                      {msg.estado === 'nuevo' ? (
                        <span className="status-pill status-new">● Nuevo</span>
                      ) : (
                        <span className="status-pill status-done">
                          <CheckCircle size={10} /> Atendido
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PANEL: Distribucion por servicio */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2><TrendingUp size={20} /> Consultas por servicio</h2>
              <p>Distribucion de mensajes recibidos</p>
            </div>
          </div>

          {totalMensajesGrafico === 0 ? (
            <div className="panel-empty">
              <TrendingUp size={32} />
              <p>Sin datos aun</p>
            </div>
          ) : (
            <div className="chart-bars">
              {Object.entries(mensajesPorServicio)
                .sort((a, b) => b[1] - a[1])
                .map(([servicio, cantidad]) => {
                  const porcentaje = (cantidad / totalMensajesGrafico) * 100
                  return (
                    <div className="chart-bar-row" key={servicio}>
                      <div className="bar-header">
                        <span className="bar-name">{servicio}</span>
                        <span className="bar-value">{cantidad}</span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${porcentaje}%` }}
                        ></div>
                      </div>
                      <span className="bar-percent">{porcentaje.toFixed(0)}%</span>
                    </div>
                  )
                })}
            </div>
          )}
        </div>

      </div>

      {/* PANEL ANCHO: Actividad reciente */}
      <div className="dashboard-panel dashboard-panel-full">
        <div className="panel-header">
          <div>
            <h2><Clock size={20} /> Actividad reciente</h2>
            <p>Ultimos cambios realizados en el sistema</p>
          </div>
          <Link to="/admin/historial" className="panel-link">
            Ver historial completo <ArrowRight size={14} />
          </Link>
        </div>

        {cambiosRecientes.length === 0 ? (
          <div className="panel-empty">
            <Clock size={32} />
            <p>Aun no hay actividad registrada</p>
          </div>
        ) : (
          <div className="activity-list">
            {cambiosRecientes.map(cambio => {
              const Icon = iconoPorAccion[cambio.accion] || Edit
              const color = colorPorAccion[cambio.accion] || '#4a9eff'

              return (
                <div className="activity-item" key={cambio.id}>
                  <div
                    className="activity-icon"
                    style={{
                      background: `${color}20`,
                      color: color,
                      borderColor: `${color}50`
                    }}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">
                      <strong>{cambio.admin_nombre || 'Sistema'}</strong> {cambio.descripcion}
                    </p>
                    <div className="activity-meta">
                      <span className="activity-tag">
                        {nombreTabla[cambio.tabla_afectada] || cambio.tabla_afectada}
                      </span>
                      <span className="activity-time">{tiempoRelativo(cambio.fecha)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ACCESOS RAPIDOS */}
      <div className="dashboard-shortcuts">
        <h2>Accesos rapidos</h2>
        <div className="shortcuts-grid">
          <Link to="/admin/planes-hosting" className="shortcut-card">
            <Server size={20} />
            <span>Gestionar Hosting</span>
          </Link>
          <Link to="/admin/planes-vps" className="shortcut-card">
            <HardDrive size={20} />
            <span>Gestionar VPS</span>
          </Link>
          <Link to="/admin/planes-bigdata" className="shortcut-card">
            <Database size={20} />
            <span>Gestionar Big Data</span>
          </Link>
          <Link to="/admin/equipo" className="shortcut-card">
            <Users size={20} />
            <span>Gestionar Equipo</span>
          </Link>
          <Link to="/admin/faqs" className="shortcut-card">
            <HelpCircle size={20} />
            <span>Gestionar FAQs</span>
          </Link>
          <Link to="/admin/mensajes" className="shortcut-card">
            <Mail size={20} />
            <span>Ver Mensajes</span>
          </Link>
        </div>
      </div>

    </div>
  )
}

export default AdminDashboard