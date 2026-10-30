import { useEffect, useState } from 'react'
import { useLenis } from './hooks/useLenis'
import Loader from './components/ui/Loader'
import Cursor from './components/ui/Cursor'
import Navbar from './components/ui/Navbar'
import ScrollProgress from './components/ui/ScrollProgress'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Awards from './sections/Awards'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import Marquee from './components/ui/Marquee'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  useLenis(true)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = loaded ? '' : 'hidden'
    if (!loaded) window.scrollTo(0, 0)
  }, [loaded])

  return (
    <>
      <div className="bg-mesh" />
      <div className="bg-grid" />
      <div className="bg-noise" />
      <Cursor />
      <ScrollProgress />
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Navbar />
      <main id="top">
        <Hero ready={loaded} />
        <Marquee />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Awards />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
