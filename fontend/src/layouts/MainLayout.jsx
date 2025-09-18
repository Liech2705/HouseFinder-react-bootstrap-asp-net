import Header from '../component/Header.jsx'
import Footer from '../component/Footer.jsx'

export default function MainLayout({ children }) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    )
}