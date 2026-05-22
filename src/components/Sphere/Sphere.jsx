import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere as DreiSphere, MeshDistortMaterial, Stars, Float, useTexture } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import logoImg from '../../assets/logo.png'
import './Sphere.css'

// Esfera principal de cristal con efecto translúcido y brillo
function GlassSphere() {
  const meshRef = useRef()
  const innerRef = useRef()

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.3
      innerRef.current.rotation.x += delta * 0.1
    }
  })

  return (
    <group>
      {/* Esfera exterior tipo cristal */}
      <DreiSphere ref={meshRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color="#0a3d6e"
          attach="material"
          distort={0.15}
          speed={1}
          roughness={0}
          metalness={0.4}
          transparent
          opacity={0.6}
          emissive="#1a5d9c"
          emissiveIntensity={0.4}
        />
      </DreiSphere>

      {/* Núcleo brillante interior */}
      <DreiSphere ref={innerRef} args={[1.2, 32, 32]}>
        <meshBasicMaterial
          color="#0a2547"
          transparent
          opacity={0.9}
        />
      </DreiSphere>

      {/* Halo de luz brillante en el centro */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#4a9eff" distance={5} />
    </group>
  )
}

// Logo de la empresa flotando en el centro de la esfera
function CentralSymbol() {
  const ref = useRef()
  const ringRef = useRef()
  const texture = useTexture(logoImg)

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5
    }
  })

  return (
    <group ref={ref} position={[0, 0, 1.6]}>
      {/* Anillo dorado pulsante alrededor del logo */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.45, 0.008, 16, 100]} />
        <meshBasicMaterial color="#d4a547" transparent opacity={0.7} />
      </mesh>

      {/* El logo en sí */}
      <mesh>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.1}
          toneMapped={false}
        />
      </mesh>

      {/* Luz adicional detrás del logo para darle resplandor */}
      <pointLight position={[0, 0, -0.2]} intensity={1.5} color="#d4a547" distance={2} />
    </group>
  )
}

// Anillos orbitando con más presencia
function OrbitRings() {
  const ring1 = useRef()
  const ring2 = useRef()
  const ring3 = useRef()
  const ring4 = useRef()

  useFrame((state, delta) => {
    if (ring1.current) ring1.current.rotation.z += delta * 0.25
    if (ring2.current) ring2.current.rotation.z -= delta * 0.18
    if (ring3.current) ring3.current.rotation.x += delta * 0.3
    if (ring4.current) ring4.current.rotation.y += delta * 0.4
  })

  return (
    <>
      <mesh ref={ring1} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.3, 0.025, 16, 120]} />
        <meshBasicMaterial color="#d4a547" transparent opacity={0.85} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 2.0, 0.3, 0]}>
        <torusGeometry args={[2.7, 0.018, 16, 120]} />
        <meshBasicMaterial color="#e8b855" transparent opacity={0.6} />
      </mesh>
      <mesh ref={ring3} rotation={[Math.PI / 1.8, -0.2, 0]}>
        <torusGeometry args={[2.0, 0.012, 16, 120]} />
        <meshBasicMaterial color="#d4a547" transparent opacity={0.5} />
      </mesh>
      {/* Anillo de "piso" reflejando abajo */}
      <mesh ref={ring4} rotation={[Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
        <ringGeometry args={[1.8, 1.85, 64]} />
        <meshBasicMaterial color="#d4a547" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

// Onda dorada horizontal que cruza la esfera
function GoldenWaves() {
  const wave1 = useRef()
  const wave2 = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (wave1.current) {
      wave1.current.rotation.z = Math.sin(t * 0.3) * 0.05
    }
    if (wave2.current) {
      wave2.current.rotation.z = -Math.sin(t * 0.4) * 0.05
    }
  })

  return (
    <>
      <mesh ref={wave1} rotation={[0, 0, 0.1]}>
        <torusGeometry args={[3.5, 0.008, 8, 200, Math.PI]} />
        <meshBasicMaterial color="#d4a547" transparent opacity={0.5} />
      </mesh>
      <mesh ref={wave2} rotation={[0, 0, -0.05]} position={[0, 0.1, 0]}>
        <torusGeometry args={[4.2, 0.006, 8, 200, Math.PI]} />
        <meshBasicMaterial color="#e8b855" transparent opacity={0.3} />
      </mesh>
    </>
  )
}

// Partículas doradas más visibles
function GoldParticles() {
  const particlesRef = useRef()
  const count = 400

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 2.8 + Math.random() * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.5
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    }
    return pos
  }, [])

  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#d4a547"
        transparent
        opacity={1}
        sizeAttenuation
      />
    </points>
  )
}

function Sphere() {
  return (
    <div className="sphere-container">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        {/* Iluminación */}
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#4a9eff" />
        <pointLight position={[-5, -3, 5]} intensity={1} color="#d4a547" />
        <pointLight position={[0, 0, 3]} intensity={1.2} color="#ffffff" />

        {/* Estrellas de fondo */}
        <Stars radius={60} depth={50} count={2000} factor={4} fade speed={1} />

        {/* Elementos */}
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
          <GlassSphere />
          <CentralSymbol />
        </Float>

        <OrbitRings />
        <GoldenWaves />
        <GoldParticles />
      </Canvas>
    </div>
  )
}

export default Sphere