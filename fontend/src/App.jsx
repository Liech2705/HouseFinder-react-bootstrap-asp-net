import SearchSection from './components/SearchSection.jsx'
import HouseGrid from './components/HouseGrid.jsx'
import WhyChooseUs from './components/WhyChooseUs.jsx'
import Testimonials from './components/Testimonials.jsx'
import Stats from './components/Stats.jsx'
import ChatWidget from './pages/user/Chatwidget.jsx';

function App() {
  const isLogin = !!localStorage.getItem("user");
  return (
    <>
      <main>
        <SearchSection />
        <HouseGrid />
        <WhyChooseUs />
        <Testimonials />
        <Stats />
      </main>
      {/* {isLogin && (<ChatWidget />)} */}
    </>
  );
}

export default App
