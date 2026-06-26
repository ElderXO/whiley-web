import { Star, Landmark, ShoppingCart, ShoppingBag, Boxes, Factory, BarChart3 } from 'lucide-react'
import { openWhatsApp } from '../utils/whatsapp'

import logoSap from '../assets/erp/logo-sap-business-one.png'
import logoWiley from '../assets/logo-header.png'
import heroErp from '../assets/erp/hero-soluciones-clean.png'

import benGestion from '../assets/erp/ben-gestion.png'
import benEficiencia from '../assets/erp/ben-eficiencia.png'
import benControl from '../assets/erp/ben-control.png'
import benEscalabilidad from '../assets/erp/ben-escalabilidad.png'
import benRentabilidad from '../assets/erp/ben-rentabilidad.png'

import './Erp.css'

const BENEFICIOS = [
  { icono: benGestion, titulo: 'Gestion integral', texto: 'Administre todas las areas de su empresa en una sola solucion.' },
  { icono: benEficiencia, titulo: 'Mayor eficiencia', texto: 'Automatice procesos y tome decisiones mas rapidas.' },
  { icono: benControl, titulo: 'Control en tiempo real', texto: 'Acceda a informacion actualizada para mejorar el control y la productividad.' },
  { icono: benEscalabilidad, titulo: 'Escalabilidad', texto: 'Una solucion flexible que crece junto con su empresa.' },
  { icono: benRentabilidad, titulo: 'Mejor rentabilidad', texto: 'Optimice recursos y reduzca costos operativos.' }
]

const MODULOS = [
  { Icono: Landmark, nombre: 'Finanzas' },
  { Icono: ShoppingCart, nombre: 'Ventas' },
  { Icono: ShoppingBag, nombre: 'Compras' },
  { Icono: Boxes, nombre: 'Inventarios' },
  { Icono: Factory, nombre: 'Produccion' },
  { Icono: BarChart3, nombre: 'Reportes' }
]

