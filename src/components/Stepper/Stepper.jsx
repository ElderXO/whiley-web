import { Search, Box, TrendingUp, MoveRight } from 'lucide-react'
import './Stepper.css'

function Stepper() {
  const steps = [
    {
      number: '01',
      icon: Search,
      label: 'Diagnóstico'
    },
    {
      number: '02',
      icon: Box,
      label: 'Implementación'
    },
    {
      number: '03',
      icon: TrendingUp,
      label: 'Optimización'
    }
  ]

  return (
    <section className="stepper-section">
      <div className="stepper-frame">
        <span className="corner corner-tl"></span>
        <span className="corner corner-tr"></span>
        <span className="corner corner-bl"></span>
        <span className="corner corner-br"></span>

        <div className="stepper">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div className="step-container" key={index}>
                <div className="step">
                  <div className="step-icon-circle">
                    <Icon size={22} strokeWidth={2} className="step-icon" />
                  </div>
                  <span className="step-number">{step.number}</span>
                  <span className="step-label">{step.label}</span>
                </div>

                {/* Conector con flecha animada (excepto el último) */}
                {index < steps.length - 1 && (
                  <div className="step-connector">
                    <div className="connector-line"></div>
                    <div className="connector-light"></div>
                    <MoveRight
  size={28}
  strokeWidth={2.5}
  className="connector-tip"
/>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Stepper