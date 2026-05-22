import { useState, useEffect } from 'react'
import { Database, Check, Star, Loader, AlertCircle } from 'lucide-react'
import './BigDataPlans.css'

function BigDataPlans() {
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarPlanes()
  }, [])

  const cargarPlanes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/planes-bigdata`)
      const data = await response.json()

      console.log('🔍 BigData recibidos del backend:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar planes Big Data')
      }

      setPlanes(data.planes)
    } catch (err) {
      console.error('❌ Error cargando Big Data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="bigdata-section">
        <div className="planes-loading-state">
          <Loader size={48} className="spin" style={{ color: '#4a9eff' }} />
          <p>Cargando planes Big Data...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bigdata-section">
        <div className="planes-error-state">
          <AlertCircle size={48} />
          <h3>No pudimos cargar los planes Big Data</h3>
          <p>{error}</p>
          <button onClick={cargarPlanes} className="btn-retry-bigdata">Reintentar</button>
        </div>
      </section>
    )
  }

  return (
    <section className="bigdata-section">
      <div className="bigdata-header">
        <span className="bigdata-eyebrow">INFRAESTRUCTURA DE ALTO RENDIMIENTO</span>
        <h2 className="bigdata-title">
          Servidores <span className="accent-blue">Big Data</span>
        </h2>
        <p className="bigdata-subtitle">
          Soluciones escalables para procesamiento masivo de datos, machine learning,
          analytics avanzados y aplicaciones empresariales de gran volumen.
        </p>

        <div className="bigdata-icon-decoration">
          <Database size={48} />
        </div>
      </div>

      <div className="bigdata-table-wrapper">
        <table className="bigdata-table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>CPU</th>
              <th>RAM</th>
              <th>Almacenamiento</th>
              <th>Precio</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {planes.map((plan) => (
              <tr key={plan.id} className={plan.popular ? 'row-popular' : ''}>
                <td className="cell-plan-name">
                  <div className="plan-name-cell">
                    <span className="plan-name-text">{plan.nombre}</span>
                    {plan.popular && (
                      <span className="popular-badge">
                        <Star size={10} fill="currentColor" /> POPULAR
                      </span>
                    )}
                  </div>
                </td>
                <td>{plan.cpu}</td>
                <td>{plan.ram}</td>
                <td>{plan.espacio}</td>
                <td className="cell-price">
                  <span className="price-currency-bd">S/</span>
                  <span className="price-amount-bd">{Math.round(parseFloat(plan.precio))}</span>
                  <span className="price-period-bd">/mes</span>
                </td>
                <td>
                  <button className="bigdata-btn">
                    Contratar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bigdata-features-list">
        <div className="bigdata-feature">
          <Check size={18} />
          <span>Garantía SLA 99.9%</span>
        </div>
        <div className="bigdata-feature">
          <Check size={18} />
          <span>Soporte técnico especializado 24/7</span>
        </div>
        <div className="bigdata-feature">
          <Check size={18} />
          <span>Centro de datos en Lima, Perú</span>
        </div>
        <div className="bigdata-feature">
          <Check size={18} />
          <span>Escalabilidad bajo demanda</span>
        </div>
      </div>
    </section>
  )
}

export default BigDataPlans