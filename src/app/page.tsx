'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Philosophy from '@/components/Philosophy';
import Workshop from '@/components/Workshop';
import Production from '@/components/Production';
import Service from '@/components/Service';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const Showroom = dynamic(() => import('@/components/Showroom'), { 
  ssr: false,
  loading: () => <div className="h-[70vh] bg-black animate-pulse" /> 
});

const Collections = dynamic(() => import('@/components/Collections'), {
  ssr: true
});

const Engineering = dynamic(() => import('@/components/Engineering'), {
  ssr: true
});

const FinalCTA = dynamic(() => import('@/components/FinalCTA'), {
  ssr: true
});

const LeadModal = dynamic(() => import('@/components/LeadModal'), {
  ssr: false
});

const LegalModal = dynamic(() => import('@/components/LegalModal'), {
  ssr: false
});

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<{ open: boolean; title: string; content: string }>({
    open: false, title: '', content: ''
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openLegal = (type: 'privacy' | 'offer') => {
    const texts = {
      privacy: { title: 'Конфиденциальность', content: 'Политика обработки данных...' },
      offer: { title: 'Публичная оферта', content: 'Условия договора...' }
    };
    setLegalModal({ open: true, ...texts[type] });
  };

  return (
    <main id="main" className="min-h-screen bg-[#050505] selection:bg-[rgb(var(--accent-wood))] selection:text-white">
      <Navbar onConnectClick={openModal} />
      <Hero onOrderClick={openModal} />
      
      <section id="philosophy"><Philosophy /></section>
      <section id="workshop"><Workshop /></section>
      
      {/* 360 & AR Unified Component */}
      <Showroom />
      
      <section id="collections">
        <Collections onDetailClick={openModal} />
      </section>

      <Engineering />
      <FinalCTA onOrderClick={openModal} />
      <Production />
      <Service />
      <Footer onLegalClick={openLegal} />

      <ScrollToTop />
      <LeadModal isOpen={isModalOpen} onClose={closeModal} />
      <LegalModal 
        isOpen={legalModal.open} 
        onClose={() => setLegalModal({ ...legalModal, open: false })} 
        title={legalModal.title} 
        content={legalModal.content} 
      />
    </main>
  );
}
