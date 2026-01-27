
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Film, 
  Play, 
  X,
  LayoutGrid
} from 'lucide-react';
import { useProjects } from '../hooks/useSupabaseData';
import type { Project } from '../hooks/useSupabaseData';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '../lib/videoUtils';

const ARC_RADIUS = 700;
const ITEM_OFFSET = 18;

interface ArcItemProps {
  item: Project;
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
        <img src={item.image_url} className={`w-full h-full object-cover transition-all duration-1000 ${isCenter ? 'grayscale-0' : 'grayscale opacity-40'}`} alt={item.title} />
        
        {isCenter && item.video_url && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <motion.button 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={(e) => { e.stopPropagation(); onPlay?.(item.video_url!, item.aspect_ratio); }} 
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

  const { portfolioData, loading,} = useProjects();
  const photos = portfolioData.Photo;
  const videos = portfolioData.Video;

  if (loading) {
    return (
      <section id="work" className="relative h-screen bg-[#fbfaf8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#c5a059]/20 border-t-[#c5a059] rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  const currentBackground = viewMode === 'Video' && videos.length > 0 
    ? videos[activeVideoIdx]?.image_url 
    : photos.length > 0 ? photos[activePhotoIdx]?.image_url : '';

  return (
    <section id="work" className="relative h-screen bg-[#fbfaf8] overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        {currentBackground && (
          <motion.div key={currentBackground} initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0 z-0 pointer-events-none">
            <motion.img src={currentBackground} className="w-full h-full object-cover blur-[45px]" alt="bg blur" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 md:px-24 relative z-10 flex h-full items-center justify-center">
        <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-14 bg-white/20 backdrop-blur-3xl py-12 px-5 rounded-full border border-white/30 shadow-2xl">
          <motion.button onClick={() => { setViewMode('Photo'); setActivePhotoIdx(0); }} className={`transition-all duration-500 flex flex-col items-center gap-1 ${viewMode === 'Photo' ? 'text-[#c5a059]' : 'text-[#2d2a26]/40 hover:text-[#2d2a26]/60'}`}>
            <Camera size={24} />
            <span className="text-[6px] font-bold tracking-widest mt-1 uppercase">Photo</span>
          </motion.button>
          <motion.button onClick={() => onSeeAll(viewMode)} className="transition-all duration-500 flex flex-col items-center gap-1 text-[#2d2a26]/40 hover:text-[#c5a059]">
            <LayoutGrid size={24} />
            <span className="text-[6px] font-bold tracking-widest mt-1 uppercase">Browse</span>
          </motion.button>
          <motion.button onClick={() => { setViewMode('Video'); setActiveVideoIdx(0); }} className={`transition-all duration-500 flex flex-col items-center gap-1 ${viewMode === 'Video' ? 'text-[#c5a059]' : 'text-[#2d2a26]/40 hover:text-[#2d2a26]/60'}`}>
            <Film size={24} />
            <span className="text-[6px] font-bold tracking-widest mt-1 uppercase">Video</span>
          </motion.button>
        </div>

        <div className="relative w-full h-full flex items-center justify-between">
          {photos.length > 0 && (
            <motion.div animate={{ x: viewMode === 'Photo' ? '25%' : '-100%', opacity: viewMode === 'Video' ? 0 : 1, scale: viewMode === 'Photo' ? 1.2 : 1 }} className="relative w-1/2 h-full flex items-center justify-start">
              {photos.map((item, i) => <ArcItem key={item.id} item={item} index={i} activeIndex={activePhotoIdx} side="left" onClick={() => setActivePhotoIdx(i)} />)}
            </motion.div>
          )}
          {videos.length > 0 && (
            <motion.div animate={{ x: viewMode === 'Video' ? '-25%' : '100%', opacity: viewMode === 'Photo' ? 0 : 1, scale: viewMode === 'Video' ? 1.2 : 1 }} className="relative w-1/2 h-full flex items-center justify-end">
              {videos.map((item, i) => <ArcItem key={item.id} item={item} index={i} activeIndex={activeVideoIdx} side="right" onClick={() => setActiveVideoIdx(i)} onPlay={(u, a) => { setSelectedVideo(u); setVideoAspect(a); }} />)}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-3xl flex items-center justify-center p-6">
            <button onClick={() => setSelectedVideo(null)} className="absolute top-10 right-10 w-16 h-16 rounded-full bg-[#c5a059]/10 hover:bg-[#c5a059] hover:text-white text-[#2d2a26] transition-all flex items-center justify-center z-[110]"><X size={28} /></button>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`relative bg-black rounded-3xl overflow-hidden shadow-2xl ${videoAspect === 'portrait' ? 'max-w-[400px] aspect-[9/16]' : 'max-w-[1200px] aspect-[16/9]'} w-full`}>
              {isYouTubeUrl(selectedVideo) ? (
                <iframe src={getYouTubeEmbedUrl(selectedVideo, { autoplay: 1 })} className="w-full h-full" allow="autoplay; fullscreen" />
              ) : (
                <video autoPlay controls src={selectedVideo} className="w-full h-full object-cover" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PortfolioSection;
