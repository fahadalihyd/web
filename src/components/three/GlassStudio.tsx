import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Grid, Lightformer, MeshTransmissionMaterial, RoundedBox } from '@react-three/drei'
import { easing } from 'maath'
import { Color, MathUtils, type Group, type Mesh } from 'three'
import { scenePalette, type Theme } from '../../theme/ThemeProvider'

type Palette = (typeof scenePalette)[Theme]

interface ShapeProps {
  position: [number, number, number]
  size: number
  rotation: [number, number, number]
  phase: number
  spin: number
}

const HERO_SHAPE: ShapeProps = { position: [0, 0.55, 0], size: 1.25, rotation: [0.3, 0.6, 0.05], phase: 0.2, spin: 0.07 }
const SIDE_SHAPE: ShapeProps = { position: [-1.25, -0.3, 0.55], size: 0.7, rotation: [0.15, -0.4, 0.1], phase: 1.8, spin: -0.1 }

const SPARKS: Array<[number, number, number, number]> = [
  [1.35, 1.4, 0.3, 0.07],
  [-0.9, 1.6, -0.2, 0.05],
  [1.7, -0.2, 0.5, 0.045],
  [0.5, -0.75, 0.9, 0.04],
]

function Glass({ palette, size, mobile, light, alt }: { palette: Palette; size: number; mobile: boolean; light: boolean; alt: boolean }) {
  const tint = alt ? palette.glassColor2 : palette.glassColor
  const atten = alt ? palette.glassAttenuation2 : palette.glassAttenuation
  const backdrop = useMemo(() => new Color(palette.glassBackdrop), [palette.glassBackdrop])

  if (mobile) {
    return (
      <meshPhysicalMaterial
        color={tint}
        roughness={light ? 0.08 : 0.12}
        metalness={0}
        transmission={1}
        thickness={size}
        ior={1.4}
        attenuationColor={atten}
        attenuationDistance={light ? 0.9 : 1.2}
        clearcoat={0.7}
        clearcoatRoughness={0.15}
        envMapIntensity={light ? 1.1 : 1.5}
      />
    )
  }

  return (
    <MeshTransmissionMaterial
      backside
      samples={6}
      resolution={384}
      transmission={1}
      roughness={light ? 0.1 : 0.22}
      thickness={1.4}
      ior={1.4}
      chromaticAberration={light ? 0.03 : 0.06}
      anisotropy={0.25}
      distortion={0.1}
      distortionScale={0.25}
      temporalDistortion={0.03}
      attenuationDistance={light ? 0.9 : 1.2}
      attenuationColor={atten}
      color={tint}
      background={backdrop}
    />
  )
}

function GlassCube({
  position,
  size,
  rotation,
  phase,
  spin,
  palette,
  mobile,
  light,
  alt = false,
}: ShapeProps & { palette: Palette; mobile: boolean; light: boolean; alt?: boolean }) {
  const ref = useRef<Mesh>(null)

  useFrame((state) => {
    const mesh = ref.current
    if (!mesh) return
    const t = state.clock.elapsedTime
    mesh.position.y = position[1] + Math.sin(t * 0.5 + phase) * 0.07
    mesh.rotation.y = rotation[1] + t * spin
    mesh.rotation.x = rotation[0] + Math.sin(t * 0.3 + phase) * 0.05
  })

  return (
    <RoundedBox ref={ref} args={[size, size, size]} radius={size * 0.12} smoothness={5} position={position} rotation={rotation}>
      <Glass palette={palette} size={size} mobile={mobile} light={light} alt={alt} />
    </RoundedBox>
  )
}

function AccentRing({
  palette,
  light,
  second = false,
}: {
  palette: Palette
  light: boolean
  second?: boolean
}) {
  const ref = useRef<Mesh>(null)
  const dir = second ? -1 : 1

  useFrame((state) => {
    const mesh = ref.current
    if (!mesh) return
    const t = state.clock.elapsedTime
    mesh.rotation.z = t * 0.2 * dir
    mesh.rotation.x = (second ? 0.55 : 1.15) + Math.sin(t * 0.3) * 0.08
  })

  return (
    <mesh ref={ref} position={[0.1, 0.5, -0.15]} rotation={[second ? 0.55 : 1.15, second ? -0.3 : 0.2, 0]}>
      <torusGeometry args={[second ? 1.7 : 1.35, second ? 0.016 : 0.03, 24, 180]} />
      <meshStandardMaterial
        color={second ? palette.accent2Metal : palette.accentMetal}
        emissive={second ? palette.accent2Emissive : palette.accentEmissive}
        emissiveIntensity={light ? 0.15 : 2.2}
        roughness={0.25}
        metalness={light ? 0.7 : 0.3}
        toneMapped={!light}
      />
    </mesh>
  )
}

