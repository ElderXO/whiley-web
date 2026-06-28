import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import imgInfraestructura from '../../assets/segmentos/segmento-infraestructura.png'
import imgErp from '../../assets/segmentos/segmento-erp.png'
import imgDesarrolloIa from '../../assets/segmentos/segmento-desarrollo-ia.png'
import SegmentModal from './SegmentModal'
import './Summary.css'

// Los 3 segmentos principales de WileyTEC.
// tituloA va en blanco; tituloB toma el color del segmento (celeste o dorado).
const SEGMENTOS = [
  {
    numero: '01',
    circulo: 'celeste',
    tituloA: 'INFRAESTRUCTURA',
    tituloB: 'DIGITAL SEGURA',
    colorB: 'celeste',
    subtitulo: 'Hosting, VPS, Cloud, Big Data\ny seguridad gestionada.',
    imagen: imgInfraestructura,
    alt: 'Infraestructura digital segura',
    detalle: {
      intro: 'Infraestructura para empresas que necesitan rendimiento, continuidad y soporte experto. Hosting SSD administrado, VPS para cargas criticas y soluciones Big Data, con dominio .com, SSL y soporte especializado.',
      tecnologias: ['Cloud Computing', 'VPS', 'Seguridad informatica', 'Big Data', 'Correos corporativos', 'Dominios .com y .org', 'Certificados SSL', 'Hosting empresarial'],
      incluye: [
        'Hosting compartido',
        'VPS (servidores virtuales privados)',
        'VPS para Big Data',
        'Seguridad y proteccion anti spam',
        'Soporte tecnico permanente',
        'Panel de administracion',
        'Backups automaticos',
        'Dominio .com o .org gratuito',
        'Certificados SSL gratuitos',
        'Subdominios ilimitados'
      ],
      bloques: [
        { titulo: 'Planes de Hosting', texto: '4 planes que se diferencian por almacenamiento, tipo de disco SSD, trafico mensual, cuentas FTP, correos y subdominios. Todos incluyen dominio gratis, SSL, soporte tecnico y anti spam.' },
        { titulo: 'Planes VPS', texto: '4 planes que varian en CPU, RAM y espacio SSD. Maquina virtual exclusiva para el cliente, acceso administrativo completo, dominio gratuito, SSL y soporte.' },
        { titulo: 'VPS para Big Data', texto: 'Alto rendimiento para procesamiento masivo de datos, analitica y grandes volumenes. Incluye todo lo del VPS tradicional con mayores recursos de CPU, RAM y SSD.' }
      ]
    }
  },
  {
    numero: '02',
    circulo: 'dorado',
    tituloA: 'ERP Y GESTIÓN',
    tituloB: 'EMPRESARIAL',
    colorB: 'dorado',
    subtitulo: 'Implementación de SAP Business One para una gestión integrada y eficiente.',
    imagen: imgErp,
    alt: 'ERP y gestion empresarial',
    ruta: '/erp'
  },
  {
    numero: '03',
    circulo: 'celeste',
    tituloA: 'DESARROLLO A MEDIDA, AUTOMATIZACIONES E',
    tituloB: 'IA',
    colorB: 'celeste',
    subtitulo: 'Software a medida, digitalización de procesos y soluciones con Inteligencia Artificial.',
    imagen: imgDesarrolloIa,
    alt: 'Desarrollo a medida e IA',
    ruta: '/desarrollo'
  }
]

function Summary() {
  const [segmentoAbierto, setSegmentoAbierto] = useState(null)
  const navigate = useNavigate()

  const abrir = (seg) => {
    if (seg.detalle) setSegmentoAbierto(seg)
    else if (seg.ruta) navigate(seg.ruta)
  }

  const onKey = (e, seg) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      abrir(seg)
    }
  }

  return (
    <section className="summary-section" id="servicios">
      <div className="summary-header">
        <span className="summary-eyebrow">RESUMEN EJECUTIVO</span>
        <h2 className="summary-title">
          Servicios gestionados con <span className="accent">foco en negocio</span>
        </h2>
        <p className="summary-subtitle">
          Tres frentes para impulsar tu empresa: infraestructura segura, gestion
          empresarial y desarrollo a medida con inteligencia artificial.
        </p>
      </div>

      <div className="summary-grid">
        {SEGMENTOS.map((seg) => (
          <div className="summary-card-wrap" key={seg.numero}>
            <div className={`summary-card-num summary-card-num--${seg.circulo}`}>{seg.numero}</div>
            <article {...((seg.detalle || seg.ruta) ? { className: 'summary-card summary-card--clickable', role: 'button', tabIndex: 0, onClick: () => abrir(seg), onKeyDown: (e) => onKey(e, seg) } : { className: 'summary-card' })}>
              <img src={seg.imagen} alt={seg.alt} className="summary-card-img" loading="lazy" />
              <div className="summary-card-overlay"></div>
              <div className="summary-card-text">
                <h3 className="summary-card-title"><span className="summary-card-title-a">{seg.tituloA}</span> <span className={`summary-card-title-b summary-card-title-b--${seg.colorB}`}>{seg.tituloB}</span></h3>
                <p className="summary-card-sub">{seg.subtitulo}</p>
              </div>
            </article>
          </div>
        ))}
      </div>

      {segmentoAbierto && <SegmentModal data={segmentoAbierto} onClose={() => setSegmentoAbierto(null)} />}
    </section>
  )
}

export default Summary
