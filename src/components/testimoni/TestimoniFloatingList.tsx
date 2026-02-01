
import React from 'react';
import { motion } from 'framer-motion';
import type { Testimonial } from '../../hooks/useTestimoni';
import { Star, Image as ImageIcon } from 'lucide-react';

interface TestimoniFloatingListProps {
  items: Testimonial[];
  onItemClick: (item: Testimonial) => void;
}

const TestimoniFloatingList: React.FC<TestimoniFloatingListProps> = ({ items, onItemClick }) => {
  if (!items || items.length === 0) return null;

  // Render tepat 1 kartu untuk 1 testimoni untuk performa maksimal
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {items.map((item, idx) => {
        // Distribusi horizontal berdasarkan index agar merata di layar
        const randomX = ((idx * 211.5) % 80) + 10; // Range 10% - 90%
        
        // Durasi jatuh yang bervariasi agar tidak kaku
        const duration = 25 + ((idx * 31) % 15); 
        
        // Delay staggered agar kartu muncul bertahap
        const delay = idx * 2.5; 
        
        // Variasi ukuran kartu untuk kedalaman visual (depth of field)
        const sizes = [0.8, 1, 0.7, 0.9, 0.85];
        const baseScale = sizes[idx % sizes.length];

        const hasWorks = item.testimonial_works && item.testimonial_works.length > 0;
        const works = item.testimonial_works?.slice(0, 3) || [];

        return (
          <motion.div
            key={item.id}
            initial={{ 
              x: `${randomX}vw`, 
              y: '-40vh',
              opacity: 0,
              rotate: (idx % 2 === 0 ? 8 : -8),
              scale: baseScale
            }}
            animate={{ 
              y: '140vh',
              opacity: [0, 0.8, 0.8, 0],
              rotate: (idx % 2 === 0 ? -8 : 8),
            }}
            transition={{ 
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "linear" 
            }}
            whileHover={{ 
              opacity: 1, 
              scale: baseScale * 1.08, 
              zIndex: 100,
              transition: { duration: 0.2 }
            }}
            onClick={(e) => {
              e.stopPropagation();
              onItemClick(item);
            }}
            className="absolute p-5 rounded-[2.5rem] bg-white/[0.04] backdrop-blur-3xl border border-white/10 w-[260px] md:w-[280px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] cursor-pointer pointer-events-auto group/card"
          >
            {/* Project Highlights Grid */}
            {hasWorks && (
              <div className="grid grid-cols-3 gap-2 mb-4 h-14">
                {works.map((work) => (
                  <div key={work.id} className="relative h-full rounded-xl overflow-hidden bg-black/40 border border-white/5 shadow-inner">
                    <img src={work.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-125" alt="Work" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#c5a059] border border-white/20 flex-shrink-0 shadow-lg">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.client_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-serif font-bold text-sm">
                    {item.client_name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-[10px] font-bold text-white truncate group-hover/card:text-[#c5a059] transition-colors tracking-tight uppercase">{item.client_name}</h4>
                <p className="text-[8px] text-[#c5a059]/50 uppercase tracking-widest truncate">{item.client_title || 'Client'}</p>
              </div>
            </div>
            
            <p className="text-[10px] text-white/50 leading-relaxed italic line-clamp-2 font-light mb-4">
              "{item.message}"
            </p>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex gap-0.5 opacity-40 group-hover/card:opacity-100 transition-opacity">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={8} fill={i < (item.rating || 5) ? "#c5a059" : "none"} className={i < (item.rating || 5) ? "text-[#c5a059]" : "text-white/10"} />
                ))}
              </div>
              {hasWorks && (
                <div className="flex items-center gap-1.5 text-[8px] font-bold text-[#c5a059]/40 uppercase tracking-widest">
                  <ImageIcon size={10} /> {item.testimonial_works?.length} Img
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TestimoniFloatingList;
