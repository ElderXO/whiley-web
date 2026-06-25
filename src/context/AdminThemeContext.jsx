import { createContext, useContext, useState, useEffect } from 'react'

// Contexto exclusivo del panel administrativo para el tema claro/oscuro.
// Es independiente de la sesion (AuthContext), por lo que la preferencia
// se conserva aunque el admin cierre e inicie sesion de nuevo.
const AdminThemeContext = createContext()

const STORAGE_KEY = 'admin_theme'
const DEFAULT_THEME = 'dark' // El oscuro sigue siendo el predeterminado

// Lee el tema guardado una sola vez al inicializar el estado.
function getInitialTheme() {
  const guardado = localStorage.getItem(STORAGE_KEY)
  return guardado === 'light' || guardado === 'dark' ? guardado : DEFAULT_THEME
}

export function AdminThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  // Persistir cada cambio para que sobreviva al refresh y al re-login.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((actual) => (actual === 'dark' ? 'light' : 'dark'))
  }

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </AdminThemeContext.Provider>
  )
}

// Hook para leer/cambiar el tema dentro del panel admin.
export function useAdminTheme() {
  const context = useContext(AdminThemeContext)
  if (!context) {
    throw new Error('useAdminTheme debe usarse dentro de AdminThemeProvider')
  }
  return context
}
