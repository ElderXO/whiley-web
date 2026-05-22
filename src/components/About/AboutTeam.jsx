import { useState, useEffect } from 'react'
import { Loader, AlertCircle, User } from 'lucide-react'
import './AboutTeam.css'

// Helper: resolver la foto del miembro (URL externa o local)
const resolverFoto = (foto) => {
  if (!foto) return null
  if (foto.startsWith('http://') || foto.startsWith('https://')) {
    return foto
  }
  return `/src/assets/${foto}`
}

// Helper: obtener iniciales del nombre
const obtenerIniciales = (nombre) => {
  if (!nombre) return '?'
  const partes = nombre.trim().split(' ')
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase()
  return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase()
}

function AboutTeam() {
  const [miembros, setMiembros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarEquipo()
  }, [])

  const cargarEquipo = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/equipo`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar equipo')
      }

      setMiembros(data.equipo || data.miembros || [])
    } catch (err) {
      console.error('❌ Error cargando AboutTeam:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="about-team-section">
      <div className="about-team-header">
        <span className="about-eyebrow">MIEMBROS DE LA EMPRESA</span>
        <h2 className="about-team-title">
          Conoce a nuestro <span className="accent">Equipo</span>
        </h2>
        <p className="about-team-subtitle">
          Profesionales certificados que combinan experiencia tecnica con un enfoque
          centrado en resultados para nuestros clientes.
        </p>
      </div>

      {/* Estados de carga / error / vacio */}
      {loading && (
        <div className="about-team-state">
          <Loader size={48} className="spin" style={{ color: '#F0A815' }} />
          <p>Cargando equipo...</p>
        </div>
      )}

      {error && (
        <div className="about-team-state about-team-state-error">
          <AlertCircle size={48} />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && miembros.length === 0 && (
        <div className="about-team-state">
          <User size={48} />
          <p>Aun no hay miembros del equipo</p>
        </div>
      )}

      {/* Grid 3x2 cuando hay datos */}
      {!loading && !error && miembros.length > 0 && (
        <div className="about-team-grid">
          {miembros.map((member, index) => {
            const fotoSrc = resolverFoto(member.foto)

            return (
              <article
                className="about-team-card"
                key={member.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="about-team-photo-wrapper">
                  {fotoSrc ? (
                    <img
                      src={fotoSrc}
                      alt={member.nombre}
                      className="about-team-photo"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        const fallback = e.target.nextElementSibling
                        if (fallback) fallback.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div
                    className="about-team-photo-fallback"
                    style={{ display: fotoSrc ? 'none' : 'flex' }}
                  >
                    <span className="about-team-initials">{obtenerIniciales(member.nombre)}</span>
                  </div>
                  <div className="about-team-overlay">
                    <div className="about-team-social">
                      <a href="#" aria-label="LinkedIn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                        </svg>
                      </a>
                      <a href="#" aria-label="Email">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 4-8 5-8-5V6l8 5 8-5z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="about-team-info">
                  <h3 className="about-team-name">{member.nombre}</h3>
                  <p className="about-team-role">{member.cargo}</p>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default AboutTeam