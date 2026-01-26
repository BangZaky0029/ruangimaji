
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {PanInfo} from 'framer-motion';
import { 
  Camera, 
  Film, 
  Play, 
  X,
  ChevronLeft,
  ChevronRight,
  LayoutGrid
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../constants';
import type { PortfolioItem } from '../constants';

const ARC_RADIUS = 700;
const ITEM_OFFSET = 18;
const SWIPE_THRESHOLD = 40; // Pixels to trigger a slide change

interface ArcItemProps {
  item: PortfolioItem;
  index: number;
  activeIndex: number;
  side: 'left' | 'right';
  onClick: () => void;
  onPlay?: (url: string, aspect: 'landscape' | 'portrait') => void;
}

const ArcItem: React.FC<ArcItemProps> = ({ item, index, activeIndex, side, onClick, onPlay }) => {
  const relativeIndex = index - activeIndex;
  const angle = relativeIndex * ITEM_OFFSET;
  const angleRad = (angle * Math.PI) / 180;
  const x = Math.cos(angleRad) * ARC_RADIUS - ARC_RADIUS;
  const y = Math.sin(angleRad) * ARC_RADIUS;
  const opacity = Math.max(0, 1 - Math.abs(relativeIndex) * 0.4);
  const scale = activeIndex === index ? 1 : 0.75 - Math.abs(relativeIndex) * 0.05;
  const isCenter = activeIndex === index;

  return (
    <motion.div
      initial={false}
      animate={{
        x: side === 'left' ? x + 100 : -(x + 100),
        y: y,
        opacity: opacity,
        scale: scale,
        zIndex: isCenter ? 30 : 20 - Math.abs(relativeIndex),
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      onClick={onClick}
      className={`absolute cursor-pointer flex flex-col items-center pointer-events-auto ${side === 'left' ? 'left-0' : 'right-0'}`}
      style={{ touchAction: 'pan-y' }} // Ensure vertical scroll is prioritized
    >
      <div className={`relative group overflow-hidden rounded-2xl transition-all duration-500 border-2 ${isCenter ? 'border-[#c5a059] shadow-2xl shadow-[#c5a059]/20 w-[240px] md:w-[320px]' : 'border-[#2d2a26]/5 w-[160px] md:w-[200px]'} aspect-square md:aspect-[4/5] bg-white`}>
        <img src={item.imageUrl} className={`w-full h-full object-cover transition-all duration-1000 ${isCenter ? 'grayscale-0' : 'grayscale opacity-40'}`} alt={item.title} />
        
        {isCenter && item.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <motion.button 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={(e) => { e.stopPropagation(); onPlay?.(item.videoUrl!, item.aspectRatio); }} 
              className="pointer-events-auto w-16 h-16 md:w-20 md:h-20 bg-[#c5a059]/90 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-2xl border border-white/20"
            >
              <Play fill="currentColor" size={28} className="ml-1" />
            </motion.button>
          </div>
        )}

        {isCenter && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-gradient-to-t from-[#2d2a26] via-[#2d2a26]/10 to-transparent flex flex-col justify-end p-6">
            <h4 className="text-xl font-bold font-serif leading-tight text-white">{item.title}</h4>
            <p className="text-[10px] uppercase tracking-widest text-[#c5a059] mt-1 font-bold">{item.category}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

interface WorkSectionProps {
  onSeeAll: (type: 'Photo' | 'Video') => void;
}

const WorkSection: React.FC<WorkSectionProps> = ({ onSeeAll }) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'Photo' | 'Video'>('Photo');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoAspect, setVideoAspect] = useState<'landscape' | 'portrait'>('landscape');

  const photos = PORTFOLIO_DATA.Photo;
  const videos = PORTFOLIO_DATA.Video;
  const currentBackground = viewMode === 'Video' ? videos[activeVideoIdx].imageUrl : photos[activePhotoIdx].imageUrl;

  const handleDragEnd = (event: any, info: PanInfo) => {
    // Only trigger if horizontal intent is clearly stronger than vertical intent
    const isHorizontal = Math.abs(info.offset.x) > Math.abs(info.offset.y);
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD && isHorizontal) {
      if (info.offset.x > 0) {
        // Swiped Right -> Previous
        if (viewMode === 'Video') setActiveVideoIdx(p => Math.max(0, p - 1));
        else setActivePhotoIdx(p => Math.max(0, p - 1));
      } else {
        // Swiped Left -> Next
        if (viewMode === 'Video') setActiveVideoIdx(p => Math.min(videos.length - 1, p + 1));
        else setActivePhotoIdx(p => Math.min(photos.length - 1, p + 1));
      }
    }
  };

  return (
    <section id="work" className="relative h-screen bg-[#fbfaf8] overflow-hidden flex items-center justify-center">
      {/* Immersive Background - No pointer events to allow background scrolling */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentBackground} 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 0.45 }} 
          exit={{ opacity: 0 }} 
          transition={{ duration: 1.5 }} 
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <motion.img 
            src={currentBackground} 
            initial={{ scale: 1.4 }}
            animate={{ scale: 1.2 }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="w-full h-full object-cover blur-[45px]" 
            alt="bg blur" 
          />
        </motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-6 md:px-24 relative z-10 flex h-full items-center justify-center pointer-events-none">
        
        {/* Sidebar Navigation - Moves based on viewMode */}
        <div className="absolute inset-y-0 left-6 right-6 md:left-12 md:right-12 z-50 flex items-center pointer-events-none">
          <motion.div 
            layout
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`pointer-events-auto flex flex-col items-center gap-14 bg-white/20 backdrop-blur-3xl py-12 px-5 rounded-full border border-white/30 shadow-2xl ${viewMode === 'Photo' ? 'mr-auto' : 'ml-auto'}`}
          >
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setViewMode('Photo')} 
              className={`transition-all duration-500 flex flex-col items-center gap-1 ${viewMode === 'Photo' ? 'text-[#c5a059]' : 'text-[#2d2a26]/40 hover:text-[#2d2a26]'}`}
            >
              <Camera size={24} />
              <span className="text-[6px] font-bold tracking-widest mt-1 uppercase">Photo</span>
            </motion.button>

            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => onSeeAll(viewMode)} 
              className="transition-all duration-500 flex flex-col items-center gap-1 text-[#2d2a26]/40 hover:text-[#c5a059]"
            >
              <LayoutGrid size={24} />
              <span className="text-[6px] font-bold tracking-widest mt-1 uppercase">Browse</span>
            </motion.button>

            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setViewMode('Video')} 
              className={`transition-all duration-500 flex flex-col items-center gap-1 ${viewMode === 'Video' ? 'text-[#c5a059]' : 'text-[#2d2a26]/40 hover:text-[#2d2a26]'}`}
            >
              <Film size={24} />
              <span className="text-[6px] font-bold tracking-widest mt-1 uppercase">Video</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Main Interactive Area - Only images/videos intercept horizontal drag, pan-y allows background scroll */}
        <motion.div 
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="relative w-full h-full flex items-center justify-between pointer-events-auto cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {/* Photo Side */}
          <motion.div 
            animate={{ 
              x: viewMode === 'Photo' ? (window.innerWidth < 768 ? '0%' : '25%') : '-100%', 
              opacity: viewMode === 'Video' ? 0 : 1 
            }} 
            className="relative w-full md:w-1/2 h-full flex items-center justify-center md:justify-start pointer-events-none"
          >
             {photos.map((item, i) => (
               <ArcItem key={item.id} item={item} index={i} activeIndex={activePhotoIdx} side="left" onClick={() => setActivePhotoIdx(i)} />
             ))}
          </motion.div>

          {/* Video Side */}
          <motion.div 
            animate={{ 
              x: viewMode === 'Video' ? (window.innerWidth < 768 ? '0%' : '-25%') : '100%', 
              opacity: viewMode === 'Photo' ? 0 : 1 
            }} 
            className="relative w-full md:w-1/2 h-full flex items-center justify-center md:justify-end pointer-events-none"
          >
             {videos.map((item, i) => (
               <ArcItem key={item.id} item={item} index={i} activeIndex={activeVideoIdx} side="right" onClick={() => setActiveVideoIdx(i)} onPlay={(u, a) => { setSelectedVideo(u); setVideoAspect(a); }} />
             ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Navigation Controls Overlay */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12 z-40 bg-white/20 backdrop-blur-2xl px-10 py-4 rounded-full border border-white/30 shadow-2xl">
         <div className="flex items-center gap-4 border-r border-[#c5a059]/30 pr-8 text-[#2d2a26]">
            <span className="hidden md:inline text-[9px] font-bold opacity-40 uppercase tracking-widest">Active Focus</span>
            <span className="text-sm md:text-lg font-serif italic text-[#c5a059] font-bold whitespace-nowrap">{viewMode === 'Video' ? videos[activeVideoIdx].title : photos[activePhotoIdx].title}</span>
         </div>
         <div className="flex gap-4">
            <button onClick={() => viewMode === 'Video' ? setActiveVideoIdx(p => Math.max(0, p - 1)) : setActivePhotoIdx(p => Math.max(0, p - 1))} className="w-10 h-10 rounded-full border border-[#c5a059]/40 text-[#c5a059] flex items-center justify-center hover:bg-[#c5a059] hover:text-white transition-all">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => viewMode === 'Video' ? setActiveVideoIdx(p => Math.min(videos.length - 1, p + 1)) : setActivePhotoIdx(p => Math.min(photos.length - 1, p + 1))} className="w-10 h-10 rounded-full border border-[#c5a059]/40 text-[#c5a059] flex items-center justify-center hover:bg-[#c5a059] hover:text-white transition-all">
              <ChevronRight size={16} />
            </button>
         </div>
      </div>

      {/* Video Lightbox */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-3xl flex items-center justify-center p-6">
            <button onClick={() => setSelectedVideo(null)} className="absolute top-10 right-10 w-16 h-16 rounded-full bg-[#c5a059]/10 hover:bg-[#c5a059] hover:text-white text-[#2d2a26] transition-all flex items-center justify-center z-[110]">
              <X size={28} />
            </button>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`relative bg-black rounded-3xl overflow-hidden shadow-2xl ${videoAspect === 'portrait' ? 'max-w-[400px] aspect-[9/16]' : 'max-w-[1200px] aspect-[16/9]'} w-full`}>
              <video autoPlay controls src={selectedVideo} className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WorkSection;
