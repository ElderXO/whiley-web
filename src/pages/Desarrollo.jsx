import { useEffect, useRef, useState } from 'react'
import { Search, Lightbulb, Code2, Rocket, TrendingUp, Gauge, Coins, LineChart, Users, ShieldCheck, Cog, BrainCircuit } from 'lucide-react'
import { openWhatsApp } from '../utils/whatsapp'

import heroDesarrollo from '../assets/desarrollo/hero-principal.png'
import icoDesarrollo from '../assets/desarrollo/ico-desarrollo.png'
import icoDigitalizacion from '../assets/desarrollo/ico-digitalizacion.png'
import icoCapacitacion from '../assets/desarrollo/ico-capacitacion.png'
import icoImplementacion from '../assets/desarrollo/ico-implementacion.png'
import icoOptimizacion from '../assets/desarrollo/ico-optimizacion.png'
import imgDesarrollo from '../assets/desarrollo/img-desarrollo.png'
import imgDigitalizacion from '../assets/desarrollo/img-digitalizacion.png'
import imgCapacitacion from '../assets/desarrollo/img-capacitacion.png'
import imgImplementacion from '../assets/desarrollo/img-implementacion.png'
import imgOptimizacion from '../assets/desarrollo/img-optimizacion.png'

import './Desarrollo.css'

const PILARES = [
  { icono: icoDesarrollo, imagen: imgDesarrollo, color: 'azul', titulo: 'Desarrollo a medida', texto: 'Creamos software hecho a la medida de tu negocio.' },
  { icono: icoDigitalizacion, imagen: imgDigitalizacion, color: 'verde', titulo: 'Digitalizacion', texto: 'Convertimos procesos manuales en flujos digitales eficientes.' },
  { icono: icoCapacitacion, imagen: imgCapacitacion, color: 'morado', titulo: 'Capacitacion en IA', texto: 'Formamos a tu equipo en el uso practico de herramientas de IA.' },
  { icono: icoImplementacion, imagen: imgImplementacion, color: 'naranja', titulo: 'Implementacion de IA', texto: 'Integramos IA en tus procesos para generar mas valor.' },
  { icono: icoOptimizacion, imagen: imgOptimizacion, color: 'celeste', titulo: 'Optimizacion con IA', texto: 'Optimizamos operaciones, reducimos costos y tomamos mejores decisiones.' }
]

const PASOS = [
  { Icono: Search, texto: 'Entendemos tu negocio' },
  { Icono: Lightbulb, texto: 'Disenamos la mejor solucion' },
  { Icono: Code2, texto: 'Desarrollamos a medida' },
  { Icono: Rocket, texto: 'Implementamos e integramos' },
  { Icono: TrendingUp, texto: 'Optimizamos y generamos valor' }
]

const RESULTADOS = [
  { Icono: Gauge, titulo: 'Mas eficiencia' },
  { Icono: Coins, titulo: 'Menos costos' },
  { Icono: LineChart, titulo: 'Mejores decisiones' },
  { Icono: Users, titulo: 'Mayor competitividad' }
]

const CONFIANZA = [
  { Icono: ShieldCheck, titulo: 'Soluciones seguras', texto: 'Desarrollos robustos, escalables y confiables.' },
  { Icono: Cog, titulo: 'Integracion total', texto: 'Conectamos sistemas y automatizamos procesos.' },
  { Icono: Users, titulo: 'Equipo experto', texto: 'Profesionales con experiencia en tecnologia e innovacion.' },
  { Icono: BrainCircuit, titulo: 'Innovacion continua', texto: 'Aplicamos IA para mejorar tu negocio dia a dia.' }
]

