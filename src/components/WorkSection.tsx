
// C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji\src\components\WorkSection.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { 
  Camera, 
  Film, 
  Play, 
  X,
  ChevronLeft,
  ChevronRight,
  LayoutGrid
} from 'lucide-react';
import { useProjects } from '../hooks/useSupabaseData';
import type { Project } from '../hooks/useSupabaseData';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '../lib/videoUtils';

const ARC_RADIUS = 700;
const ITEM_OFFSET = 18;
const SWIPE_THRESHOLD = 40;

interface ArcItemProps {
  item: Project;
  index: number;
  activeIndex: number;
  side: 'left' | 'right';
  isPlaying: boolean;
  onClick: () => void;
  onPlay: () => void;
  onClose: () => void;
}

const ArcItem: React.FC<ArcItemProps> = ({ item, index, activeIndex, side, isPlaying, onClick, onPlay, onClose }) => {
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
    >
      <div className={`relative group overflow-hidden rounded-2xl transition-all duration-500 border-2 ${isCenter ? 'border-[#c5a059] shadow-2xl shadow-[#c5a059]/20 w-[280px] md:w-[350px]' : 'border-[#2d2a26]/5 w-[160px] md:w-[200px]'} aspect-[3/4] md:aspect-[4/5] bg-black`}>
        <AnimatePresence mode="wait">
          {isPlaying && item.video_url ? (
            <motion.div 
              key="inline-video"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black flex items-center justify-center"
            >
              {isYouTubeUrl(item.video_url) ? (
                <iframe 
                  src={getYouTubeEmbedUrl(item.video_url, { autoplay: 1 })}
                  className="w-full h-full absolute inset-0"
                  allow="autoplay; fullscreen"
                />
              ) : (
                <video src={item.video_url} className="w-full h-full object-contain" autoPlay controls playsInline />
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute top-4 right-4 z-[60] w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#c5a059] transition-colors border border-white/20"
              >
                <X size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div key="item-preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
              <img src={item.image_url} className={`w-full h-full object-cover transition-all duration-1000 ${isCenter ? 'grayscale-0' : 'grayscale opacity-40'}`} alt={item.title} />
              {isCenter && item.video_url && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                  <motion.button 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={(e) => { e.stopPropagation(); onPlay(); }} 
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
            </motion.div>
          )}
        </AnimatePresence>
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
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const { portfolioData, loading } = useProjects();
  const photos = portfolioData.Photo || [];
  const videos = portfolioData.Video || [];
  const currentBackground = viewMode === 'Video' ? videos[activeVideoIdx]?.image_url : photos[activePhotoIdx]?.image_url;

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const isHorizontal = Math.abs(info.offset.x) > Math.abs(info.offset.y);
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD && isHorizontal) {
      setPlayingVideoId(null);
      if (info.offset.x > 0) {
        if (viewMode === 'Video') setActiveVideoIdx(p => Math.max(0, p - 1));
        else setActivePhotoIdx(p => Math.max(0, p - 1));
      } else {
        if (viewMode === 'Video') setActiveVideoIdx(p => Math.min(videos.length - 1, p + 1));
        else setActivePhotoIdx(p => Math.min(photos.length - 1, p + 1));
      }
    }
  };

  if (loading || (!photos.length && !videos.length)) {
    return <section id="work" className="relative h-screen bg-[#fbfaf8] flex items-center justify-center">Loading...</section>;
  }

  return (
    <section id="work" className="relative h-screen bg-[#fbfaf8] overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div key={currentBackground} initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0 z-0 pointer-events-none">
          <motion.img src={currentBackground} className="w-full h-full object-cover blur-[45px]" alt="bg blur" />
        </motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-6 md:px-24 relative z-10 flex h-full items-center justify-center pointer-events-none">
        <div className="absolute inset-y-0 left-6 right-6 md:left-12 md:right-12 z-50 flex items-center pointer-events-none">
          <motion.div layout className={`pointer-events-auto flex flex-col items-center gap-14 bg-white/20 backdrop-blur-3xl py-12 px-5 rounded-full border border-white/30 shadow-2xl ${viewMode === 'Photo' ? 'mr-auto' : 'ml-auto'}`}>
            <motion.button onClick={() => { setViewMode('Photo'); setPlayingVideoId(null); }} className={`${viewMode === 'Photo' ? 'text-[#c5a059]' : 'text-[#2d2a26]/40 hover:text-[#2d2a26]'}`}><Camera size={24} /><span className="text-[6px] font-bold mt-1 uppercase">Photo</span></motion.button>
            <motion.button onClick={() => onSeeAll(viewMode)} className="text-[#2d2a26]/40 hover:text-[#c5a059]"><LayoutGrid size={24} /><span className="text-[6px] font-bold mt-1 uppercase">Browse</span></motion.button>
            <motion.button onClick={() => { setViewMode('Video'); setPlayingVideoId(null); }} className={`${viewMode === 'Video' ? 'text-[#c5a059]' : 'text-[#2d2a26]/40 hover:text-[#2d2a26]'}`}><Film size={24} /><span className="text-[6px] font-bold mt-1 uppercase">Video</span></motion.button>
          </motion.div>
        </div>

        <motion.div drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={handleDragEnd} className="relative w-full h-full flex items-center justify-between pointer-events-auto cursor-grab active:cursor-grabbing">
          <motion.div animate={{ x: viewMode === 'Photo' ? (window.innerWidth < 768 ? '0%' : '25%') : '-100%', opacity: viewMode === 'Video' ? 0 : 1 }} className="relative w-full md:w-1/2 h-full flex items-center justify-center md:justify-start pointer-events-none">
             {photos.map((item, i) => <ArcItem key={item.id} item={item} index={i} activeIndex={activePhotoIdx} side="left" isPlaying={playingVideoId === item.id} onClick={() => { setActivePhotoIdx(i); setPlayingVideoId(null); }} onPlay={() => setPlayingVideoId(item.id)} onClose={() => setPlayingVideoId(null)} />)}
          </motion.div>
          <motion.div animate={{ x: viewMode === 'Video' ? (window.innerWidth < 768 ? '0%' : '-25%') : '100%', opacity: viewMode === 'Photo' ? 0 : 1 }} className="relative w-full md:w-1/2 h-full flex items-center justify-center md:justify-end pointer-events-none">
             {videos.map((item, i) => <ArcItem key={item.id} item={item} index={i} activeIndex={activeVideoIdx} side="right" isPlaying={playingVideoId === item.id} onClick={() => { setActiveVideoIdx(i); setPlayingVideoId(null); }} onPlay={() => setPlayingVideoId(item.id)} onClose={() => setPlayingVideoId(null)} />)}
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12 z-40 bg-white/20 backdrop-blur-2xl px-10 py-4 rounded-full border border-white/30 shadow-2xl">
         <div className="flex items-center gap-4 border-r border-[#c5a059]/30 pr-8 text-[#2d2a26]">
            <span className="text-sm md:text-lg font-serif italic text-[#c5a059] font-bold whitespace-nowrap">{viewMode === 'Video' ? videos[activeVideoIdx]?.title : photos[activePhotoIdx]?.title}</span>
         </div>
         <div className="flex gap-4">
            <button onClick={() => { setPlayingVideoId(null); viewMode === 'Video' ? setActiveVideoIdx(p => Math.max(0, p - 1)) : setActivePhotoIdx(p => Math.max(0, p - 1)); }} className="w-10 h-10 rounded-full border border-[#c5a059]/40 text-[#c5a059] flex items-center justify-center hover:bg-[#c5a059] hover:text-white"><ChevronLeft size={16} /></button>
            <button onClick={() => { setPlayingVideoId(null); viewMode === 'Video' ? setActiveVideoIdx(p => Math.min(videos.length - 1, p + 1)) : setActivePhotoIdx(p => Math.min(photos.length - 1, p + 1)); }} className="w-10 h-10 rounded-full border border-[#c5a059]/40 text-[#c5a059] flex items-center justify-center hover:bg-[#c5a059] hover:text-white"><ChevronRight size={16} /></button>
         </div>
      </div>
    </section>
  );
};

export default WorkSection;
