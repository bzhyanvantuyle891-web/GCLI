'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, RoundedBox, useTexture } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef, memo, useLayoutEffect } from 'react';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as THREE from 'three';

// Define a type for model-viewer custom element
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src: string;
        ar?: boolean;
        'ar-modes'?: string;
        'camera-controls'?: boolean;
        alt?: string;
        'ios-src'?: string;
      }, HTMLElement>;
    }
  }
}

interface ExporterProps {
  groupRef: React.RefObject<THREE.Group | null>;
  setGlbUrl: (url: string) => void;
  activeModel: string;
}

function Exporter({ groupRef, setGlbUrl, activeModel }: ExporterProps) {
  useEffect(() => {
    if (!groupRef.current) return;
    
    let isMounted = true;
    const exportModel = () => {
      if (!isMounted || !groupRef.current) return;
      try {
        const exporter = new GLTFExporter();
        exporter.parse(
          groupRef.current,
          (gltf) => {
            if (!isMounted) return;
            const blob = new Blob([gltf as ArrayBuffer], { type: 'model/gltf-binary' });
            const url = URL.createObjectURL(blob);
            setGlbUrl(url);
          },
          (error) => {
            console.error('GLTF Export Error:', error);
          },
          { binary: true }
        );
      } catch (err) {
        console.error('Exporter failed:', err);
      }
    };

    const timeout = setTimeout(exportModel, 1500);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [groupRef, setGlbUrl, activeModel]);

  return null;
}

// Textured Material Component with safe loading and detailed parameters
const DetailedWoodMaterial = ({ color, roughness, clearcoat = 0.5 }: { color: string, roughness: number, clearcoat?: number }) => {
  return (
    <meshPhysicalMaterial 
      color={color}
      roughness={roughness}
      metalness={0.05}
      clearcoat={clearcoat}
      clearcoatRoughness={0.1}
      envMapIntensity={1.5}
      reflectivity={0.5}
    />
  );
};

// 1. MONOLITH
const MonolithModel = memo(() => (
  <group>
    <RoundedBox args={[7, 0.6, 4]} radius={0.08} smoothness={8} castShadow receiveShadow>
      <DetailedWoodMaterial 
        color="#3d231a"
        roughness={0.6}
      />
    </RoundedBox>
    <mesh position={[0, 0.09, 0]}>
      <boxGeometry args={[6.4, 0.38, 3.4]} />
      <meshPhysicalMaterial color="#080808" roughness={0.9} />
    </mesh>
    <group position={[0, 0.28, 0]}>
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[(i - 4.5) * 0.62, 0.01, 0]} castShadow>
          <boxGeometry args={[0.25, 0.15, 3.4]} />
          <DetailedWoodMaterial 
            color="#4d2c1e"
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
    <mesh position={[3.55, -0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
       <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
       <meshStandardMaterial color="#d4af37" metalness={0.9} />
    </mesh>
  </group>
));
MonolithModel.displayName = 'MonolithModel';

// 2. NEXUS
const NexusModel = memo(() => (
  <group>
    <mesh receiveShadow castShadow>
      <boxGeometry args={[6.8, 0.7, 4.2]} />
      <meshPhysicalMaterial color="#1a1a1a" roughness={0.8} metalness={0.1} />
    </mesh>
    <group position={[0, 0.45, 0]}>
      {[[-2.5, 1.5], [2.5, 1.5], [-2.5, -1.5], [2.5, -1.5]].map(([x, z], i) => (
         <mesh key={i} position={[x, -0.15, z]}>
            <cylinderGeometry args={[0.03, 0.03, 0.3, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={1} />
         </mesh>
      ))}
      <RoundedBox args={[6.2, 0.1, 3.6]} radius={0.05} castShadow smoothness={4}>
         <DetailedWoodMaterial 
           color="#5c4033"
           roughness={0.4}
           clearcoat={0.6}
         />
      </RoundedBox>
      <group position={[0, 0.052, 0]}>
        {[...Array(4)].map((_, r) => [...Array(6)].map((_, c) => (
            <mesh key={`${r}-${c}`} position={[(c - 2.5) * 0.8, 0, (r - 1.5) * 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.05, 16]} />
              <meshBasicMaterial color="#000" />
            </mesh>
        )))}
      </group>
    </group>
  </group>
));
NexusModel.displayName = 'NexusModel';

// 3. ECLIPSE
const EclipseModel = memo(() => (
  <group>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[7.5, 0.8, 4.5]} />
      <DetailedWoodMaterial 
        color="#050505"
        roughness={0.2}
        clearcoat={1}
      />
    </mesh>
    <group position={[0, 0.36, 0]}>
      <mesh receiveShadow rotation={[0, 0.2, 0]}>
        <boxGeometry args={[5, 0.1, 1.2]} />
        <meshPhysicalMaterial color="#000" roughness={1} />
      </mesh>
      <mesh position={[0, -0.02, 0]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[4.8, 0.05, 0.8]} />
        <meshPhysicalMaterial color="#d4af37" metalness={1} roughness={0.1} emissive="#d4af37" emissiveIntensity={0.5} />
      </mesh>
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[(i - 2.5) * 0.7, 0.06, i * 0.1]} rotation={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.04, 0.04, 1.4]} />
          <meshStandardMaterial color="#ffffff" metalness={1} />
        </mesh>
      ))}
    </group>
    <mesh position={[2.5, 0.41, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.1, 32]} />
      <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={10} />
    </mesh>
    {[[-3.4, 1.9], [3.4, 1.9], [-3.4, -1.9], [3.4, -1.9]].map(([x, z], i) => (
      <mesh key={i} position={[x, -0.45, z]}>
         <cylinderGeometry args={[0.08, 0.12, 0.2, 16]} />
         <meshStandardMaterial color="#71717a" metalness={1} />
      </mesh>
    ))}
  </group>
));
EclipseModel.displayName = 'EclipseModel';

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={4} color="#ffffff" castShadow />
      <pointLight position={[-10, 5, 8]} intensity={1.5} color="#e0e8ff" />
      <spotLight position={[0, 12, -15]} angle={0.4} penumbra={1} intensity={5} color="#ffe8cc" />
      <directionalLight position={[0, 10, 0]} intensity={1.5} color="#ffffff" />
      <Environment preset="apartment" />
    </>
  );
}

