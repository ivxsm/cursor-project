import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";

function Mascot({ x, color, speed }: { x: number; color: string; speed: number }) {
  const mascotRef = useRef<Group>(null);

  useFrame((state) => {
    if (mascotRef.current) {
      mascotRef.current.position.y = Math.sin(state.clock.elapsedTime * speed + x) * 0.09;
      mascotRef.current.rotation.z = Math.sin(state.clock.elapsedTime * speed) * 0.08;
    }
  });

  return (
    <group ref={mascotRef} position={[x, 0.22, 0.72]}>
      <mesh>
        <sphereGeometry args={[0.16, 24, 16]} />
        <meshStandardMaterial color={color} roughness={0.55} />
      </mesh>
      <mesh position={[-0.055, 0.03, 0.14]}>
        <sphereGeometry args={[0.026, 12, 8]} />
        <meshStandardMaterial color="#172033" />
      </mesh>
      <mesh position={[0.055, 0.03, 0.14]}>
        <sphereGeometry args={[0.026, 12, 8]} />
        <meshStandardMaterial color="#172033" />
      </mesh>
    </group>
  );
}

function WobbleBus({ compact = false }: { compact?: boolean }) {
  const busRef = useRef<Group>(null);
  const wheelRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (busRef.current) {
      busRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.4) * 0.025;
      busRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.06;
    }

    if (wheelRef.current) {
      wheelRef.current.rotation.x = state.clock.elapsedTime * 2.5;
    }
  });

  return (
    <group ref={busRef} scale={compact ? 0.78 : 1} position={[0, compact ? -0.15 : 0, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.4, 1.35, 1]} />
        <meshStandardMaterial color="#ffd166" roughness={0.52} />
      </mesh>
      <mesh position={[0, 0.82, -0.03]}>
        <boxGeometry args={[3.35, 0.24, 0.9]} />
        <meshStandardMaterial color="#ff7aa8" roughness={0.48} />
      </mesh>
      <mesh position={[1.85, 0.18, 0.54]}>
        <boxGeometry args={[0.34, 0.68, 0.08]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {[-1.45, -0.55, 0.35, 1.25].map((x) => (
        <mesh key={x} position={[x, 0.22, 0.55]}>
          <boxGeometry args={[0.62, 0.42, 0.08]} />
          <meshStandardMaterial color="#a7e9ff" metalness={0.05} roughness={0.18} />
        </mesh>
      ))}
      {[-1.05, -0.15, 0.75].map((x) => (
        <mesh key={x} position={[x, -0.42, 0.45]}>
          <boxGeometry args={[0.34, 0.42, 0.28]} />
          <meshStandardMaterial color="#36506b" roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[-1.45, -0.76, 0.34]} ref={wheelRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.18, 32]} />
        <meshStandardMaterial color="#172033" />
      </mesh>
      <mesh position={[1.45, -0.76, 0.34]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.18, 32]} />
        <meshStandardMaterial color="#172033" />
      </mesh>
      <mesh position={[2.25, 0.04, 0.6]}>
        <sphereGeometry args={[0.12, 18, 12]} />
        <meshStandardMaterial color="#fff4a3" emissive="#ffd166" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-2.25, 0.04, 0.6]}>
        <sphereGeometry args={[0.12, 18, 12]} />
        <meshStandardMaterial color="#fff4a3" emissive="#ffd166" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, -0.98, 0]}>
        <boxGeometry args={[5.3, 0.12, 1.5]} />
        <meshStandardMaterial color="#8a5b3d" roughness={0.8} />
      </mesh>
      <Mascot x={-0.92} color="#5ec8ff" speed={2.1} />
      <Mascot x={0.08} color="#ff7aa8" speed={2.5} />
      <Mascot x={0.98} color="#95e06c" speed={1.8} />
    </group>
  );
}

export function ThreeScene({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`three-scene ${compact ? "compact" : ""}`} aria-hidden="true">
      <Canvas camera={{ position: [0, compact ? 0.35 : 0.45, compact ? 5.4 : 5], fov: compact ? 42 : 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <pointLight position={[-3, 2, 3]} intensity={0.6} color="#ff7aa8" />
        <WobbleBus compact={compact} />
      </Canvas>
    </div>
  );
}
