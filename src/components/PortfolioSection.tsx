
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      className={`absolute cursor-pointer flex flex-col items-center ${side === 'left' ? 'left-0' : 'right-0'}`}
    >
      <div className={`relative group overflow-hidden rounded-2xl transition-all duration-500 border-2 ${isCenter ? 'border-[#c5a059] shadow-2xl shadow-[#c5a059]/20 w-[240px] md:w-[320px]' : 'border-[#2d2a26]/5 w-[160px] md:w-[200px]'} aspect-square md:aspect-[4/5] bg-white`}>
        <img src={item.imageUrl} className={`w-full h-full object-cover transition-all duration-1000 ${isCenter ? 'grayscale-0' : 'grayscale opacity-40'}`} alt={item.title} />
        
        {/* Absolute Centered Play Button for Mobile/Desktop fix */}
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
            <p className="text-[10px] text-white/60 leading-relaxed mt-3 line-clamp-2">{item.description}</p>
          </motion.div>
        )}
      </div>
      <motion.span animate={{ opacity: isCenter ? 1 : 0.2 }} className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-bold tracking-[0.3em] font-mono text-[#2d2a26] ${side === 'left' ? '-left-32' : '-right-32'}`}>
        {item.title.toUpperCase()}
      </motion.span>
    </motion.div>
  );
};

interface PortfolioSectionProps {
  onSeeAll: (type: 'Photo' | 'Video') => void;
}

const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onSeeAll }) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'Photo' | 'Video'>('Photo');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoAspect, setVideoAspect] = useState<'landscape' | 'portrait'>('landscape');

  const photos = PORTFOLIO_DATA.Photo;
  const videos = PORTFOLIO_DATA.Video;
  const currentBackground = viewMode === 'Video' ? videos[activeVideoIdx].imageUrl : photos[activePhotoIdx].imageUrl;

  return (
    <section id="work" className="relative h-screen bg-[#fbfaf8] overflow-hidden flex items-center justify-center">
      {/* Immersive Background: Enlarged and Blurred active image */}
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

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#fbfaf8]/20 via-transparent to-[#fbfaf8]/20 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-24 relative z-10 flex h-full items-center justify-center">
        {/* Sidebar Navigation - Glassmorphism refined */}
        <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-14 bg-white/20 backdrop-blur-3xl py-12 px-5 rounded-full border border-white/30 shadow-2xl">
          <motion.button
            whileHover={{ scale: 1.25 }}
            className={`transition-all duration-500 flex flex-col items-center gap-1 ${viewMode === 'Photo' ? 'text-[#c5a059]' : 'text-[#2d2a26]/40 hover:text-[#2d2a26]/60'}`}
            onClick={() => setViewMode('Photo')}
          >
            <Camera size={24} />
            <span className="text-[6px] font-bold tracking-widest mt-1 uppercase">Photo</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.25 }}
            className="transition-all duration-500 flex flex-col items-center gap-1 text-[#2d2a26]/40 hover:text-[#c5a059]"
            onClick={() => onSeeAll(viewMode)}
          >
            <LayoutGrid size={24} />
            <span className="text-[6px] font-bold tracking-widest mt-1 uppercase">Browse</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.25 }}
            className={`transition-all duration-500 flex flex-col items-center gap-1 ${viewMode === 'Video' ? 'text-[#c5a059]' : 'text-[#2d2a26]/40 hover:text-[#2d2a26]/60'}`}
            onClick={() => setViewMode('Video')}
          >
            <Film size={24} />
            <span className="text-[6px] font-bold tracking-widest mt-1 uppercase">Video</span>
          </motion.button>
        </div>

        <div className="relative w-full h-full flex items-center justify-between">
          <motion.div animate={{ x: viewMode === 'Photo' ? '25%' : '-100%', opacity: viewMode === 'Video' ? 0 : 1, scale: viewMode === 'Photo' ? 1.2 : 1 }} className="relative w-1/2 h-full flex items-center justify-start">
            <div className="absolute left-[-100px] md:left-0 flex items-center h-full w-full">
               <div className="absolute left-10 z-20 pointer-events-none">
                 <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#2d2a26]/5 italic">Photo Series</h2>
                 <p className="text-[8px] text-[#c5a059] tracking-[0.3em] font-bold mb-4">MOMENTS CAPTURED</p>
               </div>
               {photos.map((item, i) => (
                 <ArcItem key={item.id} item={item} index={i} activeIndex={activePhotoIdx} side="left" onClick={() => setActivePhotoIdx(i)} />
               ))}
            </div>
          </motion.div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-32 bg-gradient-to-b from-transparent via-[#c5a059]/20 to-transparent z-10" />

          <motion.div animate={{ x: viewMode === 'Video' ? '-25%' : '100%', opacity: viewMode === 'Photo' ? 0 : 1, scale: viewMode === 'Video' ? 1.2 : 1 }} className="relative w-1/2 h-full flex items-center justify-end">
            <div className="absolute right-[-100px] md:right-0 flex items-center h-full w-full justify-end">
               <div className="absolute right-10 z-20 pointer-events-none text-right">
                 <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#2d2a26]/5 italic">Video Series</h2>
                 <p className="text-[8px] text-[#c5a059] tracking-[0.3em] font-bold mb-4">CINEMATIC NARRATIVES</p>
               </div>
               {videos.map((item, i) => (
                 <ArcItem key={item.id} item={item} index={i} activeIndex={activeVideoIdx} side="right" onClick={() => setActiveVideoIdx(i)} onPlay={(u, a) => { setSelectedVideo(u); setVideoAspect(a); }} />
               ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Focus Control - Refined clear blur */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12 z-40 bg-white/20 backdrop-blur-2xl px-10 py-4 rounded-full border border-white/30 shadow-2xl">
         <div className="flex items-center gap-4 border-r border-[#c5a059]/30 pr-8 text-[#2d2a26]">
            <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">Active Focus</span>
            <span className="text-lg font-serif italic text-[#c5a059] font-bold">{viewMode === 'Video' ? videos[activeVideoIdx].title : photos[activePhotoIdx].title}</span>
         </div>
         <div className="flex gap-4">
            <button onClick={() => viewMode === 'Video' ? setActiveVideoIdx(p => Math.max(0, p - 1)) : setActivePhotoIdx(p => Math.max(0, p - 1))} className="w-10 h-10 rounded-full border border-[#c5a059]/40 text-[#c5a059] flex items-center justify-center hover:bg-[#c5a059] hover:text-white transition-all shadow-md">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => viewMode === 'Video' ? setActiveVideoIdx(p => Math.min(videos.length - 1, p + 1)) : setActivePhotoIdx(p => Math.min(photos.length - 1, p + 1))} className="w-10 h-10 rounded-full border border-[#c5a059]/40 text-[#c5a059] flex items-center justify-center hover:bg-[#c5a059] hover:text-white transition-all shadow-md">
              <ChevronRight size={16} />
            </button>
         </div>
      </div>

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

export default PortfolioSection;
