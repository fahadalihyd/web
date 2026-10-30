import { useRef } from 'react'
import type { ReactNode, MouseEvent, CSSProperties } from 'react'
import gsap from 'gsap'

interface Props {
  children: ReactNode
  className?: string
  max?: number
  style?: CSSProperties
  holo?: boolean
}

export default function TiltCard({ children, className = '', max = 10, style, holo = false }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const move = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
    if (holo) {
      el.style.setProperty('--hx', `${px * 100}%`)
      el.style.setProperty('--hy', `${py * 100}%`)
    }
    gsap.to(el, {
      rotateY: (px - 0.5) * max * 2,
      rotateX: (0.5 - py) * max * 2,
      transformPerspective: 900,
      duration: 0.4,
      ease: 'power2.out',
    })
  }
  const leave = () =>
    gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })

  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={leave} className={className} style={{ transformStyle: 'preserve-3d', ...style }}>
      {children}
    </div>
  )
}
