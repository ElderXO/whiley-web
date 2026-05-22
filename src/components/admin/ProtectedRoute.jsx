import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  // Mientras verifica si hay sesion
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#010713',
        color: '#F0A815'
      }}>
        Cargando...
      </div>
    )
  }

  // Si NO esta autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  // Si SI esta autenticado, mostrar el contenido
  return children
}

export default ProtectedRoute