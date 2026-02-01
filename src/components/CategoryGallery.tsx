
//C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji\src\components\CategoryGallery.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, X, Filter, Camera, Film, ChevronRight, ChevronLeft, Plus } from 'lucide-react';
import { useProjects, useCategories } from '../hooks/useSupabaseData';
import type { Project } from '../hooks/useSupabaseData';
import VideoEmbed from './VideoEmbed';

interface CategoryGalleryProps {
  type: 'Photo' | 'Video';
  onBack: () => void;
}

const CategoryGallery: React.FC<CategoryGalleryProps> = ({ type, onBack }) => {
  const [activeType, setActiveType] = useState<'Photo' | 'Video'>(type);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Project | null>(null);
  const [direction, setDirection] = useState(0); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(7); 
  
  const { portfolioData, loading: projectsLoading } = useProjects();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const items = portfolioData[activeType] || [];
  
  const filteredItems = useMemo(() => {
    return selectedCategory 
      ? items.filter(i => i.category.toLowerCase() === selectedCategory.toLowerCase())
      : items;
  }, [items, selectedCategory]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const loading = projectsLoading || categoriesLoading;

  const currentItemIndex = useMemo(() => {
    if (!selectedItem) return -1;
    return filteredItems.findIndex(item => item.id === selectedItem.id);
  }, [selectedItem, filteredItems]);

  const goToNext = () => {
    if (currentItemIndex < filteredItems.length - 1) {
      setDirection(1);
      setSelectedItem(filteredItems[currentItemIndex + 1]);
    }
  };

  const goToPrev = () => {
    if (currentItemIndex > 0) {
      setDirection(-1);
      setSelectedItem(filteredItems[currentItemIndex - 1]);
    }
  };

  useEffect(() => {
    setVisibleCount(7);
  }, [selectedCategory, activeType]);

  useEffect(() => {
    if (isFilterOpen || selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isFilterOpen, selectedItem]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedItem) {
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'ArrowLeft') goToPrev();
        if (e.key === 'Escape') setSelectedItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, currentItemIndex, filteredItems]);

  const handleSeeMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const getGridItemClasses = (index: number) => {
    const mod = index % 12;
    switch (mod) {
      case 0: return "lg:col-span-2 lg:row-span-1 aspect-[16/9]";
      case 1: return "lg:col-span-1 lg:row-span-2 aspect-[9/16]";
      case 2: return "lg:col-span-1 lg:row-span-1 aspect-[16/9]";
      case 3: return "lg:col-span-1 lg:row-span-1 aspect-[16/9]";
      case 4: return "lg:col-span-1 lg:row-span-2 aspect-[9/16]";
      case 5: return "lg:col-span-2 lg:row-span-1 aspect-[16/9]";
      case 6: return "lg:col-span-1 lg:row-span-1 aspect-[16/9]";
      case 7: return "lg:col-span-1 lg:row-span-1 aspect-[16/9]";
      case 8: return "lg:col-span-1 lg:row-span-2 aspect-[9/16]";
      case 9: return "lg:col-span-2 lg:row-span-1 aspect-[16/9]";
      case 10: return "lg:col-span-1 lg:row-span-1 aspect-[16/9]";
      default: return "lg:col-span-1 lg:row-span-1 aspect-[16/9]";
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[160] bg-[#fbfaf8] flex items-center justify-center">
        <motion.img 
          src="/imajiLogo.png" 
          className="w-20 h-20" 
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1, 0.95] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
        />
      </motion.div>
    );
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.25 }
    })
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 z-[140] bg-[#fbfaf8] overflow-y-auto overflow-x-hidden pt-28 md:pt-36 pb-32"
    >
      <div className="md:hidden fixed bottom-8 right-8 z-[200]">
        <motion.button
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsFilterOpen(true)}
          className="w-16 h-16 bg-[#c5a059] text-white rounded-full flex items-center justify-center shadow-2xl border border-white/20 backdrop-blur-md"
        >
          <Filter size={24} />
          {selectedCategory && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-[#2d2a26] rounded-full text-[10px] flex items-center justify-center font-bold border border-white/20">1</span>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 z-[205] bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 z-[210] w-[85%] bg-[#2d2a26]/85 backdrop-blur-[30px] text-white p-8 overflow-y-auto border-l border-white/10"
            >
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-[#c5a059]">Refine View</h3>
                <button onClick={() => setIsFilterOpen(false)} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"><X size={24} /></button>
              </div>
              <div className="space-y-12">
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => { setActiveType('Photo'); setSelectedCategory(null); }} className={`py-5 rounded-2xl flex flex-col items-center gap-2 border transition-all ${activeType === 'Photo' ? 'bg-[#c5a059] border-[#c5a059] text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40'}`}><Camera size={20} /><span className="text-[10px] font-bold uppercase tracking-widest mt-1">Photos</span></button>
                  <button onClick={() => { setActiveType('Video'); setSelectedCategory(null); }} className={`py-5 rounded-2xl flex flex-col items-center gap-2 border transition-all ${activeType === 'Video' ? 'bg-[#c5a059] border-[#c5a059] text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40'}`}><Film size={20} /><span className="text-[10px] font-bold uppercase tracking-widest mt-1">Videos</span></button>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => { setSelectedCategory(null); setIsFilterOpen(false); }} className={`text-left py-5 px-6 rounded-2xl flex justify-between items-center transition-all border ${!selectedCategory ? 'bg-white/15 border-white/20 text-[#c5a059]' : 'bg-white/5 border-white/5 text-white/50'}`}><span className="text-xl font-serif font-bold italic">All Production</span>{!selectedCategory && <ChevronRight size={18} />}</button>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => { setSelectedCategory(cat); setIsFilterOpen(false); }} className={`text-left py-5 px-6 rounded-2xl flex justify-between items-center transition-all border ${selectedCategory === cat ? 'bg-white/15 border-white/20 text-[#c5a059]' : 'bg-white/5 border-white/5 text-white/50'}`}><span className="text-xl font-serif font-bold italic">{cat}</span>{selectedCategory === cat && <ChevronRight size={18} />}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div className="w-full md:w-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2d2a26]/40 hover:text-[#c5a059] transition-colors mb-4 group"><ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home</button>
            <h2 className="text-4xl md:text-7xl font-serif font-bold text-[#2d2a26]">Explore <span className="italic text-[#c5a059]">{activeType}s</span></h2>
          </div>
          <div className="hidden md:flex flex-col items-end gap-6">
            <div className="flex bg-[#f3eee5] p-1.5 rounded-full border border-[#2d2a26]/5">
              <button onClick={() => { setActiveType('Photo'); setSelectedCategory(null); }} className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeType === 'Photo' ? 'bg-white text-[#c5a059] shadow-sm' : 'text-[#2d2a26]/30 hover:text-[#2d2a26]/60'}`}><Camera size={12} /> Photos</button>
              <button onClick={() => { setActiveType('Video'); setSelectedCategory(null); }} className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeType === 'Video' ? 'bg-white text-[#c5a059] shadow-sm' : 'text-[#2d2a26]/30 hover:text-[#2d2a26]/60'}`}><Film size={12} /> Videos</button>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button onClick={() => setSelectedCategory(null)} className={`px-5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${!selectedCategory ? 'bg-[#c5a059] text-white border-[#c5a059] shadow-lg shadow-[#c5a059]/20' : 'border-[#2d2a26]/10 text-[#2d2a26]/40 hover:border-[#c5a059]/40'}`}>All</button>
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-[#c5a059] text-white border-[#c5a059] shadow-lg shadow-[#c5a059]/20' : 'border-[#2d2a26]/10 text-[#2d2a26]/40 hover:border-[#c5a059]/40'}`}>{cat}</button>
              ))}
            </div>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 grid-auto-flow-dense">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, index) => {
              const gridClasses = getGridItemClasses(index);

              return (
                <motion.div 
                  key={item.id} layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.5 }}
                  className={`relative rounded-[1.2rem] md:rounded-[2rem] overflow-hidden group border border-[#2d2a26]/5 bg-black shadow-lg ${gridClasses}`}
                >
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    className="w-full h-full cursor-pointer relative" 
                    onClick={() => {
                      setDirection(0);
                      setSelectedItem(item);
                    }}
                  >
                    <img src={item.image_url} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" alt={item.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent p-6 md:p-8 flex flex-col justify-end transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100">
                       <span className="text-[9px] font-bold text-[#c5a059] uppercase tracking-widest mb-1.5 block">{item.category}</span>
                       <h3 className="text-lg md:text-2xl font-serif font-bold text-white mb-2 leading-tight">{item.title}</h3>
                       <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-white/60">
                         {activeType === 'Video' ? <><Play size={10} className="text-[#c5a059]" fill="currentColor" /> Play Production</> : 'View Project'}
                       </div>
                    </div>
                    {activeType === 'Video' && (
                      <div className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                         <div className="w-14 h-14 rounded-full bg-[#c5a059]/90 backdrop-blur-md flex items-center justify-center text-white shadow-2xl border border-white/20"><Play fill="currentColor" size={20} className="ml-0.5" /></div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length > visibleCount && (
          <div className="mt-20 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#c5a059', color: '#fff' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSeeMore}
              className="px-10 py-4 border-2 border-[#c5a059] text-[#c5a059] font-bold uppercase tracking-[0.3em] text-[9px] rounded-full flex items-center gap-3 transition-all"
            >
              See More Work <Plus size={14} />
            </motion.button>
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="py-32 text-center">
            <p className="text-[#2d2a26]/20 font-serif italic text-2xl">No {activeType.toLowerCase()}s found in this category.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-0 md:p-10"
            onClick={() => setSelectedItem(null)}
          >
            {/* Navigasi Samping Desktop */}
            <div className="hidden md:flex absolute inset-x-10 top-1/2 -translate-y-1/2 justify-between z-[320] pointer-events-none">
              <button 
                onClick={(e) => { e.stopPropagation(); goToPrev(); }} 
                disabled={currentItemIndex === 0}
                className={`w-16 h-16 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#2d2a26] border border-white/20 flex items-center justify-center transition-all backdrop-blur-md pointer-events-auto ${currentItemIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); goToNext(); }} 
                disabled={currentItemIndex === filteredItems.length - 1}
                className={`w-16 h-16 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#2d2a26] border border-white/20 flex items-center justify-center transition-all backdrop-blur-md pointer-events-auto ${currentItemIndex === filteredItems.length - 1 ? 'opacity-0' : 'opacity-100'}`}
              >
                <ChevronRight size={32} />
              </button>
            </div>

            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[320] text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] bg-black/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
              {currentItemIndex + 1} / {filteredItems.length}
            </div>

            <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-[#c5a059] text-white flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-xl z-[330]"><X size={24} /></button>

            <div className="w-full h-full flex items-center justify-center p-4">
              <div 
                className={`relative w-full ${selectedItem.aspect_ratio === 'portrait' ? 'max-w-[420px]' : 'max-w-[1000px]'} bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full h-[50vh] md:h-[65vh] bg-black overflow-hidden select-none">
                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div 
                      key={selectedItem.id}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 200, damping: 35, mass: 1 },
                        opacity: { duration: 0.35 },
                        scale: { duration: 0.4, ease: "easeOut" }
                      }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.4}
                      onDragEnd={(_e, { offset, velocity }) => {
                        const swipe = Math.abs(offset.x) * velocity.x;
                        if (swipe < -10000 || offset.x < -80) {
                          goToNext();
                        } else if (swipe > 10000 || offset.x > 80) {
                          goToPrev();
                        }
                      }}
                      className="absolute inset-0 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                    >
                      {selectedItem.type === 'Video' && selectedItem.video_url ? (
                        <div className="w-full h-full pointer-events-auto">
                           <VideoEmbed url={selectedItem.video_url} />
                        </div>
                      ) : (
                        <img 
                          src={selectedItem.image_url} 
                          alt={selectedItem.title} 
                          className="w-full h-full object-contain pointer-events-none" 
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
                
                <div className="p-8 md:p-12 bg-white flex flex-col gap-6">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={`info-${selectedItem.id}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-6"
                    >
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.4em] block">{selectedItem.category}</span>
                        <h3 className="text-2xl md:text-5xl font-serif font-bold text-[#2d2a26] leading-none tracking-tight">{selectedItem.title}</h3>
                      </div>
                      <div className="h-[1px] w-full bg-[#2d2a26]/5" />
                      <div className="text-[#2d2a26]/60 text-sm md:text-base font-light leading-relaxed line-clamp-3 md:line-clamp-none">
                        {selectedItem.description || "Visual narratives captured with precision and cinematic depth. Part of the exclusive collection by Ruang Imaji."}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CategoryGallery;
