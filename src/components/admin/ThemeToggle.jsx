import { Sun, Moon } from 'lucide-react'
import { useAdminTheme } from '../../context/AdminThemeContext'
import './ThemeToggle.css'

// Interruptor visual de tema para el header del panel admin.
function ThemeToggle() {
  const { theme, toggleTheme } = useAdminTheme()
  const esOscuro = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={esOscuro ? 'Activar tema claro' : 'Activar tema oscuro'}
      title={esOscuro ? 'Tema claro' : 'Tema oscuro'}
    >
      <span className={`theme-toggle-track ${esOscuro ? 'dark' : 'light'}`}>
        <span className="theme-toggle-thumb">
          {esOscuro ? <Moon size={14} /> : <Sun size={14} />}
        </span>
      </span>
    </button>
  )
}

export default ThemeToggle
