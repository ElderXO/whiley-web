import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import { AdminThemeProvider } from './context/AdminThemeContext'

// Componentes publicos
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Nosotros from './pages/Nosotros'
import Servicios from './pages/Servicios'
import Soporte from './pages/Soporte'

// Admin
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMensajes from './pages/admin/AdminMensajes'
import AdminPlanesHosting from './pages/admin/AdminPlanesHosting'
import AdminPlanesVPS from './pages/admin/AdminPlanesVPS'
import AdminPlanesBigData from './pages/admin/AdminPlanesBigData'
import AdminEquipo from './pages/admin/AdminEquipo'
import AdminFAQs from './pages/admin/AdminFAQs'
import AdminHistorial from './pages/admin/AdminHistorial'
import ProtectedRoute from './components/admin/ProtectedRoute'

import './App.css'

function ScrollToHash() {
  const location = useLocation()
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0)
      return
    }

    const elementId = location.hash.replace('#', '')

    const scrollToTarget = () => {
      const element = document.getElementById(elementId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    // Reposiciona cada vez que la altura del documento cambie
    // (FAQ que termina de cargar, imagenes que llegan, etc.)
    const observer = new ResizeObserver(() => scrollToTarget())
    observer.observe(document.body)

    // Intento inicial inmediato
    scrollToTarget()

    // Deja de corregir tras 1.5s, cuando el layout ya se estabilizo
    const settleTimer = setTimeout(() => observer.disconnect(), 1500)

    return () => {
      observer.disconnect()
      clearTimeout(settleTimer)
    }
  }, [location])
  return null
}

function PublicLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <ScrollToHash />
          <Routes>

            {/* RUTAS PUBLICAS */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/nosotros" element={<PublicLayout><Nosotros /></PublicLayout>} />
            <Route path="/servicios" element={<PublicLayout><Servicios /></PublicLayout>} />
            <Route path="/soporte" element={<PublicLayout><Soporte /></PublicLayout>} />

            {/* RUTAS ADMIN */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Rutas protegidas con layout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminThemeProvider>
                    <AdminLayout />
                  </AdminThemeProvider>
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="mensajes" element={<AdminMensajes />} />
              <Route path="planes-hosting" element={<AdminPlanesHosting />} />
              <Route path="planes-vps" element={<AdminPlanesVPS />} />
              <Route path="planes-bigdata" element={<AdminPlanesBigData />} />
              <Route path="equipo" element={<AdminEquipo />} />
              <Route path="faqs" element={<AdminFAQs />} />
              <Route path="historial" element={<AdminHistorial />} />
            </Route>

          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App