import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { easing } from 'maath'
import NeuralNetwork from './NeuralNetwork'
import Starfield from './Starfield'
import { useSceneActive } from './active'
import { useIsMobile, usePrefersReducedMotion } from '../../hooks/useMediaQuery'

const BG = '#0a0f1c'

function Rig() {
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [state.pointer.x * 0.7, state.pointer.y * 0.45, 7.5], 0.4, delta)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function Content({ mobile }: { mobile: boolean }) {
  const { viewport } = useThree()
  const wide = viewport.width > 9 && !mobile
  return (
    <>
      <NeuralNetwork
        mobile={mobile}
        scrollLinked
        position={wide ? [1.9, 0, 0] : [0, mobile ? 2.2 : 1.3, 0]}
        scale={wide ? 0.68 : mobile ? 0.42 : 0.6}
      />
      <gridHelper args={[48, 48, '#1e293b', '#1e293b']} position={[0, -4.2, 0]} material-transparent material-opacity={0.5} />
    </>
  )
}

export default function HeroScene() {
  const active = useSceneActive()
  const mobile = useIsMobile()
  const reduced = usePrefersReducedMotion()

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={active && !reduced ? 'always' : 'demand'}
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
      eventSource={document.documentElement}
      eventPrefix="client"
    >
      {/* postprocessing output is opaque, so the hero uses a solid matching background */}
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 10, 24]} />
      <Content mobile={mobile} />
      <Starfield count={mobile ? 140 : 300} />
      <Rig />
      {!mobile && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.7} luminanceThreshold={0.6} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  )
}
