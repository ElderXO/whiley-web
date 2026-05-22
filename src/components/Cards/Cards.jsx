import { ArrowRight } from 'lucide-react'
import cardInfraestructura from '../../assets/card-infraestructura.png'
import cardSap from '../../assets/card-sap.png'
import cardDesarrollo from '../../assets/card-desarrollo.png'
import cardTransformacion from '../../assets/card-transformacion.png'
import cardInnovacion from '../../assets/card-innovacion.png'
import './Cards.css'

function Cards() {
  const cards = [
    {
      image: cardInfraestructura,
      title: 'Infraestructura gestionada',
      description: 'Operación estable y segura.'
    },
    {
      image: cardSap,
      title: 'SAP BusinessObjects',
      description: 'Analítica y reporting confiable.'
    },
    {
      image: cardDesarrollo,
      title: 'Desarrollo a medida',
      description: 'Software para procesos reales.'
    },
    {
      image: cardTransformacion,
      title: 'Transformación digital',
      description: 'Sistemas alineados al negocio.'
    },
    {
      image: cardInnovacion,
      title: 'Innovación aplicada',
      description: 'Nuevas capacidades con criterio técnico.'
    }
  ]

  return (
    <section className="cards-section">
      <div className="cards-container">
        {cards.map((card, index) => (
          <article
            className="card"
            key={index}
            style={{ '--card-bg': `url(${card.image})` }}
          >
            {/* Borde animado */}
            <div className="card-border"></div>

            {/* Esquinas decorativas */}
            <span className="card-corner card-corner-tl"></span>
            <span className="card-corner card-corner-tr"></span>
            <span className="card-corner card-corner-bl"></span>
            <span className="card-corner card-corner-br"></span>

            {/* Imagen de fondo */}
            <div className="card-bg"></div>

            {/* Contenido (texto) */}
            <div className="card-content">
              <h3 className="card-title">{card.title}</h3>
              <p className="card-description">{card.description}</p>
              <a href="#" className="card-link">
                Ver más
                <ArrowRight size={14} strokeWidth={2.5} className="card-link-arrow" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Cards