'use client';

import { useEffect } from 'react';

export default function ARShowroom() {
  useEffect(() => {
    import('@google/model-viewer').catch(console.error);
  }, []);

  const activateAR = () => {
    const mv = document.querySelector('model-viewer') as HTMLElement & { activateAR: () => void };
    if (mv && mv.activateAR) {
      mv.activateAR();
    } else {
      alert('AR поддерживается только на мобильных устройствах с Android/iOS');
    }
  };

  return (
    <section id="ar" className="py-24 md:py-32 px-4 md:px-8 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-[rgb(var(--accent-wood))] font-semibold">
              Технологии
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Примерка в интерьере
            </h2>
          </div>
          <p className="text-base text-gray-400 leading-relaxed max-w-md">
            Используйте WebXR (дополненную реальность), чтобы увидеть масштаб и текстуру чабани на вашем столе до начала проектирования.
          </p>
          
          <div className="pt-4">
            <button 
              className="premium-button-outline"
              onClick={activateAR}
            >
              Запустить AR-сессию
            </button>
          </div>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold mt-4">
            * Доступно на устройствах iOS и Android
          </p>
        </div>

        <div className="w-full lg:w-1/2 aspect-[4/3] lg:aspect-square relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: `
                <model-viewer
                  src="https://modelviewer.dev/shared-assets/models/Chair.glb"
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  camera-controls
                  poster="https://images.unsplash.com/photo-1590059132718-5026939989d3?q=80&w=1200&auto=format&fit=crop"
                  shadow-intensity="1"
                  auto-rotate
                  style="width: 100%; height: 100%; background-color: transparent;"
                >
                  <div slot="poster" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.4); font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 600;">
                    Загрузка среды...
                  </div>
                </model-viewer>
              ` 
            }}
            className="w-full h-full"
          />
          <div className="absolute top-6 right-6 px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[9px] uppercase tracking-widest text-white/80 font-semibold pointer-events-none">
            Демонстрация WebXR
          </div>
        </div>

      </div>
    </section>
  );
}
