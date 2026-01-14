import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface EarthProps {
  latitude: number | null;
  longitude: number | null;
}

function EarthGlobe({ latitude, longitude }: EarthProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  // Load Earth textures
  const colorMap = useLoader(
    THREE.TextureLoader,
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'
  );

  const bumpMap = useLoader(
    THREE.TextureLoader,
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg'
  );

  const lightsMap = useLoader(
    THREE.TextureLoader,
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_lights_2048.png'
  );

  // Calculate sun position based on coordinates and current time
  const calculateSunPosition = () => {
    const now = new Date();
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();

    // Calculate sun's position (simplified solar position)
    // Hour angle: 15 degrees per hour from solar noon
    const hourAngle = ((hours + minutes / 60) - 12) * 15 * (Math.PI / 180);

    // If we have latitude, use it for declination approximation
    const declination = latitude !== null ? (latitude * Math.PI / 180) * 0.4 : 0;

    // Convert to 3D position
    const distance = 15;
    const sunX = distance * Math.cos(declination) * Math.sin(hourAngle);
    const sunY = distance * Math.sin(declination);
    const sunZ = distance * Math.cos(declination) * Math.cos(hourAngle);

    return new THREE.Vector3(sunX, sunY, sunZ);
  };

  // Update target rotation when location changes
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      const latRad = (latitude * Math.PI) / 180;
      const lonRad = (longitude * Math.PI) / 180;

      // Rotate to show the selected location facing the camera
      targetRotation.current = {
        x: -latRad,
        y: -lonRad + Math.PI / 2, // Add 90° to face the location correctly
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

    // Update sun light position
    if (sunLightRef.current) {
      const sunPos = calculateSunPosition();
      sunLightRef.current.position.copy(sunPos);
    }
  });

  return (
    <>
      {/* Realistic sun light */}
      <directionalLight
        ref={sunLightRef}
        intensity={2.5}
        color="#ffffff"
        castShadow
      />

      {/* Ambient light for the dark side */}
      <ambientLight intensity={0.15} color="#1a1a2e" />

      {/* Subtle blue fill light from space */}
      <hemisphereLight
        skyColor="#4a9eff"
        groundColor="#000000"
        intensity={0.3}
      />

      <mesh ref={meshRef} rotation={[0, 0, 0]}>
        <sphereGeometry args={[3, 128, 128]} />
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          normalMap={bumpMap}
          normalScale={new THREE.Vector2(2, 2)}
          emissiveMap={lightsMap}
          emissive={new THREE.Color(0xffff88)}
          emissiveIntensity={1.5}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[3.15, 64, 64]} />
        <meshBasicMaterial
          color="#4a9eff"
          transparent={true}
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}

export default function Earth({ latitude, longitude }: EarthProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <EarthGlobe latitude={latitude} longitude={longitude} />
      </Canvas>
    </div>
  );
}
