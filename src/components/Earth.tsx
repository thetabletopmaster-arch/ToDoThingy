import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface EarthProps {
  latitude: number | null;
  longitude: number | null;
}

interface EarthGlobeProps extends EarthProps {
  mouseX: number;
  mouseY: number;
  scrollY: number;
}

function EarthGlobe({ latitude, longitude, mouseX, mouseY, scrollY }: EarthGlobeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Load Earth texture
  const texture = useLoader(
    THREE.TextureLoader,
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'
  );

  // Update target rotation when location changes
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      const latRad = (latitude * Math.PI) / 180;
      const lonRad = (longitude * Math.PI) / 180;

      targetRotation.current = {
        x: -latRad,
        y: -lonRad + Math.PI,
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

    // Apply mouse and scroll effects to the entire group
    if (groupRef.current) {
      // Mouse movement effect - subtle rotation
      groupRef.current.rotation.y = mouseX * 0.3;
      groupRef.current.rotation.x = -mouseY * 0.3;

      // Scroll effect - vertical movement
      groupRef.current.position.y = scrollY * 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <Sphere args={[2.5, 64, 64]}>
          <meshStandardMaterial
            map={texture}
            roughness={0.8}
            metalness={0.2}
          />
        </Sphere>

        {/* Atmosphere glow */}
        <Sphere args={[2.7, 32, 32]}>
          <meshBasicMaterial
            color="#4a9eff"
            transparent={true}
            opacity={0.15}
            side={THREE.BackSide}
          />
        </Sphere>
      </mesh>
    </group>
  );
}

export default function Earth({ latitude, longitude }: EarthProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a9eff" />

        <EarthGlobe
          latitude={latitude}
          longitude={longitude}
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
          scrollY={scrollY}
        />
      </Canvas>
    </div>
  );
}
