import { Headphones, FileText, CheckCircle, XCircle, Gauge, MessageSquare } from 'lucide-react'
import './SLASection.css'

function SLASection() {
  const definitionsBlocks = [
    {
      icon: Headphones,
      title: 'Cobertura del soporte',
      items: [
        'Atención para incidencias de servicio y consultas de uso del panel.',
        'Asistencia en configuración de DNS, SSL y correo corporativo.',
        'Migración guiada desde otro proveedor (según viabilidad técnica).'
      ]
    },
    {
      icon: FileText,
      title: 'Requisitos del cliente',
      items: [
        'Datos de titularidad del dominio y/o acceso al registrador.',
        'Contactos autorizados para soporte y facturación.',
        'Políticas internas de seguridad y respaldo de información crítica.'
      ]
    },
    {
      icon: CheckCircle,
      title: 'Entregables',
      items: [
        'Acceso al panel de administración y credenciales iniciales seguras.',
        'Certificado SSL activo y dominio configurado (cuando aplique).',
        'Reporte de activación con parámetros de servicio.'
      ]
    },
    {
      icon: XCircle,
      title: 'Alcances y exclusiones',
      items: [
        'Incluye soporte de plataforma y panel.',
        'No incluye desarrollo de software ni administración de aplicaciones del cliente (opcional bajo acuerdo).',
        'Personalizaciones o ampliaciones se cotizan por separado.'
      ]
    }
  ]

  const slaInfo = [
    {
      icon: Gauge,
      title: 'Niveles de servicio',
      items: [
        { label: 'Uptime objetivo:', value: '99.9% (Hosting) / 99.95% (VPS)' },
        { label: 'Soporte:', value: 'Atención 24/7; prioridad para incidencias P1 (servicio caído).' },
        { label: 'Monitoreo:', value: 'Alertas preventivas y vigilancia continua.' }
      ]
    },
    {
      icon: MessageSquare,
      title: 'Activación y canales',
      items: [
        { label: 'Activación:', value: 'Hosting 24–48 h · VPS 24–72 h (según disponibilidad).' },
        { label: 'Canales:', value: 'Teléfono y WhatsApp corporativo.' },
        { label: 'Escalamiento:', value: 'Mesa técnica especializada ante incidentes críticos.' }
      ]
    }
  ]

  return (
    <section className="sla-section">
      <div className="sla-header">
        <span className="sla-eyebrow">DEFINICIONES Y ALCANCE</span>
        <h2 className="sla-title">
          Condiciones <span className="accent">comerciales y operativas</span>
        </h2>
        <p className="sla-subtitle">
          Marco de servicio para la activación, operación y soporte de las soluciones de Hosting y VPS.
        </p>
      </div>

      {/* Bloque 1: Definiciones (4 cards) */}
      <div className="definitions-grid">
        {definitionsBlocks.map((block, index) => {
          const Icon = block.icon
          return (
            <article className="definition-card" key={index}>
              <div className="definition-header">
                <div className="definition-icon-wrapper">
                  <Icon size={24} strokeWidth={2} className="definition-icon" />
                </div>
                <h3 className="definition-title">{block.title}</h3>
              </div>
              <ul className="definition-list">
                {block.items.map((item, i) => (
                  <li key={i}>
                    <span className="bullet"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>

      {/* Bloque 2: SLA y tiempos */}
      <div className="sla-subheader">
        <span className="sla-eyebrow">SLA Y TIEMPOS DE ACTIVACIÓN</span>
        <h3 className="sla-subtitle-title">Niveles de servicio garantizados</h3>
      </div>

      <div className="sla-grid">
        {slaInfo.map((block, index) => {
          const Icon = block.icon
          return (
            <article className="sla-card" key={index}>
              <div className="sla-card-header">
                <div className="sla-icon-wrapper">
                  <Icon size={26} strokeWidth={2} className="sla-icon" />
                </div>
                <h4 className="sla-card-title">{block.title}</h4>
              </div>
              <ul className="sla-list">
                {block.items.map((item, i) => (
                  <li key={i}>
                    <strong>{item.label}</strong> {item.value}
                  </li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default SLASection