import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import * as THREE from 'three'
import { scenePalette, type Theme } from '../../theme/ThemeProvider'

type Palette = (typeof scenePalette)[Theme]

const RADIUS = 2
const TRAIL = 6

/* ------------------------------------------------------------------ shaders */

// Shared by every point cloud. Points on the far side of the orb fade out to give depth.
const pointVertex = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  uniform float uSizeMul;
  uniform float uTwinkle;
  attribute float aSize;
  attribute float aPhase;
  attribute float aAlpha;
  varying float vMix;
  varying float vAlpha;
  varying float vBoost;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 dir = mat3(modelViewMatrix) * position;
    float facing = length(dir) < 1e-4 ? 1.0 : smoothstep(-0.85, 0.65, normalize(dir).z);
    float tw = 0.5 + 0.5 * sin(uTime * 1.4 + aPhase * 6.2831);
    vMix = mix(fract(aPhase * 7.31), tw, uTwinkle);
    vBoost = tw * uTwinkle;
    vAlpha = aAlpha * mix(0.14, 1.0, facing);
    gl_PointSize = aSize * uSizeMul * (1.0 + vBoost * 0.3) * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`

const pointFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uGlow;
  uniform float uIntensity;
  varying float vMix;
  varying float vAlpha;
  varying float vBoost;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    vec3 col = mix(uColorA, uColorB, vMix);
    vec3 c;
    float a;
    if (uGlow > 0.5) {
      float core = smoothstep(0.34, 0.08, d);
      float halo = pow(1.0 - d, 2.6);
      a = (core + halo * 0.7) * vAlpha;
      c = col * (1.0 + core * uIntensity * (1.0 + vBoost)) + core * 0.05;
    } else {
      float disc = smoothstep(1.0, 0.78, d);
      a = disc * vAlpha;
      c = mix(col * 1.15, col * 0.6, smoothstep(0.2, 0.95, d));
    }
    gl_FragColor = vec4(c, a);
    #include <colorspace_fragment>
  }
`

const lineVertex = /* glsl */ `
  varying float vFade;
  void main() {
    vec3 dir = mat3(modelViewMatrix) * position;
    vFade = mix(0.08, 1.0, smoothstep(-0.7, 0.75, normalize(dir).z));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const lineFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFade;
  void main() {
    gl_FragColor = vec4(uColor, uOpacity * vFade);
    #include <colorspace_fragment>
  }
`

const fresnelVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

const fresnelFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uOpacity;
  uniform float uIntensity;
  uniform float uFill;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float f = pow(1.0 - max(dot(vNormal, vView), 0.0), uPower);
    gl_FragColor = vec4(uColor * uIntensity, (f + uFill) * uOpacity);
    #include <colorspace_fragment>
  }
