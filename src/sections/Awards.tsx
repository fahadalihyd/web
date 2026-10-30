import { awards, education, languages } from '../data/resume'
import SplitText from '../components/ui/SplitText'
import Reveal from '../components/ui/Reveal'
import TiltCard from '../components/ui/TiltCard'
import Icon from '../components/ui/Icons'

export default function Awards() {
  return (
    <section id="awards" className="relative mx-auto max-w-6xl px-6 py-28 md:py-40">
      <div className="mb-16 text-center">
        <Reveal>
          <span className="section-label">Recognition</span>
        </Reveal>
        <SplitText
          text="Awards & Achievements"
          className="mt-5 font-display text-4xl font-bold md:text-6xl"
          accentWords={['Achievements']}
        />
      </div>

      {/* Awards */}
      <div className="grid gap-6 md:grid-cols-3">
        {awards.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.12}>
            <TiltCard max={12} className="h-full">
              <div className="glass glass-glow spotlight group relative h-full overflow-hidden p-8 text-center">
                <div
                  className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-accent text-white shadow-[0_12px_30px_-10px_rgba(59,130,246,0.7)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-[360deg]"
                  style={{ transform: 'translateZ(50px)' }}
                >
                  <Icon name={a.icon} width={36} height={36} />
                </div>
                <p className="text-accent-soft font-display text-sm font-semibold uppercase tracking-widest">{a.year}</p>
                <h3 className="mt-2 font-display text-2xl font-bold">{a.title}</h3>
                <p className="mt-1 text-sm text-ink/55">{a.org}</p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-3xl">
        <Reveal>
          <div className="glass glass-glow h-full p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent-soft">
                <Icon name="graduation" />
              </span>
              <h3 className="font-display text-2xl font-bold">Education</h3>
            </div>
            <ul className="relative space-y-6 border-l border-line pl-6">
              {education.map((e) => (
                <li key={e.degree} className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-accent shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                  <p className="text-xs font-semibold text-accent-soft">{e.year}</p>
                  <p className="font-medium text-ink/90">{e.degree}</p>
                  <p className="text-sm text-ink/50">{e.school}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center gap-3 border-t border-line pt-6">
              <span className="text-sm text-ink/50">Languages</span>
              {languages.map((l) => (
                <span key={l} className="pill">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
