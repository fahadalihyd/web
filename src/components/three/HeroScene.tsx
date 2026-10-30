import { Canvas, useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import HeroOrb from './HeroOrb'
import Starfield from './Starfield'
import { useSceneActive } from './active'
import { useIsMobile, useMediaQuery, usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { scenePalette, useTheme } from '../../theme/ThemeProvider'

function Rig({ mobile, interactive }: { mobile: boolean; interactive: boolean }) {
  useFrame((state, delta) => {
    const x = interactive ? state.pointer.x * 0.2 : 0
    const y = interactive ? state.pointer.y * 0.12 : 0
    const base: [number, number, number] = mobile ? [0, 1.5, 8.2] : [-0.15, 1.85, 7.2]
    easing.damp3(state.camera.position, [base[0] + x, base[1] + y, base[2]], 0.35, delta)
    state.camera.lookAt(mobile ? 0 : 0.7, mobile ? 0.7 : 0.25, 0)
  })
  return null
}

export default function HeroScene() {
  const active = useSceneActive()
  const mobile = useIsMobile()
  const reduced = usePrefersReducedMotion()
  const coarse = useMediaQuery('(pointer: coarse)')
  const { theme } = useTheme()
  const palette = scenePalette[theme]
  const interactive = !coarse && !reduced

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={active && !reduced ? 'always' : 'demand'}
      dpr={mobile ? 1 : [1, 1.5]}
      camera={mobile ? { position: [0, 1.5, 8.2], fov: 40 } : { position: [-0.15, 1.85, 7.2], fov: 34 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={[palette.bg]} />
      <fog attach="fog" args={[palette.bg, 11, 22]} />
      {theme === 'dark' && <Starfield count={mobile ? 120 : 260} radius={14} size={0.03} />}
      <HeroOrb theme={theme} mobile={mobile} interactive={interactive} reduced={reduced} />
      <Rig mobile={mobile} interactive={interactive} />
    </Canvas>
  )
}
