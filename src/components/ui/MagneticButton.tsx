import { useRef } from 'react'
import type { ReactNode, MouseEvent } from 'react'
import gsap from 'gsap'

interface Props {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  strength?: number
  download?: boolean
  target?: string
  type?: 'button' | 'submit'
}

export default function MagneticButton({ children, href, onClick, className = '', strength = 0.35, download, target, type = 'button' }: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)

  const move = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    gsap.to(el, { x, y, duration: 0.4, ease: 'power3.out' })
  }
  const leave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })

  const common = { onMouseMove: move, onMouseLeave: leave, className }
  return href ? (
    <a ref={ref} href={href} download={download} target={target} rel={target ? 'noreferrer' : undefined} onClick={onClick} {...common}>
      {children}
    </a>
  ) : (
    <button ref={ref} type={type} onClick={onClick} {...common}>
      {children}
    </button>
  )
}
