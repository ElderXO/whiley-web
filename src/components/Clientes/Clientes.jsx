import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

import cienti from '../../assets/clientes/cliente-cientifica.png'
import coled from '../../assets/clientes/cliente-coled.png'
import donSalazar from '../../assets/clientes/cliente-don-salazar.png'
import fincaJuanCarlos from '../../assets/clientes/cliente-finca-juan-carlos.png'
import incaValley from '../../assets/clientes/cliente-inca-valley.png'
import inppares from '../../assets/clientes/cliente-inppares.png'
import moali from '../../assets/clientes/cliente-moali.png'
import narsa from '../../assets/clientes/cliente-narsa.png'
import partdoCoffee from '../../assets/clientes/cliente-partdo-coffee.png'
import redlac from '../../assets/clientes/cliente-redlac.png'
import romatex from '../../assets/clientes/cliente-romatex.png'
import rufticos from '../../assets/clientes/cliente-rufticos.png'
import scaPeru from '../../assets/clientes/cliente-sca-peru.png'
import tierraJovenes from '../../assets/clientes/cliente-tierra-jovenes-mujeres.png'

import cCienti from '../../assets/clientes/circulares/cliente-cientifica.png'
import cColed from '../../assets/clientes/circulares/cliente-coled.png'
import cDonSalazar from '../../assets/clientes/circulares/cliente-don-salazar.png'
import cFincaJuanCarlos from '../../assets/clientes/circulares/cliente-finca-juan-carlos.png'
import cIncaValley from '../../assets/clientes/circulares/cliente-inca-valley.png'
import cInppares from '../../assets/clientes/circulares/cliente-inppares.png'
import cMoali from '../../assets/clientes/circulares/cliente-moali.png'
import cNarsa from '../../assets/clientes/circulares/cliente-narsa.png'
import cPartdoCoffee from '../../assets/clientes/circulares/cliente-partdo-coffee.png'
import cRedlac from '../../assets/clientes/circulares/cliente-redlac.png'
import cRomatex from '../../assets/clientes/circulares/cliente-romatex.png'
import cRufticos from '../../assets/clientes/circulares/cliente-rufticos.png'
import cScaPeru from '../../assets/clientes/circulares/cliente-sca-peru.png'
import cTierraJovenes from '../../assets/clientes/circulares/cliente-tierra-jovenes-mujeres.png'

import './Clientes.css'

const LOGOS = [
  { nombre: 'Inppares', src: inppares, circular: cInppares },
  { nombre: 'Don Salazar', src: donSalazar, circular: cDonSalazar },
  { nombre: 'Inca Valley', src: incaValley, circular: cIncaValley },
  { nombre: 'Redlac', src: redlac, circular: cRedlac },
  { nombre: 'Romatex', src: romatex, circular: cRomatex },
  { nombre: 'Cientifica Consultores', src: cienti, circular: cCienti },
  { nombre: 'Coled', src: coled, circular: cColed },
  { nombre: 'Moali', src: moali, circular: cMoali },
  { nombre: 'Narsa', src: narsa, circular: cNarsa },
  { nombre: 'Tierra de Jovenes y Mujeres', src: tierraJovenes, circular: cTierraJovenes },
  { nombre: 'SCA Peru', src: scaPeru, circular: cScaPeru },
  { nombre: 'La Finca de Juan Carlos', src: fincaJuanCarlos, circular: cFincaJuanCarlos },
  { nombre: 'Rufticos', src: rufticos, circular: cRufticos },
  { nombre: 'Partdo Coffee', src: partdoCoffee, circular: cPartdoCoffee }
]

function Clientes() {
  const [seleccionado, setSeleccionado] = useState(null)

  useEffect(() => {
    if (!seleccionado) return
    const onEsc = (e) => { if (e.key === 'Escape') setSeleccionado(null) }
    document.addEventListener('keydown', onEsc)
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = previo
    }
  }, [seleccionado])

  return (
    <section className="clientes-section">
      <div className="clientes-inner">

        <div className="clientes-text">
          <h2 className="clientes-title">¡NUESTROS CLIENTES NOS <span className="clientes-accent">RESPALDAN!</span></h2>
          <p className="clientes-desc">Empresas, organizaciones e instituciones que confian en nuestras soluciones tecnologicas.</p>
        </div>

        <div className="clientes-marquee">
          <div className="clientes-track">
            {LOGOS.concat(LOGOS).map((logo, i) => (
              logo.circular ? (
                <button className="cliente-logo cliente-logo--btn" type="button" key={i} onClick={() => setSeleccionado(logo)} aria-label={`Ver logo de ${logo.nombre}`}>
                  <img src={logo.src} alt={logo.nombre} loading="lazy" />
                </button>
              ) : (
                <div className="cliente-logo" key={i}>
                  <img src={logo.src} alt={logo.nombre} loading="lazy" />
                </div>
              )
            ))}
          </div>
        </div>

      </div>

      {seleccionado && (
        <div className="clientes-lightbox" onClick={() => setSeleccionado(null)} role="presentation">
          <div className="clientes-lightbox-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={seleccionado.nombre}>
            <button className="clientes-lightbox-close" onClick={() => setSeleccionado(null)} aria-label="Cerrar">
              <X size={22} />
            </button>
            <img className="clientes-lightbox-img" src={seleccionado.circular} alt={seleccionado.nombre} />
            <span className="clientes-lightbox-nombre">{seleccionado.nombre}</span>
          </div>
        </div>
      )}

    </section>
  )
}

export default Clientes
