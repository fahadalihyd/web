import { lazy } from 'react'
import { motion } from 'framer-motion'
import { profile, skillCategories } from '../data/resume'
import SceneFrame from '../components/three/SceneFrame'
import SplitText from '../components/ui/SplitText'
import Reveal from '../components/ui/Reveal'
import TiltCard from '../components/ui/TiltCard'
import Icon from '../components/ui/Icons'

const SkillSphere = lazy(() => import('../components/three/SkillSphere'))

export default function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-6 py-28 md:py-40">
      <div className="mb-14 text-center">
        <Reveal>
          <span className="section-label">Tech arsenal</span>
        </Reveal>
        <SplitText
          text="Skills & Technologies"
          className="mt-5 font-display text-4xl font-bold md:text-6xl"
          accentWords={['Technologies']}
        />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-ink/55">Drag the sphere to explore the stack I use to ship production software.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {profile.topSkills.map((skill) => (
              <span key={skill} className="pill">
                {skill}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      {/* 3D sphere */}
      <Reveal>
        <div className="relative mx-auto mb-20 aspect-square w-full max-w-[560px] md:aspect-[4/3] md:max-w-[760px]">
          <SceneFrame className="absolute inset-0">
            <SkillSphere />
          </SceneFrame>
        </div>
      </Reveal>

      {/* Category cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((cat, i) => {
          const wide = i === skillCategories.length - 1 && skillCategories.length % 3 === 1
          return (
          <Reveal key={cat.title} delay={(i % 3) * 0.08} className={wide ? 'lg:col-span-3' : ''}>
            <TiltCard max={6} className="h-full">
              <div
                className={`glass glass-glow spotlight h-full p-6 ${wide ? 'lg:flex lg:items-center lg:gap-8' : ''} ${
                  cat.featured ? 'ring-1 ring-accent/50' : ''
                }`}
              >
                {cat.featured && (
                  <span className="absolute right-5 top-5 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Specialty
                  </span>
                )}
                <div className={`mb-5 flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-accent/10 text-accent-soft ${wide ? 'lg:mb-0' : ''}`}>
                  <Icon name={cat.icon} />
                </div>
                <h3 className={`mb-4 font-display text-xl font-semibold ${wide ? 'lg:mb-0 lg:w-48' : ''}`}>{cat.title}</h3>
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                >
                  {cat.items.map((s) => (
                    <motion.span
                      key={s}
                      className="pill"
                      variants={{ hidden: { opacity: 0, scale: 0.6, y: 10 }, visible: { opacity: 1, scale: 1, y: 0 } }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </TiltCard>
          </Reveal>
          )
        })}
      </div>
    </section>
  )
}
