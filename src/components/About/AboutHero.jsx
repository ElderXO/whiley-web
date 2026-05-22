import { Link } from 'react-router-dom'
import { Award, Users, Phone, ChevronRight, ArrowRight } from 'lucide-react'
import './AboutHero.css'

function AboutHero() {
  return (
    <section className="about-hero">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Inicio</Link>
        <ChevronRight size={14} className="breadcrumb-separator" />
        <span className="breadcrumb-current">Sobre Nosotros</span>
      </div>

      <div className="about-hero-content">
        {/* Columna izquierda */}
        <div className="about-hero-left">
          <span className="about-eyebrow">ACERCA DE</span>
          <h1 className="about-title">
            Fácil de usar, <br />
            <span className="accent">fácil de amar</span>
          </h1>
          <p className="about-description">
            Lleva tu marca al siguiente nivel con diseño web impulsado por
            inteligencia artificial, experiencias personalizadas, interfaces
            intuitivas y tecnología que maximiza la conversión y el engagement.
          </p>

          {/* 2 cards de credibilidad */}
          <div className="about-features">
            <div className="about-feature">
              <div className="feature-icon-wrapper">
                <Award size={22} className="feature-icon" />
              </div>
              <div className="feature-text">
                <h3>Empresa Certificada</h3>
                <p>Los mejores servicios de capacitación.</p>
              </div>
            </div>
            <div className="about-feature">
              <div className="feature-icon-wrapper">
                <Users size={22} className="feature-icon" />
              </div>
              <div className="feature-text">
                <h3>Equipo de Expertos</h3>
                <p>Equipo 100% experto y certificado.</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="about-cta">
            <Link to="/servicios" className="about-btn-primary">
              Descubre Más
              <ArrowRight size={18} />
            </Link>
            <a href="tel:+51918640041" className="about-phone">
              <div className="phone-icon-wrapper">
                <Phone size={18} />
              </div>
              <div className="phone-text">
                <span className="phone-label">Llámanos al:</span>
                <span className="phone-number">+51 918 640 041</span>
              </div>
            </a>
          </div>
        </div>

        {/* Columna derecha: stats/decoración */}
        <div className="about-hero-right">
          <div className="stat-card stat-card-1">
            <div className="stat-number">+150</div>
            <div className="stat-label">Empresas confían en nosotros</div>
          </div>
          <div className="stat-card stat-card-2">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime garantizado</div>
          </div>
          <div className="stat-card stat-card-3">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Soporte técnico activo</div>
          </div>
          <div className="stat-card stat-card-4">
            <div className="stat-number">10+</div>
            <div className="stat-label">Años de experiencia</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutHero