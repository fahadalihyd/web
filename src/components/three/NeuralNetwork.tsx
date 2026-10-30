import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scenePalette, useTheme } from '../../theme/ThemeProvider'

type Variant = 'layers' | 'sphere'

interface Props {
  variant?: Variant
  mobile?: boolean
  position?: [number, number, number]
  scale?: number
  /** react to page scroll (hero only) */
  scrollLinked?: boolean
}

interface Graph {
  nodes: THREE.Vector3[]
  edges: [number, number][]
  lengths: number[]
  /** outgoing edges per node: edge index + whether traversal goes a -> b */
  out: { edge: number; forward: boolean }[][]
  sources: number[]
}

function finish(nodes: THREE.Vector3[], edges: [number, number][], bidirectional: boolean, sources: number[]): Graph {
  const out: Graph['out'] = nodes.map(() => [])
  edges.forEach(([a, b], i) => {
    out[a].push({ edge: i, forward: true })
    if (bidirectional) out[b].push({ edge: i, forward: false })
  })
  const lengths = edges.map(([a, b]) => nodes[a].distanceTo(nodes[b]))
  return { nodes, edges, lengths, out, sources }
}

/** Feed-forward network: rings of nodes stacked along X, fully connected layer to layer. */
function buildLayers(mobile: boolean): Graph {
  const sizes = mobile ? [4, 6, 7, 6, 3] : [6, 10, 12, 10, 4]
  const gap = mobile ? 1.35 : 1.9
  const nodes: THREE.Vector3[] = []
  const starts: number[] = []
  sizes.forEach((n, li) => {
    starts.push(nodes.length)
    const x = (li - (sizes.length - 1) / 2) * gap
    const r = 0.8 + Math.sqrt(n) * 0.3
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + li * 0.6
      nodes.push(new THREE.Vector3(x + (Math.random() - 0.5) * 0.15, Math.sin(a) * r, Math.cos(a) * r * 0.9))
    }
  })
  const edges: [number, number][] = []
  for (let li = 0; li < sizes.length - 1; li++) {
    for (let i = 0; i < sizes[li]; i++) {
      for (let j = 0; j < sizes[li + 1]; j++) {
        edges.push([starts[li] + i, starts[li + 1] + j])
      }
    }
  }
  const sources = Array.from({ length: sizes[0] }, (_, i) => starts[0] + i)
  return finish(nodes, edges, false, sources)
}

/** Connected globe: nodes on a fibonacci sphere linked to their nearest neighbours. */
function buildSphere(mobile: boolean): Graph {
  const n = mobile ? 38 : 64
  const radius = 2
  const nodes: THREE.Vector3[] = []
  for (let i = 0; i < n; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / n)
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
    nodes.push(
      new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
      ),
    )
  }
  const seen = new Set<string>()
  const edges: [number, number][] = []
  nodes.forEach((p, i) => {
    nodes
      .map((q, j) => ({ j, d: p.distanceToSquared(q) }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (!seen.has(key)) {
          seen.add(key)
          edges.push([i, j])
        }
      })
  })
  return finish(nodes, edges, true, nodes.map((_, i) => i))
}

interface Pulse {
  edge: number
  forward: boolean
  t: number
  speed: number
}

const BASE = new THREE.Color('#334155')
const HOT = new THREE.Color('#60a5fa')
const PULSE = new THREE.Color('#93c5fd')