function Sparks({ palette, mobile, light }: { palette: Palette; mobile: boolean; light: boolean }) {
  const items = mobile ? SPARKS.slice(0, 2) : SPARKS
  return (
    <>
      {items.map(([x, y, z, r], i) => (
        <Spark key={i} position={[x, y, z]} radius={r} phase={i * 1.3} palette={palette} alt={i % 2 === 1} light={light} />
      ))}
    </>
  )
}

function Spark({
  light,
  position,
  radius,
  phase,
  palette,
  alt,
}: {
  light: boolean
  position: [number, number, number]
  radius: number
  phase: number
  palette: Palette
  alt: boolean
}) {
  const ref = useRef<Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 + phase) * 0.12
  })
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshStandardMaterial
        color={alt ? palette.accent2Metal : palette.accentMetal}
        emissive={alt ? palette.accent2Emissive : palette.accentEmissive}
        emissiveIntensity={light ? 0.2 : 2.6}
        roughness={0.3}
        metalness={0.3}
      />
    </mesh>
  )
}

export default function GlassStudio({
  theme,
  mobile,
  interactive = true,
}: {
  theme: Theme
  mobile: boolean
  interactive?: boolean
}) {
  const light = theme === 'light'
  const palette = scenePalette[theme]
  const cluster = useRef<Group>(null)

  // gentle, limited pointer parallax on the whole cluster
  useFrame((state, delta) => {
    const g = cluster.current
    if (!g) return
    const px = interactive ? state.pointer.x : 0
    const py = interactive ? state.pointer.y : 0
    easing.damp(g.rotation, 'y', MathUtils.degToRad(px * 6), 0.4, delta)
    easing.damp(g.rotation, 'x', MathUtils.degToRad(-py * 4), 0.4, delta)
  })

  return (
    <>
      <ambientLight intensity={light ? 0.7 : 0.25} />
      {/* key */}
      <directionalLight position={[4, 7, 5]} intensity={light ? 1.4 : 1.0} color="#ffffff" />
      {/* fill */}
      <directionalLight position={[-6, 3, 2]} intensity={light ? 0.5 : 0.7} color={palette.fillLight} />
      {/* colored glow lights for depth */}
      <pointLight position={[-3, 1.5, 3]} intensity={light ? 6 : 14} distance={14} color={palette.glowA} />
      <pointLight position={[4, 0.5, 2]} intensity={light ? 5 : 12} distance={14} color={palette.glowB} />
      {/* rim */}
      <directionalLight position={[0, 4, -6]} intensity={light ? 0.6 : 1.4} color={palette.rimLight} />

      <Environment resolution={256}>
        <Lightformer form="rect" intensity={light ? 4 : 2.4} position={[0, 5, 2]} scale={[12, 6, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={light ? 1.2 : 2.2} position={[-4, 2, -3]} scale={[8, 4, 1]} color={light ? palette.fillLight : palette.glowB} />
        <Lightformer form="rect" intensity={light ? 0.9 : 2} position={[4, 1, 3]} scale={[5, 8, 1]} color={light ? palette.rimLight : palette.glowA} />
      </Environment>

      <group
        position={mobile ? [0.35, 1.2, -0.8] : [1.2, 0.55, -0.9]}
        scale={mobile ? 0.55 : 0.8}
      >
        <group ref={cluster}>
          <GlassCube {...HERO_SHAPE} palette={palette} mobile={mobile} light={light} />
          <GlassCube {...SIDE_SHAPE} palette={palette} mobile={mobile} light={light} alt />
          <AccentRing palette={palette} light={light} />
          <AccentRing palette={palette} light={light} second />
          <Sparks palette={palette} mobile={mobile} light={light} />
        </group>
      </group>

      <ContactShadows
        position={[1.2, -1.22, 0]}
        opacity={light ? 0.22 : 0.4}
        scale={14}
        blur={3.6}
        far={4.5}
        color={palette.shadow}
      />

      <Grid
        position={[0, -1.22, 0]}
        args={[40, 40]}
        cellSize={0.48}
        cellThickness={0.5}
        cellColor={palette.floorLine}
        sectionSize={2.4}
        sectionThickness={0.9}
        sectionColor={palette.floorSection}
        fadeDistance={12}
        fadeStrength={2}
        infiniteGrid
      />
    </>
  )
}
