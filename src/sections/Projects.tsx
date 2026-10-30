import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projectFilters, projects } from '../data/resume'
import type { Project, ProjectCategory } from '../data/resume'
import SplitText from '../components/ui/SplitText'
import Reveal from '../components/ui/Reveal'
import TiltCard from '../components/ui/TiltCard'
import Icon from '../components/ui/Icons'

function hostOf(url?: string) {
  if (!url) return ''
  try {
    return new URL(url).host
  } catch {
    return url
  }
}

function BrowserFrame({ project }: { project: Project }) {
  return (
    <div className="shot overflow-hidden rounded-xl border border-line bg-deep shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] transition-colors duration-300 group-hover/card:border-accent/50">
      <div className="flex items-center gap-3 border-b border-line bg-[#0c1322] px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
        </span>
        <span className="mx-auto min-w-0 max-w-[75%] flex-1 truncate rounded-md bg-void px-3 py-1 text-center text-[11px] text-slate-400">
          {hostOf(project.url)}
        </span>
        <span className="w-10" />
      </div>
      <div className="relative h-[220px] overflow-hidden [--shot-h:220px] sm:h-[300px] sm:[--shot-h:300px] lg:h-[330px] lg:[--shot-h:330px]">
        {project.imageFull ? (
          <img
            src={project.imageFull}
            alt={`${project.name} website preview`}
            width={1440}
            height={5200}
            loading="lazy"
            className="shot-scroll absolute left-0 top-0 block w-full"
          />
        ) : (
          <img
            src={project.image}
            alt={`${project.name} website preview`}
            width={1440}
            height={900}
            loading="lazy"
            className="absolute left-0 top-0 block w-full"
          />
        )}
      </div>
    </div>
  )
}

function Showcase({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1
  return (
    <Reveal>
      <article className="group/card grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div className={flip ? 'lg:order-2' : ''}>
          <BrowserFrame project={project} />
        </div>
        <div className={flip ? 'lg:order-1' : ''}>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {project.aiPowered && (
              <span className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                <Icon name="sparkles" width={12} height={12} /> AI Powered
              </span>
            )}
            {project.role && (
              <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-soft">
                {project.role}
              </span>
            )}
          </div>
          <h3 className="font-display text-3xl font-bold leading-tight md:text-4xl">{project.name}</h3>
          <p className="mt-4 text-base leading-relaxed text-white/60">{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="pill !py-1 !text-[11px]">
                {t}
              </span>
            ))}
          </div>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">
              Visit live site <Icon name="arrow" width={18} height={18} className="-rotate-45" />
            </a>
          )}
        </div>
      </article>
    </Reveal>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState<'All' | ProjectCategory>('All')

  const { showcase, list } = useMemo(() => {
    const match = (p: Project) => filter === 'All' || p.categories.includes(filter)
    return {
      showcase: projects.filter((p) => p.showcase && match(p)),
      list: projects.filter((p) => !p.showcase && match(p)),
    }
  }, [filter])

  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-28 md:py-40">
      <div className="mb-12 text-center">
        <Reveal>
          <span className="section-label">Selected work</span>
        </Reveal>
        <SplitText text="Featured Projects" className="mt-5 font-display text-4xl font-bold md:text-6xl" accentWords={['Projects']} />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-white/55">
            {projects.length} products across AI, SaaS, enterprise and mobile backends.
          </p>
        </Reveal>
      </div>

      {/* Filter tabs */}
      <Reveal delay={0.15} className="mb-14 flex flex-wrap justify-center gap-2">
        {projectFilters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              filter === f ? 'text-white' : 'text-white/55 hover:text-white'
            }`}
          >
            {filter === f && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 -z-10 rounded-full bg-accent"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{f}</span>
          </button>
        ))}
      </Reveal>

      {/* Showcase case studies */}
      {showcase.length > 0 && (
        <div className="mb-24 space-y-20 md:space-y-28">
          {showcase.map((p, i) => (
            <Showcase key={p.name} project={p} index={i} />
          ))}
        </div>
      )}

      {list.length > 0 && showcase.length > 0 && (
        <div className="mb-10 flex items-center gap-4">
          <span className="h-px flex-1 bg-line" />
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">More projects</span>
          <span className="h-px flex-1 bg-line" />
        </div>
      )}

      <motion.div layout className="grid auto-rows-fr grid-flow-dense gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.div
              key={p.name}
              layout
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={p.featured ? 'sm:col-span-2' : ''}
            >
              <TiltCard max={7} className="h-full">
                <article className={`glass glass-glow spotlight group flex h-full min-h-[230px] flex-col overflow-hidden p-6 ${p.featured ? 'md:min-h-[260px]' : ''}`}>
                  <div className="relative mb-6 flex items-start justify-between">
                    <span className="font-display text-sm font-semibold text-white/30">{String(i + 1).padStart(2, '0')}</span>
                    {p.featured ? (
                      <span className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
                        <Icon name="sparkles" width={12} height={12} /> AI Powered
                      </span>
                    ) : (
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/50 transition-all group-hover:rotate-45 group-hover:border-accent group-hover:text-accent-soft">
                        <Icon name="arrow" width={16} height={16} className="-rotate-45" />
                      </span>
                    )}
                  </div>
                  <h3 className={`relative font-display font-bold leading-tight ${p.featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>{p.name}</h3>
                  <p className="relative mt-3 flex-1 text-sm leading-relaxed text-white/55">{p.description}</p>
                  <div className="relative mt-5 flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span key={t} className="pill !py-1 !text-[11px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
