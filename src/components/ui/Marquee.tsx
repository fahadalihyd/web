import { marqueeItems } from '../../data/resume'

export default function Marquee({ reverse = false }: { reverse?: boolean }) {
  const items = [...marqueeItems, ...marqueeItems]
  return (
    <div className="relative overflow-hidden py-6 border-y border-white/5 bg-white/[0.015] [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className="flex w-max animate-marquee gap-10" style={{ animationDirection: reverse ? 'reverse' : 'normal' }}>
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-display text-2xl md:text-4xl font-semibold text-white/25 hover:text-white transition-colors whitespace-nowrap"
          >
            {item}
            <span className="text-accent text-xl">&#10022;</span>
          </span>
        ))}
      </div>
    </div>
  )
}
