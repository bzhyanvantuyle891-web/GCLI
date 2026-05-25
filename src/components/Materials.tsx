'use client';

import { motion } from 'framer-motion';

const materials = [
  {
    title: 'Карагач',
    description: 'Дикая текстура и невероятная прочность. Каждое изделие обладает уникальным рисунком годовых колец.',
    image: 'https://images.unsplash.com/photo-1541459530419-723321557002?q=80&w=1974&auto=format&fit=crop',
    size: 'col-span-1 md:col-span-2 h-[400px]',
  },
  {
    title: 'Дуб',
    description: 'Классика благородства. Мощь и устойчивость к любым испытаниям временем.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2070&auto=format&fit=crop',
    size: 'col-span-1 h-[400px]',
  },
  {
    title: 'Мореный дуб',
    description: 'Эксклюзивный материал с тысячелетней историей. Черный как уголь, твердый как камень.',
    image: 'https://images.unsplash.com/photo-1606101210457-3f9f4b9ca9c3?q=80&w=2070&auto=format&fit=crop',
    size: 'col-span-1 h-[400px]',
  },
  {
    title: 'Ясень',
    description: 'Светлый, гибкий и выразительный. Идеален для минималистичных интерьеров.',
    image: 'https://images.unsplash.com/photo-1596633605700-1efc9b49e277?q=80&w=2070&auto=format&fit=crop',
    size: 'col-span-1 md:col-span-2 h-[400px]',
  },
];

export default function Materials() {
  return (
    <section className="py-20 px-4 md:px-8 bg-[rgb(var(--background))]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[rgb(var(--accent-wood))] mb-4 block">
              Материалы
            </span>
            <h2 className="text-3xl md:text-5xl font-display leading-tight">
              Природа в её <br /> чистом проявлении
            </h2>
          </div>
          <p className="text-gray-500 max-w-sm text-sm font-light leading-relaxed">
            Мы отбираем только те слэбы, которые прошли естественную сушку и обладают выразительным характером.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {materials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="luxury-card h-full flex flex-col group border border-white/5 bg-white/[0.01]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#050505] opacity-60 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-[0.5em] text-white/5 font-bold">Material_Spec</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
              </div>
              
              <div className="p-5 space-y-3 flex-grow">
                <h3 className="text-lg font-bold text-white tracking-tight leading-tight">{item.title}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
