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
      <Boundary fallback={<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_60%)]" />}>
        <SceneActiveContext.Provider value={active}>
          <Suspense fallback={null}>{children}</Suspense>
        </SceneActiveContext.Provider>
      </Boundary>
    </div>
  )
}
