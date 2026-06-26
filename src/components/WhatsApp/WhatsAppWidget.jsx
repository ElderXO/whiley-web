import { useState, useEffect, useRef } from 'react'
import { openWhatsApp } from '../../utils/whatsapp'
import './WhatsAppWidget.css'

// ============================================================
//  CONTACTOS  ->  edita aqui nombre, cargo y numero.
//  Formato del telefono: 51 + numero, SIN espacios ni signos.
//  Orden pedido por Wilder: 1) Wilder  2) Debora  3) Leyner
// ============================================================
// Fallback por defecto: si la API falla o demora (Render free tier tarda ~30s
// en frio), el widget muestra estos contactos y NUNCA queda vacio.
const CONTACTOS_FALLBACK = [
  { nombre: 'Wilder Pardo', cargo: 'Director general', telefono: '51920335420' },
  { nombre: 'Débora Angulo', cargo: 'Agente comercial', telefono: '51XXXXXXXXX' },
  { nombre: 'Leyner Abad', cargo: 'Innovación y Tecnología', telefono: '51920335420' }
]

const MENSAJE_INICIAL = 'Hola, vengo desde la web de WileyTEC y quisiera mas informacion.'

// Icono oficial de WhatsApp en SVG (sin dependencias externas)
function WhatsAppIcon({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5-.17 0-.37-.03-.57-.03-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35M12 21.5c-1.68 0-3.32-.45-4.75-1.3l-.34-.2-3.53.92.94-3.44-.22-.36A9.45 9.45 0 0 1 2.5 12 9.5 9.5 0 0 1 12 2.5 9.5 9.5 0 0 1 21.5 12 9.5 9.5 0 0 1 12 21.5M12 .5A11.5 11.5 0 0 0 .5 12c0 2.03.53 4 1.54 5.74L.5 23.5l5.9-1.54A11.5 11.5 0 1 0 12 .5z" />
    </svg>
  )
}

function WhatsAppWidget() {
  const [abierto, setAbierto] = useState(false)
  const [contactos, setContactos] = useState(CONTACTOS_FALLBACK)
  const panelRef = useRef(null)

  // Carga los contactos desde la API publica al montar. Si falla o viene vacio,
  // se mantiene el fallback para que el widget nunca quede sin contactos.
  useEffect(() => {
    let activo = true
    const cargar = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/whatsapp-contactos`)
        if (!response.ok) throw new Error('respuesta no ok')
        const ct = response.headers.get('content-type') || ''
        if (!ct.includes('application/json')) throw new Error('no es json')
        const data = await response.json()
        const lista = data.contactos || data.whatsapp || (Array.isArray(data) ? data : [])
        if (activo && lista.length > 0) {
          setContactos(lista)
        }
      } catch {
        // Cualquier fallo (red caida, 404, HTML, json invalido): se mantiene CONTACTOS_FALLBACK
      }
    }
    cargar()
    return () => { activo = false }
  }, [])

  // Cerrar al hacer clic fuera del panel
  useEffect(() => {
    if (!abierto) return
    const handleClickFuera = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && !e.target.closest('.wa-fab')) {
        setAbierto(false)
      }
    }
    const handleEsc = (e) => { if (e.key === 'Escape') setAbierto(false) }
    document.addEventListener('mousedown', handleClickFuera)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickFuera)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [abierto])

  const elegirContacto = (telefono) => {
    openWhatsApp(telefono, MENSAJE_INICIAL)
    setAbierto(false)
  }

  return (
    <div className="wa-widget">

      {/* PANEL DE CONTACTOS */}
      <div className={`wa-panel ${abierto ? 'wa-panel--open' : ''}`} ref={panelRef} role="dialog" aria-label="Chat de WhatsApp con WileyTEC">

        {/* Cabecera verde */}
        <div className="wa-panel__header">
          <div className="wa-panel__avatar"><WhatsAppIcon size={26} /></div>
          <div className="wa-panel__head-text">
            <span className="wa-panel__title">WileyTEC</span>
            <span className="wa-panel__status"><i className="wa-dot" /> En línea · responde en minutos</span>
          </div>
          <button className="wa-panel__close" onClick={() => setAbierto(false)} aria-label="Cerrar chat">×</button>
        </div>

        {/* Cuerpo azul acero */}
        <div className="wa-panel__body">
          <p className="wa-panel__intro">¡Hola! 👋 Elige con quién deseas conversar y te atendemos por WhatsApp.</p>

          <div className="wa-contactos">
            {contactos.map((c) => (
              <button className="wa-contacto" key={c.nombre} onClick={() => elegirContacto(c.telefono)}>
                <span className="wa-contacto__avatar">{c.nombre.charAt(0)}</span>
                <span className="wa-contacto__info">
                  <span className="wa-contacto__nombre">{c.nombre}</span>
                  <span className="wa-contacto__cargo">{c.cargo}</span>
                </span>
                <span className="wa-contacto__go"><WhatsAppIcon size={20} /></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BOTON FLOTANTE */}
      <button className={`wa-fab ${abierto ? 'wa-fab--active' : ''}`} onClick={() => setAbierto(!abierto)} aria-label="Abrir chat de WhatsApp" aria-expanded={abierto}>
        {abierto ? <span className="wa-fab__close">×</span> : <WhatsAppIcon size={32} />}
        {!abierto && <span className="wa-fab__pulse" />}
      </button>
    </div>
  )
}

export default WhatsAppWidget
