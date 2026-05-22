import { useState, useEffect } from 'react'
import {
  Database,
  Plus,
  Edit2,
  Trash2,
  Star,
  X,
  AlertCircle,
  Save,
  Loader
} from 'lucide-react'
import { planesBigDataAPI } from '../../services/api'
import './AdminPlanesBigData.css'

function AdminPlanesBigData() {
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [planEditando, setPlanEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const formInicial = {
    nombre: '',
    cpu: '',
    ram: '',
    espacio: '',
    precio: '',
    popular: false,
    orden: 0
  }

  const [formData, setFormData] = useState(formInicial)

  useEffect(() => {
    cargarPlanes()
  }, [])

  const cargarPlanes = async () => {
    try {
      setLoading(true)
      const data = await planesBigDataAPI.listar()
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
      cpu: plan.cpu || '',
      ram: plan.ram || '',
      espacio: plan.espacio || '',
      precio: plan.precio || '',
      popular: plan.popular || false,
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
        await planesBigDataAPI.actualizar(planEditando.id, formData)
      } else {
        await planesBigDataAPI.crear(formData)
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
      await planesBigDataAPI.eliminar(id)
      await cargarPlanes()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const togglePopular = async (plan) => {
    try {
      await planesBigDataAPI.actualizar(plan.id, { popular: !plan.popular })
      await cargarPlanes()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="bigdata-admin-loading">
        <div className="spinner-large"></div>
        <p>Cargando planes Big Data...</p>
      </div>
    )
  }

  return (
    <div className="admin-bigdata">

      <div className="bigdata-admin-header">
        <div>
          <h1><Database size={28} /> Planes Big Data</h1>
          <p>Gestiona los servidores de alto rendimiento</p>
        </div>
        <button className="btn-primary-bd" onClick={abrirModalCrear}>
          <Plus size={18} /> Nuevo plan
        </button>
      </div>

      {error && (
        <div className="bigdata-admin-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {planes.length === 0 ? (
        <div className="bigdata-admin-empty">
          <Database size={48} />
          <h3>No hay planes Big Data</h3>
          <p>Crea tu primer plan haciendo clic en "Nuevo plan"</p>
        </div>
      ) : (
        <div className="bigdata-admin-table-wrapper">
          <table className="bigdata-admin-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>CPU</th>
                <th>RAM</th>
                <th>Almacenamiento</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {planes.map((plan) => (
                <tr key={plan.id} className={plan.popular ? 'row-popular-admin' : ''}>
                  <td>
                    <div className="plan-name-admin-cell">
                      <strong>{plan.nombre}</strong>
                      {plan.popular && (
                        <span className="popular-badge-admin">
                          <Star size={10} fill="currentColor" /> POPULAR
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{plan.cpu}</td>
                  <td>{plan.ram}</td>
                  <td>{plan.espacio}</td>
                  <td>
                    <strong className="precio-admin-bd">S/ {plan.precio}</strong>
                  </td>
                  <td>
                    <div className="acciones-bd">
                      <button className="btn-icon-bd btn-pop" onClick={() => togglePopular(plan)} title="Destacar">
                        <Star size={16} fill={plan.popular ? 'currentColor' : 'none'} />
                      </button>
                      <button className="btn-icon-bd btn-edit-bd" onClick={() => abrirModalEditar(plan)} title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon-bd btn-del-bd" onClick={() => eliminarPlan(plan.id, plan.nombre)} title="Eliminar">
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

      {/* MODAL */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
              <h2>{modoEdicion ? 'Editar plan Big Data' : 'Nuevo plan Big Data'}</h2>
              <button className="modal-close" onClick={cerrarModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid-bd">

                  <div className="form-field-bd">
                    <label>Nombre del plan *</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Ej: BIG1, BIG2..." />
                  </div>

                  <div className="form-field-bd">
                    <label>Orden</label>
                    <input type="number" name="orden" value={formData.orden} onChange={handleChange} placeholder="1, 2, 3..." />
                  </div>

                  <div className="form-field-bd">
                    <label>CPU *</label>
                    <input type="text" name="cpu" value={formData.cpu} onChange={handleChange} required placeholder="4 vCores" />
                  </div>

                  <div className="form-field-bd">
                    <label>RAM *</label>
                    <input type="text" name="ram" value={formData.ram} onChange={handleChange} required placeholder="8 GB" />
                  </div>

                  <div className="form-field-bd">
                    <label>Almacenamiento *</label>
                    <input type="text" name="espacio" value={formData.espacio} onChange={handleChange} required placeholder="200 GB SSD" />
                  </div>

                  <div className="form-field-bd">
                    <label>Precio mensual (S/) *</label>
                    <input type="number" step="0.01" name="precio" value={formData.precio} onChange={handleChange} required placeholder="150.00" />
                  </div>

                  <div className="form-field-bd form-field-bd-full">
                    <label className="form-checkbox-bd">
                      <input type="checkbox" name="popular" checked={formData.popular} onChange={handleChange} />
                      <span className="checkbox-custom-bd"></span>
                      <span><Star size={14} /> Marcar como popular</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary-bd" onClick={cerrarModal} disabled={guardando}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-bd" disabled={guardando}>
                  {guardando ? (
                    <><Loader size={16} className="spin" /> Guardando...</>
                  ) : (
                    <><Save size={16} /> {modoEdicion ? 'Guardar' : 'Crear plan'}</>
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

export default AdminPlanesBigData