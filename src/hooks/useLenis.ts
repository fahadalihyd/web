import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null
export const getLenis = () => lenisInstance

export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true })
    lenisInstance = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisInstance = null
    }
  }, [enabled])
}

export function scrollToTarget(target: string | number) {
  if (lenisInstance) lenisInstance.scrollTo(target, { offset: -20, duration: 1.6 })
  else if (typeof target === 'string') document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  else window.scrollTo({ top: target, behavior: 'smooth' })
}
