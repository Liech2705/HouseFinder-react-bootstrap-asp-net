import Navbar from "./components/Navbar"
import HeroSection from "./components/HeroSection"
import FeaturesSection from "./components/FeaturesSection"
import HowItWorksSection from "./components/HowItWorksSection"
import TestimonialsSection from "./components/TestimonialsSection"
import CTASection from "./components/CTASection"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="App">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default App
