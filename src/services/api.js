const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`

// Funcion helper para hacer peticiones autenticadas
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('admin_token')

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  // Si hay token, lo agregamos automaticamente
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Error en la peticion')
  }

  return data
}

// ====== CONTACTOS / MENSAJES ======
export const contactosAPI = {
  listar: () => apiRequest('/contactos'),
  obtenerPorId: (id) => apiRequest(`/contactos/${id}`),
  estadisticas: () => apiRequest('/contactos/estadisticas'),
  actualizarEstado: (id, estado) => apiRequest(`/contactos/${id}/estado`, {
    method: 'PUT',
    body: JSON.stringify({ estado })
  }),
  eliminar: (id) => apiRequest(`/contactos/${id}`, { method: 'DELETE' })
}

// ====== PLANES HOSTING ======
export const planesHostingAPI = {
  listar: () => apiRequest('/planes-hosting'),
  obtenerPorId: (id) => apiRequest(`/planes-hosting/${id}`),
  crear: (datos) => apiRequest('/planes-hosting', {
    method: 'POST',
    body: JSON.stringify(datos)
  }),
  actualizar: (id, datos) => apiRequest(`/planes-hosting/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos)
  }),
  eliminar: (id) => apiRequest(`/planes-hosting/${id}`, { method: 'DELETE' })
}

// ====== PLANES VPS ======
export const planesVPSAPI = {
  listar: () => apiRequest('/planes-vps'),
  obtenerPorId: (id) => apiRequest(`/planes-vps/${id}`),
  crear: (datos) => apiRequest('/planes-vps', {
    method: 'POST',
    body: JSON.stringify(datos)
  }),
  actualizar: (id, datos) => apiRequest(`/planes-vps/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos)
  }),
  eliminar: (id) => apiRequest(`/planes-vps/${id}`, { method: 'DELETE' })
}

// ====== PLANES BIG DATA ======
export const planesBigDataAPI = {
  listar: () => apiRequest('/planes-bigdata'),
  obtenerPorId: (id) => apiRequest(`/planes-bigdata/${id}`),
  crear: (datos) => apiRequest('/planes-bigdata', {
    method: 'POST',
    body: JSON.stringify(datos)
  }),
  actualizar: (id, datos) => apiRequest(`/planes-bigdata/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos)
  }),
  eliminar: (id) => apiRequest(`/planes-bigdata/${id}`, { method: 'DELETE' })
}

// ====== EQUIPO ======
export const equipoAPI = {
  listar: () => apiRequest('/equipo'),
  obtenerPorId: (id) => apiRequest(`/equipo/${id}`),
  crear: (datos) => apiRequest('/equipo', {
    method: 'POST',
    body: JSON.stringify(datos)
  }),
  actualizar: (id, datos) => apiRequest(`/equipo/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos)
  }),
  eliminar: (id) => apiRequest(`/equipo/${id}`, { method: 'DELETE' })
}

// ====== FAQs ======
export const faqsAPI = {
  listar: () => apiRequest('/faqs'),
  obtenerPorId: (id) => apiRequest(`/faqs/${id}`),
  crear: (datos) => apiRequest('/faqs', {
    method: 'POST',
    body: JSON.stringify(datos)
  }),
  actualizar: (id, datos) => apiRequest(`/faqs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos)
  }),
  eliminar: (id) => apiRequest(`/faqs/${id}`, { method: 'DELETE' })
}

// ====== HISTORIAL ======
export const historialAPI = {
  listar: () => apiRequest('/historial'),
  porTabla: (tabla) => apiRequest(`/historial/${tabla}`)
}