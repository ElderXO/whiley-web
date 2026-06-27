import { Search, Lightbulb, Code2, Rocket, TrendingUp, MoveRight } from 'lucide-react'
import './Stepper.css'

function Stepper() {
  const steps = [
    {
      number: '01',
      icon: Search,
      label: 'Entendemos tu negocio'
    },
    {
      number: '02',
      icon: Lightbulb,
      label: 'Diseñamos la mejor solución'
    },
    {
      number: '03',
      icon: Code2,
      label: 'Desarrollamos a medida'
    },
    {
      number: '04',
      icon: Rocket,
      label: 'Implementamos e integramos'
    },
    {
      number: '05',
      icon: TrendingUp,
      label: 'Optimizamos y generamos valor'
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
                  <div className="step-text">
                    <span className="step-number">{step.number}</span>
                    <span className="step-label">{step.label}</span>
                  </div>
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