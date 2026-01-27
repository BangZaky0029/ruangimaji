
//C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji\src\components\CategoryGallery.tsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, X } from 'lucide-react';
import { useProjects } from '../hooks/useSupabaseData';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '../lib/videoUtils';

interface CategoryGalleryProps {
  type: 'Photo' | 'Video';
  onBack: () => void;
}

const CategoryGallery: React.FC<CategoryGalleryProps> = ({ type, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const { portfolioData, loading: projectsLoading } = useProjects();
  
  const items = portfolioData[type] || [];

  const availableCategories = useMemo(() => {
    const cats = items.map(item => item.category);
    return Array.from(new Set(cats)).sort();
  }, [items]);
  
  const filteredItems = selectedCategory 
    ? items.filter(i => i.category === selectedCategory)
    : items;

  if (projectsLoading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[60] bg-[#fbfaf8] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#c5a059]/20 border-t-[#c5a059] rounded-full animate-spin" />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[60] bg-[#fbfaf8] overflow-y-auto pt-24 pb-20 px-6 md:px-12">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#2d2a26]/40 hover:text-[#c5a059] transition-colors mb-4 group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
            </button>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-[#2d2a26]">Explore <span className="italic text-[#c5a059]">{type}s</span></h2>
          </div>
          <div className="flex flex-wrap gap-3">
             <button onClick={() => setSelectedCategory(null)} className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${!selectedCategory ? 'bg-[#c5a059] text-white' : 'border-[#2d2a26]/10 text-[#2d2a26]/40'}`}>All</button>
             {availableCategories.map(cat => (
               <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedCategory === cat ? 'bg-[#c5a059] text-white' : 'border-[#2d2a26]/10 text-[#2d2a26]/40'}`}>{cat}</button>
             ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const isPlaying = playingVideoId === item.id;
              return (
                <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`relative rounded-3xl overflow-hidden group border border-[#2d2a26]/5 bg-black ${item.aspect_ratio === 'portrait' ? 'row-span-2' : 'aspect-[16/10]'}`}>
                  <AnimatePresence mode="wait">
                    {isPlaying && item.video_url ? (
                      <motion.div key="video-player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-10 bg-black">
                        {isYouTubeUrl(item.video_url) ? (
                          <iframe src={getYouTubeEmbedUrl(item.video_url, { autoplay: 1 })} className="w-full h-full" allow="autoplay; fullscreen" />
                        ) : (
                          <video src={item.video_url} className="w-full h-full object-cover" autoPlay controls playsInline />
                        )}
                        <button onClick={() => setPlayingVideoId(null)} className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#c5a059]"><X size={16} /></button>
                      </motion.div>
                    ) : (
                      <motion.div key="static-preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full">
                        <img src={item.image_url} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" alt={item.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2d2a26]/90 via-transparent to-transparent p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all">
                           <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest mb-1">{item.category}</span>
                           <h3 className="text-2xl font-serif font-bold text-white mb-2">{item.title}</h3>
                           <button onClick={() => type === 'Video' && setPlayingVideoId(item.id)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#c5a059] hover:text-white">
                             {type === 'Video' ? <><Play size={12} fill="currentColor" /> Play Cinema</> : 'View Details'}
                           </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CategoryGallery;