function Erp() {
  const solicitar = () => openWhatsApp('51920335420', 'Hola, quiero informacion sobre la implementacion de SAP Business One.')

  return (
    <main className="erp-page">

      {/* 1) HERO / CO-BRANDING */}
      <section className="erp-hero">
        <div className="erp-hero-text">
          <div className="erp-brands">
            <img className="erp-brand-sap" src={logoSap} alt="SAP Business One" />
            <span className="erp-brand-sep" />
            <span className="erp-brand-wiley">
              <img className="erp-brand-wiley-logo" src={logoWiley} alt="Wiley Technology" />
              <span className="erp-brand-wiley-text">WILEY TECHNOLOGY</span>
            </span>
          </div>

          <h1 className="erp-hero-title">
            SOLUCIONES INTELIGENTES PARA <span className="erp-accent-blue">EMPRESAS EN CRECIMIENTO</span>
          </h1>
          <p className="erp-hero-lead">
            SAP Business One (SAP B1) es la solucion de gestion empresarial disenada para pequenas y
            medianas empresas que buscan eficiencia, control y crecimiento sostenible.
          </p>
        </div>

        <div className="erp-hero-img-wrap">
          <img className="erp-hero-img" src={heroErp} alt="Dashboards de SAP Business One" />
          <span className="erp-orb erp-orb--1"></span>
          <span className="erp-orb erp-orb--2"></span>
          <span className="erp-orb erp-orb--3"></span>
        </div>
      </section>

      {/* 2) BENEFICIOS CLAVE */}
      <section className="erp-section">
        <h2 className="erp-section-title">Beneficios <span className="erp-accent-blue">clave</span></h2>
        <div className="erp-beneficios">
          {BENEFICIOS.map((b) => (
            <article className="erp-beneficio" key={b.titulo}>
              <div className="erp-beneficio-icon"><img src={b.icono} alt="" /></div>
              <h3 className="erp-beneficio-title">{b.titulo}</h3>
              <p className="erp-beneficio-text">{b.texto}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 3) MODULOS */}
      <section className="erp-modulos">
        <h2 className="erp-modulos-title">SAP BUSINESS ONE SE ADAPTA A TU NEGOCIO</h2>
        <p className="erp-modulos-sub">
          Elige la opcion de licenciamiento y consultoria que mejor se ajuste al tamano y necesidades de tu empresa.
        </p>
        <div className="erp-modulos-grid">
          {MODULOS.map((m) => (
            <div className="erp-modulo" key={m.nombre}>
              <m.Icono className="erp-modulo-icon" size={46} strokeWidth={1.5} />
              <span className="erp-modulo-name">{m.nombre}</span>
            </div>
          ))}
        </div>
        <p className="erp-modulos-slogan">UNA SOLUCION. TODOS LOS PROCESOS. MEJORES RESULTADOS.</p>
      </section>

      {/* 4) OPCIONES DE LICENCIAS Y CONSULTORIA */}
      <section className="erp-section">
        <h2 className="erp-section-title">Opciones de licencias y <span className="erp-accent-gold">consultoria</span></h2>
        <div className="erp-licencias">

          <article className="erp-licencia erp-licencia--blue">
            <header className="erp-licencia-head erp-licencia-head--blue">Cuando la cantidad de usuarios es igual o menor a 5</header>
            <div className="erp-licencia-body">
              <div className="erp-precio-row">
                <span className="erp-precio-label">Licencia starter package SAP (maximo hasta 5 usuarios)</span>
                <span className="erp-precio-val">USD 1,800</span>
              </div>
              <span className="erp-precio-nota">Pago no recurrente</span>
              <div className="erp-precio-row">
                <span className="erp-precio-label">Consultoria MIPYME / PYME</span>
                <span className="erp-precio-val">USD 8,500</span>
              </div>
              <span className="erp-precio-nota">Pago no recurrente</span>
              <p className="erp-licencia-tip"><Star size={16} className="erp-star" /> Ideal para empresas que estan comenzando su transformacion digital.</p>
            </div>
          </article>

          <article className="erp-licencia erp-licencia--gold">
            <header className="erp-licencia-head erp-licencia-head--gold">Cuando la cantidad de usuarios es mayor a 5</header>
            <div className="erp-licencia-body">
              <span className="erp-licencia-aclaracion">Por licencia · Pago no recurrente</span>
              <div className="erp-precio-row">
                <span className="erp-precio-label">Licencia SAP profesional</span>
                <span className="erp-precio-val">USD 2,700</span>
              </div>
              <div className="erp-precio-row">
                <span className="erp-precio-label">Licencia financiera</span>
                <span className="erp-precio-val">USD 1,400</span>
              </div>
              <div className="erp-precio-row">
                <span className="erp-precio-label">Licencia logistica</span>
                <span className="erp-precio-val">USD 1,400</span>
              </div>
              <div className="erp-precio-row">
                <span className="erp-precio-label">Consultoria</span>
                <span className="erp-precio-val">USD 13,500</span>
              </div>
              <p className="erp-licencia-tip"><Star size={16} className="erp-star" /> Ideal para empresas que requieren una solucion completa e integrada para una gestion avanzada.</p>
            </div>
          </article>

        </div>
      </section>

      {/* 5) SECCIONES INFERIORES */}
      <section className="erp-section">
        <div className="erp-extra">
          <article className="erp-extra-card">
            <h3 className="erp-extra-title">Acompanamiento experto</h3>
            <p className="erp-extra-text">Nuestro equipo de consultores certificados te acompana en todo el proceso de implementacion para asegurar el exito de tu proyecto.</p>
          </article>
          <article className="erp-extra-card">
            <h3 className="erp-extra-title">Mantenimiento anual</h3>
            <p className="erp-extra-text">18% del costo de licencia.</p>
          </article>
        </div>
      </section>

      {/* 6) CIERRE */}
      <section className="erp-cierre">
        <p className="erp-cierre-slogan">SAP BUSINESS ONE (SAP B1) · <span className="erp-accent-blue">CONTROL TOTAL. CRECIMIENTO SIN LIMITES.</span></p>
        <button className="erp-cta" onClick={solicitar}>Solicitar implementacion de SAP B1</button>
      </section>

    </main>
  )
}

export default Erp
