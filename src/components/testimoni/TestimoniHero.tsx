
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, PenTool } from 'lucide-react';

interface TestimoniHeroProps {
  onWriteClick: () => void;
}

const TestimoniHero: React.FC<TestimoniHeroProps> = ({ onWriteClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="text-center relative z-20"
    >
      <div className="flex items-center justify-center gap-3 mb-8">
        <Sparkles size={18} className="text-[#c5a059]" />
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#c5a059]">Client Chronicles</span>
      </div>

      <h2 className="text-5xl md:text-8xl font-serif font-bold text-white leading-[0.9] tracking-tighter mb-12">
        VOICES OF <br />
        <span className="italic text-[#c5a059]">TRANSFORMATION.</span>
      </h2>

      <p className="text-white/40 text-sm md:text-lg max-w-xl mx-auto mb-16 leading-relaxed font-light">
        Our legacy is defined by the stories of those we’ve partnered with. 
        Witness the impact of immersive visual storytelling.
      </p>

      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: '#c5a059' }}
        whileTap={{ scale: 0.95 }}
        onClick={onWriteClick}
        className="px-14 py-6 bg-transparent border-2 border-[#c5a059] text-white font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl transition-all flex items-center gap-4 mx-auto group"
      >
        <PenTool size={16} className="group-hover:rotate-12 transition-transform" />
        Write Your Experience
      </motion.button>
    </motion.div>
  );
};

export default TestimoniHero;
