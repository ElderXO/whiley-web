import { Link } from 'react-router-dom'
import { ChevronRight, MessageCircle, Mail, Phone } from 'lucide-react'
import './SupportHero.css'

function SupportHero() {
  return (
    <section className="support-hero">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Inicio</Link>
        <ChevronRight size={14} className="breadcrumb-separator" />
        <span className="breadcrumb-current">Centro de Ayuda</span>
      </div>

      <div className="support-hero-content">
        <span className="support-eyebrow">SOPORTE 24/7</span>
        <h1 className="support-title">
          Como podemos <span className="accent">ayudarte hoy?</span>
        </h1>
        <p className="support-subtitle">
          Nuestro equipo tecnico esta disponible las 24 horas para resolver tus dudas, atender incidencias y guiarte en cada paso.
        </p>
        <div className="availability-badge">
          <span className="pulse-dot"></span>
          <span>Equipo en linea ahora</span>
        </div>
      </div>

      <div className="channels-grid">

        <a href="https://wa.me/51918640041" className="channel-card channel-green" target="_blank" rel="noopener noreferrer">
          <div className="channel-icon-wrapper">
            <MessageCircle size={28} strokeWidth={2} />
          </div>
          <h3 className="channel-title">WhatsApp</h3>
          <p className="channel-subtitle">Respuesta inmediata</p>
          <div className="channel-action">
            <span>+51 918 640 041</span>
            <ChevronRight size={16} className="channel-arrow" />
          </div>
        </a>

        <a href="mailto:info@wileytec.com" className="channel-card channel-gold">
          <div className="channel-icon-wrapper">
            <Mail size={28} strokeWidth={2} />
          </div>
          <h3 className="channel-title">Correo Electronico</h3>
          <p className="channel-subtitle">Respuesta en 24h</p>
          <div className="channel-action">
            <span>info@wileytec.com</span>
            <ChevronRight size={16} className="channel-arrow" />
          </div>
        </a>

        <a href="tel:+51920335420" className="channel-card channel-blue">
          <div className="channel-icon-wrapper">
            <Phone size={28} strokeWidth={2} />
          </div>
          <h3 className="channel-title">Telefono Directo</h3>
          <p className="channel-subtitle">Atencion inmediata</p>
          <div className="channel-action">
            <span>+51 920 335 420</span>
            <ChevronRight size={16} className="channel-arrow" />
          </div>
        </a>

      </div>
    </section>
  )
}

export default SupportHero