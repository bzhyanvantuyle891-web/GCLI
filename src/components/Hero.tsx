'use client';

import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const Showroom = dynamic(() => import('./Showroom'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-transparent flex items-center justify-center text-white/5 text-[10px] uppercase tracking-widest">Инициализация 3D...</div> 
});

interface HeroProps {
  onOrderClick: () => void;
  activeModel: 'monolith' | 'nature' | 'dark';
  onModelChange: (model: 'monolith' | 'nature' | 'dark') => void;
}

const collections = [
  { id: 'monolith', name: 'Monolith', desc: 'Карагач + Матовая Латунь' },
  { id: 'nature', name: 'Nexus', desc: 'Дуб + Закаленное стекло' },
  { id: 'dark', name: 'Eclipse', desc: 'Мореный дуб + Титан' },
] as const;

export default function Hero({ onOrderClick, activeModel, onModelChange }: HeroProps) {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  return (
    <section 
      aria-label="МАССИВ — Премиальное чайное искусство"
      className="relative h-screen w-full flex flex-col items-center overflow-hidden bg-[#050505]"
    >
      {/* 3D Model Background with improved vertical spacing */}
      <div className="absolute inset-0 z-0 pointer-events-auto overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 top-[15%] md:top-[20%] h-full">
           <Showroom activeModel={activeModel} />
        </div>
        {/* Blending gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] pointer-events-none" />
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>

      <div className="absolute inset-0 z-1 pointer-events-none opacity-20">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light" />
      </div>

      <div className="relative z-20 text-center px-4 w-full max-w-7xl mx-auto flex flex-col items-center pt-20 md:pt-32 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 max-w-4xl"
        >
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white tracking-tighter leading-none uppercase select-none text-shadow-glow">
            МАССИВ
          </h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-[9px] uppercase tracking-[0.8em] text-white"
          >
            Aesthetics of Eternity
          </motion.div>
        </motion.div>
      </div>

      {/* Control Panel (HUD) - Refined for all devices */}
      <div className="absolute bottom-0 left-0 w-full z-40">
        <div className="w-full h-px bg-white/5" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center md:items-end gap-10 md:gap-8">
          
          {/* Main Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-10 md:gap-16 pointer-events-auto">
            <div className="flex flex-col gap-2 items-center sm:items-start group">
               <span className="text-[7px] text-gray-600 uppercase tracking-[0.4em] font-mono group-hover:text-[rgb(var(--accent-wood))] transition-colors">Action_Request</span>
               <button 
                  onClick={onOrderClick} 
                  className="premium-button shadow-[0_0_50px_rgba(255,255,255,0.05)]"
               >
                  Начать проектирование
               </button>
            </div>
            
            <div className="flex flex-col gap-2 items-center sm:items-start relative">
               <span className="text-[7px] text-gray-600 uppercase tracking-[0.4em] font-mono">Archive_Scan</span>
               
               <AnimatePresence>
                 {isAccordionOpen && (
                   <motion.div
                     initial={{ opacity: 0, y: 10, scale: 0.98 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.98 }}
                     className="absolute bottom-full left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mb-6 w-64 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden p-2 shadow-2xl z-50"
                   >
                     {collections.map((item) => (
                       <button
                         key={item.id}
                         onClick={() => {
                           onModelChange(item.id);
                           setIsAccordionOpen(false);
                         }}
                         className={`w-full text-left p-4 rounded-xl transition-all flex flex-col gap-1 group ${
                           activeModel === item.id ? 'bg-white/5' : 'hover:bg-white/[0.03]'
                         }`}
                       >
                         <div className="flex justify-between items-center">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${activeModel === item.id ? 'text-[rgb(var(--accent-wood))]' : 'text-white/80'}`}>
                              {item.name}
                            </span>
                            {activeModel === item.id && <motion.div layoutId="dot" className="w-1 h-1 rounded-full bg-[rgb(var(--accent-wood))] shadow-[0_0_10px_rgb(var(--accent-wood))]" />}
                         </div>
                         <span className="text-[8px] text-gray-500 uppercase tracking-wider font-medium">{item.desc}</span>
                       </button>
                     ))}
                   </motion.div>
                 )}
               </AnimatePresence>

               <button 
                  onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                  className={`text-[9px] uppercase tracking-[0.3em] transition-all duration-500 pb-2 border-b-2 flex items-center gap-3 font-bold ${
                    isAccordionOpen ? 'text-white border-[rgb(var(--accent-wood))]' : 'text-white/40 border-transparent hover:text-white hover:border-white/20'
                  }`}
               >
                  Коллекции
                  <motion.svg 
                    animate={{ rotate: isAccordionOpen ? 180 : 0 }}
                    width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                  >
                    <path d="M18 15l-6-6-6 6"/>
                  </motion.svg>
               </button>
            </div>
          </div>

          {/* Center Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="flex flex-col items-center gap-4 opacity-20 pointer-events-none hidden lg:flex pb-1"
          >
            <span className="text-[7px] uppercase tracking-[0.6em] text-white font-mono">Exploring_Artifacts</span>
            <div className="w-[1px] h-10 bg-white/40" />
          </motion.div>

          {/* Right Area Spacer */}
          <div className="flex flex-col gap-2 items-center md:items-end min-w-[180px]">
             <span className="text-[7px] text-gray-600 uppercase tracking-[0.4em] font-mono">Vision_Protocol</span>
             <div className="h-[48px] w-full" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4 opacity-30"
      >
        <div className="w-[1px] h-12 bg-white/20" />
      </motion.div>
    </section>
  );
}
