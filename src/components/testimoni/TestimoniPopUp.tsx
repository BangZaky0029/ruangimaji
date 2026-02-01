
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Quote, Star, Camera, ChevronRight } from 'lucide-react';
import type { Testimonial } from '../../hooks/useTestimoni';

interface TestimoniPopUpProps {
  item: Testimonial | null;
  onClose: () => void;
}

const TestimoniPopUp: React.FC<TestimoniPopUpProps> = ({ item, onClose }) => {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[1000] bg-[#2d2a26]/95 backdrop-blur-2xl flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-[3.5rem] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-[#f3eee5] flex items-center justify-center text-[#2d2a26] hover:bg-[#c5a059] hover:text-white transition-all z-20 shadow-sm"
            >
              <X size={20} />
            </button>

            <div className="flex-grow overflow-y-auto custom-scrollbar">
              <div className="p-8 md:p-16">
                <div className="flex flex-col items-center text-center mb-10">
                  <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden bg-[#c5a059]/10 border-4 border-white shadow-xl mb-6">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.client_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#c5a059] font-bold text-3xl font-serif">
                        {item.client_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#2d2a26] leading-none mb-3 tracking-tight">{item.client_name}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c5a059] mb-4">{item.client_title || 'Brand Visionary'}</p>
                  
                  <div className="flex gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < (item.rating || 5) ? "#c5a059" : "none"} className={i < (item.rating || 5) ? "text-[#c5a059]" : "text-[#2d2a26]/10"} />
                    ))}
                  </div>
                </div>

                <div className="relative mb-14 px-4">
                  <Quote size={50} className="text-[#c5a059]/10 absolute -top-8 -left-2 -rotate-12" />
                  <p className="text-[#2d2a26]/80 text-lg md:text-xl leading-relaxed italic font-light text-center relative z-10">
                    "{item.message}"
                  </p>
                  <Quote size={50} className="text-[#c5a059]/10 absolute -bottom-8 -right-2 rotate-12" />
                </div>

                {/* Testimonial Works Gallery */}
                {item.testimonial_works && item.testimonial_works.length > 0 && (
                  <div className="mt-12 space-y-6">
                    <div className="flex items-center gap-3 border-b border-[#2d2a26]/5 pb-4">
                      <Camera size={16} className="text-[#c5a059]" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2d2a26]/40">Production Highlights</span>
                    </div>
                    <div className={`grid gap-4 ${item.testimonial_works.length === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
                      {item.testimonial_works.map((work) => (
                        <motion.div 
                          key={work.id}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="aspect-[3/4] rounded-3xl overflow-hidden border border-[#2d2a26]/5 shadow-lg bg-[#f3eee5]"
                        >
                          <img src={work.image_url} className="w-full h-full object-cover" alt="Client work" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-[#f3eee5]/50 py-6 text-center border-t border-[#2d2a26]/5 shrink-0">
              <div className="flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-[#2d2a26]/30">
                Ruang Imaji <ChevronRight size={10} /> Client Success Story
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TestimoniPopUp;
