import { useState, useEffect } from 'react'
import {
  HardDrive,
  Plus,
  Edit2,
  Trash2,
  Star,
  Check,
  X,
  AlertCircle,
  Save,
  Loader
} from 'lucide-react'
import { planesVPSAPI } from '../../services/api'
import './AdminPlanesHosting.css'

function AdminPlanesVPS() {
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
    precio: '',
    cpu: '',
    ram: '',
    espacio: '',
    trafico: '',
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
      const data = await planesVPSAPI.listar()
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
      precio: plan.precio || '',
      cpu: plan.cpu || '',
      ram: plan.ram || '',
      espacio: plan.espacio || '',
      trafico: plan.trafico || '',
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
        await planesVPSAPI.actualizar(planEditando.id, formData)
      } else {
        await planesVPSAPI.crear(formData)
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
      await planesVPSAPI.eliminar(id)
      await cargarPlanes()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const toggleDestacado = async (plan) => {
    try {
      await planesVPSAPI.actualizar(plan.id, { destacado: !plan.destacado })
      await cargarPlanes()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="planes-loading">
        <div className="spinner-large"></div>
        <p>Cargando planes VPS...</p>
      </div>
    )
  }

  return (
    <div className="admin-planes">

      <div className="planes-header">
        <div>
          <h1><HardDrive size={28} /> Planes VPS SSD</h1>
          <p>Gestiona los servidores privados virtuales</p>
        </div>
        <button className="btn-primary" onClick={abrirModalCrear}>
          <Plus size={18} /> Nuevo VPS
        </button>
      </div>

      {error && (
        <div className="planes-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {planes.length === 0 ? (
        <div className="planes-empty">
          <HardDrive size={48} />
          <h3>No hay planes VPS</h3>
          <p>Crea tu primer plan VPS haciendo clic en "Nuevo VPS"</p>
        </div>
      ) : (
        <div className="planes-grid">
          {planes.map((plan) => (
            <div className={`plan-card-admin ${plan.destacado ? 'destacado' : ''}`} key={plan.id}>
              {plan.destacado && (
                <div className="plan-destacado-badge">
                  <Star size={12} fill="currentColor" /> POPULAR
                </div>
              )}

              <div className="plan-card-header">
                <h3>{plan.nombre}</h3>
                <p className="plan-tagline">{plan.tagline}</p>
              </div>

              <div className="plan-card-price">
                <span className="currency">S/</span>
                <span className="amount">{plan.precio}</span>
                <span className="period">/mes</span>
              </div>

              <div className="plan-card-features">
                <div className="feature-row"><Check size={14} /> CPU: {plan.cpu}</div>
                <div className="feature-row"><Check size={14} /> RAM: {plan.ram}</div>
                <div className="feature-row"><Check size={14} /> {plan.espacio} SSD</div>
                <div className="feature-row"><Check size={14} /> {plan.trafico}</div>
              </div>

              <div className="plan-card-actions">
                <button className="btn-icon-action btn-destacar" onClick={() => toggleDestacado(plan)} title="Destacar">
                  <Star size={16} fill={plan.destacado ? 'currentColor' : 'none'} />
                </button>
                <button className="btn-icon-action btn-editar" onClick={() => abrirModalEditar(plan)} title="Editar">
                  <Edit2 size={16} />
                </button>
                <button className="btn-icon-action btn-eliminar" onClick={() => eliminarPlan(plan.id, plan.nombre)} title="Eliminar">
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
              <h2>{modoEdicion ? 'Editar plan VPS' : 'Nuevo plan VPS'}</h2>
              <button className="modal-close" onClick={cerrarModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">

                  <div className="form-field">
                    <label>Nombre del VPS *</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Ej: Aurora VPS" />
                  </div>

                  <div className="form-field">
                    <label>Orden de visualizacion</label>
                    <input type="number" name="orden" value={formData.orden} onChange={handleChange} placeholder="1, 2, 3..." />
                  </div>

                  <div className="form-field form-field-full">
                    <label>Tagline (descripcion corta)</label>
                    <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} placeholder="Ej: Potencia y velocidad" />
                  </div>

                  <div className="form-field">
                    <label>Precio mensual (S/) *</label>
                    <input type="number" step="0.01" name="precio" value={formData.precio} onChange={handleChange} required placeholder="80.00" />
                  </div>

                  <div className="form-field">
                    <label>CPU</label>
                    <input type="text" name="cpu" value={formData.cpu} onChange={handleChange} placeholder="2 vCores" />
                  </div>

                  <div className="form-field">
                    <label>RAM</label>
                    <input type="text" name="ram" value={formData.ram} onChange={handleChange} placeholder="4 GB" />
                  </div>

                  <div className="form-field">
                    <label>Espacio SSD</label>
                    <input type="text" name="espacio" value={formData.espacio} onChange={handleChange} placeholder="80 GB" />
                  </div>

                  <div className="form-field form-field-full">
                    <label>Trafico</label>
                    <input type="text" name="trafico" value={formData.trafico} onChange={handleChange} placeholder="Ilimitado o 1 TB" />
                  </div>

                  <div className="form-field form-field-full">
                    <label className="form-checkbox">
                      <input type="checkbox" name="destacado" checked={formData.destacado} onChange={handleChange} />
                      <span className="checkbox-custom-admin"></span>
                      <span><Star size={14} /> Marcar como destacado (MÁS POPULAR)</span>
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
                    <><Save size={16} /> {modoEdicion ? 'Guardar cambios' : 'Crear VPS'}</>
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

export default AdminPlanesVPS