
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Filter, ArrowRight, Loader2, Plus, MessageSquare } from 'lucide-react';
import type { Testimonial } from '../../hooks/useTestimoni';

interface TestimoniGalleryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  items: Testimonial[];
  onItemClick: (item: Testimonial) => void;
  isLoading?: boolean;
}

const TestimoniGalleryOverlay: React.FC<TestimoniGalleryOverlayProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onItemClick,
  isLoading = false 
}) => {
  const [filter, setFilter] = useState<number | 'All'>('All');
  const [visibleCount, setVisibleCount] = useState(4);

  const filteredItems = useMemo(() => {
    let result = filter === 'All' ? items : items.filter(t => t.rating === filter);
    return result;
  }, [items, filter]);

  const displayedItems = filteredItems.slice(0, visibleCount);

  const handleFilterChange = (val: number | 'All') => {
    setFilter(val);
    setVisibleCount(4); 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-[#2d2a26]/95 backdrop-blur-3xl flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-8 md:px-12 md:py-10 border-b border-white/5 flex justify-between items-center bg-transparent">
            <div>
              <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.4em] mb-2 block">Voices of Imaji</span>
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-white leading-none">Client Chronicles</h2>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#c5a059] transition-all shadow-xl"
            >
              <X size={24} />
            </button>
          </div>

          {/* Filters */}
          <div className="px-6 py-6 md:px-12 border-b border-white/5 overflow-x-auto no-scrollbar flex items-center gap-3">
             <div className="flex items-center gap-3 mr-6 text-white/40">
                <Filter size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Filter by:</span>
             </div>
             <button 
               onClick={() => handleFilterChange('All')}
               className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${filter === 'All' ? 'bg-[#c5a059] border-[#c5a059] text-white shadow-lg shadow-[#c5a059]/20' : 'border-white/10 text-white/40 hover:border-white/20'}`}
             >
               All Stories
             </button>
             {[5, 4, 3].map(rating => (
               <button 
                key={rating}
                onClick={() => handleFilterChange(rating)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border flex items-center gap-2 ${filter === rating ? 'bg-[#c5a059] border-[#c5a059] text-white shadow-lg shadow-[#c5a059]/20' : 'border-white/10 text-white/40 hover:border-white/20'}`}
               >
                 {rating} <Star size={10} fill="currentColor" />
               </button>
             ))}
          </div>

          {/* Content Grid */}
          <div className="flex-grow overflow-y-auto p-6 md:p-12 custom-scrollbar">
            <div className="container mx-auto max-w-6xl">
              {isLoading ? (
                // State Saat Benar-benar Loading
                <div className="py-32 text-center">
                  <Loader2 className="w-12 h-12 text-[#c5a059] animate-spin mx-auto mb-6" />
                  <p className="text-white/40 font-serif italic text-2xl">Menganalisis cerita klien...</p>
                </div>
              ) : displayedItems.length > 0 ? (
                // State Saat Data Ada
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  {displayedItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => onItemClick(item)}
                      className="p-8 md:p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-[#c5a059]/40 hover:bg-white/[0.07] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#c5a059] border-2 border-white/10 shadow-lg">
                              {item.image_url ? (
                                <img src={item.image_url} alt={item.client_name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">{item.client_name.charAt(0)}</div>
                              )}
                            </div>
                            <div>
                              <h4 className="text-lg font-serif font-bold text-white group-hover:text-[#c5a059] transition-colors">{item.client_name}</h4>
                              <p className="text-[10px] font-bold text-[#c5a059]/60 uppercase tracking-widest">{item.client_title || 'Collaborator'}</p>
                            </div>
                         </div>
                         <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={12} fill={i < (item.rating || 5) ? "#c5a059" : "none"} className={i < (item.rating || 5) ? "text-[#c5a059]" : "text-white/10"} />
                            ))}
                         </div>
                      </div>
                      <p className="text-white/50 text-base leading-relaxed font-light italic mb-8">
                        "{item.message}"
                      </p>
                      <div className="flex justify-end">
                         <span className="text-[9px] font-bold uppercase tracking-widest text-white/20 group-hover:text-[#c5a059] transition-colors flex items-center gap-2">View Full Story <ArrowRight size={12} /></span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                // State Saat Data Kosong (Tanpa Spinner Berputar Terus)
                <div className="py-32 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                    <MessageSquare className="text-white/10 w-10 h-10" />
                  </div>
                  <p className="text-white/20 font-serif italic text-2xl mb-2">Belum ada cerita untuk rating ini.</p>
                  <p className="text-white/10 text-xs uppercase tracking-widest">Jadilah yang pertama memberikan ulasan.</p>
                </div>
              )}

              {!isLoading && filteredItems.length > visibleCount && (
                <div className="mt-16 flex justify-center pb-12">
                   <motion.button
                     whileHover={{ scale: 1.05, y: -2 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setVisibleCount(prev => prev + 4)}
                     className="px-12 py-5 border-2 border-[#c5a059] text-[#c5a059] font-bold uppercase tracking-[0.4em] text-[10px] rounded-full flex items-center gap-4 hover:bg-[#c5a059] hover:text-white transition-all shadow-2xl"
                   >
                     Load More Stories <Plus size={16} />
                   </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TestimoniGalleryOverlay;
