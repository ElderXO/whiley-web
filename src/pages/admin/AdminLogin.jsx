import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, LogIn, AlertCircle, Loader, Eye, EyeOff, Shield, ArrowLeft, Info } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logoWiley from '../../assets/logo-header.png'
import cloudDivider from '../../assets/cloud-divider.png'
import './AdminLogin.css'

// Componente del fondo animado tipo constelacion
function ParticlesBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = []
    const PARTICLE_COUNT = 60
    const MAX_DISTANCE = 130

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.8
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(240, 168, 21, 0.7)'
        ctx.shadowBlur = 10
        ctx.shadowColor = '#F0A815'
        ctx.fill()
        ctx.shadowBlur = 0
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < MAX_DISTANCE) {
            const opacity = 1 - distance / MAX_DISTANCE
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(240, 168, 21, ${opacity * 0.3})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="brand-canvas" />
}

// Genera una operacion matematica simple (suma o resta con numeros pequenos).
// En las restas se garantiza a >= b para no mostrar resultados negativos.
function generarCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1
  const b = Math.floor(Math.random() * 10) + 1
  const esSuma = Math.random() < 0.5

  if (esSuma) {
    return { a, b, op: '+', resultado: a + b }
  }

  const mayor = Math.max(a, b)
  const menor = Math.min(a, b)
  return { a: mayor, b: menor, op: '−', resultado: mayor - menor }
}

function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // Verificacion anti-bot: se genera una operacion nueva en cada carga del componente.
  const [captcha, setCaptcha] = useState(() => generarCaptcha())
  const [captchaInput, setCaptchaInput] = useState('')
  // Aviso de "recuperacion de contrasena" (funcionalidad futura).
  const [mostrarAvisoRecuperacion, setMostrarAvisoRecuperacion] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // TODO: integrar recuperacion de contrasena por correo electronico.
  const handleForgotPassword = () => {
    setMostrarAvisoRecuperacion(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Verificacion humana: si la respuesta es incorrecta no se contacta al backend
    // y se genera una nueva operacion.
    if (Number(captchaInput) !== captcha.resultado) {
      setError('Verificacion incorrecta. Resuelve la operacion para continuar.')
      setCaptcha(generarCaptcha())
      setCaptchaInput('')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesion')
      }

      login(data.admin, data.token)
      navigate('/admin/dashboard')

    } catch (err) {
      setError(err.message)
      // Tras un intento fallido se renueva la verificacion humana.
      setCaptcha(generarCaptcha())
      setCaptchaInput('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-wrapper">

      {/* Imagen de nubes divisora */}
      <div className="cloud-divider-wrapper">
        <img src={cloudDivider} alt="" className="cloud-divider-img" />
      </div>

      {/* ========== LADO IZQUIERDO: BRANDING ========== */}
      <div className="admin-login-brand">

        {/* Constelacion animada */}
        <ParticlesBackground />

        {/* Contenido central */}
        <div className="brand-center">

          <span className="brand-welcome">BIENVENIDO A</span>

          <div className="brand-logo-wrapper">
            <div className="brand-logo-glow"></div>
            <img src={logoWiley} alt="WileyTEC" className="brand-logo" />
          </div>

          <h1 className="brand-name">
            Wiley<span className="brand-name-accent">TEC</span>
          </h1>

          <p className="brand-description">
            Plataforma de gestion administrativa para nuestra
            infraestructura tecnologica. Controla planes, contactos,
            equipo y mucho mas desde un solo lugar.
          </p>

          <div className="brand-divider">
            <div className="divider-text">
              <p className="divider-tagline">TU PORTAL AL CONTROL TOTAL</p>
              <p className="divider-tagline">DE LA INFRAESTRUCTURA</p>
            </div>
            <div className="divider-shield">
              <Shield size={14} />
            </div>
          </div>
        </div>

        <div className="brand-mission">
          <p>Nuestra mision es asegurar su crecimiento tecnologico.</p>
        </div>

        <div className="brand-footer">
          <span>WileyTEC © 2025</span>
          <span className="brand-footer-divider">|</span>
          <span>Innovacion · Seguridad · Expansion</span>
          <span className="brand-footer-divider">|</span>
          <span>Enterprise Solution</span>
        </div>
      </div>

      {/* ========== LADO DERECHO: FORMULARIO ========== */}
      <div className="admin-login-form-side">
        <div className="admin-login-form-container">

          <div className="admin-login-header">
            <span className="login-eyebrow">PANEL ADMINISTRATIVO</span>
            <h2 className="login-title">Inicia sesion</h2>
            <p className="login-subtitle">
              Accede para gestionar todo el contenido de WileyTEC
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">

            {error && (
              <div className="login-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="login-input-group">
              <label htmlFor="email">Correo electronico</label>
              <div className="login-input-wrapper">
                <Mail size={18} className="input-icon" />
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="ejemplo@correo.com" disabled={loading} autoComplete="email" />
              </div>
            </div>

            <div className="login-input-group">
              <label htmlFor="password">Contrasena</label>
              <div className="login-input-wrapper">
                <Lock size={18} className="input-icon" />
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Ingresa tu contrasena" disabled={loading} autoComplete="current-password" />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)} aria-label="Mostrar/ocultar contrasena">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Verificacion humana */}
            <div className="login-input-group">
              <label htmlFor="captcha">Demuestra que eres un ser humano</label>
              <div className="login-captcha">
                <span className="login-captcha-question">
                  {captcha.a} {captcha.op} {captcha.b} =
                </span>
                <div className="login-input-wrapper login-captcha-input">
                  <Shield size={18} className="input-icon" />
                  <input type="number" id="captcha" name="captcha" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} required placeholder="Respuesta" disabled={loading} autoComplete="off" inputMode="numeric" />
                </div>
              </div>
            </div>

            <div className="login-options">
              <label className="login-checkbox">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} disabled={loading} />
                <span className="checkbox-custom"></span>
                <span>Recordarme</span>
              </label>
              <button type="button" className="login-forgot" onClick={handleForgotPassword}>Olvidaste tu contrasena?</button>
            </div>

            {mostrarAvisoRecuperacion && (
              <div className="login-info-note">
                <Info size={16} />
                <span>La recuperacion de contrasena estara disponible proximamente.</span>
              </div>
            )}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader size={18} className="spin" />
                  <span>Iniciando sesion...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Iniciar sesion</span>
                </>
              )}
            </button>

          </form>

          <Link to="/" className="login-back-home">
            <ArrowLeft size={16} />
            <span>Ir a WileyTEC</span>
          </Link>

          <div className="login-footer-text">
            <p>Solo personal autorizado de WileyTEC</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AdminLogin