export default function NeuralNetwork({ variant = 'layers', mobile = false, position = [0, 0, 0], scale = 1, scrollLinked = false }: Props) {
  const { theme } = useTheme()
  const palette = scenePalette[theme]
  const group = useRef<THREE.Group>(null)

  useEffect(() => {
    BASE.set(palette.base)
    HOT.set(palette.hot)
    PULSE.set(palette.pulse)
  }, [palette])
  const nodeMesh = useRef<THREE.InstancedMesh>(null)
  const pulseMesh = useRef<THREE.InstancedMesh>(null)

  const graph = useMemo(() => (variant === 'layers' ? buildLayers(mobile) : buildSphere(mobile)), [variant, mobile])
  const pulseCount = variant === 'layers' ? (mobile ? 24 : 60) : mobile ? 14 : 26

  const lineGeo = useMemo(() => {
    const arr = new Float32Array(graph.edges.length * 6)
    graph.edges.forEach(([a, b], i) => {
      graph.nodes[a].toArray(arr, i * 6)
      graph.nodes[b].toArray(arr, i * 6 + 3)
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [graph])

  useEffect(() => () => lineGeo.dispose(), [lineGeo])

  const state = useMemo(() => {
    const activation = new Float32Array(graph.nodes.length)
    const pulses: Pulse[] = []
    const spawn = (p: Pulse, node: number) => {
      const o = graph.out[node]
      if (!o.length) return false
      const pick = o[Math.floor(Math.random() * o.length)]
      p.edge = pick.edge
      p.forward = pick.forward
      p.t = 0
      p.speed = 1.3 + Math.random() * 1.1
      return true
    }
    for (let i = 0; i < pulseCount; i++) {
      const p: Pulse = { edge: 0, forward: true, t: Math.random(), speed: 1 }
      spawn(p, graph.sources[Math.floor(Math.random() * graph.sources.length)])
      p.t = Math.random()
      pulses.push(p)
    }
    return { activation, pulses, spawn, cursor: 0 }
  }, [graph, pulseCount])

  const tmp = useMemo(
    () => ({ m: new THREE.Matrix4(), v: new THREE.Vector3(), c: new THREE.Color(), q: new THREE.Quaternion(), s: new THREE.Vector3() }),
    [],
  )

  useFrame((s, delta) => {
    const g = group.current
    const nm = nodeMesh.current
    const pm = pulseMesh.current
    if (!g || !nm || !pm) return
    const dt = Math.min(delta, 0.05)
    const t = s.clock.elapsedTime
    const { activation, pulses, spawn } = state
    const { m, v, c, q, s: sc } = tmp

    // group motion: idle sway + pointer parallax (+ scroll for the hero)
    const progress = scrollLinked ? Math.min(window.scrollY / window.innerHeight, 1.4) : 0
    const baseY = variant === 'layers' ? -0.5 : t * 0.12
    const targetY = baseY + Math.sin(t * 0.25) * (variant === 'layers' ? 0.12 : 0.05) + s.pointer.x * 0.2 + progress * 0.5
    const targetX = (variant === 'layers' ? 0.12 : 0.2) + s.pointer.y * -0.12
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetY, variant === 'layers' ? 0.06 : 1)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetX, 0.06)
    g.position.z = THREE.MathUtils.lerp(g.position.z, position[2] - progress * 1.6, 0.08)
    g.position.y = THREE.MathUtils.lerp(g.position.y, position[1] + progress * 0.8, 0.08)
    g.updateMatrixWorld()

    // pointer proximity: the nearest node lights up and fires pulses
    let nearest = -1
    let best = 0.1
    for (let i = 0; i < graph.nodes.length; i++) {
      v.copy(graph.nodes[i])
      g.localToWorld(v)
      v.project(s.camera)
      const d = Math.hypot(v.x - s.pointer.x, v.y - s.pointer.y)
      if (d < best) {
        best = d
        nearest = i
      }
    }
    if (nearest >= 0) {
      activation[nearest] = 1
      if (Math.random() < 0.25) {
        const p = pulses[state.cursor++ % pulses.length]
        spawn(p, nearest)
      }
    }

    // nodes
    for (let i = 0; i < graph.nodes.length; i++) {
      activation[i] *= Math.exp(-dt * 3)
      const a = activation[i]
      const k = (variant === 'layers' ? 0.07 : 0.055) * (1 + a * 0.8)
      sc.set(k, k, k)
      m.compose(graph.nodes[i], q, sc)
      nm.setMatrixAt(i, m)
      c.lerpColors(BASE, HOT, Math.min(a, 1)).multiplyScalar(1 + a * 0.35)
      nm.setColorAt(i, c)
    }
    nm.instanceMatrix.needsUpdate = true
    if (nm.instanceColor) nm.instanceColor.needsUpdate = true

    // pulses
    for (let i = 0; i < pulses.length; i++) {
      const p = pulses[i]
      p.t += (p.speed * dt) / Math.max(graph.lengths[p.edge], 0.3)
      if (p.t >= 1) {
        const [ea, eb] = graph.edges[p.edge]
        const end = p.forward ? eb : ea
        activation[end] = Math.min(activation[end] + 0.55, 1)
        if (!spawn(p, end)) spawn(p, graph.sources[Math.floor(Math.random() * graph.sources.length)])
      }
      const [a, b] = graph.edges[p.edge]
      const from = p.forward ? graph.nodes[a] : graph.nodes[b]
      const to = p.forward ? graph.nodes[b] : graph.nodes[a]
      v.lerpVectors(from, to, p.t)
      sc.setScalar(1)
      m.compose(v, q, sc)
      pm.setMatrixAt(i, m)
      pm.setColorAt(i, PULSE)
    }
    pm.instanceMatrix.needsUpdate = true
    if (pm.instanceColor) pm.instanceColor.needsUpdate = true
  })

  return (
    <group ref={group} position={position} scale={scale}>
      <instancedMesh ref={nodeMesh} args={[undefined, undefined, graph.nodes.length]} frustumCulled={false}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      <lineSegments geometry={lineGeo} frustumCulled={false}>
        <lineBasicMaterial color={palette.line} transparent opacity={mobile ? 0.22 : 0.16} depthWrite={false} />
      </lineSegments>

      <instancedMesh ref={pulseMesh} args={[undefined, undefined, pulseCount]} frustumCulled={false}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  )
}
