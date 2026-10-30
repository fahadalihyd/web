import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { sphereWords } from '../../data/resume'
import { useSceneActive } from './active'

const COLORS = ['#93c5fd', '#e2e8f0', '#60a5fa', '#ffffff', '#cbd5e1']

function makeTexture(word: string, color: string) {
  const w = 512
  const h = 128
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, w, h)
  ctx.font = '600 64px "Space Grotesk", Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = color
  ctx.shadowBlur = 12
  ctx.fillStyle = color
  ctx.fillText(word, w / 2, h / 2 + 4)
  ctx.shadowBlur = 0
  ctx.fillStyle = '#ffffff'
  ctx.globalAlpha = 0.9
  ctx.fillText(word, w / 2, h / 2 + 4)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function Sphere({ radius }: { radius: number }) {
  const group = useRef<THREE.Group>(null)
  const { gl } = useThree()
  const drag = useRef({ down: false, x: 0, y: 0, vx: 0.004, vy: 0 })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    document.fonts.ready.then(() => !cancelled && setReady(true))
    return () => {
      cancelled = true
    }
  }, [])

  const items = useMemo(() => {
    if (!ready) return []
    const n = sphereWords.length
    return sphereWords.map((word, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n)
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
      const pos = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
      )
      const texture = makeTexture(word, COLORS[i % COLORS.length])
      return { word, pos, texture }
    })
  }, [ready, radius])

  useEffect(() => {
    const el = gl.domElement
    const d = drag.current
    const down = (e: PointerEvent) => {
      d.down = true
      d.x = e.clientX
      d.y = e.clientY
      el.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!d.down) return
      d.vx = (e.clientX - d.x) * 0.0035
      d.vy = (e.clientY - d.y) * 0.0035
      d.x = e.clientX
      d.y = e.clientY
    }
    const up = () => {
      d.down = false
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [gl])

  useFrame(() => {
    const g = group.current
    if (!g) return
    const d = drag.current
    g.rotation.y += d.vx
    g.rotation.x += d.vy
    g.rotation.x = THREE.MathUtils.clamp(g.rotation.x, -1.1, 1.1)
    if (!d.down) {
      d.vx += (0.004 - d.vx) * 0.03
      d.vy *= 0.94
    }
  })

  return (
    <group ref={group}>
      {/* glowing core */}
      <mesh>
        <icosahedronGeometry args={[radius * 0.55, 3]} />
        <meshBasicMaterial color="#475569" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 0.32, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[radius, 1]} />
        <meshBasicMaterial color="#64748b" wireframe transparent opacity={0.12} />
      </mesh>
      {items.map((it) => (
        <sprite key={it.word} position={it.pos} scale={[1.45, 0.36, 1]}>
          <spriteMaterial map={it.texture} transparent depthWrite={false} />
        </sprite>
      ))}
    </group>
  )
}

export default function SkillSphere() {
  const active = useSceneActive()
  return (
    <Canvas
      className="!absolute inset-0 touch-pan-y cursor-grab active:cursor-grabbing"
      data-cursor
      frameloop={active ? 'always' : 'demand'}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7.2], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
    >
      <fog attach="fog" args={['#0a0f1c', 6, 11.5]} />
      <Sphere radius={2.7} />
    </Canvas>
  )
}
