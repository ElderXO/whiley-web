import { useState, useEffect } from 'react'
import {
  Inbox,
  Search,
  Filter,
  Mail,
  Phone,
  User,
  Briefcase,
  Calendar,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  MessageSquare,
  TrendingUp,
  Clock
} from 'lucide-react'
import { contactosAPI } from '../../services/api'
import './AdminMensajes.css'

function AdminMensajes() {
  const [mensajes, setMensajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtro, setFiltro] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null)
  const [stats, setStats] = useState({ total: 0, nuevos: 0, atendidos: 0, hoy: 0 })

  // Cargar mensajes al iniciar
  useEffect(() => {
    cargarMensajes()
  }, [])

  const cargarMensajes = async () => {
    try {
      setLoading(true)
      const data = await contactosAPI.listar()
      setMensajes(data.contactos)
      calcularStats(data.contactos)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const calcularStats = (lista) => {
    const hoy = new Date().toDateString()
    setStats({
      total: lista.length,
      nuevos: lista.filter(m => m.estado === 'nuevo').length,
      atendidos: lista.filter(m => m.estado === 'atendido').length,
      hoy: lista.filter(m => new Date(m.fecha_recibido).toDateString() === hoy).length
    })
  }

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await contactosAPI.actualizarEstado(id, nuevoEstado)
      await cargarMensajes()
      if (mensajeSeleccionado && mensajeSeleccionado.id === id) {
        setMensajeSeleccionado({ ...mensajeSeleccionado, estado: nuevoEstado })
      }
    } catch (err) {
      alert('Error al actualizar: ' + err.message)
    }
  }

  const eliminarMensaje = async (id) => {
    if (!confirm('Estas seguro de eliminar este mensaje?')) return
    try {
      await contactosAPI.eliminar(id)
      await cargarMensajes()
      setMensajeSeleccionado(null)
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  // Filtrar mensajes
  const mensajesFiltrados = mensajes.filter(m => {
    const coincideFiltro = filtro === 'todos' || m.estado === filtro
    const coincideBusqueda =
      m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.servicio.toLowerCase().includes(busqueda.toLowerCase())
    return coincideFiltro && coincideBusqueda
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

  if (loading) {
    return (
      <div className="mensajes-loading">
        <div className="spinner-large"></div>
        <p>Cargando mensajes...</p>
      </div>
    )
  }

  return (
    <div className="admin-mensajes">

      {/* HEADER DE LA PAGINA */}
      <div className="mensajes-header">
        <div>
          <h1><Inbox size={28} /> Bandeja de Mensajes</h1>
          <p>Gestiona todas las consultas recibidas del formulario de contacto</p>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-gold">
            <MessageSquare size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total de mensajes</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <AlertCircle size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{stats.nuevos}</span>
            <span className="stat-label">Sin atender</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <CheckCircle size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{stats.atendidos}</span>
            <span className="stat-label">Atendidos</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-purple">
            <Clock size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-number">{stats.hoy}</span>
            <span className="stat-label">Recibidos hoy</span>
          </div>
        </div>
      </div>

      {/* FILTROS Y BUSQUEDA */}
      <div className="mensajes-toolbar">

        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o servicio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filtro === 'todos' ? 'active' : ''}`}
            onClick={() => setFiltro('todos')}
          >
            Todos ({mensajes.length})
          </button>
          <button
            className={`filter-tab ${filtro === 'nuevo' ? 'active' : ''}`}
            onClick={() => setFiltro('nuevo')}
          >
            Nuevos ({stats.nuevos})
          </button>
          <button
            className={`filter-tab ${filtro === 'atendido' ? 'active' : ''}`}
            onClick={() => setFiltro('atendido')}
          >
            Atendidos ({stats.atendidos})
          </button>
        </div>
      </div>

      {/* MENSAJES */}
      {error && (
        <div className="mensajes-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {mensajesFiltrados.length === 0 ? (
        <div className="mensajes-empty">
          <Inbox size={48} />
          <h3>No hay mensajes</h3>
          <p>{busqueda ? 'No se encontraron mensajes con esa busqueda' : 'Aun no se han recibido mensajes'}</p>
        </div>
      ) : (
        <div className="mensajes-tabla">
          <table>
            <thead>
              <tr>
                <th>Estado</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Servicio</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mensajesFiltrados.map((mensaje) => (
                <tr key={mensaje.id} className={mensaje.estado === 'nuevo' ? 'row-new' : ''}>
                  <td>
                    <span className={`badge badge-${mensaje.estado}`}>
                      {mensaje.estado === 'nuevo' ? '● Nuevo' : '✓ Atendido'}
                    </span>
                  </td>
                  <td>
                    <div className="user-cell">
                      <div className="user-mini-avatar">
                        {mensaje.nombre.charAt(0).toUpperCase()}
                      </div>
                      <span>{mensaje.nombre}</span>
                    </div>
                  </td>
                  <td className="cell-email">{mensaje.email}</td>
                  <td>
                    <span className="servicio-tag">{mensaje.servicio}</span>
                  </td>
                  <td className="cell-fecha">{formatearFecha(mensaje.fecha_recibido)}</td>
                  <td>
                    <div className="acciones-cell">
                      <button
                        className="btn-icon btn-view"
                        onClick={() => setMensajeSeleccionado(mensaje)}
                        title="Ver detalle"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => eliminarMensaje(mensaje.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DE DETALLE */}
      {mensajeSeleccionado && (
        <div className="modal-overlay" onClick={() => setMensajeSeleccionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
              <h2>Detalle del mensaje</h2>
              <button className="modal-close" onClick={() => setMensajeSeleccionado(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">

              <div className="modal-status">
                <span className={`badge badge-${mensajeSeleccionado.estado}`}>
                  {mensajeSeleccionado.estado === 'nuevo' ? '● Nuevo' : '✓ Atendido'}
                </span>
                <span className="modal-date">
                  <Calendar size={14} /> {formatearFecha(mensajeSeleccionado.fecha_recibido)}
                </span>
              </div>

              <div className="modal-grid">
                <div className="modal-field">
                  <label><User size={14} /> Nombre</label>
                  <p>{mensajeSeleccionado.nombre}</p>
                </div>

                <div className="modal-field">
                  <label><Mail size={14} /> Email</label>
                  <p>
                    <a href={`mailto:${mensajeSeleccionado.email}`}>
                      {mensajeSeleccionado.email}
                    </a>
                  </p>
                </div>

                <div className="modal-field">
                  <label><Phone size={14} /> Telefono</label>
                  <p>
                    <a href={`tel:${mensajeSeleccionado.telefono}`}>
                      {mensajeSeleccionado.telefono}
                    </a>
                  </p>
                </div>

                <div className="modal-field">
                  <label><Briefcase size={14} /> Servicio de interes</label>
                  <p><span className="servicio-tag">{mensajeSeleccionado.servicio}</span></p>
                </div>
              </div>

              <div className="modal-field modal-field-full">
                <label><MessageSquare size={14} /> Mensaje</label>
                <div className="modal-message-box">
                  {mensajeSeleccionado.mensaje}
                </div>
              </div>

            </div>

            <div className="modal-footer">
              {mensajeSeleccionado.estado === 'nuevo' ? (
                <button
                  className="btn-primary"
                  onClick={() => cambiarEstado(mensajeSeleccionado.id, 'atendido')}
                >
                  <CheckCircle size={16} /> Marcar como atendido
                </button>
              ) : (
                <button
                  className="btn-secondary"
                  onClick={() => cambiarEstado(mensajeSeleccionado.id, 'nuevo')}
                >
                  <XCircle size={16} /> Marcar como pendiente
                </button>
              )}
              <button
                className="btn-danger"
                onClick={() => eliminarMensaje(mensajeSeleccionado.id)}
              >
                <Trash2 size={16} /> Eliminar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default AdminMensajes