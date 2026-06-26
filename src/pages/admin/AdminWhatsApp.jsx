import { useState, useEffect } from 'react'
import {
  MessageCircle,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  Save,
  Loader,
  Phone,
  ToggleRight,
  ToggleLeft
} from 'lucide-react'
import { whatsappAPI } from '../../services/api'
import './AdminWhatsApp.css'

function AdminWhatsApp() {
  const [contactos, setContactos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [contactoEditando, setContactoEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const formInicial = {
    nombre: '',
    cargo: '',
    telefono: '',
    orden: 0,
    activo: true
  }

  const [formData, setFormData] = useState(formInicial)

  useEffect(() => {
    cargarContactos()
  }, [])

  const mostrarExito = (mensaje) => {
    setExito(mensaje)
    setTimeout(() => setExito(null), 3000)
  }

  const cargarContactos = async () => {
    try {
      setLoading(true)
      const data = await whatsappAPI.listar()
      setContactos(data.contactos || data.whatsapp || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const abrirModalCrear = () => {
    setFormData({ ...formInicial, orden: contactos.length + 1 })
    setModoEdicion(false)
    setContactoEditando(null)
    setModalAbierto(true)
  }

  const abrirModalEditar = (contacto) => {
    setFormData({
      nombre: contacto.nombre || '',
      cargo: contacto.cargo || '',
      telefono: contacto.telefono || '',
      orden: contacto.orden || 0,
      activo: contacto.activo !== false
    })
    setModoEdicion(true)
    setContactoEditando(contacto)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setFormData(formInicial)
    setContactoEditando(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'telefono') {
      setFormData({ ...formData, telefono: value.replace(/\D/g, '') })
      return
    }
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      if (modoEdicion) {
        await whatsappAPI.actualizar(contactoEditando.id, formData)
        mostrarExito('Contacto actualizado correctamente')
      } else {
        await whatsappAPI.crear(formData)
        mostrarExito('Contacto creado correctamente')
      }
      await cargarContactos()
      cerrarModal()
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setGuardando(false)
    }
  }

  const toggleActivo = async (contacto) => {
    try {
      await whatsappAPI.actualizar(contacto.id, {
        nombre: contacto.nombre,
        cargo: contacto.cargo,
        telefono: contacto.telefono,
        orden: contacto.orden,
        activo: !(contacto.activo !== false)
      })
      mostrarExito(contacto.activo !== false ? 'Contacto desactivado' : 'Contacto activado')
      await cargarContactos()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const eliminarContacto = async (id, nombre) => {
    if (!confirm(`Eliminar el contacto "${nombre}"?`)) return
    try {
      await whatsappAPI.eliminar(id)
      mostrarExito('Contacto eliminado')
      await cargarContactos()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="wa-loading">
        <div className="spinner-large"></div>
        <p>Cargando contactos...</p>
      </div>
    )
  }

  return (
    <div className="admin-whatsapp">

      <div className="wa-header">
        <div>
          <h1><MessageCircle size={28} /> Contactos de WhatsApp</h1>
          <p>Administra los contactos que aparecen en el widget publico</p>
        </div>
        <button className="btn-primary" onClick={abrirModalCrear}>
          <Plus size={18} /> Agregar contacto
        </button>
      </div>

      {error && (
        <div className="wa-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {exito && (
        <div className="wa-success">
          <CheckCircle size={20} />
          <span>{exito}</span>
        </div>
      )}

      {contactos.length === 0 ? (
        <div className="wa-empty">
          <MessageCircle size={48} />
          <h3>No hay contactos de WhatsApp</h3>
          <p>Agrega el primero haciendo clic en "Agregar contacto"</p>
        </div>
      ) : (
        <div className="wa-grid">
          {contactos.map((contacto) => (
            <div className={`wa-card ${contacto.activo !== false ? '' : 'wa-card--inactivo'}`} key={contacto.id}>

              <div className="wa-card-top">
                <div className="wa-card-avatar">
                  <MessageCircle size={22} />
                </div>
                <span className={`wa-badge ${contacto.activo !== false ? 'wa-badge--on' : 'wa-badge--off'}`}>
                  {contacto.activo !== false ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="wa-card-info">
                <h3>{contacto.nombre}</h3>
                <p className="wa-card-cargo">{contacto.cargo}</p>
                <p className="wa-card-phone"><Phone size={14} /> {contacto.telefono}</p>
                <span className="wa-orden">Orden: {contacto.orden}</span>
              </div>

              <div className="wa-acciones">
                <button
                  className="btn-icon-action btn-toggle"
                  onClick={() => toggleActivo(contacto)}
                  title={contacto.activo !== false ? 'Desactivar' : 'Activar'}
                >
                  {contacto.activo !== false ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
                <button
                  className="btn-icon-action btn-editar"
                  onClick={() => abrirModalEditar(contacto)}
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="btn-icon-action btn-eliminar"
                  onClick={() => eliminarContacto(contacto.id, contacto.nombre)}
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
              <h2>{modoEdicion ? 'Editar contacto' : 'Nuevo contacto'}</h2>
              <button className="modal-close" onClick={cerrarModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">

                  <div className="form-field form-field-full">
                    <label>Nombre completo *</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Ej: Wilder Pardo" />
                  </div>

                  <div className="form-field form-field-full">
                    <label>Cargo *</label>
                    <input type="text" name="cargo" value={formData.cargo} onChange={handleChange} required placeholder="Ej: Director general" />
                  </div>

                  <div className="form-field">
                    <label>
                      <Phone size={14} style={{ display: 'inline', marginRight: '6px' }} />
                      Telefono *
                    </label>
                    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required inputMode="numeric" placeholder="51987654321" />
                    <small className="form-hint">Formato internacional: 51 + numero, solo numeros (sin espacios ni signos).</small>
                  </div>

                  <div className="form-field">
                    <label>Orden de visualizacion</label>
                    <input type="number" name="orden" value={formData.orden} onChange={handleChange} placeholder="1, 2, 3..." />
                  </div>

                  <div className="form-field form-field-full">
                    <label className="wa-check-label">
                      <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} />
                      <span>Contacto activo (visible en el widget publico)</span>
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
                    <><Save size={16} /> {modoEdicion ? 'Guardar cambios' : 'Crear contacto'}</>
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

export default AdminWhatsApp