function Desarrollo() {
  const flujoRef = useRef(null)
  const [flujoVisible, setFlujoVisible] = useState(false)
  const dualRef = useRef(null)
  const [dualVisible, setDualVisible] = useState(false)

  useEffect(() => {
    const el = flujoRef.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setFlujoVisible(true); obs.disconnect() } })
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const el = dualRef.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setDualVisible(true); obs.disconnect() } })
    }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const hablemos = () => openWhatsApp('51920335420', 'Hola, quiero informacion sobre desarrollo a medida, automatizaciones e IA.')

  return (
    <main className="dev-page">

      {/* 1) HERO */}
      <section className="dev-hero">
        <div className="dev-hero-text">
          <span className="dev-eyebrow">IMPULSAMOS TU NEGOCIO CON SOLUCIONES TECNOLOGICAS</span>
          <h1 className="dev-hero-title">SOLUCIONES A MEDIDA</h1>
          <p className="dev-hero-sub">Tecnologia que impulsa tus <span className="dev-accent-blue">resultados</span></p>
        </div>
        <div className="dev-hero-img-wrap">
          <img className="dev-hero-img" src={heroDesarrollo} alt="Desarrollo a medida e inteligencia artificial" />
          <span className="dev-orb dev-orb--1"></span>
          <span className="dev-orb dev-orb--2"></span>
          <span className="dev-orb dev-orb--3"></span>
          <span className="dev-orb dev-orb--4"></span>
        </div>
      </section>

      {/* 2) PILARES DE SERVICIO */}
      <section className="dev-section">
        <h2 className="dev-section-title">Nuestros <span className="dev-accent-blue">servicios</span></h2>
        <div className="dev-pilares">
          {PILARES.map((p) => (
            <article className="dev-pilar" key={p.titulo}>
              <div className={`dev-pilar-icon dev-pilar-icon--${p.color}`}><img src={p.icono} alt="" /></div>
              <h3 className="dev-pilar-title">{p.titulo}</h3>
              <p className="dev-pilar-text">{p.texto}</p>
              <div className="dev-pilar-img-wrap"><img className="dev-pilar-img" src={p.imagen} alt="" /></div>
            </article>
          ))}
        </div>
      </section>

      {/* 3) COMO TRABAJAMOS */}
      <section className="dev-flujo-section">
        <h2 className="dev-section-title">Como <span className="dev-accent-blue">trabajamos</span></h2>
        <div className={`dev-flujo ${flujoVisible ? 'is-visible' : ''}`} ref={flujoRef}>
          {PASOS.map((paso, i) => (
            <div className="dev-flujo-item" key={paso.texto}>
              <div className="dev-paso" style={{ transitionDelay: `${i * 0.18}s` }}>
                <div className="dev-paso-icon"><paso.Icono size={40} strokeWidth={1.8} /></div>
                <span className="dev-paso-num">{i + 1}</span>
                <p className="dev-paso-text">{paso.texto}</p>
              </div>
              {i < PASOS.length - 1 && <span className="dev-conector" style={{ transitionDelay: `${i * 0.18 + 0.1}s` }} />}
            </div>
          ))}
        </div>
      </section>

      {/* 4 y 5) RESULTADOS + CONFIANZA (lado a lado) */}
      <section className="dev-section">
        <div className={`dev-dual ${dualVisible ? 'is-visible' : ''}`} ref={dualRef}>

          <div className="dev-dual-col">
            <h2 className="dev-dual-title">Resultados que <span className="dev-accent-gold">importan</span></h2>
            <div className="dev-resultados">
              {RESULTADOS.map((r) => (
                <div className="dev-resultado" key={r.titulo}>
                  <r.Icono className="dev-resultado-icon" size={34} strokeWidth={1.6} />
                  <h3 className="dev-resultado-title">{r.titulo}</h3>
                </div>
              ))}
            </div>
          </div>

          <div className="dev-dual-col">
            <h2 className="dev-dual-title">Por que <span className="dev-accent-blue">confiar</span> en nosotros</h2>
            <div className="dev-confianza">
              {CONFIANZA.map((c) => (
                <article className="dev-confianza-card" key={c.titulo}>
                  <div className="dev-confianza-icon"><c.Icono size={26} strokeWidth={1.8} /></div>
                  <div className="dev-confianza-body">
                    <h3 className="dev-confianza-title">{c.titulo}</h3>
                    <p className="dev-confianza-text">{c.texto}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 6) CIERRE / CTA */}
      <section className="dev-cierre">
        <p className="dev-cierre-slogan">TRANSFORMAMOS TECNOLOGIA EN <span className="dev-accent-blue">RESULTADOS</span> PARA TU NEGOCIO.</p>
        <button className="dev-cta" onClick={hablemos}>Hablemos</button>
        <p className="dev-cierre-sub">Descubre como podemos ayudarte a crecer.</p>
      </section>

    </main>
  )
}

export default Desarrollo
