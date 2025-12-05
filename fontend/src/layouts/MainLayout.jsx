import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import ChatWidget from '../pages/user/Chatwidget.jsx'

export default function MainLayout({ children }) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <ChatWidget />
            <Footer />
        </>
    )
}