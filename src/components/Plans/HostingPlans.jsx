import { useState, useEffect } from 'react'
import { Rocket, Zap, Gauge, Server, Check, Star, Loader, AlertCircle } from 'lucide-react'
import './HostingPlans.css'

const iconosPorNombre = {
  'Standard SSD': Rocket,
  'Enhanced SSD': Zap,
  'Premium SSD': Gauge,
  'Ultimate SSD': Server,
  'Plan Prueba': Server
}

function HostingPlans() {
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarPlanes()
  }, [])

  const cargarPlanes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/planes-hosting`)
      const data = await response.json()

      console.log('🔍 Datos recibidos del backend:', data)
      console.log('🔍 Primer plan:', data.planes[0])

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar planes')
      }

      setPlanes(data.planes)
    } catch (err) {
      console.error('❌ Error cargando planes:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const includedFeatures = [
    'Panel · Backups · Protección SPAM',
    'Softaculous · phpMyAdmin · Editor MX',
    'Soporte técnico 24/7',
    'Disco SSD · Certificado SSL',
    'Hosting + Dominio .com'
  ]

  if (loading) {
    return (
      <section className="hosting-plans-section">
        <div className="planes-loading-state">
          <Loader size={48} className="spin" style={{ color: '#F0A815' }} />
          <p>Cargando planes...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="hosting-plans-section">
        <div className="planes-error-state">
          <AlertCircle size={48} />
          <h3>No pudimos cargar los planes</h3>
          <p>{error}</p>
          <button onClick={cargarPlanes} className="btn-retry">Reintentar</button>
        </div>
      </section>
    )
  }

  return (
    <section className="hosting-plans-section">
      <div className="plans-header">
        <span className="plans-eyebrow">OFERTA</span>
        <h2 className="plans-title">
          Planes SSD <span className="accent">administrados</span>
        </h2>
        <p className="plans-subtitle">
          Hosting administrado SSD con panel intuitivo, copias de seguridad y certificado SSL.
          Ideal para sitios corporativos, correos empresariales y proyectos en crecimiento.
        </p>
        <div className="plans-badges">
          <span className="plan-badge">Panel CWP</span>
          <span className="plan-badge">SSL</span>
          <span className="plan-badge">Backups</span>
          <span className="plan-badge">Softaculous</span>
        </div>
      </div>

      <div className="plans-grid">
        {planes.map((plan) => {
          const Icon = iconosPorNombre[plan.nombre] || Server
          const sitiosNum = plan.sitios || '1'
          const labelSitios = sitiosNum === '1' ? 'sitio web' : 'sitios web'

          return (
            <article
              className={`plan-card ${plan.destacado ? 'featured' : ''}`}
              key={plan.id}
            >
              {plan.destacado && (
                <div className="featured-badge">
                  <Star size={12} fill="currentColor" />
                  <span>RECOMENDADO</span>
                </div>
              )}

              <div className="plan-icon-wrapper">
                <Icon size={32} strokeWidth={2} className="plan-icon" />
              </div>

              <h3 className="plan-name">{plan.nombre}</h3>
              <p className="plan-tagline">{plan.tagline}</p>

              <div className="plan-price">
                <span className="price-currency">S/</span>
                <span className="price-amount">{Math.round(parseFloat(plan.precio_mes))}</span>
                <span className="price-period">/mes</span>
              </div>
              <p className="plan-price-annual">S/ {Math.round(parseFloat(plan.precio_anual))} + IGV (anual)</p>

              <ul className="plan-features">
                <li><Check size={14} /> {plan.espacio} SSD</li>
                <li><Check size={14} /> {plan.trafico} de tráfico</li>
                <li><Check size={14} /> {plan.ftp} cuentas FTP</li>
                <li><Check size={14} /> Correos: {plan.email_cuentas}</li>
                <li><Check size={14} /> {plan.mysql_db} bases MySQL</li>
                <li><Check size={14} /> {sitiosNum} {labelSitios}</li>
              </ul>

              <button className="plan-btn">
                Contratar plan
              </button>
            </article>
          )
        })}
      </div>

      <div className="included-section">
        <h3 className="included-title">Incluido en todos los planes</h3>
        <div className="included-list">
          {includedFeatures.map((feature, index) => (
            <div className="included-item" key={index}>
              <Check size={16} className="included-check" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HostingPlans