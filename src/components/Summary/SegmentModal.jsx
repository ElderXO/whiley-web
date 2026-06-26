import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Check } from 'lucide-react'
import './SegmentModal.css'

function SegmentModal({ data, onClose }) {
  const navigate = useNavigate()
  const detalle = data.detalle || {}

  // Bloquea el scroll del body mientras el modal esta abierto y lo restaura al cerrar
  useEffect(() => {
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previo }
  }, [])

  // Cerrar con tecla Escape
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [onClose])

  const irAServicios = () => {
    navigate('/servicios')
    onClose()
  }

  return (
    <div className="segmodal-overlay" onClick={onClose} role="presentation">
      <div className="segmodal-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${data.tituloA} ${data.tituloB}`}>

        <header className="segmodal-header">
          <span className={`segmodal-num segmodal-num--${data.circulo}`}>{data.numero}</span>
          <h2 className="segmodal-title">
            <span className="segmodal-title-a">{data.tituloA}</span>{' '}
            <span className={`segmodal-title-b segmodal-title-b--${data.colorB}`}>{data.tituloB}</span>
          </h2>
          <button className="segmodal-close" onClick={onClose} aria-label="Cerrar">
            <X size={22} />
          </button>
        </header>

        <div className="segmodal-body">
          <p className="segmodal-intro">{detalle.intro}</p>

          {detalle.tecnologias && (
            <div className="segmodal-chips">
              {detalle.tecnologias.map((t) => (
                <span className="segmodal-chip" key={t}>{t}</span>
              ))}
            </div>
          )}

          {detalle.incluye && (
            <>
              <h3 className="segmodal-subtitle">Incluye:</h3>
              <ul className="segmodal-incluye">
                {detalle.incluye.map((item) => (
                  <li className="segmodal-incluye-item" key={item}>
                    <Check size={16} className="segmodal-check" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {detalle.bloques && (
            <div className="segmodal-bloques">
              {detalle.bloques.map((b) => (
                <div className="segmodal-bloque" key={b.titulo}>
                  <h4 className="segmodal-bloque-title">{b.titulo}</h4>
                  <p className="segmodal-bloque-text">{b.texto}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="segmodal-footer">
          <button className="segmodal-cta" onClick={irAServicios}>Ver todos los planes de infraestructura</button>
        </footer>

      </div>
    </div>
  )
}

export default SegmentModal
