import { Canvas } from '@react-three/fiber'
import NeuralNetwork from './NeuralNetwork'
import { useSceneActive } from './active'
import { useIsMobile } from '../../hooks/useMediaQuery'

export default function ContactScene() {
  const active = useSceneActive()
  const mobile = useIsMobile()
  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={active ? 'always' : 'demand'}
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ alpha: true, antialias: !mobile }}
      eventSource={document.documentElement}
      eventPrefix="client"
    >
      <NeuralNetwork variant="sphere" mobile={mobile} scale={0.95} />
    </Canvas>
  )
}
