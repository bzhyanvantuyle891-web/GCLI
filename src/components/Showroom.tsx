'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Environment, ContactShadows, RoundedBox, SpotLight } from '@react-three/drei';
import { createXRStore, XR } from '@react-three/xr';
import { motion } from 'framer-motion';
import { Suspense, useState, useEffect, useRef } from 'react';

// Инициализация AR хранилища
const store = createXRStore();

function PremiumChabanModel() {
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
      {/* Основной массив (Мореный дуб) */}
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
      
      {/* Сливной поддон (Фрезеровка) */}
      <RoundedBox args={[3.8, 0.36, 2.0]} radius={0.05} smoothness={4} position={[0, 0.05, 0]}>
        <meshPhysicalMaterial 
          color="#0a0807" 
          roughness={0.9} 
          metalness={0} 
        />
      </RoundedBox>

      {/* Латунный центральный слив */}
      <mesh position={[0, 0.23, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <circleGeometry args={[0.25, 64]} />
        <meshStandardMaterial 
          color="#c4a484" 
          metalness={0.8} 
          roughness={0.3} 
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Латунные ножки */}
      {[[-2.1, 1.2], [2.1, 1.2], [-2.1, -1.2], [2.1, -1.2]].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.25, z]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.15, 32]} />
          <meshStandardMaterial color="#c4a484" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
    </Float>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <SpotLight 
        position={[6, 8, 4]} 
        angle={0.4} 
        penumbra={1} 
        intensity={2.5} 
        color="#ffe8cc" 
        castShadow 
      />
      <SpotLight 
        position={[-6, 4, -4]} 
        angle={0.5} 
        penumbra={1} 
        intensity={1.5} 
        color="#e0e8ff" 
      />
      <Environment preset="studio" />
    </>
  );
}

export default function Showroom() {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '300px 0px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

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

      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        {isInView ? (
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white/30 text-xs tracking-widest uppercase animate-pulse">Инициализация 3D среды...</div>}>
            
            {/* Кнопка запуска AR поверх 3D среды */}
            <button 
              onClick={() => store.enterAR()}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest z-50 border-none shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform"
            >
              Смотреть в AR
            </button>

            <Canvas shadows camera={{ position: [0, 4, 8], fov: 40 }} frameloop="demand">
              <XR store={store}>
                <SceneLighting />
                <PremiumChabanModel />
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
              </XR>
            </Canvas>
          </Suspense>
        ) : (
           <div className="w-full h-full bg-[#050505]" />
        )}
      </div>

      <div className="absolute bottom-24 md:bottom-28 left-0 w-full z-20 pointer-events-none flex justify-center">
        <div className="bg-black/50 backdrop-blur-md border border-white/10 px-6 py-2.5 rounded-full flex items-center gap-3 shadow-xl hidden md:flex">
           <div className="w-1.5 h-1.5 bg-[rgb(var(--accent-wood))] rounded-full animate-pulse" />
           <span className="text-[10px] text-gray-300 uppercase tracking-widest font-semibold">Вращайте модель. Нажмите кнопку AR для примерки.</span>
        </div>
      </div>
    </section>
  );
}
