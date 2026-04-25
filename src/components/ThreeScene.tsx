import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

function WobbleBus() {
  const busRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (busRef.current) {
      busRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.6) * 0.035;
      busRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.08;
    }
  });

  return (
    <group>
      <mesh ref={busRef} position={[0, 0, 0]}>
        <boxGeometry args={[3.8, 1.2, 1]} />
        <meshStandardMaterial color="#ffd166" roughness={0.55} />
      </mesh>
      <mesh position={[-1.1, 0.2, 0.52]}>
        <boxGeometry args={[0.6, 0.42, 0.06]} />
        <meshStandardMaterial color="#8bd3ff" />
      </mesh>
      <mesh position={[0, 0.2, 0.52]}>
        <boxGeometry args={[0.6, 0.42, 0.06]} />
        <meshStandardMaterial color="#8bd3ff" />
      </mesh>
      <mesh position={[1.1, 0.2, 0.52]}>
        <boxGeometry args={[0.6, 0.42, 0.06]} />
        <meshStandardMaterial color="#8bd3ff" />
      </mesh>
      <mesh position={[-1.2, -0.68, 0.35]}>
        <cylinderGeometry args={[0.26, 0.26, 0.18, 24]} />
        <meshStandardMaterial color="#2d3447" />
      </mesh>
      <mesh position={[1.2, -0.68, 0.35]}>
        <cylinderGeometry args={[0.26, 0.26, 0.18, 24]} />
        <meshStandardMaterial color="#2d3447" />
      </mesh>
    </group>
  );
}

export function ThreeScene() {
  return (
    <div className="three-scene" aria-hidden="true">
      <Canvas camera={{ position: [0, 0.4, 5], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} />
        <WobbleBus />
      </Canvas>
    </div>
  );
}
