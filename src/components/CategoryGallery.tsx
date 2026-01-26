
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Layers } from 'lucide-react';
import { PORTFOLIO_DATA, CATEGORIES } from '../constants';

interface CategoryGalleryProps {
  type: 'Photo' | 'Video';
  onBack: () => void;
}

const CategoryGallery: React.FC<CategoryGalleryProps> = ({ type, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const items = PORTFOLIO_DATA[type];
  
  const filteredItems = selectedCategory 
    ? items.filter(i => i.category === selectedCategory)
    : items;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-[#fbfaf8] overflow-y-auto pt-24 pb-20 px-6 md:px-12"
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#2d2a26]/40 hover:text-[#c5a059] transition-colors mb-4 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
            </button>
            <h2 className="text-5xl md:text-7xl font-serif font-bold flex items-center gap-4 text-[#2d2a26]">
              Explore <span className="italic text-[#c5a059]">{type}s</span>
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
             <button 
               onClick={() => setSelectedCategory(null)}
               className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${!selectedCategory ? 'bg-[#c5a059] text-white border-[#c5a059]' : 'border-[#2d2a26]/10 text-[#2d2a26]/40 hover:border-[#c5a059]'}`}
             >
               All
             </button>
             {CATEGORIES.filter(cat => items.some(i => i.category === cat)).map(cat => (
               <button 
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedCategory === cat ? 'bg-[#c5a059] text-white border-[#c5a059]' : 'border-[#2d2a26]/10 text-[#2d2a26]/40 hover:border-[#c5a059]'}`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className={`relative rounded-3xl overflow-hidden group border border-[#2d2a26]/5 bg-white shadow-sm ${item.aspectRatio === 'portrait' ? 'row-span-2' : 'aspect-[16/10]'}`}
              >
                <img src={item.imageUrl} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" alt={item.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d2a26]/90 via-transparent to-transparent p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500">
                   <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest mb-1">{item.category}</span>
                   <h3 className="text-2xl font-serif font-bold text-white mb-2">{item.title}</h3>
                   <p className="text-xs text-white/60 mb-6 leading-relaxed line-clamp-2">{item.description}</p>
                   <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                     {type === 'Video' ? <><Play size={12} fill="currentColor" /> Play Cinema</> : 'View Details'}
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredItems.length === 0 && (
          <div className="py-40 text-center">
            <Layers className="mx-auto text-[#c5a059]/10 mb-6" size={80} />
            <p className="text-[#2d2a26]/20 uppercase tracking-[0.4em] font-bold">No results found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryGallery;
