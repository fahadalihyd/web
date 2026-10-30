import { navLinks, profile } from '../data/resume'
import Icon from '../components/ui/Icons'
import MagneticButton from '../components/ui/MagneticButton'
import { scrollToTarget } from '../hooks/useLenis'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-6 py-10 md:flex-row">
        <div className="text-center md:text-left">
          <p className="font-display text-2xl font-bold">
            <span className="text-accent-soft">Fahad Ali</span>
          </p>
          <p className="mt-1 text-sm text-white/45">Senior Full Stack Developer &middot; AI Agents Engineer</p>
        </div>

        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/55">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToTarget(l.href)
                }}
                className="transition-colors hover:text-accent-soft"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {[
            { name: 'github', href: profile.github, label: 'GitHub' },
            { name: 'linkedin', href: profile.linkedin, label: 'LinkedIn' },
            { name: 'mail', href: `mailto:${profile.email}`, label: 'Email' },
          ].map((s) => (
            <a
              key={s.name}
              href={s.href}
              target={s.name === 'mail' ? undefined : '_blank'}
              rel="noreferrer"
              aria-label={s.label}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all hover:-translate-y-1 hover:border-accent hover:text-accent-soft"
            >
              <Icon name={s.name} width={18} height={18} />
            </a>
          ))}
          <MagneticButton
            onClick={() => scrollToTarget(0)}
            className="ml-2 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_24px_-8px_rgba(59,130,246,0.8)]"
          >
            <Icon name="arrowUp" width={18} height={18} />
          </MagneticButton>
        </div>
      </div>
      <p className="border-t border-white/5 py-5 text-center text-xs text-white/35">
        &copy; {new Date().getFullYear()} Fahad Ali. Crafted with React, Three.js &amp; GSAP.
      </p>
    </footer>
  )
}
