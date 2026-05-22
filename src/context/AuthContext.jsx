import { createContext, useContext, useState, useEffect } from 'react'

// Crear el contexto
const AuthContext = createContext()

// Proveedor del contexto (envuelve toda la app del admin)
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Al cargar la app, recuperar el token de localStorage
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('admin_token')
    const adminGuardado = localStorage.getItem('admin_data')

    if (tokenGuardado && adminGuardado) {
      setToken(tokenGuardado)
      setAdmin(JSON.parse(adminGuardado))
    }
    setLoading(false)
  }, [])

  // Funcion para iniciar sesion
  const login = (adminData, tokenData) => {
    setAdmin(adminData)
    setToken(tokenData)
    // Guardar en localStorage para que sobreviva al refresh
    localStorage.setItem('admin_token', tokenData)
    localStorage.setItem('admin_data', JSON.stringify(adminData))
  }

  // Funcion para cerrar sesion
  const logout = () => {
    setAdmin(null)
    setToken(null)
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_data')
  }

  // Verificar si esta autenticado
  const isAuthenticated = !!token && !!admin

  return (
    <AuthContext.Provider value={{
      admin,
      token,
      loading,
      login,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para usar el contexto facilmente
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}