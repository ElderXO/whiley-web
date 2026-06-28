import { Check, Clock, Calendar } from 'lucide-react'
import { openWhatsApp } from '../../utils/whatsapp'
import heroBg from '../../assets/hero-bg.png'
import logoImg from '../../assets/logo.png'
import './Hero.css'

function Hero() {
  return (
    <section
      className="hero"
      style={{ '--hero-bg': `url(${heroBg})` }}
    >
      {/* Contenedor de la imagen + logo */}
      <div className="hero-image-wrapper">
        <div className="hero-image"></div>
        <div className="hero-logo">
          <img src={logoImg} alt="Wiley Tec Logo" />
        </div>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Tecnología que impulsa <span className="accent">resultados.</span>
          </h1>
          <p className="hero-subtitle">
            Infraestructura, datos y software para operaciones críticas.
          </p>
        </div>

        <div className="hero-actions">
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => openWhatsApp('51920335420', 'Hola, quiero agendar un diagnostico para mi empresa.')}>
              Agendar diagnóstico
              <span className="btn-arrow">→</span>
            </button>
            <button className="btn btn-secondary" onClick={() => { const el = document.getElementById('servicios'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
              Ver soluciones
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {/* Trust bar: 3 elementos de credibilidad */}
          <div className="hero-trust">
            <div className="trust-item">
              <Check className="trust-icon" size={18} strokeWidth={2.5} />
              <span>Diagnóstico sin costo</span>
            </div>
            <div className="trust-item">
              <Clock className="trust-icon" size={18} strokeWidth={2.5} />
              <span>Respuesta en menos de 24 h</span>
            </div>
            <div className="trust-item">
              <Calendar className="trust-icon" size={18} strokeWidth={2.5} />
              <span>Agenda limitada esta semana</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero