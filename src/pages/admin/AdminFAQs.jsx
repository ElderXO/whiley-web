import { useState, useEffect } from 'react'
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Save,
  Loader,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { faqsAPI } from '../../services/api'
import './AdminFAQs.css'

function AdminFAQs() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [faqEditando, setFaqEditando] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [expandido, setExpandido] = useState(null)

  const formInicial = {
    pregunta: '',
    respuesta: '',
    orden: 0
  }

  const [formData, setFormData] = useState(formInicial)

  useEffect(() => {
    cargarFAQs()
  }, [])

  const cargarFAQs = async () => {
    try {
      setLoading(true)
      const data = await faqsAPI.listar()
      setFaqs(data.faqs || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const abrirModalCrear = () => {
    setFormData({ ...formInicial, orden: faqs.length + 1 })
    setModoEdicion(false)
    setFaqEditando(null)
    setModalAbierto(true)
  }

  const abrirModalEditar = (faq) => {
    setFormData({
      pregunta: faq.pregunta || '',
      respuesta: faq.respuesta || '',
      orden: faq.orden || 0
    })
    setModoEdicion(true)
    setFaqEditando(faq)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setFormData(formInicial)
    setFaqEditando(null)
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
        await faqsAPI.actualizar(faqEditando.id, formData)
      } else {
        await faqsAPI.crear(formData)
      }
      await cargarFAQs()
      cerrarModal()
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setGuardando(false)
    }
  }

  const eliminarFAQ = async (id, pregunta) => {
    if (!confirm(`Eliminar la pregunta:\n"${pregunta}"?`)) return
    try {
      await faqsAPI.eliminar(id)
      await cargarFAQs()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const toggleExpandir = (id) => {
    setExpandido(expandido === id ? null : id)
  }

  if (loading) {
    return (
      <div className="faqs-admin-loading">
        <div className="spinner-large"></div>
        <p>Cargando FAQs...</p>
      </div>
    )
  }

  return (
    <div className="admin-faqs">

      <div className="faqs-admin-header">
        <div>
          <h1><HelpCircle size={28} /> Gestion de FAQs</h1>
          <p>Administra las preguntas frecuentes que ven los visitantes</p>
        </div>
        <button className="btn-primary" onClick={abrirModalCrear}>
          <Plus size={18} /> Nueva FAQ
        </button>
      </div>

      {error && (
        <div className="faqs-admin-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {faqs.length === 0 ? (
        <div className="faqs-admin-empty">
          <HelpCircle size={48} />
          <h3>No hay FAQs</h3>
          <p>Crea la primera pregunta haciendo clic en "Nueva FAQ"</p>
        </div>
      ) : (
        <div className="faqs-admin-list">
          {faqs.map((faq) => (
            <div className="faq-admin-item" key={faq.id}>

              <div className="faq-admin-header-row">
                <div className="faq-admin-orden-badge">
                  <span>#{faq.orden}</span>
                </div>

                <div className="faq-admin-pregunta-wrapper">
                  <h3 className="faq-admin-pregunta">{faq.pregunta}</h3>
                  {expandido === faq.id && (
                    <p className="faq-admin-respuesta">{faq.respuesta}</p>
                  )}
                </div>

                <div className="faq-admin-acciones">
                  <button
                    className="btn-icon-faq btn-expandir"
                    onClick={() => toggleExpandir(faq.id)}
                    title={expandido === faq.id ? 'Contraer' : 'Ver respuesta'}
                  >
                    {expandido === faq.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button
                    className="btn-icon-faq btn-editar-faq"
                    onClick={() => abrirModalEditar(faq)}
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon-faq btn-eliminar-faq"
                    onClick={() => eliminarFAQ(faq.id, faq.pregunta)}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CREAR/EDITAR */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
              <h2>{modoEdicion ? 'Editar FAQ' : 'Nueva FAQ'}</h2>
              <button className="modal-close" onClick={cerrarModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                <div className="form-field-faq">
                  <label>Orden de visualizacion</label>
                  <input
                    type="number"
                    name="orden"
                    value={formData.orden}
                    onChange={handleChange}
                    placeholder="1, 2, 3..."
                  />
                  <small className="form-hint">Determina el orden en que se muestran las FAQs</small>
                </div>

                <div className="form-field-faq">
                  <label>Pregunta *</label>
                  <input
                    type="text"
                    name="pregunta"
                    value={formData.pregunta}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Que metodos de pago aceptan?"
                  />
                </div>

                <div className="form-field-faq">
                  <label>Respuesta *</label>
                  <textarea
                    name="respuesta"
                    value={formData.respuesta}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Escribe aqui la respuesta detallada..."
                  />
                  <small className="form-hint">Puedes usar varias lineas. Se vera asi en la pagina publica.</small>
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
                    <><Save size={16} /> {modoEdicion ? 'Guardar cambios' : 'Crear FAQ'}</>
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

export default AdminFAQs