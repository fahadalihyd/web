import { lazy, useState } from 'react'
import type { FormEvent } from 'react'
import { profile } from '../data/resume'
import SceneFrame from '../components/three/SceneFrame'
import SplitText from '../components/ui/SplitText'
import Reveal from '../components/ui/Reveal'
import MagneticButton from '../components/ui/MagneticButton'
import Icon from '../components/ui/Icons'

const ContactScene = lazy(() => import('../components/three/ContactScene'))

function CopyCard({ icon, label, value, href }: { icon: string; label: string; value: string; href: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = href
    }
  }
  return (
    <div className="glass glass-glow spotlight flex items-center gap-4 p-5">
      <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-accent/10 text-accent-soft">
        <Icon name={icon} />
      </span>
      <a href={href} className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-widest text-ink/40">{label}</p>
        <p className="truncate font-medium text-ink/90">{value}</p>
      </a>
      <button
        onClick={copy}
        aria-label={`Copy ${label}`}
        className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-line text-ink/60 transition-colors hover:border-accent hover:text-accent-soft"
      >
        <Icon name={copied ? 'check' : 'copy'} width={18} height={18} />
      </button>
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n-- ${form.name} (${form.email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  const field =
    'w-full rounded-2xl border border-line bg-overlay/[0.04] px-5 py-4 text-sm text-ink placeholder-ink/30 outline-none transition-all focus:border-accent/70 focus:bg-overlay/[0.08]'

  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative mb-16 text-center">
          <Reveal>
            <span className="section-label">Get in touch</span>
          </Reveal>
          <SplitText
            text="Let's build something amazing together"
            className="mx-auto mt-5 max-w-4xl font-display text-4xl font-bold leading-tight md:text-7xl"
            accentWords={['amazing']}
          />
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* 3D scene + contact cards */}
          <div>
            <div className="relative mx-auto aspect-square w-full max-w-[460px]">
              <SceneFrame className="absolute inset-0">
                <ContactScene />
              </SceneFrame>
            </div>
            <div className="mt-4 space-y-4">
              <Reveal>
                <CopyCard icon="mail" label="Email" value={profile.email} href={`mailto:${profile.email}`} />
              </Reveal>
              <Reveal delay={0.1}>
                <CopyCard icon="phone" label="Phone" value={profile.phone} href={`tel:${profile.phoneHref}`} />
              </Reveal>
              <Reveal delay={0.2}>
                <div className="glass glass-glow flex items-center gap-4 p-5">
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-accent/10 text-accent-soft">
                    <Icon name="pin" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-ink/40">Location</p>
                    <p className="font-medium text-ink/90">{profile.location}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Form */}
          <Reveal x={50} y={0}>
            <form onSubmit={submit} className="glass glass-glow space-y-5 p-8 md:p-10">
              <h3 className="font-display text-2xl font-bold">Send me a message</h3>
              <p className="text-sm text-ink/50">Tell me about your project, I usually reply within a day.</p>
              <input
                required
                className={field}
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                required
                type="email"
                className={field}
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <textarea
                required
                rows={5}
                className={`${field} resize-none`}
                placeholder="Tell me about your project..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <MagneticButton type="submit" className="btn-primary w-full justify-center" strength={0.15}>
                Send Message <Icon name="send" width={18} height={18} />
              </MagneticButton>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
