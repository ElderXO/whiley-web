import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, User, Mail, MessageSquare, CheckCircle, Phone, Briefcase, AlertCircle } from 'lucide-react'
import './ContactForm.css'

const services = [
  'Hosting SSD',
  'VPS SSD',
  'VPS Big Data',
  'SAP BusinessObjects',
  'Desarrollo a medida',
  'Otra consulta'
]

function ContactForm() {
  const [searchParams] = useSearchParams()

  // Pre-selecciona el servicio si llega por la URL (?servicio=...).
  // Si el servicio recibido no existe en la lista, cae automaticamente en "Otra consulta".
  // Si no llega ningun parametro, queda sin seleccionar (placeholder).
  const servicioParam = searchParams.get('servicio')
  const servicioInicial = services.includes(servicioParam)
    ? servicioParam
    : (servicioParam ? 'Otra consulta' : '')

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    servicio: servicioInicial,
    mensaje: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contactos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el mensaje')
      }

      // Exito
      setSubmitted(true)
      setFormData({ nombre: '', email: '', telefono: '', servicio: '', mensaje: '' })

      setTimeout(() => {
        setSubmitted(false)
      }, 5000)

    } catch (err) {
      console.error('Error:', err)
      setError(err.message || 'No se pudo enviar. Verifica tu conexion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="contact-form-section" id="contacto">
      <div className="contact-form-header">
        <span className="support-eyebrow">CUENTANOS TU PROYECTO</span>
        <h2 className="contact-form-title">
          Envianos un <span className="accent">mensaje</span>
        </h2>
        <p className="contact-form-subtitle">
          Selecciona el servicio que te interesa y nuestro equipo especializado te contactara para una asesoria personalizada.
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        {submitted && (
          <div className="form-success">
            <CheckCircle size={20} />
            <span>Mensaje enviado correctamente! Te contactaremos pronto.</span>
          </div>
        )}

        {error && (
          <div className="form-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">
              <User size={14} /> Nombre completo
            </label>
            <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Tu nombre" disabled={loading} />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={14} /> Correo electronico
            </label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="tu@email.com" disabled={loading} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="telefono">
              <Phone size={14} /> Numero de telefono
            </label>
            <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required placeholder="+51 999 999 999" disabled={loading} />
          </div>

          <div className="form-group">
            <label htmlFor="servicio">
              <Briefcase size={14} /> Servicio de interes
            </label>
            <select id="servicio" name="servicio" value={formData.servicio} onChange={handleChange} required className="form-select" disabled={loading}>
              <option value="">Selecciona un servicio</option>
              {services.map((service, index) => (
                <option key={index} value={service}>{service}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="mensaje">
            <MessageSquare size={14} /> Cuentanos a detalle como podemos ayudarte
          </label>
          <textarea id="mensaje" name="mensaje" rows="5" value={formData.mensaje} onChange={handleChange} required placeholder="Describe tu proyecto, objetivos, presupuesto estimado o cualquier informacion relevante..." disabled={loading} />
        </div>

        <button type="submit" className="form-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Enviando...
            </>
          ) : (
            <>
              Enviar mensaje
              <Send size={18} />
            </>
          )}
        </button>
      </form>
    </section>
  )
}

export default ContactForm