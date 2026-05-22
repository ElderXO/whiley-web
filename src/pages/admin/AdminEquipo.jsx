import { useState, useEffect } from 'react'
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Save,
  Loader,
  User,
  Image as ImageIcon
} from 'lucide-react'
import { equipoAPI } from '../../services/api'
import './AdminEquipo.css'

function AdminEquipo() {
  const [miembros, setMiembros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [miembroEditando, setMiembroEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const formInicial = {
    nombre: '',
    cargo: '',
    foto: '',
    orden: 0
  }

  const [formData, setFormData] = useState(formInicial)

  useEffect(() => {
    cargarEquipo()
  }, [])

  const cargarEquipo = async () => {
    try {
      setLoading(true)
      const data = await equipoAPI.listar()
      setMiembros(data.equipo || data.miembros || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const abrirModalCrear = () => {
    setFormData({ ...formInicial, orden: miembros.length + 1 })
    setModoEdicion(false)
    setMiembroEditando(null)
    setModalAbierto(true)
  }

  const abrirModalEditar = (miembro) => {
    setFormData({
      nombre: miembro.nombre || '',
      cargo: miembro.cargo || '',
      foto: miembro.foto || '',
      orden: miembro.orden || 0
    })
    setModoEdicion(true)
    setMiembroEditando(miembro)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setFormData(formInicial)
    setMiembroEditando(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      if (modoEdicion) {
        await equipoAPI.actualizar(miembroEditando.id, formData)
      } else {
        await equipoAPI.crear(formData)
      }
      await cargarEquipo()
      cerrarModal()
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setGuardando(false)
    }
  }

  const eliminarMiembro = async (id, nombre) => {
    if (!confirm(`Eliminar a "${nombre}" del equipo?`)) return
    try {
      await equipoAPI.eliminar(id)
      await cargarEquipo()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="equipo-loading">
        <div className="spinner-large"></div>
        <p>Cargando equipo...</p>
      </div>
    )
  }

  return (
    <div className="admin-equipo">

      <div className="equipo-header">
        <div>
          <h1><Users size={28} /> Gestion de Equipo</h1>
          <p>Administra los miembros del equipo WileyTEC</p>
        </div>
        <button className="btn-primary" onClick={abrirModalCrear}>
          <Plus size={18} /> Nuevo miembro
        </button>
      </div>

      {error && (
        <div className="equipo-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {miembros.length === 0 ? (
        <div className="equipo-empty">
          <Users size={48} />
          <h3>No hay miembros del equipo</h3>
          <p>Agrega el primer miembro haciendo clic en "Nuevo miembro"</p>
        </div>
      ) : (
        <div className="equipo-grid">
          {miembros.map((miembro) => (
            <div className="miembro-card" key={miembro.id}>

              <div className="miembro-avatar">
                {miembro.foto ? (
                  <img
                    src={
                      miembro.foto.startsWith('http')
                        ? miembro.foto
                        : `/src/assets/${miembro.foto}`
                    }
                    alt={miembro.nombre}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className="miembro-avatar-fallback"
                  style={{ display: miembro.foto ? 'none' : 'flex' }}
                >
                  {miembro.nombre.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="miembro-info">
                <h3>{miembro.nombre}</h3>
                <p>{miembro.cargo}</p>
                <span className="miembro-orden">Orden: {miembro.orden}</span>
              </div>

              <div className="miembro-acciones">
                <button
                  className="btn-icon-action btn-editar"
                  onClick={() => abrirModalEditar(miembro)}
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="btn-icon-action btn-eliminar"
                  onClick={() => eliminarMiembro(miembro.id, miembro.nombre)}
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
              <h2>{modoEdicion ? 'Editar miembro' : 'Nuevo miembro'}</h2>
              <button className="modal-close" onClick={cerrarModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                {/* Preview de la foto */}
                <div className="foto-preview-section">
                  <label>Vista previa</label>
                  <div className="foto-preview-circle">
                    {formData.foto ? (
                      <img
                        src={
                          formData.foto.startsWith('http')
                            ? formData.foto
                            : `/src/assets/${formData.foto}`
                        }
                        alt="Preview"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div
                      className="foto-preview-fallback"
                      style={{ display: formData.foto ? 'none' : 'flex' }}
                    >
                      <User size={40} />
                    </div>
                  </div>
                </div>

                <div className="form-grid">

                  <div className="form-field form-field-full">
                    <label>Nombre completo *</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Ej: Wilder Pardo"
                    />
                  </div>

                  <div className="form-field">
                    <label>Cargo *</label>
                    <input
                      type="text"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      required
                      placeholder="Ej: Desarrollador Full Stack"
                    />
                  </div>

                  <div className="form-field">
                    <label>Orden de visualizacion</label>
                    <input
                      type="number"
                      name="orden"
                      value={formData.orden}
                      onChange={handleChange}
                      placeholder="1, 2, 3..."
                    />
                  </div>

                  <div className="form-field form-field-full">
                    <label>
                      <ImageIcon size={14} style={{ display: 'inline', marginRight: '6px' }} />
                      Foto (URL completa o nombre de archivo)
                    </label>
                    <input
                      type="text"
                      name="foto"
                      value={formData.foto}
                      onChange={handleChange}
                      placeholder="https://ejemplo.com/foto.jpg o team-1.png"
                    />
                    <small className="form-hint">
                      Puedes usar una URL externa (https://...) o el nombre de un archivo
                      ya guardado en assets (team-1.png, team-2.png, etc.)
                    </small>
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
                    <><Save size={16} /> {modoEdicion ? 'Guardar cambios' : 'Crear miembro'}</>
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

export default AdminEquipo