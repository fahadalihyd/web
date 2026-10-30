import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    document.body.classList.add('custom-cursor')

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' })

    const move = (e: MouseEvent) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      const hover = !!t?.closest('a, button, input, textarea, [data-cursor]')
      ring.current?.classList.toggle('is-hover', hover)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      document.body.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-ring hidden [@media(pointer:fine)]:block" />
      <div ref={dot} className="cursor-dot hidden [@media(pointer:fine)]:block" />
    </>
  )
}
