import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const PARTICLE_COUNT = 500;
const particlesPosition = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particlesPosition[i * 3] = (Math.random() - 0.5) * 10;
  particlesPosition[i * 3 + 1] = (Math.random() - 0.5) * 10;
  particlesPosition[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

export function HeroMechanism() {
  const outerRingRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * 0.1;
      outerRingRef.current.rotation.y += delta * 0.15;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x -= delta * 0.12;
      innerRingRef.current.rotation.z -= delta * 0.2;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.3;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.05;
    }

    // Pointer subtle response
    const targetX = (state.pointer.x * Math.PI) / 10;
    const targetY = (state.pointer.y * Math.PI) / 10;
    
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y += 0.05 * (targetX - outerRingRef.current.rotation.y);
      outerRingRef.current.rotation.x += 0.05 * (targetY - outerRingRef.current.rotation.x);
    }
  });

  const brassMaterial = new THREE.MeshStandardMaterial({
    color: '#cda65f',
    metalness: 0.8,
    roughness: 0.3,
    wireframe: true,
    transparent: true,
    opacity: 0.2,
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#cda65f" />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#f4ebd8" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#5e2129" />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <group ref={outerRingRef}>
          <mesh>
            <torusGeometry args={[3, 0.05, 16, 100]} />
            <primitive object={brassMaterial} attach="material" />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[3, 0.05, 16, 100]} />
            <primitive object={brassMaterial} attach="material" />
          </mesh>
        </group>

        <group ref={innerRingRef}>
          <mesh>
            <torusGeometry args={[2.5, 0.08, 16, 100]} />
            <primitive object={brassMaterial} attach="material" />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[2.5, 0.08, 16, 100]} />
            <primitive object={brassMaterial} attach="material" />
          </mesh>
        </group>

        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#cda65f" metalness={0.9} roughness={0.1} wireframe opacity={0.3} transparent />
        </mesh>
      </Float>

      <Points ref={pointsRef} positions={particlesPosition} stride={3}>
        <PointMaterial transparent color="#cda65f" size={0.03} sizeAttenuation={true} depthWrite={false} opacity={0.4} />
      </Points>
    </>
  );
}
