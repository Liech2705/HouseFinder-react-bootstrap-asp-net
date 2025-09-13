import Header from './component/Header.jsx'
import SearchSection from './component/SearchSection.jsx'
import RoomsGrid from './component/RoomsGrid.jsx'
import Testimonials from './component/Testimonials.jsx'
import Stats from './component/Stats.jsx'
import Footer from './component/Footer.jsx'

function App() {
  return (
    <>
      <Header />
      <main>
        <SearchSection />
        <RoomsGrid />
        <Testimonials />
        <Stats />
      </main>
      <Footer />
    </>
  );
}

export default App
