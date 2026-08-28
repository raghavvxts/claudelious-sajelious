import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ORACLE_PARTICLE_COUNT = 800;
const oracleParticlesPosition = new Float32Array(ORACLE_PARTICLE_COUNT * 3);
for (let i = 0; i < ORACLE_PARTICLE_COUNT; i++) {
  oracleParticlesPosition[i * 3] = (Math.random() - 0.5) * 8;
  oracleParticlesPosition[i * 3 + 1] = (Math.random() - 0.5) * 8;
  oracleParticlesPosition[i * 3 + 2] = (Math.random() - 0.5) * 8;
}

export function ClaudeOracleCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Group>(null);
  const ringRef2 = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.2;
      coreRef.current.rotation.y += delta * 0.3;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x += delta * 0.5;
      ringRef1.current.rotation.z += delta * 0.1;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y -= delta * 0.4;
      ringRef2.current.rotation.x -= delta * 0.2;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} color="#121212" />
      <pointLight position={[0, 0, 0]} intensity={4} color="#f4ebd8" distance={5} />
      <directionalLight position={[-5, 5, 5]} intensity={0.5} color="#cda65f" />

      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={coreRef}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial 
            color="#f4ebd8" 
            emissive="#f4ebd8"
            emissiveIntensity={0.5}
            wireframe 
            distort={0.4} 
            speed={2}
          />
        </mesh>

        <group ref={ringRef1}>
          <mesh>
            <torusGeometry args={[2, 0.02, 16, 100]} />
            <meshStandardMaterial color="#cda65f" emissive="#cda65f" emissiveIntensity={0.5} />
          </mesh>
        </group>

        <group ref={ringRef2} rotation={[Math.PI / 4, 0, 0]}>
          <mesh>
            <torusGeometry args={[2.5, 0.01, 16, 100]} />
            <meshStandardMaterial color="#cda65f" opacity={0.5} transparent />
          </mesh>
        </group>
      </Float>

      <Points ref={pointsRef} positions={oracleParticlesPosition} stride={3}>
        <PointMaterial transparent color="#f4ebd8" size={0.02} sizeAttenuation={true} depthWrite={false} opacity={0.8} />
      </Points>
    </>
  );
}
