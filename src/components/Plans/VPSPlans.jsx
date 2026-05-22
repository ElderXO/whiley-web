import { useState, useEffect } from 'react'
import { Cpu, Zap, Rocket, Crown, Check, Star, Loader, AlertCircle, Server } from 'lucide-react'
import './VPSPlans.css'

// Iconos por nombre (los planes VPS suelen tener nombres tipo Aurora, Nebula, etc)
const iconosPorNombre = {
  'Aurora VPS': Cpu,
  'Nebula VPS': Zap,
  'Pulsar VPS': Rocket,
  'Quasar VPS': Crown
}

function VPSPlans() {
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarPlanes()
  }, [])

  const cargarPlanes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/planes-vps`)
      const data = await response.json()

      console.log('🔍 VPS recibidos del backend:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar planes VPS')
      }

      setPlanes(data.planes)
    } catch (err) {
      console.error('❌ Error cargando VPS:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="vps-plans-section">
        <div className="planes-loading-state">
          <Loader size={48} className="spin" style={{ color: '#4dc4ff' }} />
          <p>Cargando planes VPS...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="vps-plans-section">
        <div className="planes-error-state">
          <AlertCircle size={48} />
          <h3>No pudimos cargar los planes VPS</h3>
          <p>{error}</p>
          <button onClick={cargarPlanes} className="btn-retry-vps">Reintentar</button>
        </div>
      </section>
    )
  }

  return (
    <section className="vps-plans-section">
      <div className="vps-header">
        <span className="vps-eyebrow">SOLUCIONES AVANZADAS</span>
        <h2 className="vps-title">
          Servidores Privados <span className="accent-cyan">VPS SSD</span>
        </h2>
        <p className="vps-subtitle">
          Recursos dedicados, mayor potencia y control absoluto. Ideal para aplicaciones
          de alto rendimiento, ecommerce o sistemas que requieren escalabilidad.
        </p>
      </div>

      <div className="vps-grid">
        {planes.map((plan) => {
          const Icon = iconosPorNombre[plan.nombre] || Server

          return (
            <article
              className={`vps-card ${plan.destacado ? 'featured-vps' : ''}`}
              key={plan.id}
            >
              {plan.destacado && (
                <div className="featured-badge-vps">
                  <Star size={12} fill="currentColor" />
                  <span>MAS POPULAR</span>
                </div>
              )}

              <div className="vps-icon-wrapper">
                <Icon size={32} strokeWidth={2} className="vps-icon" />
              </div>

              <h3 className="vps-name">{plan.nombre}</h3>
              <p className="vps-tagline">{plan.tagline}</p>

              <div className="vps-price">
                <span className="vps-currency">S/</span>
                <span className="vps-amount">{Math.round(parseFloat(plan.precio))}</span>
                <span className="vps-period">/mes</span>
              </div>

              <ul className="vps-features">
                <li><Check size={14} /> CPU: {plan.cpu}</li>
                <li><Check size={14} /> RAM: {plan.ram}</li>
                <li><Check size={14} /> {plan.espacio} SSD</li>
                <li><Check size={14} /> {plan.trafico} de tráfico</li>
              </ul>

              <button className="vps-btn">
                Contratar VPS
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default VPSPlans