import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface EarthProps {
  latitude: number | null;
  longitude: number | null;
}

function EarthGlobe({ latitude, longitude }: EarthProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Update target rotation when location changes
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      // Convert lat/long to spherical coordinates
      // Latitude: 0° at equator, 90° at north pole, -90° at south pole
      // Longitude: -180° to 180°
      const latRad = (latitude * Math.PI) / 180;
      const lonRad = (longitude * Math.PI) / 180;

      // Set target rotation
      // Negate latitude for proper orientation
      targetRotation.current = {
        x: -latRad,
        y: -lonRad + Math.PI, // Add PI to face the location towards camera
      };
    }
  }, [latitude, longitude]);

  // Smooth rotation animation
  useFrame(() => {
    if (meshRef.current) {
      // Smoothly interpolate to target rotation
      meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.05;

      // Slow auto-rotation when not targeting a location
      if (latitude === null || longitude === null) {
        meshRef.current.rotation.y += 0.001;
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <Sphere args={[2.5, 64, 64]}>
        <meshStandardMaterial
          color="#1a4d7a"
          wireframe={false}
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>

      {/* Wireframe overlay for continents effect */}
      <Sphere args={[2.51, 32, 32]}>
        <meshBasicMaterial
          color="#ffffff"
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[2.7, 32, 32]}>
        <meshBasicMaterial
          color="#4a9eff"
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
    </mesh>
  );
}

export default function Earth({ latitude, longitude }: EarthProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a9eff" />

        <EarthGlobe latitude={latitude} longitude={longitude} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          enabled={false}
        />
      </Canvas>
    </div>
  );
}