`

/* ------------------------------------------------------------- materials */

function makePointMaterial(opts: { a: string; b: string; glow: boolean; twinkle?: number; sizeMul?: number; intensity?: number }) {
  return new THREE.ShaderMaterial({
    vertexShader: pointVertex,
    fragmentShader: pointFragment,
    transparent: true,
    depthWrite: false,
    blending: opts.glow ? THREE.AdditiveBlending : THREE.NormalBlending,
    uniforms: {
      uTime: { value: 0 },
      uScale: { value: 1 },
      uSizeMul: { value: opts.sizeMul ?? 1 },
      uTwinkle: { value: opts.twinkle ?? 0 },
      uColorA: { value: new THREE.Color(opts.a) },
      uColorB: { value: new THREE.Color(opts.b) },
      uGlow: { value: opts.glow ? 1 : 0 },
      uIntensity: { value: opts.intensity ?? 0.5 },
    },
  })
}

function makeLineMaterial(color: string, opacity: number, glow: boolean) {
  return new THREE.ShaderMaterial({
    vertexShader: lineVertex,
    fragmentShader: lineFragment,
    transparent: true,
    depthWrite: false,
    blending: glow ? THREE.AdditiveBlending : THREE.NormalBlending,
    uniforms: { uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity } },
  })
}

function makeFresnelMaterial(opts: { color: string; power: number; opacity: number; glow: boolean; intensity?: number; fill?: number }) {
  return new THREE.ShaderMaterial({
    vertexShader: fresnelVertex,
    fragmentShader: fresnelFragment,
    transparent: true,
    depthWrite: false,
    blending: opts.glow ? THREE.AdditiveBlending : THREE.NormalBlending,
    uniforms: {
      uColor: { value: new THREE.Color(opts.color) },
      uPower: { value: opts.power },
      uOpacity: { value: opts.opacity },
      uIntensity: { value: opts.intensity ?? 1 },
      uFill: { value: opts.fill ?? 0 },
    },
  })
}

function buildMaterials(palette: Palette, light: boolean) {
  const glow = !light
  const spriteMul = glow ? 3.2 : 1
  return {
    nodes: makePointMaterial({ a: palette.orbNode, b: palette.orbNodeHot, glow, twinkle: 0.65, sizeMul: spriteMul }),
    pulses: makePointMaterial({ a: palette.orbPulse, b: palette.orbNode, glow, sizeMul: spriteMul, intensity: 1 }),
    dust: makePointMaterial({ a: palette.orbNode, b: palette.orbNodeHot, glow, twinkle: 0.4, sizeMul: spriteMul * 0.9, intensity: 0.6 }),
    ring: makePointMaterial({ a: palette.orbEdge, b: palette.orbNode, glow, sizeMul: spriteMul * 0.8, intensity: 0.4 }),
    satellite: makePointMaterial({ a: palette.orbNodeHot, b: palette.orbPulse, glow, sizeMul: spriteMul, intensity: 1 }),
    heart: makePointMaterial({ a: palette.orbCore, b: palette.orbNodeHot, glow, twinkle: 0.3, sizeMul: 1, intensity: 1.2 }),
    edges: makeLineMaterial(palette.orbEdge, palette.orbEdgeOpacity, glow),
    lattice: makeLineMaterial(palette.orbNodeHot, light ? 0.55 : 0.5, glow),
    core: makeFresnelMaterial({ color: palette.orbCore, power: 1.6, opacity: light ? 0.75 : 0.9, glow, intensity: light ? 1 : 1.8, fill: light ? 0.08 : 0.15 }),
    atmosphere: makeFresnelMaterial({ color: palette.orbShell, power: 3.2, opacity: palette.orbShellOpacity, glow, intensity: light ? 1 : 1.4 }),
  }
}

type Materials = ReturnType<typeof buildMaterials>

/* ---------------------------------------------------------------- geometry */

interface Graph {
  nodes: THREE.Vector3[]
  edges: [number, number][]
  lengths: number[]
  adjacency: { edge: number; forward: boolean }[][]
}

/** Fibonacci-sphere nodes with a little jitter, each linked to its nearest neighbours. */
function buildGraph(count: number): Graph {
  const nodes: THREE.Vector3[] = []
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count)
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
    const r = RADIUS * (0.97 + Math.random() * 0.06)
    nodes.push(new THREE.Vector3(r * Math.cos(theta) * Math.sin(phi), r * Math.cos(phi), r * Math.sin(theta) * Math.sin(phi)))
  }
  const seen = new Set<string>()
  const edges: [number, number][] = []
  nodes.forEach((p, i) => {
    nodes
      .map((q, j) => ({ j, d: p.distanceToSquared(q) }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 4)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (!seen.has(key)) {
          seen.add(key)
          edges.push([i, j])
        }
      })
  })
  const adjacency: Graph['adjacency'] = nodes.map(() => [])
  edges.forEach(([a, b], i) => {
    adjacency[a].push({ edge: i, forward: true })
    adjacency[b].push({ edge: i, forward: false })
  })
  const lengths = edges.map(([a, b]) => nodes[a].distanceTo(nodes[b]))
  return { nodes, edges, lengths, adjacency }
}

function pointGeometry(positions: Float32Array, sizes: Float32Array, phases?: Float32Array, alphas?: Float32Array) {
  const n = sizes.length
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  g.setAttribute('aPhase', new THREE.BufferAttribute(phases ?? new Float32Array(n).map(() => Math.random()), 1))
  g.setAttribute('aAlpha', new THREE.BufferAttribute(alphas ?? new Float32Array(n).fill(1), 1))
  return g
}

function ringGeometry(count: number, radius: number, size: number) {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    pos[i * 3] = Math.cos(a) * radius
    pos[i * 3 + 1] = Math.sin(a) * radius
  }
  return pointGeometry(pos, new Float32Array(count).fill(size), undefined, new Float32Array(count).fill(0.7))
}

interface Pulse {
  edge: number
  forward: boolean
  t: number
  speed: number
}

/* --------------------------------------------------------------- component */

export default function HeroOrb({
  theme,
  mobile,
  interactive = true,
  reduced = false,
}: {
  theme: Theme
  mobile: boolean
  interactive?: boolean
  reduced?: boolean
}) {
  const palette = scenePalette[theme]
  const light = theme === 'light'
  const scale = mobile ? 0.5 : 0.72
  const pulseCount = mobile ? 12 : 26
  const dustCount = mobile ? 90 : 220

  const graph = useMemo(() => buildGraph(mobile ? 60 : 110), [mobile])

  const geo = useMemo(() => {
    const nodeCount = graph.nodes.length
    const nodePos = new Float32Array(nodeCount * 3)
    const nodeSize = new Float32Array(nodeCount)
    graph.nodes.forEach((p, i) => {
      p.toArray(nodePos, i * 3)
      const hub = Math.random() < 0.12
      nodeSize[i] = (hub ? 0.11 : 0.05 + Math.random() * 0.025) * (light ? 1.15 : 1)
    })

    const edgePos = new Float32Array(graph.edges.length * 6)
    graph.edges.forEach(([a, b], i) => {
      graph.nodes[a].toArray(edgePos, i * 6)
      graph.nodes[b].toArray(edgePos, i * 6 + 3)
    })
    const edges = new THREE.BufferGeometry()
    edges.setAttribute('position', new THREE.BufferAttribute(edgePos, 3))

    const trailCount = pulseCount * TRAIL
    const pulseSize = new Float32Array(trailCount)
    const pulseAlpha = new Float32Array(trailCount)
    for (let i = 0; i < pulseCount; i++) {
      for (let k = 0; k < TRAIL; k++) {
        const f = 1 - k / TRAIL
        pulseSize[i * TRAIL + k] = 0.075 * (0.35 + f * 0.65)
        pulseAlpha[i * TRAIL + k] = f * f
      }
    }

    const dustPos = new Float32Array(dustCount * 3)
    const dustSize = new Float32Array(dustCount)
    const dustAlpha = new Float32Array(dustCount)
    for (let i = 0; i < dustCount; i++) {
      const r = RADIUS * (1.2 + Math.random() * 0.75)
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      dustPos[i * 3] = r * Math.sin(ph) * Math.cos(th)
      dustPos[i * 3 + 1] = r * Math.cos(ph) * 0.75
      dustPos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th)
      dustSize[i] = 0.018 + Math.random() * 0.025
      dustAlpha[i] = 0.25 + Math.random() * 0.5
    }

    const lattice = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.85, 1))

    return {
      nodes: pointGeometry(nodePos, nodeSize),
      edges,
      pulses: pointGeometry(new Float32Array(trailCount * 3), pulseSize, new Float32Array(trailCount), pulseAlpha),
      dust: pointGeometry(dustPos, dustSize, undefined, dustAlpha),
      ringA: ringGeometry(mobile ? 120 : 220, RADIUS * 1.32, 0.022),
      ringB: ringGeometry(mobile ? 100 : 180, RADIUS * 1.55, 0.018),
      satellite: pointGeometry(new Float32Array([RADIUS * 1.32, 0, 0]), new Float32Array([0.09])),
      satellite2: pointGeometry(new Float32Array([RADIUS * 1.55, 0, 0]), new Float32Array([0.07])),
      heart: pointGeometry(new Float32Array(3), new Float32Array([light ? 0.5 : 1.5]), undefined, new Float32Array([light ? 0.55 : 0.6])),
      lattice,
      core: new THREE.SphereGeometry(0.5, 48, 48),
      atmosphere: new THREE.SphereGeometry(RADIUS * 1.08, 64, 64),
    }
  }, [graph, pulseCount, dustCount, mobile, light])

  useEffect(() => () => Object.values(geo).forEach((g) => g.dispose()), [geo])

  const mats = useMemo<Materials>(() => buildMaterials(palette, light), [palette, light])
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats])

  const pulses = useMemo<Pulse[]>(
    () =>
      Array.from({ length: pulseCount }, () => ({
        edge: Math.floor(Math.random() * graph.edges.length),
        forward: Math.random() > 0.5,
        t: Math.random(),
        speed: 0.8 + Math.random() * 0.9,
      })),
    [graph, pulseCount],
  )

  const group = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const lattice = useRef<THREE.LineSegments>(null)
  const dust = useRef<THREE.Points>(null)
  const orbitA = useRef<THREE.Group>(null)
  const orbitB = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const clock = useRef(0)
  const v = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(delta, 0.05)
    if (!reduced) clock.current += dt
    const t = clock.current

    const cam = state.camera as THREE.PerspectiveCamera
    const pxScale = (state.size.height * state.viewport.dpr) / (2 * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2))
    for (const m of [mats.nodes, mats.pulses, mats.dust, mats.ring, mats.satellite, mats.heart]) {
      m.uniforms.uTime.value = t
      m.uniforms.uScale.value = pxScale * scale
    }

    const px = interactive ? state.pointer.x : 0
    const py = interactive ? state.pointer.y : 0
    easing.damp(g.rotation, 'y', px * 0.3, 0.5, dt)
    easing.damp(g.rotation, 'x', -py * 0.2 + 0.12, 0.5, dt)

    if (spin.current) spin.current.rotation.y = t * 0.12
    if (lattice.current) {
      lattice.current.rotation.x = t * 0.25
      lattice.current.rotation.y = -t * 0.35
    }
    if (dust.current) dust.current.rotation.y = -t * 0.04
    if (orbitA.current) orbitA.current.rotation.z = t * 0.35
    if (orbitB.current) orbitB.current.rotation.z = -t * 0.22
    if (core.current) core.current.scale.setScalar(1 + Math.sin(t * 1.8) * 0.06)

    const attr = geo.pulses.getAttribute('position') as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    for (let i = 0; i < pulses.length; i++) {
      const p = pulses[i]
      p.t += (p.speed * dt) / Math.max(graph.lengths[p.edge], 0.3)
      if (p.t >= 1) {
        const [ea, eb] = graph.edges[p.edge]
        const opts = graph.adjacency[p.forward ? eb : ea]
        const pick = opts[Math.floor(Math.random() * opts.length)]
        p.edge = pick.edge
        p.forward = pick.forward
        p.t = 0
      }
      const [a, b] = graph.edges[p.edge]
      const from = p.forward ? graph.nodes[a] : graph.nodes[b]
      const to = p.forward ? graph.nodes[b] : graph.nodes[a]
      for (let k = 0; k < TRAIL; k++) {
        v.lerpVectors(from, to, Math.max(p.t - k * 0.045, 0))
        v.toArray(arr, (i * TRAIL + k) * 3)
      }
    }
    attr.needsUpdate = true
  })

  return (
    <group ref={group} position={mobile ? [0.3, 1.25, -0.8] : [1.45, 0.6, -0.9]} scale={scale}>
      <mesh geometry={geo.atmosphere} material={mats.atmosphere} renderOrder={-1} />

      <group ref={spin}>
        <mesh ref={core} geometry={geo.core} material={mats.core} />
        {!light && <points geometry={geo.heart} material={mats.heart} frustumCulled={false} />}
        <lineSegments ref={lattice} geometry={geo.lattice} material={mats.lattice} />
        <lineSegments geometry={geo.edges} material={mats.edges} frustumCulled={false} />
        <points geometry={geo.nodes} material={mats.nodes} frustumCulled={false} />
        <points geometry={geo.pulses} material={mats.pulses} frustumCulled={false} />
      </group>

      <points ref={dust} geometry={geo.dust} material={mats.dust} frustumCulled={false} />

      <group rotation={[1.2, 0.25, 0]}>
        <points geometry={geo.ringA} material={mats.ring} frustumCulled={false} />
        <group ref={orbitA}>
          <points geometry={geo.satellite} material={mats.satellite} frustumCulled={false} />
        </group>
      </group>
      <group rotation={[1.75, -0.5, 0.3]}>
        <points geometry={geo.ringB} material={mats.ring} frustumCulled={false} />
        <group ref={orbitB}>
          <points geometry={geo.satellite2} material={mats.satellite} frustumCulled={false} />
        </group>
      </group>
    </group>
  )
}
