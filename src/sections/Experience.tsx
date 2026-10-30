import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience } from '../data/resume'
import SplitText from '../components/ui/SplitText'
import Reveal from '../components/ui/Reveal'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const wrap = useRef<HTMLDivElement>(null)
  const line = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // timeline line draws itself with scroll
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: wrap.current, start: 'top 60%', end: 'bottom 70%', scrub: 0.6 },
        },
      )

      gsap.utils.toArray<HTMLElement>('.exp-card').forEach((card, i) => {
        const fromLeft = i % 2 === 0
        gsap.from(card, {
          opacity: 0,
          x: window.innerWidth > 768 ? (fromLeft ? -80 : 80) : 40,
          rotateY: window.innerWidth > 768 ? (fromLeft ? 12 : -12) : 0,
          transformPerspective: 1000,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 82%', toggleActions: 'play none none reverse' },
        })
      })

      gsap.utils.toArray<HTMLElement>('.exp-dot').forEach((dot) => {
        gsap.from(dot, {
          scale: 0,
          duration: 0.6,
          ease: 'back.out(3)',
          scrollTrigger: { trigger: dot, start: 'top 75%', toggleActions: 'play none none reverse' },
        })
      })

      gsap.utils.toArray<HTMLElement>('.exp-points li').forEach((li) => {
        gsap.from(li, {
          opacity: 0,
          y: 14,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: li, start: 'top 92%', toggleActions: 'play none none reverse' },
        })
      })
    }, wrap)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" className="relative mx-auto max-w-6xl px-6 py-28 md:py-40">
      <div className="mb-20 text-center">
        <Reveal>
          <span className="section-label">Career path</span>
        </Reveal>
        <SplitText
          text="Professional Experience"
          className="mt-5 font-display text-4xl font-bold md:text-6xl"
          accentWords={['Experience']}
        />
      </div>

      <div ref={wrap} className="relative">
        {/* track + glowing progress line */}
        <div className="absolute left-5 top-0 h-full w-[2px] -translate-x-1/2 rounded bg-white/10 md:left-1/2" />
        <div ref={line} className="timeline-line absolute left-5 top-0 h-full w-[2px] origin-top -translate-x-1/2 rounded md:left-1/2" />

        <div className="space-y-16 md:space-y-24">
          {experience.map((job, i) => {
            const left = i % 2 === 0
            return (
              <div key={job.company} className="relative md:grid md:grid-cols-2 md:gap-16">
                <span className="exp-dot absolute left-5 top-8 z-10 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-accent bg-void shadow-[0_0_16px_rgba(59,130,246,0.6)] md:left-1/2">
                  <span className="absolute inset-1 rounded-full bg-accent" />
                </span>

                <div className={`exp-card pl-14 md:pl-0 ${left ? 'md:col-start-1 md:pr-6' : 'md:col-start-2 md:pl-6'}`}>
                  <div className="glass glass-glow p-6 md:p-8">
                    <div className="mb-1 flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-soft">{job.period}</span>
                      {job.current && (
                        <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
                          Current
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 font-display text-2xl font-bold">{job.role}</h3>
                    <p className="text-accent-soft mb-5 font-display text-lg font-medium">
                      {job.company} <span className="text-white/40">/ {job.location}</span>
                    </p>
                    <ul className="exp-points space-y-2.5 text-sm leading-relaxed text-white/65">
                      {job.points.map((p) => (
                        <li key={p} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                      {job.tech.map((t) => (
                        <span key={t} className="pill">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
