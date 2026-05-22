import { useState, useEffect } from 'react'
import {
  Server,
  Plus,
  Edit2,
  Trash2,
  Star,
  Check,
  X,
  AlertCircle,
  Save,
  Loader,
  Eye,
  EyeOff
} from 'lucide-react'
import { planesHostingAPI } from '../../services/api'
import './AdminPlanesHosting.css'

function AdminPlanesHosting() {
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [planEditando, setPlanEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const formInicial = {
    nombre: '',
    tagline: '',
    precio_mes: '',
    precio_anual: '',
    espacio: '',
    trafico: '',
    ftp: '',
    email_cuentas: '',
    mysql_db: '',
    sitios: '',
    destacado: false,
    orden: 0
  }

  const [formData, setFormData] = useState(formInicial)

  useEffect(() => {
    cargarPlanes()
  }, [])

  const cargarPlanes = async () => {
    try {
      setLoading(true)
      const data = await planesHostingAPI.listar()
      setPlanes(data.planes)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const abrirModalCrear = () => {
    setFormData({ ...formInicial, orden: planes.length + 1 })
    setModoEdicion(false)
    setPlanEditando(null)
    setModalAbierto(true)
  }

  const abrirModalEditar = (plan) => {
    setFormData({
      nombre: plan.nombre || '',
      tagline: plan.tagline || '',
      precio_mes: plan.precio_mes || '',
      precio_anual: plan.precio_anual || '',
      espacio: plan.espacio || '',
      trafico: plan.trafico || '',
      ftp: plan.ftp || '',
      email_cuentas: plan.email_cuentas || '',
      mysql_db: plan.mysql_db || '',
      sitios: plan.sitios || '',
      destacado: plan.destacado || false,
      orden: plan.orden || 0
    })
    setModoEdicion(true)
    setPlanEditando(plan)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setFormData(formInicial)
    setPlanEditando(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)

    try {
      if (modoEdicion) {
        await planesHostingAPI.actualizar(planEditando.id, formData)
      } else {
        await planesHostingAPI.crear(formData)
      }
      await cargarPlanes()
      cerrarModal()
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setGuardando(false)
    }
  }

  const eliminarPlan = async (id, nombre) => {
    if (!confirm(`Eliminar el plan "${nombre}"?`)) return
    try {
      await planesHostingAPI.eliminar(id)
      await cargarPlanes()
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  const toggleDestacado = async (plan) => {
    try {
      await planesHostingAPI.actualizar(plan.id, { destacado: !plan.destacado })
      await cargarPlanes()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="planes-loading">
        <div className="spinner-large"></div>
        <p>Cargando planes...</p>
      </div>
    )
  }

  return (
    <div className="admin-planes">

      {/* HEADER */}
      <div className="planes-header">
        <div>
          <h1><Server size={28} /> Planes Hosting SSD</h1>
          <p>Gestiona los planes de hosting administrado</p>
        </div>
        <button className="btn-primary" onClick={abrirModalCrear}>
          <Plus size={18} /> Nuevo plan
        </button>
      </div>

      {error && (
        <div className="planes-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* TABLA DE PLANES */}
      {planes.length === 0 ? (
        <div className="planes-empty">
          <Server size={48} />
          <h3>No hay planes</h3>
          <p>Crea tu primer plan haciendo clic en "Nuevo plan"</p>
        </div>
      ) : (
        <div className="planes-grid">
          {planes.map((plan) => (
            <div className={`plan-card-admin ${plan.destacado ? 'destacado' : ''}`} key={plan.id}>
              {plan.destacado && (
                <div className="plan-destacado-badge">
                  <Star size={12} fill="currentColor" /> DESTACADO
                </div>
              )}

              <div className="plan-card-header">
                <h3>{plan.nombre}</h3>
                <p className="plan-tagline">{plan.tagline}</p>
              </div>

              <div className="plan-card-price">
                <span className="currency">S/</span>
                <span className="amount">{plan.precio_mes}</span>
                <span className="period">/mes</span>
              </div>

              <div className="plan-card-features">
                <div className="feature-row"><Check size={14} /> {plan.espacio} SSD</div>
                <div className="feature-row"><Check size={14} /> {plan.trafico} de trafico</div>
                <div className="feature-row"><Check size={14} /> {plan.ftp} cuentas FTP</div>
                <div className="feature-row"><Check size={14} /> {plan.sitios} sitios web</div>
              </div>

              <div className="plan-card-actions">
                <button
                  className="btn-icon-action btn-destacar"
                  onClick={() => toggleDestacado(plan)}
                  title={plan.destacado ? 'Quitar destacado' : 'Marcar como destacado'}
                >
                  <Star size={16} fill={plan.destacado ? 'currentColor' : 'none'} />
                </button>
                <button
                  className="btn-icon-action btn-editar"
                  onClick={() => abrirModalEditar(plan)}
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="btn-icon-action btn-eliminar"
                  onClick={() => eliminarPlan(plan.id, plan.nombre)}
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CREAR/EDITAR */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
              <h2>{modoEdicion ? 'Editar plan' : 'Nuevo plan de Hosting'}</h2>
              <button className="modal-close" onClick={cerrarModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                <div className="form-grid">
                  <div className="form-field">
                    <label>Nombre del plan *</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Ej: Standard SSD" />
                  </div>

                  <div className="form-field">
                    <label>Orden de visualizacion</label>
                    <input type="number" name="orden" value={formData.orden} onChange={handleChange} placeholder="1, 2, 3..." />
                  </div>

                  <div className="form-field form-field-full">
                    <label>Tagline (descripcion corta)</label>
                    <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} placeholder="Ej: Ideal para emprendedores" />
                  </div>

                  <div className="form-field">
                    <label>Precio mensual (S/) *</label>
                    <input type="number" step="0.01" name="precio_mes" value={formData.precio_mes} onChange={handleChange} required placeholder="25.00" />
                  </div>

                  <div className="form-field">
                    <label>Precio anual (S/)</label>
                    <input type="number" step="0.01" name="precio_anual" value={formData.precio_anual} onChange={handleChange} placeholder="300.00" />
                  </div>

                  <div className="form-field">
                    <label>Espacio SSD</label>
                    <input type="text" name="espacio" value={formData.espacio} onChange={handleChange} placeholder="10 GB" />
                  </div>

                  <div className="form-field">
                    <label>Trafico</label>
                    <input type="text" name="trafico" value={formData.trafico} onChange={handleChange} placeholder="100 GB" />
                  </div>

                  <div className="form-field">
                    <label>Cuentas FTP</label>
                    <input type="text" name="ftp" value={formData.ftp} onChange={handleChange} placeholder="10" />
                  </div>

                  <div className="form-field">
                    <label>Cuentas de email</label>
                    <input type="text" name="email_cuentas" value={formData.email_cuentas} onChange={handleChange} placeholder="10 / 10 / Ilimitado" />
                  </div>

                  <div className="form-field">
                    <label>Bases de datos MySQL</label>
                    <input type="text" name="mysql_db" value={formData.mysql_db} onChange={handleChange} placeholder="10" />
                  </div>

                  <div className="form-field">
                    <label>Sitios web</label>
                    <input type="text" name="sitios" value={formData.sitios} onChange={handleChange} placeholder="1" />
                  </div>

                  <div className="form-field form-field-full">
                    <label className="form-checkbox">
                      <input type="checkbox" name="destacado" checked={formData.destacado} onChange={handleChange} />
                      <span className="checkbox-custom-admin"></span>
                      <span><Star size={14} /> Marcar como plan destacado (RECOMENDADO)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={cerrarModal} disabled={guardando}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={guardando}>
                  {guardando ? (
                    <><Loader size={16} className="spin" /> Guardando...</>
                  ) : (
                    <><Save size={16} /> {modoEdicion ? 'Guardar cambios' : 'Crear plan'}</>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}

export default AdminPlanesHosting