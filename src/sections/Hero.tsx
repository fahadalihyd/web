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

function HeroPortrait({ className = '' }: { className?: string }) {
  return (
    <img
      src={profile.avatar}
      alt=""
      width={873}
      height={904}
      className={`w-auto max-w-full object-contain object-bottom drop-shadow-[0_24px_36px_rgba(15,23,42,0.16)] ${className}`}
    />
  )
}

export default function Hero({ ready }: { ready: boolean }) {
  return (
    <section id="hero" className="relative min-h-[100svh] overflow-hidden bg-void">
      <SceneFrame className="absolute inset-0" initiallyActive>
        <HeroScene />
      </SceneFrame>
      {/* readability scrims: top-to-bottom on mobile, left-to-right on desktop */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/70 to-transparent lg:bg-gradient-to-r lg:from-void/90 lg:via-void/40 lg:to-transparent" />
      {/* soft brand glow behind the portrait */}
      <div className="pointer-events-none absolute left-1/2 top-[22%] h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--mesh-glow),transparent_70%)] blur-2xl sm:h-96 sm:w-96 lg:left-auto lg:right-[8%] lg:top-1/2 lg:h-[34rem] lg:w-[34rem] lg:-translate-y-1/2 lg:translate-x-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-void to-transparent" />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-6xl items-end gap-4 px-5 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.82fr)] lg:items-center lg:pb-10">
        <AnimatePresence>
          {ready && (
            <motion.div variants={container} initial="hidden" animate="visible" className="min-w-0">
              <motion.div variants={item} className="mb-4 flex justify-center lg:hidden">
                <HeroPortrait className="h-[min(30svh,15rem)] sm:h-[min(34svh,18rem)]" />
              </motion.div>
              <motion.div variants={item} className="mb-5 inline-flex items-center gap-3 rounded-full border border-line bg-overlay/5 px-3.5 py-1.5 backdrop-blur-md sm:mb-6 sm:px-4 sm:py-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs font-medium tracking-wide text-ink/80">Available for new opportunities</span>
              </motion.div>

              <motion.p variants={item} className="mb-3 text-lg text-ink/60">
                Hi, I&apos;m
              </motion.p>
              <motion.h1 variants={item} className="font-display text-5xl font-bold leading-[0.95] tracking-tight min-[400px]:text-6xl sm:text-7xl md:text-8xl xl:text-9xl">
                <span className="block text-ink">FAHAD</span>
                <span className="block text-accent-soft">ALI</span>
              </motion.h1>

              <motion.div variants={item} className="mt-4 min-h-10 font-display text-lg font-medium text-ink/90 min-[400px]:text-xl sm:mt-6 sm:text-2xl md:text-3xl">
                <Typing words={profile.roles} />
              </motion.div>

              <motion.p variants={item} className="mt-4 max-w-xl text-sm leading-relaxed text-ink/70 sm:mt-5 sm:text-base md:text-lg">
                {profile.tagline}
              </motion.p>

              <motion.div variants={item} className="mt-7 flex flex-col items-stretch gap-3 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:items-center sm:mt-9 sm:gap-4">
                <MagneticButton
                  href="#projects"
                  className="btn-primary justify-center"
                  onClick={() => scrollToTarget('#projects')}
                >
                  View Work <Icon name="arrow" width={18} height={18} />
                </MagneticButton>
                <MagneticButton href={profile.resume} download className="btn-ghost justify-center">
                  <Icon name="download" width={18} height={18} /> Download CV
                </MagneticButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {ready && <HeroPortrait className="hidden h-[min(62vh,560px)] self-end justify-self-end lg:block" />}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.6 }}
        onClick={() => scrollToTarget('#about')}
        aria-label="Scroll down"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-ink/40 md:flex"
      >
        Scroll
        <span className="relative h-12 w-[22px] rounded-full border border-line">
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
