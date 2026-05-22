'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Float, Environment, ContactShadows, RoundedBox, SpotLight } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Suspense, useState, useEffect, useRef } from 'react';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as THREE from 'three';

function Exporter({ groupRef, setGlbUrl }: { groupRef: React.RefObject<THREE.Group | null>, setGlbUrl: (url: string) => void }) {
  useEffect(() => {
    if (!groupRef.current) return;
    
    const timeout = setTimeout(() => {
      const exporter = new GLTFExporter();
      exporter.parse(
        groupRef.current!,
        (gltf) => {
          const blob = new Blob([gltf as ArrayBuffer], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          setGlbUrl(url);
        },
        (error) => console.error('GLTF Export Error:', error),
        { binary: true }
      );
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [groupRef, setGlbUrl]);

  return null;
}

function PremiumChabanModel({ groupRef }: { groupRef?: React.RefObject<THREE.Group | null> }) {
  const content = (
    <group ref={groupRef}>
      <RoundedBox args={[4.8, 0.35, 3.0]} radius={0.08} smoothness={4} castShadow receiveShadow position={[0, 0, 0]}>
        <meshPhysicalMaterial 
          color="#120e0c" 
          roughness={0.7} 
          metalness={0.1}
          clearcoat={0.3} 
          clearcoatRoughness={0.4}
          envMapIntensity={1.2}
        />
      </RoundedBox>
      
      <RoundedBox args={[3.8, 0.36, 2.0]} radius={0.05} smoothness={4} position={[0, 0.05, 0]}>
        <meshPhysicalMaterial color="#0a0807" roughness={0.9} metalness={0} />
      </RoundedBox>

      <mesh position={[0, 0.23, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <circleGeometry args={[0.25, 64]} />
        <meshStandardMaterial color="#c4a484" metalness={0.8} roughness={0.3} envMapIntensity={1.5} />
      </mesh>

      {[[-2.1, 1.2], [2.1, 1.2], [-2.1, -1.2], [2.1, -1.2]].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.25, z]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.15, 32]} />
          <meshStandardMaterial color="#c4a484" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
      {content}
    </Float>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <SpotLight position={[6, 8, 4]} angle={0.4} penumbra={1} intensity={2.5} color="#ffe8cc" castShadow />
      <SpotLight position={[-6, 4, -4]} angle={0.5} penumbra={1} intensity={1.5} color="#e0e8ff" />
      <Environment preset="studio" />
    </>
  );
}

export default function Showroom() {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const modelGroupRef = useRef<THREE.Group>(null);
  const [glbUrl, setGlbUrl] = useState<string | null>(null);

  useEffect(() => {
    // Предзагрузка model-viewer
    import('@google/model-viewer').catch(console.error);

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '300px 0px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const activateAR = () => {
    if (!glbUrl) {
      alert('Модель еще загружается, подождите секунду...');
      return;
    }
    const mv = document.getElementById('ar-viewer') as any;
    if (mv && mv.activateAR) {
      mv.activateAR();
    } else {
      alert('AR поддерживается только на смартфонах с ARCore (Android) или ARKit (iOS).');
    }
  };

  return (
    <section ref={containerRef} id="showroom" className="h-[80vh] md:h-[100vh] w-full bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,164,132,0.05)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

      <div className="absolute top-12 md:top-24 left-0 w-full z-10 flex flex-col items-center pointer-events-none space-y-4">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-widest text-[rgb(var(--accent-wood))] font-semibold"
        >
          Интерактивная Среда
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-white tracking-tight text-center px-4"
        >
          Рассмотрите детали
        </motion.h2>
      </div>

      {/* Hidden Model Viewer for AR */}
      {glbUrl && (
        <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
          {/* @ts-expect-error - model-viewer */}
          <model-viewer
            id="ar-viewer"
            src={glbUrl}
            ar
            ar-modes="webxr scene-viewer quick-look"
          />
        </div>
      )}

      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        {isInView ? (
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white/30 text-xs tracking-widest uppercase animate-pulse">Инициализация 3D среды...</div>}>
            
            <button 
              onClick={activateAR}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest z-50 border-none shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all flex items-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 21v-4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4"/><path d="M21 10.368a2 2 0 0 0-1.04-.9l-7-3.32a2 2 0 0 0-1.92 0l-7 3.32A2 2 0 0 0 3 10.368V21"/><path d="M3 10.368 12 15l9-4.632"/><path d="M12 15v6"/></svg>
              <span>{glbUrl ? 'Смотреть в AR' : 'Загрузка AR...'}</span>
            </button>

            <Canvas shadows camera={{ position: [0, 4, 8], fov: 40 }} frameloop="demand">
              <SceneLighting />
              <PremiumChabanModel groupRef={modelGroupRef} />
              <Exporter groupRef={modelGroupRef} setGlbUrl={setGlbUrl} />
              
              <ContactShadows 
                position={[0, -0.4, 0]} 
                opacity={0.8} 
                scale={15} 
                blur={2.5} 
                far={4} 
                color="#000000" 
                resolution={512}
              />
              <OrbitControls 
                enableZoom={true}
                minDistance={4}
                maxDistance={12} 
                enablePan={false}
                autoRotate 
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={Math.PI / 6}
              />
            </Canvas>
          </Suspense>
        ) : (
           <div className="w-full h-full bg-[#050505]" />
        )}
      </div>

      <div className="absolute bottom-24 md:bottom-28 left-0 w-full z-20 pointer-events-none flex justify-center">
        <div className="bg-black/50 backdrop-blur-md border border-white/10 px-6 py-2.5 rounded-full flex items-center gap-3 shadow-xl hidden md:flex">
           <div className="w-1.5 h-1.5 bg-[rgb(var(--accent-wood))] rounded-full animate-pulse" />
           <span className="text-[10px] text-gray-300 uppercase tracking-widest font-semibold">Вращайте модель. Поддерживается AR на смартфонах.</span>
        </div>
      </div>
    </section>
  );
}
