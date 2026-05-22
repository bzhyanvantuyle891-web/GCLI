'use client';

import Script from 'next/script';

export default function ARShowroom() {
  return (
    <section id="ar" className="py-24 md:py-32 px-4 md:px-8 bg-[#0a0a0a]">
      {/* 
        Bulletproof CDN load for model-viewer. 
        Bypasses any Next.js/Turbopack bundling issues with Three.js peer dependencies.
      */}
      <Script 
        type="module" 
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" 
      />

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
          
          <div className="space-y-6 text-gray-400 leading-relaxed max-w-md text-sm md:text-base">
            <p>
              Используйте WebXR (дополненную реальность), чтобы увидеть масштаб и текстуру чабани на вашем столе до начала проектирования.
            </p>
            <p className="hidden md:block text-[rgb(var(--accent-wood))] border-l-2 border-[rgb(var(--accent-wood))] pl-4">
              <strong>Для пользователей ПК:</strong> Отсканируйте эту страницу с вашего смартфона (iOS или Android), чтобы активировать функцию дополненной реальности.
            </p>
            <p className="md:hidden text-gray-300">
              Нажмите кнопку <strong>«Запустить AR»</strong> на 3D-модели ниже, чтобы разместить объект в вашей комнате.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 aspect-[4/3] lg:aspect-square relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: `
                <model-viewer
                  src="https://modelviewer.dev/shared-assets/models/Chair.glb"
                  ios-src="https://modelviewer.dev/shared-assets/models/Chair.usdz"
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  camera-controls
                  poster="https://images.unsplash.com/photo-1590059132718-5026939989d3?q=80&w=1200&auto=format&fit=crop"
                  shadow-intensity="1"
                  auto-rotate
                  style="width: 100%; height: 100%; background-color: transparent;"
                >
                  <button slot="ar-button" style="position: absolute; bottom: 24px; right: 24px; background-color: #f5f5f5; color: #080808; border: none; border-radius: 4px; padding: 12px 24px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; font-size: 11px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); transition: all 0.3s ease;">
                    Запустить AR
                  </button>
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
