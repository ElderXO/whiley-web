import HostingPlans from '../components/Plans/HostingPlans'
import VPSPlans from '../components/Plans/VPSPlans'
import BigDataPlans from '../components/Plans/BigDataPlans'
import SLASection from '../components/Plans/SLASection'

function Servicios() {
  return (
    <>
      <HostingPlans />
      <VPSPlans />
      <BigDataPlans />
      <SLASection />
    </>
  )
}

export default Servicios