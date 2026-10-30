import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { navLinks, profile } from '../../data/resume'
import { scrollToTarget } from '../../hooks/useLenis'

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > last && y > 200)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    navLinks.forEach((l) => {
      const el = document.querySelector(l.href)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const go = (href: string) => {
    setOpen(false)
    setTimeout(() => scrollToTarget(href), 50)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden && !open ? -120 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-4 left-0 right-0 z-50 px-4"
      >
        <nav
          className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
            scrolled ? 'glass bg-black/30' : 'bg-transparent'
          }`}
        >
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget(0)
            }}
            className="font-display text-xl font-bold tracking-tight"
          >
            <span className="text-accent-soft">FA</span>
            <span className="text-white/90">.</span>
          </a>

          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault()
                    go(l.href)
                  }}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                    active === l.href ? 'text-white' : 'text-white/55 hover:text-white'
                  }`}
                >
                  {active === l.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/10 border border-white/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a href={profile.resume} download className="hidden sm:inline-flex btn-ghost !py-2 !px-5 !text-sm">
              Resume
            </a>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((o) => !o)}
              className="md:hidden relative h-10 w-10 rounded-full border border-white/15 bg-white/5"
            >
              <span
                className={`absolute left-1/2 top-[15px] h-[2px] w-5 -translate-x-1/2 bg-white transition-transform ${open ? 'translate-y-[5px] rotate-45' : ''}`}
              />
              <span
                className={`absolute left-1/2 top-[25px] h-[2px] w-5 -translate-x-1/2 bg-white transition-transform ${open ? '-translate-y-[5px] -rotate-45' : ''}`}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 90% 5%)' }}
            animate={{ clipPath: 'circle(150% at 90% 5%)' }}
            exit={{ clipPath: 'circle(0% at 90% 5%)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-void/95 backdrop-blur-xl md:hidden"
          >
            {navLinks.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.06 } }}
                onClick={(e) => {
                  e.preventDefault()
                  go(l.href)
                }}
                className="font-display text-4xl font-semibold text-accent-soft"
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
