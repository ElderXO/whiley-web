import { useState, useEffect } from 'react'
import {
  Clock,
  Filter,
  Search,
  User,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Database,
  X,
  Eye,
  Loader,
  TrendingUp,
  Activity
} from 'lucide-react'
import { historialAPI } from '../../services/api'
import './AdminHistorial.css'

// Mapa de iconos por accion
const iconoPorAccion = {
  crear: Plus,
  actualizar: Edit,
  eliminar: Trash2
}

// Mapa de colores por accion
const colorPorAccion = {
  crear: 'green',
  actualizar: 'blue',
  eliminar: 'red'
}

// Mapa de nombres bonitos de tablas
const nombreTabla = {
  planes_hosting: 'Planes Hosting',
  planes_vps: 'Planes VPS',
  planes_bigdata: 'Planes Big Data',
  equipo: 'Equipo',
  faqs: 'FAQs',
  contactos: 'Mensajes'
}

function AdminHistorial() {
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroTabla, setFiltroTabla] = useState('todos')
  const [filtroAccion, setFiltroAccion] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null)
  const [stats, setStats] = useState({ total: 0, hoy: 0, semana: 0, creaciones: 0 })

  useEffect(() => {
    cargarHistorial()
  }, [])

  const cargarHistorial = async () => {
    try {
      setLoading(true)
      const data = await historialAPI.listar()
      const registros = data.historial || data.cambios || []
      setHistorial(registros)
      calcularStats(registros)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const calcularStats = (lista) => {
    const ahora = new Date()
    const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
    const inicioSemana = new Date(ahora)
    inicioSemana.setDate(ahora.getDate() - 7)

    setStats({
      total: lista.length,
      hoy: lista.filter(r => new Date(r.fecha) >= inicioHoy).length,
      semana: lista.filter(r => new Date(r.fecha) >= inicioSemana).length,
      creaciones: lista.filter(r => r.accion === 'crear').length
    })
  }

  // Lista de tablas unicas del historial
  const tablasUnicas = [...new Set(historial.map(r => r.tabla_afectada))]

  // Filtrar registros
  const historialFiltrado = historial.filter(r => {
    const coincideTabla = filtroTabla === 'todos' || r.tabla_afectada === filtroTabla
    const coincideAccion = filtroAccion === 'todos' || r.accion === filtroAccion
    const textoBusqueda = busqueda.toLowerCase()
    const coincideBusqueda =
      r.descripcion?.toLowerCase().includes(textoBusqueda) ||
      r.admin_nombre?.toLowerCase().includes(textoBusqueda) ||
      nombreTabla[r.tabla_afectada]?.toLowerCase().includes(textoBusqueda)
    return coincideTabla && coincideAccion && coincideBusqueda
  })

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatearFechaCorta = (fecha) => {
    const ahora = new Date()
    const fechaObj = new Date(fecha)
    const diffMs = ahora - fechaObj
    const diffMin = Math.floor(diffMs / 60000)
    const diffHrs = Math.floor(diffMs / 3600000)
    const diffDias = Math.floor(diffMs / 86400000)

    if (diffMin < 1) return 'Hace un momento'
    if (diffMin < 60) return `Hace ${diffMin} min`
    if (diffHrs < 24) return `Hace ${diffHrs}h`
    if (diffDias < 7) return `Hace ${diffDias}d`
    return formatearFecha(fecha)
  }

  if (loading) {
    return (
      <div className="historial-loading">
        <div className="spinner-large"></div>
        <p>Cargando historial...</p>
      </div>
    )
  }

  return (
    <div className="admin-historial">

      {/* HEADER */}
      <div className="historial-header">
        <div>
          <h1><Clock size={28} /> Historial de Cambios</h1>
          <p>Auditoria completa de todas las modificaciones del sistema</p>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid-hist">
        <div className="stat-card-hist">
          <div className="stat-icon-hist stat-gold">
            <Activity size={22} />
          </div>
          <div className="stat-content-hist">
            <span className="stat-number-hist">{stats.total}</span>
            <span className="stat-label-hist">Cambios totales</span>
          </div>
        </div>

        <div className="stat-card-hist">
          <div className="stat-icon-hist stat-blue">
            <Calendar size={22} />
          </div>
          <div className="stat-content-hist">
            <span className="stat-number-hist">{stats.hoy}</span>
            <span className="stat-label-hist">Hoy</span>
          </div>
        </div>

        <div className="stat-card-hist">
          <div className="stat-icon-hist stat-purple">
            <TrendingUp size={22} />
          </div>
          <div className="stat-content-hist">
            <span className="stat-number-hist">{stats.semana}</span>
            <span className="stat-label-hist">Esta semana</span>
          </div>
        </div>

        <div className="stat-card-hist">
          <div className="stat-icon-hist stat-green">
            <Plus size={22} />
          </div>
          <div className="stat-content-hist">
            <span className="stat-number-hist">{stats.creaciones}</span>
            <span className="stat-label-hist">Creaciones</span>
          </div>
        </div>
      </div>

      {/* FILTROS Y BUSQUEDA */}
      <div className="historial-toolbar">
        <div className="search-box-hist">
          <Search size={18} className="search-icon-hist" />
          <input
            type="text"
            placeholder="Buscar por admin, descripcion o tabla..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="filtros-hist">
          <select
            value={filtroTabla}
            onChange={(e) => setFiltroTabla(e.target.value)}
            className="select-filtro"
          >
            <option value="todos">Todas las secciones</option>
            {tablasUnicas.map(t => (
              <option key={t} value={t}>{nombreTabla[t] || t}</option>
            ))}
          </select>

          <select
            value={filtroAccion}
            onChange={(e) => setFiltroAccion(e.target.value)}
            className="select-filtro"
          >
            <option value="todos">Todas las acciones</option>
            <option value="crear">Creaciones</option>
            <option value="actualizar">Actualizaciones</option>
            <option value="eliminar">Eliminaciones</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="historial-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* TIMELINE */}
      {historialFiltrado.length === 0 ? (
        <div className="historial-empty">
          <Clock size={48} />
          <h3>No hay registros</h3>
          <p>{busqueda || filtroTabla !== 'todos' || filtroAccion !== 'todos'
            ? 'No se encontraron cambios con los filtros aplicados'
            : 'Aun no se han registrado cambios en el sistema'}
          </p>
        </div>
      ) : (
        <div className="historial-timeline">
          {historialFiltrado.map((registro) => {
            const Icon = iconoPorAccion[registro.accion] || Edit
            const color = colorPorAccion[registro.accion] || 'blue'

            return (
              <div className="timeline-item" key={registro.id}>

                <div className={`timeline-dot dot-${color}`}>
                  <Icon size={14} />
                </div>

                <div className="timeline-card">
                  <div className="timeline-header">
                    <div className="timeline-action-info">
                      <span className={`action-badge badge-${color}`}>
                        {registro.accion === 'crear' && 'CREADO'}
                        {registro.accion === 'actualizar' && 'ACTUALIZADO'}
                        {registro.accion === 'eliminar' && 'ELIMINADO'}
                      </span>
                      <span className="tabla-tag">
                        <Database size={12} />
                        {nombreTabla[registro.tabla_afectada] || registro.tabla_afectada}
                      </span>
                    </div>
                    <span className="timeline-time">{formatearFechaCorta(registro.fecha)}</span>
                  </div>

                  <p className="timeline-description">{registro.descripcion}</p>

                  <div className="timeline-footer">
                    <span className="timeline-admin">
                      <User size={12} />
                      {registro.admin_nombre || 'Sistema'}
                    </span>
                    <button
                      className="btn-detalle"
                      onClick={() => setRegistroSeleccionado(registro)}
                    >
                      <Eye size={14} /> Ver detalle
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MODAL DETALLE */}
      {registroSeleccionado && (
        <div className="modal-overlay" onClick={() => setRegistroSeleccionado(null)}>
          <div className="modal-content modal-historial" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
              <h2>Detalle del cambio</h2>
              <button className="modal-close" onClick={() => setRegistroSeleccionado(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">

              <div className="detalle-grid">
                <div className="detalle-field">
                  <label>Accion</label>
                  <span className={`action-badge badge-${colorPorAccion[registroSeleccionado.accion]}`}>
                    {registroSeleccionado.accion?.toUpperCase()}
                  </span>
                </div>

                <div className="detalle-field">
                  <label>Seccion</label>
                  <p>{nombreTabla[registroSeleccionado.tabla_afectada] || registroSeleccionado.tabla_afectada}</p>
                </div>

                <div className="detalle-field">
                  <label>Administrador</label>
                  <p>{registroSeleccionado.admin_nombre || 'Sistema'}</p>
                </div>

                <div className="detalle-field">
                  <label>Fecha</label>
                  <p>{formatearFecha(registroSeleccionado.fecha)}</p>
                </div>

                <div className="detalle-field detalle-full">
                  <label>Descripcion</label>
                  <p>{registroSeleccionado.descripcion}</p>
                </div>
              </div>

              {/* Comparacion antes / despues */}
              {(registroSeleccionado.datos_anteriores || registroSeleccionado.datos_nuevos) && (
                <div className="datos-comparacion">
                  <h3>Cambios realizados</h3>

                  <div className="datos-grid">
                    {registroSeleccionado.datos_anteriores && (
                      <div className="datos-box datos-antes">
                        <h4>📜 Datos anteriores</h4>
                        <pre>{JSON.stringify(registroSeleccionado.datos_anteriores, null, 2)}</pre>
                      </div>
                    )}

                    {registroSeleccionado.datos_nuevos && (
                      <div className="datos-box datos-despues">
                        <h4>✨ Datos nuevos</h4>
                        <pre>{JSON.stringify(registroSeleccionado.datos_nuevos, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminHistorial