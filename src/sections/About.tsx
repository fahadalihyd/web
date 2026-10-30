import { useEffect, useRef } from 'react'
import { animate, useInView, motion } from 'framer-motion'
import { profile, stats } from '../data/resume'
import TiltCard from '../components/ui/TiltCard'
import SplitText from '../components/ui/SplitText'
import Reveal from '../components/ui/Reveal'
import Icon from '../components/ui/Icons'

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })

  useEffect(() => {
    if (!inView || !ref.current) return
    const controls = animate(0, to, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, to, suffix])

  return <span ref={ref}>0{suffix}</span>
}

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28 md:py-40">
      <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Photo */}
        <Reveal x={-60} y={0} className="mx-auto w-full max-w-sm">
          <div className="relative [perspective:1000px]">
            <TiltCard max={12} holo className="relative">
              <div className="glass glass-glow spotlight relative overflow-hidden !rounded-[2rem] p-3">
                <div className="relative overflow-hidden rounded-[1.5rem]">
                  <img src={profile.photo} alt="Fahad Ali" className="aspect-[4/5] w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/85 via-transparent to-transparent" />
                  <div className="holo" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                    <div>
                      <p className="font-display text-xl font-semibold">{profile.name}</p>
                      <p className="text-xs text-white/60">{profile.title}</p>
                    </div>
                    <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur-md">
                      <Icon name="pin" width={12} height={12} className="mr-1 inline -mt-0.5" />
                      Karachi, PK
                    </span>
                  </div>
                </div>
              </div>

              {/* floating badges */}
              <div className="absolute -right-4 top-10 md:-right-10" style={{ transform: 'translateZ(60px)' }}>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="glass !rounded-2xl px-4 py-3 text-sm"
                >
                  <span className="text-accent-soft font-display text-xl font-bold">AI</span>
                  <p className="text-[11px] text-white/60">Agents &amp; Automation</p>
                </motion.div>
              </div>
              <div className="absolute -left-4 bottom-24 md:-left-10" style={{ transform: 'translateZ(80px)' }}>
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="glass !rounded-2xl px-4 py-3 text-sm"
                >
                  <span className="text-accent-soft font-display text-xl font-bold">8+ yrs</span>
                  <p className="text-[11px] text-white/60">Full Stack</p>
                </motion.div>
              </div>
            </TiltCard>
          </div>
        </Reveal>

        {/* Copy */}
        <div>
          <Reveal>
            <span className="section-label">About me</span>
          </Reveal>
          <SplitText
            text="Building scalable products, powered by AI."
            className="mt-5 font-display text-4xl font-bold leading-tight md:text-6xl"
            accentWords={['AI']}
          />
          <Reveal delay={0.1}>
            <p className="mt-8 text-base leading-relaxed text-white/65 md:text-lg">{profile.summary}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 text-base leading-relaxed text-white/65 md:text-lg">{profile.summary2}</p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={0.1 * i}>
                <div className="glass glass-glow h-full !rounded-2xl p-5 text-center">
                  <div className="text-accent-soft font-display text-4xl font-bold md:text-5xl">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </div>
                  <p className="mt-2 text-xs text-white/55">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
