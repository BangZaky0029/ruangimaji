//C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji\src\components\CategoryGallery.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, X, Filter, Camera, Film, ChevronRight } from 'lucide-react';
import { useProjects, useCategories } from '../hooks/useSupabaseData';
import type { Project } from '../hooks/useSupabaseData';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '../lib/videoUtils';

interface CategoryGalleryProps {
  type: 'Photo' | 'Video';
  onBack: () => void;
}

const CategoryGallery: React.FC<CategoryGalleryProps> = ({ type, onBack }) => {
  const [activeType, setActiveType] = useState<'Photo' | 'Video'>(type);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Project | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Fetch projects from Supabase
  const { portfolioData, loading: projectsLoading } = useProjects();
  
  // Fetch master categories from Supabase categories table
  const { categories, loading: categoriesLoading } = useCategories();
  
  const items = portfolioData[activeType] || [];
  
  const filteredItems = selectedCategory 
    ? items.filter(i => i.category.toLowerCase() === selectedCategory.toLowerCase())
    : items;

  const loading = projectsLoading || categoriesLoading;

  // Prevent scroll when filter menu or photo modal is open
  useEffect(() => {
    if (isFilterOpen || selectedPhoto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isFilterOpen, selectedPhoto]);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[160] bg-[#fbfaf8] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#c5a059]/20 border-t-[#c5a059] rounded-full animate-spin" />
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 z-[140] bg-[#fbfaf8] overflow-y-auto overflow-x-hidden pt-28 md:pt-36 pb-20"
    >
      {/* Mobile Filter Bubble (Bottom Right) */}
      <div className="md:hidden fixed bottom-8 right-8 z-[200]">
        <motion.button
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsFilterOpen(true)}
          className="w-16 h-16 bg-[#c5a059] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#c5a059]/40 border border-white/20 backdrop-blur-md"
        >
          <Filter size={24} />
          {selectedCategory && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-[#2d2a26] rounded-full text-[10px] flex items-center justify-center font-bold border border-white/20">1</span>
          )}
        </motion.button>
      </div>

      {/* Full-Screen Filter Overlay for Mobile */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 z-[205] bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[210] w-[85%] bg-[#2d2a26]/85 backdrop-blur-[30px] text-white p-8 overflow-y-auto border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.3)]"
            >
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-[#c5a059]">Refine View</h3>
                <button 
                  onClick={() => setIsFilterOpen(false)} 
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-12">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-6 ml-1">Modality</p>
                  <div className="grid grid-cols-2 gap-4">
                     <button 
                       onClick={() => { setActiveType('Photo'); setSelectedCategory(null); }}
                       className={`py-5 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all ${activeType === 'Photo' ? 'bg-[#c5a059] border-[#c5a059] text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40'}`}
                     >
                       <Camera size={20} /> <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Photos</span>
                     </button>
                     <button 
                       onClick={() => { setActiveType('Video'); setSelectedCategory(null); }}
                       className={`py-5 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all ${activeType === 'Video' ? 'bg-[#c5a059] border-[#c5a059] text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40'}`}
                     >
                       <Film size={20} /> <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Videos</span>
                     </button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-6 ml-1">Collections</p>
                  <div className="flex flex-col gap-3">
                     <button 
                       onClick={() => { setSelectedCategory(null); setIsFilterOpen(false); }}
                       className={`text-left py-5 px-6 rounded-2xl flex justify-between items-center transition-all border ${!selectedCategory ? 'bg-white/15 border-white/20 text-[#c5a059]' : 'bg-white/5 border-white/5 text-white/50'}`}
                     >
                       <span className="text-xl font-serif font-bold italic">All Production</span>
                       {!selectedCategory && <ChevronRight size={18} />}
                     </button>
                     {categories.map(cat => (
                       <button 
                         key={cat} 
                         onClick={() => { setSelectedCategory(cat); setIsFilterOpen(false); }}
                         className={`text-left py-5 px-6 rounded-2xl flex justify-between items-center transition-all border ${selectedCategory === cat ? 'bg-white/15 border-white/20 text-[#c5a059]' : 'bg-white/5 border-white/5 text-white/50'}`}
                       >
                         <span className="text-xl font-serif font-bold italic">{cat}</span>
                         {selectedCategory === cat && <ChevronRight size={18} />}
                       </button>
                     ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div className="w-full md:w-auto">
            <button 
              onClick={onBack} 
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2d2a26]/40 hover:text-[#c5a059] transition-colors mb-4 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
            </button>
            <h2 className="text-4xl md:text-7xl font-serif font-bold text-[#2d2a26]">
              Explore <span className="italic text-[#c5a059]">{activeType}s</span>
            </h2>
          </div>

          <div className="hidden md:flex flex-col items-end gap-6">
            <div className="flex bg-[#f3eee5] p-1.5 rounded-full border border-[#2d2a26]/5">
               <button 
                 onClick={() => { setActiveType('Photo'); setSelectedCategory(null); }}
                 className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeType === 'Photo' ? 'bg-white text-[#c5a059] shadow-sm' : 'text-[#2d2a26]/30 hover:text-[#2d2a26]/60'}`}
               >
                 <Camera size={12} /> Photos
               </button>
               <button 
                 onClick={() => { setActiveType('Video'); setSelectedCategory(null); }}
                 className={`px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeType === 'Video' ? 'bg-white text-[#c5a059] shadow-sm' : 'text-[#2d2a26]/30 hover:text-[#2d2a26]/60'}`}
               >
                 <Film size={12} /> Videos
               </button>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
               <button 
                 onClick={() => setSelectedCategory(null)} 
                 className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${!selectedCategory ? 'bg-[#c5a059] text-white border-[#c5a059] shadow-lg shadow-[#c5a059]/20' : 'border-[#2d2a26]/10 text-[#2d2a26]/40 hover:border-[#c5a059]/40'}`}
               >
                 All
               </button>
               {categories.map(cat => (
                 <button 
                   key={cat} 
                   onClick={() => setSelectedCategory(cat)} 
                   className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-[#c5a059] text-white border-[#c5a059] shadow-lg shadow-[#c5a059]/20' : 'border-[#2d2a26]/10 text-[#2d2a26]/40 hover:border-[#c5a059]/40'}`}
                 >
                   {cat}
                 </button>
               ))}
            </div>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const isPlaying = playingVideoId === item.id;
              const aspectRatioClass = item.aspect_ratio === 'portrait' 
                ? 'aspect-[3/4] md:row-span-2' 
                : 'aspect-[16/10] md:aspect-[16/9]';

              return (
                <motion.div 
                  key={item.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative rounded-[2rem] overflow-hidden group border border-[#2d2a26]/5 bg-black w-full shadow-md ${aspectRatioClass}`}
                >
                  <AnimatePresence mode="wait">
                    {isPlaying && item.video_url ? (
                      <motion.div 
                        key="video-player" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 bg-black flex items-center justify-center w-full h-full"
                      >
                        {isYouTubeUrl(item.video_url) ? (
                          <iframe 
                            src={getYouTubeEmbedUrl(item.video_url, { autoplay: 1, controls: 1 })} 
                            className="w-full h-full absolute inset-0 border-none" 
                            allow="autoplay; fullscreen" 
                          />
                        ) : (
                          <video 
                            src={item.video_url} 
                            className="w-full h-full object-contain bg-black" 
                            autoPlay 
                            controls 
                            playsInline 
                          />
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); setPlayingVideoId(null); }} 
                          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#c5a059] backdrop-blur-md border border-white/20 transition-all shadow-xl"
                        >
                          <X size={18} />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="static-preview" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="w-full h-full cursor-pointer relative" 
                        onClick={() => activeType === 'Video' ? setPlayingVideoId(item.id) : setSelectedPhoto(item)}
                      >
                        <img 
                          src={item.image_url} 
                          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" 
                          alt={item.title} 
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 md:p-10 flex flex-col justify-end transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100">
                           <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest mb-2 block">{item.category}</span>
                           <h3 className="text-xl md:text-3xl font-serif font-bold text-white mb-3 leading-tight">{item.title}</h3>
                           <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/70">
                             {activeType === 'Video' ? <><Play size={12} className="text-[#c5a059]" fill="currentColor" /> Play Production</> : 'View Details'}
                           </div>
                        </div>

                        {activeType === 'Video' && (
                          <div className="absolute inset-0 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                             <div className="w-16 h-16 rounded-full bg-[#c5a059]/90 backdrop-blur-md flex items-center justify-center text-white shadow-2xl border border-white/20">
                               <Play fill="currentColor" size={24} className="ml-1" />
                             </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="py-32 text-center">
            <p className="text-[#2d2a26]/20 font-serif italic text-2xl">No {activeType.toLowerCase()}s found in this category.</p>
          </div>
        )}
      </div>

      {/* Photo Details Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 overflow-y-auto"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className={`relative w-full ${selectedPhoto.aspect_ratio === 'portrait' ? 'max-w-[420px]' : 'max-w-[1000px]'} bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/40 flex flex-col`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Header - Aspect ratio aware */}
              <div className="relative w-full bg-black group overflow-hidden">
                <img 
                  src={selectedPhoto.image_url} 
                  alt={selectedPhoto.title} 
                  className={`w-full h-auto max-h-[70vh] object-contain transition-transform duration-700 group-hover:scale-105`}
                />
                
                {/* Close button - Integrated into image frame */}
                <button 
                  onClick={() => setSelectedPhoto(null)} 
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/30 hover:bg-[#c5a059] text-white flex items-center justify-center backdrop-blur-xl border border-white/20 transition-all shadow-xl z-50"
                >
                  <X size={24} />
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Info Area */}
              <div className="p-8 md:p-12 bg-white">
                <div className="flex flex-col gap-6">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.4em] block">{selectedPhoto.category}</span>
                    <h3 className="text-3xl md:text-5xl font-serif font-bold text-[#2d2a26] leading-none tracking-tight">
                      {selectedPhoto.title}
                    </h3>
                  </div>
                  
                  <div className="h-[1px] w-full bg-[#2d2a26]/5" />
                  
                  <div className="text-[#2d2a26]/60 text-sm md:text-base font-light leading-relaxed">
                    {selectedPhoto.description || "Sebuah karya visual yang menangkap esensi dari momen dan cerita di balik lensa. Bagian dari koleksi portofolio eksklusif Ruang Imaji."}
                  </div>

                  <div className="flex items-center gap-6 pt-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#2d2a26]/20">Client</span>
                      <span className="text-xs font-bold text-[#2d2a26]/80">Portfolio Selection</span>
                    </div>
                    <div className="w-[1px] h-8 bg-[#2d2a26]/5" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#2d2a26]/20">Year</span>
                      <span className="text-xs font-bold text-[#2d2a26]/80">2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CategoryGallery;