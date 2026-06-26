// Utilidad central para abrir conversaciones de WhatsApp.
// Asi cualquier boton del sitio ("Contratar plan", "Ver mas", etc.)
// abre el chat con un mensaje ya escrito, sin repetir codigo.

// Numero principal de la empresa (Wilder). Formato internacional SIN signos: 51 + numero.
export const WHATSAPP_PRINCIPAL = '51920335420'

export function openWhatsApp(telefono = WHATSAPP_PRINCIPAL, mensaje = '') {
  const numero = String(telefono).replace(/\D/g, '')
  const texto = mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''
  const url = `https://wa.me/${numero}${texto}`

  // Abrimos con un enlace simulado en vez de window.open con "features": en
  // produccion (HTTPS, otro dominio) el bloqueador de pop-ups suele bloquear
  // window.open(..., 'noopener,noreferrer'). Un click de enlace real no se bloquea.
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.target = '_blank'
  enlace.rel = 'noopener noreferrer'
  document.body.appendChild(enlace)
  enlace.click()
  enlace.remove()
}

// Mensaje por defecto cuando alguien escribe desde la web.
export function mensajePlan(nombrePlan) {
  return nombrePlan
    ? `Hola, vengo desde la web de WileyTEC y me interesa el plan "${nombrePlan}". ¿Me pueden dar mas informacion?`
    : 'Hola, vengo desde la web de WileyTEC y quisiera mas informacion.'
}
