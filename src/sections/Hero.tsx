import { lazy, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../data/resume'
import SceneFrame from '../components/three/SceneFrame'
import MagneticButton from '../components/ui/MagneticButton'
import Icon from '../components/ui/Icons'
import { scrollToTarget } from '../hooks/useLenis'

const HeroScene = lazy(() => import('../components/three/HeroScene'))

function Typing({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index]
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setText(word.slice(0, text.length + 1))
          if (text.length + 1 === word.length) setTimeout(() => setDeleting(true), 1400)
        } else {
          setText(word.slice(0, text.length - 1))
          if (text.length - 1 === 0) {
            setDeleting(false)
            setIndex((i) => (i + 1) % words.length)
          }
        }
      },
      deleting ? 35 : 70,
    )
    return () => clearTimeout(timeout)
  }, [text, deleting, index, words])

  return (
    <span className="text-accent-soft">
      {text}
      <span className="ml-1 inline-block w-[3px] h-[1em] translate-y-[0.15em] bg-accent animate-pulse-glow" />
    </span>
  )
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const } },
}

export default function Hero({ ready }: { ready: boolean }) {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden bg-void">
      <SceneFrame className="absolute inset-0" initiallyActive>
        <HeroScene />
      </SceneFrame>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-24 pt-32 lg:justify-center lg:pb-0">
        <AnimatePresence>
          {ready && (
            <motion.div variants={container} initial="hidden" animate="visible" className="max-w-2xl">
              <motion.div variants={item} className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs font-medium tracking-wide text-white/80">Available for new opportunities</span>
              </motion.div>

              <motion.p variants={item} className="mb-3 text-lg text-white/60">
                Hi, I&apos;m
              </motion.p>
              <motion.h1 variants={item} className="font-display text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
                <span className="block text-white">FAHAD</span>
                <span className="block text-accent-soft">ALI</span>
              </motion.h1>

              <motion.div variants={item} className="mt-6 h-10 font-display text-xl font-medium text-white/90 sm:text-2xl md:text-3xl">
                <Typing words={profile.roles} />
              </motion.div>

              <motion.p variants={item} className="mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
                8+ years crafting scalable web platforms and AI-powered products with Laravel, Vue, React, Node.js, cloud and agentic automation.
              </motion.p>

              <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
                <MagneticButton
                  href="#projects"
                  className="btn-primary"
                  onClick={() => scrollToTarget('#projects')}
                >
                  View Work <Icon name="arrow" width={18} height={18} />
                </MagneticButton>
                <MagneticButton href={profile.resume} download className="btn-ghost">
                  <Icon name="download" width={18} height={18} /> Download CV
                </MagneticButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.6 }}
        onClick={() => scrollToTarget('#about')}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-white/40 md:flex"
      >
        Scroll
        <span className="relative h-12 w-[22px] rounded-full border border-white/25">
          <motion.span
            animate={{ y: [6, 26, 6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 h-2 w-[3px] -translate-x-1/2 rounded bg-accent"
          />
        </span>
      </motion.button>
    </section>
  )
}
