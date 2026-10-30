import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Loader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    let n = 0
    const id = setInterval(() => {
      n += Math.random() * 9 + 3
      if (n >= 100) {
        n = 100
        clearInterval(id)
        setTimeout(() => setLeaving(true), 350)
      }
      setCount(Math.floor(n))
    }, 70)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-void"
      initial={{ y: 0 }}
      animate={leaving ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => leaving && onDone()}
    >
      <div className="absolute inset-0 bg-mesh opacity-80" style={{ zIndex: 0 }} />
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl glass glass-glow"
        >
          <span className="font-display text-4xl font-bold text-accent-soft">FA</span>
          <span className="absolute inset-0 rounded-3xl animate-pulse-glow shadow-[0_0_50px_rgba(59,130,246,0.35)]" />
        </motion.div>
        <div className="font-display text-7xl font-bold tabular-nums text-white md:text-8xl">
          {String(count).padStart(2, '0')}
          <span className="text-accent-soft text-4xl align-top">%</span>
        </div>
        <div className="mt-8 h-[2px] w-56 overflow-hidden rounded bg-white/10">
          <div
            className="h-full bg-accent transition-[width] duration-100"
            style={{ width: `${count}%` }}
          />
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.4em] text-white/40">Initializing experience</p>
      </div>
    </motion.div>
  )
}
