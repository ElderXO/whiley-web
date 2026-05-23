import { useState, useEffect } from 'react'
import { Loader, AlertCircle, User } from 'lucide-react'
import './Team.css'

// Importar todas las fotos del equipo (Vite las procesa correctamente)
import teamWilder from '../../assets/team-wilder.png'
import teamLeyner from '../../assets/team-leyner.png'
import teamAracely from '../../assets/team-aracely.png'
import teamElmer from '../../assets/team-elmer.png'
import teamMarco from '../../assets/team-marco.png'
import teamJoaquin from '../../assets/team-joaquin.png'

// Mapeo de fotos locales por nombre de archivo
const fotosLocales = {
  'team-wilder.png': teamWilder,
  'team-leyner.png': teamLeyner,
  'team-aracely.png': teamAracely,
  'team-elmer.png': teamElmer,
  'team-marco.png': teamMarco,
  'team-joaquin.png': teamJoaquin
}

// Helper: resolver la foto (URL externa o local)
const resolverFoto = (foto) => {
  if (!foto) return null
  // Si es URL externa, usarla directa
  if (foto.startsWith('http://') || foto.startsWith('https://')) {
    return foto
  }
  // Si es local, buscar en el mapa
  return fotosLocales[foto] || null
}

// Helper: obtener iniciales del nombre
const obtenerIniciales = (nombre) => {
  if (!nombre) return '?'
  const partes = nombre.trim().split(' ')
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase()
  return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase()
}

function Team() {
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
      console.error('❌ Error cargando equipo:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const duplicatedTeam = [...miembros, ...miembros]

  if (loading) {
    return (
      <section className="team-section">
        <div className="team-state-loading">
          <Loader size={48} className="spin" style={{ color: '#F0A815' }} />
          <p>Cargando equipo...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="team-section">
        <div className="team-state-error">
          <AlertCircle size={48} />
          <p>{error}</p>
        </div>
      </section>
    )
  }

  if (miembros.length === 0) {
    return (
      <section className="team-section">
        <div className="team-state-empty">
          <User size={48} />
          <p>Aun no hay miembros del equipo</p>
        </div>
      </section>
    )
  }

  return (
    <section className="team-section">
      <div className="team-header">
        <span className="team-eyebrow">NUESTRO EQUIPO</span>
        <h2 className="team-title">
          Profesionales apasionados por la <span className="accent">tecnologia</span>
        </h2>
        <p className="team-subtitle">
          Conoce al equipo WileyTEC, expertos comprometidos con tu transformacion digital.
        </p>
      </div>

      <div className="team-carousel">
        <div className="team-track">
          {duplicatedTeam.map((member, index) => {
            const fotoSrc = resolverFoto(member.foto)

            return (
              <article className="team-card" key={`${member.id}-${index}`}>
                <div className="team-photo-wrapper">
                  {fotoSrc ? (
                    <img
                      src={fotoSrc}
                      alt={member.nombre}
                      className="team-photo"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        const fallback = e.target.nextElementSibling
                        if (fallback) fallback.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div
                    className="team-photo-fallback"
                    style={{ display: fotoSrc ? 'none' : 'flex' }}
                  >
                    <span className="team-photo-initials">{obtenerIniciales(member.nombre)}</span>
                  </div>
                  <div className="team-photo-overlay"></div>
                </div>
                <div className="team-info">
                  <h3 className="team-name">{member.nombre}</h3>
                  <p className="team-role">{member.cargo}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Team