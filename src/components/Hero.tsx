import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { useHeroSlides } from '../hooks/useSupabaseData';
import { isYouTubeUrl, getYouTubeEmbedUrl } from '../lib/videoUtils';

const Hero: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { heroSlides, loading } = useHeroSlides();

  const nextSlide = () => {
    setProgress(0);
    setActiveIdx((prev) => (prev + 1) % heroSlides.length);
  };
  
  const prevSlide = () => {
    setProgress(0);
    setActiveIdx((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    if (videoRef.current && heroSlides.length > 0 && !isYouTubeUrl(heroSlides[activeIdx]?.video_url || '')) {
      videoRef.current.load();
      videoRef.current.volume = isMuted ? 0 : volume / 100;
      setIsPlaying(true);
    }
  }, [activeIdx, heroSlides, volume, isMuted]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume / 100;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) / 100) * (videoRef.current?.duration || 0);
    if (videoRef.current) videoRef.current.currentTime = time;
  };

  if (loading || heroSlides.length === 0) {
    return (
      <section className="relative h-[100dvh] w-full bg-[#fbfaf8] overflow-hidden flex items-center justify-center">
        <motion.img 
          src="/imajiLogo.svg" 
          className="w-20 h-20" 
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1, 0.95] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
        />
      </section>
    );
  }

  const currentSlide = heroSlides[activeIdx];
  const isCurrentYouTube = isYouTubeUrl(currentSlide.video_url);

  return (
    <section className="relative h-[100dvh] w-full bg-[#fbfaf8] overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0">
        <img 
          src={currentSlide.image_url} 
          alt="Background Placeholder"
          className="w-full h-full object-cover blur-sm opacity-20"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-[1] overflow-hidden"
        >
          {isCurrentYouTube ? (
            /* Trick for YouTube Background to behave like object-cover */
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                <iframe
                src={getYouTubeEmbedUrl(currentSlide.video_url, { autoplay: 1, mute: isMuted ? 1 : 0, controls: 0, loop: 1 })}
                allow="autoplay; fullscreen; picture-in-picture"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ 
                    width: '100vw', 
                    height: '56.25vw', /* 16:9 aspect ratio */
                    minHeight: '100dvh', 
                    minWidth: '177.77dvh' /* 16:9 aspect ratio */
                }}
                title={currentSlide.title}
                />
            </div>
          ) : (
            <video
              ref={videoRef}
              src={currentSlide.video_url}
              autoPlay
              muted={isMuted}
              playsInline
              loop
              onTimeUpdate={handleTimeUpdate}
              onEnded={nextSlide}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#fbfaf8] via-transparent to-transparent opacity-80 md:opacity-80" />
      <div className="absolute inset-0 z-[2] bg-black/20 md:hidden" /> {/* Added slight dark overlay for mobile text readability */}

      <div className="absolute bottom-12 left-6 md:left-24 z-[40] flex flex-col gap-6 items-start">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-12 md:h-14 bg-[#c5a059] text-white text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold px-8 md:px-12 rounded-full shadow-lg shadow-[#c5a059]/20 whitespace-nowrap"
        >
          Cinematic Portfolio
        </motion.button>

        <div 
          className="relative flex items-center gap-3"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#c5a059] text-white flex items-center justify-center shadow-lg shadow-[#c5a059]/20 relative z-10"
          >
            {/* Fix: Removed invalid responsive 'md:size' prop from Lucide icon components. */}
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </motion.button>

          <AnimatePresence>
            {showVolumeSlider && (
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute left-14 md:left-16 bg-white/20 backdrop-blur-xl rounded-full px-6 py-4 border border-white/30 shadow-2xl flex items-center gap-4 min-w-[180px] md:min-w-[200px]"
              >
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #c5a059 0%, #c5a059 ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)` }}
                />
                <span className="text-white text-[10px] font-bold font-mono min-w-[32px] text-right">{volume}%</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {!isCurrentYouTube && (
          <div className="flex items-center gap-4 md:gap-8 mt-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border-2 border-[#c5a059] text-[#2d2a26] flex items-center justify-center shadow-xl transition-colors"
            >
              {/* Fix: Removed invalid responsive 'md:size' prop from Lucide icon components. */}
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
            </motion.button>

            <motion.div 
              className="bg-white/10 backdrop-blur-xl rounded-full px-6 md:px-8 py-3 md:py-5 flex items-center gap-4 md:gap-8 border border-white/20 shadow-2xl min-w-[200px] md:min-w-[420px]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex-grow relative h-1 md:h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-[#c5a059]"
                  style={{ width: `${progress}%` }}
                />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={progress} 
                  onChange={handleSeek}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </div>
              <div className="text-[10px] md:text-[12px] text-white font-mono tracking-widest min-w-[30px] md:min-w-[36px] font-bold">
                {progress.toFixed(0)}%
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <div className="relative z-10 w-full px-6 md:px-24 flex flex-col md:flex-row items-center justify-between gap-12 h-full pt-20">
        <div className="max-w-2xl w-full mt-auto mb-56 md:mb-72">
          <motion.div
            key={`content-${activeIdx}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-[1px] bg-[#c5a059]/50"></span>
              <span className="text-[#c5a059] text-[9px] md:text-[10px] uppercase tracking-widest font-bold font-mono">
                {currentSlide.location}
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl lg:text-[8.5rem] font-bold leading-[0.9] md:leading-[0.85] tracking-tighter mb-6 md:mb-8 font-serif text-[#2d2a26] md:text-[#2d2a26] drop-shadow-sm">
              {currentSlide.title.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {word}<br />
                </React.Fragment>
              ))}
            </h1>
            
            <p className="text-[#2d2a26]/70 md:text-[#2d2a26]/60 text-sm md:text-base max-w-sm mb-10 leading-relaxed font-medium md:font-light">
              {currentSlide.description}
            </p>
          </motion.div>
        </div>
        
        <div className="hidden lg:flex flex-col items-end gap-8 self-end pb-12 overflow-visible mr-[-2rem]">
          <div className="flex flex-row items-center gap-6">
            {heroSlides.map((slide, idx) => (
               <motion.div
                 key={slide.id}
                 onClick={() => setActiveIdx(idx)}
                 animate={{ 
                   scale: activeIdx === idx ? 1.05 : 0.9,
                   borderColor: activeIdx === idx ? '#c5a059' : 'rgba(197, 160, 89, 0.1)',
                 }}
                 whileHover={{ scale: 1.1 }}
                 className="relative cursor-pointer w-40 aspect-[9/16] rounded-2xl overflow-hidden group border-2 transition-all duration-500 bg-white"
               >
                 <img src={slide.image_url} alt={slide.title} className={`w-full h-full object-cover transition-all duration-1000 ${activeIdx === idx ? 'grayscale-0 opacity-100' : 'grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0'}`} />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#2d2a26]/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                    <span className="text-[8px] text-white/70 uppercase tracking-widest mb-1">{slide.category}</span>
                    <h4 className="text-[10px] font-bold leading-tight uppercase text-white">{slide.title}</h4>
                 </div>
               </motion.div>
            ))}
          </div>
          
          <div className="flex items-center gap-8 pr-4">
            <div className="text-4xl font-bold font-serif text-[#c5a059]/20 italic">0{activeIdx + 1}</div>
            <div className="w-32 h-[1px] bg-[#c5a059]/10 relative overflow-hidden rounded-full">
              <motion.div className="absolute top-0 left-0 h-full bg-[#c5a059]" initial={false} animate={{ width: `${((activeIdx + 1) / heroSlides.length) * 100}%` }} />
            </div>
            <div className="flex gap-3">
              <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-[#c5a059]/10 bg-white flex items-center justify-center hover:bg-[#c5a059] hover:text-white transition-all group">
                <ChevronLeft size={18} className="text-[#c5a059] group-hover:text-white" />
              </button>
              <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-[#c5a059]/10 bg-white flex items-center justify-center hover:bg-[#c5a059] hover:text-white transition-all group">
                <ChevronRight size={18} className="text-[#c5a059] group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;