export default function Showroom({ activeModel = 'monolith' }: { activeModel?: 'monolith' | 'nature' | 'dark' }) {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const modelGroupRef = useRef<THREE.Group>(null);
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
      document.head.appendChild(script);
    }
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { rootMargin: '300px' });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const prevModelRef = useRef(activeModel);
  useEffect(() => {
    if (prevModelRef.current !== activeModel) {
      if (glbUrl) URL.revokeObjectURL(glbUrl);
      setGlbUrl(null);
      setIsExporting(true);
      prevModelRef.current = activeModel;
    }
  }, [activeModel, glbUrl]);

  const handleGlbReady = (url: string) => {
    setGlbUrl(url);
    setIsExporting(false);
  };

  const activateAR = () => {
    if (!glbUrl) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mv = document.getElementById('ar-viewer') as any;
    if (mv?.activateAR) {
      mv.activateAR();
    } else {
      const link = document.createElement('a');
      link.rel = 'ar'; link.href = glbUrl; link.click();
    }
  };

  return (
    <section ref={containerRef} id="showroom" className="h-full w-full bg-transparent relative overflow-hidden flex flex-col items-center justify-center">
      <div style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}>
        {/* @ts-expect-error - model-viewer */}
        <model-viewer id="ar-viewer" src={glbUrl || ''} ar ar-modes="webxr scene-viewer quick-look" />
      </div>
      <div className="w-full h-full cursor-grab active:cursor-grabbing touch-none">
        {isInView && (
          <Suspense fallback={null}>
            <button 
              onClick={activateAR}
              disabled={isExporting}
              className={`absolute bottom-8 right-6 md:right-12 px-5 py-3 rounded-full font-bold text-[9px] uppercase tracking-widest z-50 transition-all flex items-center gap-2 ${
                isExporting ? 'bg-white/10 text-white/30 cursor-wait' : 'bg-white text-black border-none shadow-xl hover:scale-105 active:scale-95'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 21v-4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4"/><path d="M21 10.368a2 2 0 0 0-1.04-.9l-7-3.32a2 2 0 0 0-1.92 0l-7 3.32A2 2 0 0 0 3 10.368V21"/><path d="M3 10.368 12 15l9-4.632"/><path d="M12 15v6"/></svg>
              <span>{isExporting ? 'AR...' : 'Примерить в AR'}</span>
            </button>
            <Canvas 
              shadows 
              dpr={[1, 1.5]} 
              gl={{ antialias: true, powerPreference: "high-performance" }}
              camera={{ position: [0, 4, 7.5], fov: 34 }} 
              onPointerDown={(e) => (e.target as HTMLElement).setPointerCapture(1)}
            >
              <SceneLighting />
              <group ref={modelGroupRef} key={activeModel}>
                {activeModel === 'monolith' && <MonolithModel />}
                {activeModel === 'nature' && <NexusModel />}
                {activeModel === 'dark' && <EclipseModel />}
              </group>
              <Exporter groupRef={modelGroupRef} setGlbUrl={handleGlbReady} activeModel={activeModel} />
              <ContactShadows position={[0, -0.45, 0]} opacity={0.4} scale={15} blur={2.5} far={4} color="#000000" resolution={256} />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} enableDamping dampingFactor={0.05} minPolarAngle={0} maxPolarAngle={Math.PI} />
            </Canvas>
          </Suspense>
        )}
      </div>
    </section>
  );
}
