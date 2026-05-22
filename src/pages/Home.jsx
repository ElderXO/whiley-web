import Hero from '../components/Hero/Hero'
import Stepper from '../components/Stepper/Stepper'
import Cards from '../components/Cards/Cards'
import Summary from '../components/Summary/Summary'
import Team from '../components/Team/Team'

function Home() {
  return (
    <>
      <Hero />
      <Stepper />
      <Cards />
      <Summary />
      <Team />
    </>
  )
}

export default Home