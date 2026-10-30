import { Component, Suspense, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { SceneActiveContext } from './active'

class Boundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/** Theme-aware CSS poster shown while the scene loads or when WebGL is unavailable. */
function Poster() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(circle at 70% 45%, var(--mesh-glow), transparent 55%), linear-gradient(to bottom, var(--void), var(--deep))',
      }}
    />
  )
}

interface Props {
  children: ReactNode
  className?: string
  initiallyActive?: boolean
}

/** Lazy 3D wrapper: pauses rendering when off-screen, survives missing WebGL. */
export default function SceneFrame({ children, className = '', initiallyActive = false }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(initiallyActive)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: '150px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      <Boundary fallback={<Poster />}>
        <SceneActiveContext.Provider value={active}>
          <Suspense fallback={<Poster />}>{children}</Suspense>
        </SceneActiveContext.Provider>
      </Boundary>
    </div>
  )
}
