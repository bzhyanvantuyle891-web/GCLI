'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Environment, ContactShadows, RoundedBox, SpotLight } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Suspense, useState, useEffect, useRef } from 'react';

function PremiumChabanModel() {
  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.2}>
      {/* Главный массив (Основание) */}
      <RoundedBox args={[4.5, 0.3, 2.8]} radius={0.05} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial 
          color="#16110f" // Глубокий мореный дуб
          roughness={0.6} 
          metalness={0.1}
          clearcoat={0.4} // Эффект масляного покрытия
          clearcoatRoughness={0.3}
          envMapIntensity={1.5}
        />
      </RoundedBox>
      
      {/* Латунный сливной коллектор (Центр) */}
      <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <circleGeometry args={[0.35, 64]} />
        <meshStandardMaterial 
          color="#d4af37" // Латунь
          metalness={0.9} 
          roughness={0.2} 
          envMapIntensity={2}
        />
      </mesh>

      {/* Фрезеровка вокруг слива (Углубление) */}
      <mesh position={[0, 0.155, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.45, 64]} />
        <meshPhysicalMaterial 
          color="#0a0807" 
          roughness={0.8} 
          metalness={0} 
        />
      </mesh>

      {/* Латунные ножки */}
      {[[-2.0, 1.2], [2.0, 1.2], [-2.0, -1.2], [2.0, -1.2]].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.25, z]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.2, 32]} />
          <meshStandardMaterial 
            color="#d4af37" 
            metalness={0.8} 
            roughness={0.3} 
          />
        </mesh>
      ))}
    </Float>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.2} />
      {/* Теплый свет из мастерской */}
      <SpotLight 
        position={[5, 8, 5]} 
        angle={0.3} 
        penumbra={1} 
        intensity={2} 
        color="#ffe8cc" 
        castShadow 
      />
      {/* Холодный контровой свет для объема */}
      <SpotLight 
        position={[-5, 5, -5]} 
        angle={0.5} 
        penumbra={1} 
        intensity={1} 
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
    <section ref={containerRef} id="showroom" className="h-[70vh] md:h-[90vh] w-full bg-[#030303] relative overflow-hidden flex flex-col items-center justify-center border-y border-white/5">
      {/* Атмосферный фон */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,164,132,0.05)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

      <div className="absolute top-12 left-0 w-full z-10 flex flex-col items-center pointer-events-none space-y-2">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-widest text-[rgb(var(--accent-wood))] font-semibold"
        >
          360° Инспекция
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-white tracking-tight"
        >
          Анатомия монолита
        </motion.h2>
      </div>

      <div className="w-full h-full cursor-grab active:cursor-grabbing pt-16">
        {isInView ? (
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white/30 text-xs tracking-widest uppercase animate-pulse">Инициализация 3D среды...</div>}>
            <Canvas shadows camera={{ position: [0, 3, 7], fov: 40 }} frameloop="demand">
              <SceneLighting />
              <PremiumChabanModel />
              <ContactShadows 
                position={[0, -0.4, 0]} 
                opacity={0.6} 
                scale={12} 
                blur={2.5} 
                far={4} 
                color="#000000" 
                resolution={512}
              />
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                autoRotate 
                autoRotateSpeed={0.8}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={Math.PI / 4}
              />
            </Canvas>
          </Suspense>
        ) : (
           <div className="w-full h-full bg-[#030303]" />
        )}
      </div>

      <div className="absolute bottom-8 left-0 w-full z-20 pointer-events-none flex justify-center">
        <div className="bg-black/50 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full flex items-center gap-3">
           <div className="w-1.5 h-1.5 bg-[rgb(var(--accent-wood))] rounded-full animate-pulse" />
           <span className="text-[10px] text-gray-300 uppercase tracking-widest font-semibold">Вращайте модель для изучения</span>
        </div>
      </div>
    </section>
  );
}
