import { Globe, Server, Database, Gift } from 'lucide-react'
import './Summary.css'

function Summary() {
  const items = [
    {
      icon: Globe,
      title: 'Dominio & Hosting',
      subtitle: 'Planes SSD',
      description: 'Opciones Standard, Enhanced, Premium y Ultimate con correo corporativo, bases de datos, backups y SSL.'
    },
    {
      icon: Server,
      title: 'VPS SSD',
      subtitle: 'Reseller Empresarial',
      description: 'VPS administrables con IP dedicada, acceso root y panel, listos para producción.'
    },
    {
      icon: Database,
      title: 'VPS Big Data',
      subtitle: 'Alto Almacenamiento',
      description: 'Planes BIG1 a BIG8 con hasta 16 núcleos y 8 TB de almacenamiento para datos masivos.'
    },
    {
      icon: Gift,
      title: 'Incluye sin costo extra',
      subtitle: '',
      description: 'Dominio .com, Certificado SSL y asesoría de despliegue.'
    }
  ]

  return (
    <section className="summary-section">
      <div className="summary-header">
        <span className="summary-eyebrow">RESUMEN EJECUTIVO</span>
        <h2 className="summary-title">
          Servicios gestionados con <span className="accent">foco en negocio</span>
        </h2>
        <p className="summary-subtitle">
          Infraestructura, seguridad y soporte continuo para proyectos que exigen
          estabilidad, rendimiento y acompañamiento experto.
        </p>
      </div>

      <div className="summary-grid">
        {items.map((item, index) => {
          const Icon = item.icon
          return (
            <article className="summary-card" key={index}>
              <div className="summary-icon-wrapper">
                <Icon size={28} strokeWidth={2} className="summary-icon" />
              </div>
              <div className="summary-content">
                <h3 className="summary-card-title">
                  {item.title}
                  {item.subtitle && (
                    <span className="summary-card-subtitle">{item.subtitle}</span>
                  )}
                </h3>
                <p className="summary-card-description">{item.description}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Summary