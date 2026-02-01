
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import TestimoniHero from './TestimoniHero';
import TestimoniForm from './TestimoniForm';
import TestimoniFloatingList from './TestimoniFloatingList';
import TestimoniPopUp from './TestimoniPopUp';
import { useTestimoni } from '../../hooks/useTestimoni';
import type { Testimonial } from '../../hooks/useTestimoni';

const TestimoniSection: React.FC = () => {
  const [view, setView] = useState<'hero' | 'form'>('hero');
  // Added state to handle the selected testimonial from floating list
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const { testimonials, submitTestimonial } = useTestimoni();

  return (
    <section id="testimonials" className="relative min-h-screen bg-[#2d2a26] flex items-center justify-center overflow-hidden py-32">
      
      {/* Dynamic Background branding */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-[0.03] flex flex-col justify-around items-center">
        <h2 className="text-[30vw] font-black uppercase tracking-tighter leading-none -rotate-12 translate-x-[-15%] font-serif italic">VOICE</h2>
        <h2 className="text-[25vw] font-black uppercase tracking-tighter leading-none rotate-12 translate-x-[20%] font-serif italic">LEGACY</h2>
      </div>

      {/* Floating Testimonials Layer */}
      <AnimatePresence>
        {view === 'hero' && testimonials.length > 0 && (
          // Fix: Added required onItemClick prop to TestimoniFloatingList
          <TestimoniFloatingList 
            items={testimonials} 
            onItemClick={(item) => setSelectedTestimonial(item)} 
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 relative z-30">
        <AnimatePresence mode="wait">
          {view === 'hero' ? (
            <TestimoniHero key="hero" onWriteClick={() => setView('form')} />
          ) : (
            <TestimoniForm 
              key="form" 
              onClose={() => setView('hero')} 
              onSubmit={submitTestimonial}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Fix: Added TestimoniPopUp to display details when a floating item is clicked */}
      <TestimoniPopUp 
        item={selectedTestimonial} 
        onClose={() => setSelectedTestimonial(null)} 
      />

      {/* Luxury light leaks */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c5a059]/5 rounded-full blur-[150px] pointer-events-none -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c5a059]/5 rounded-full blur-[120px] pointer-events-none -ml-40 -mb-40" />
    </section>
  );
};

export default TestimoniSection;
