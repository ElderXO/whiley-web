import { Check, Sparkles } from 'lucide-react'
import './AboutWhy.css'

function AboutWhy() {
  const benefitsLeft = [
    'Diseño UI/UX/SEO profesional',
    'Soporte en línea 24/7',
    'Mejora empresarial continua'
  ]

  const benefitsRight = [
    'Seguridad de alta calidad',
    'Equipo de expertos 24/7',
    'Diseños novedosos y modernos'
  ]

  return (
    <section className="about-why-section">
      <div className="about-why-container">
        {/* Columna izquierda - visual decorativo */}
        <div className="about-why-visual">
          <div className="visual-card visual-card-1">
            <Sparkles size={32} className="visual-icon" />
            <div className="visual-text">
              <span className="visual-number">+10</span>
              <span className="visual-label">Años de experiencia</span>
            </div>
          </div>
          <div className="visual-card visual-card-2">
            <div className="visual-percent">99.9%</div>
            <div className="visual-percent-label">Uptime garantizado</div>
          </div>
          <div className="visual-orbit"></div>
          <div className="visual-glow"></div>
        </div>

        {/* Columna derecha - contenido */}
        <div className="about-why-content">
          <span className="about-eyebrow">POR QUÉ ELEGIRNOS</span>
          <h2 className="about-why-title">
            Transformamos tu visión en una <span className="accent">web poderosa</span>
          </h2>
          <p className="about-why-description">
            Creamos sitios web atractivos, rápidos y optimizados para captar clientes.
            Diseño UI/UX, SEO y desarrollo responsivo en un solo lugar.
          </p>

          {/* Lista de beneficios en 2 columnas */}
          <div className="benefits-grid">
            <ul className="benefits-list">
              {benefitsLeft.map((benefit, index) => (
                <li key={index}>
                  <span className="benefit-check">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
            <ul className="benefits-list">
              {benefitsRight.map((benefit, index) => (
                <li key={index}>
                  <span className="benefit-check">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutWhy