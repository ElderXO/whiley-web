import { useState, useEffect } from 'react'
import { ChevronDown, HelpCircle, Loader, AlertCircle } from 'lucide-react'
import './FAQ.css'

function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [indiceAbierto, setIndiceAbierto] = useState(null)

  useEffect(() => {
    cargarFAQs()
  }, [])

  const cargarFAQs = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/faqs`)
      const data = await response.json()

      console.log('🔍 FAQs recibidas del backend:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar FAQs')
      }

      setFaqs(data.faqs || [])
    } catch (err) {
      console.error('❌ Error cargando FAQs:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleFAQ = (index) => {
    setIndiceAbierto(indiceAbierto === index ? null : index)
  }

  if (loading) {
    return (
      <section className="faq-section">
        <div className="faq-state">
          <Loader size={48} className="spin" style={{ color: '#F0A815' }} />
          <p>Cargando preguntas frecuentes...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="faq-section">
        <div className="faq-state faq-state-error">
          <AlertCircle size={48} />
          <p>{error}</p>
        </div>
      </section>
    )
  }

  if (faqs.length === 0) {
    return (
      <section className="faq-section">
        <div className="faq-state">
          <HelpCircle size={48} />
          <p>Aun no hay preguntas frecuentes disponibles</p>
        </div>
      </section>
    )
  }

  return (
    <section className="faq-section">
      <div className="faq-header">
        <span className="faq-eyebrow">CENTRO DE AYUDA</span>
        <h2 className="faq-title">
          Preguntas <span className="accent">frecuentes</span>
        </h2>
        <p className="faq-subtitle">
          Encuentra respuestas rapidas a las consultas mas comunes sobre nuestros servicios.
        </p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className={`faq-item ${indiceAbierto === index ? 'open' : ''}`}
          >
            <button
              className="faq-question"
              onClick={() => toggleFAQ(index)}
              aria-expanded={indiceAbierto === index}
            >
              <span className="faq-question-text">
                <HelpCircle size={18} className="faq-question-icon" />
                {faq.pregunta}
              </span>
              <ChevronDown size={20} className="faq-chevron" />
            </button>

            <div className="faq-answer-wrapper">
              <div className="faq-answer">
                <p>{faq.respuesta}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQