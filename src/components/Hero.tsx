import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { HERO_SLIDES_DATA } from '../constants';

const Hero: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const nextSlide = () => {
    setIsVideoLoaded(false);
    setProgress(0);
    setActiveIdx((prev) => (prev + 1) % HERO_SLIDES_DATA.length);
  };
  
  const prevSlide = () => {
    setIsVideoLoaded(false);
    setProgress(0);
    setActiveIdx((prev) => (prev - 1 + HERO_SLIDES_DATA.length) % HERO_SLIDES_DATA.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(true);
    }
  }, [activeIdx]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
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

  return (
    <section 
      className="relative h-screen w-full bg-[#fbfaf8] overflow-hidden flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image/Video Fallback */}
      <div className="absolute inset-0 z-0">
        <img 
          src={HERO_SLIDES_DATA[activeIdx].imageUrl} 
          alt="Background Placeholder"
          className="w-full h-full object-cover blur-sm opacity-20"
        />
      </div>

      {/* Background Video (Main) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVideoLoaded ? 0.9 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-[1]"
        >
          <video
            ref={videoRef}
            src={HERO_SLIDES_DATA[activeIdx].videoUrl}
            autoPlay
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onCanPlayThrough={() => setIsVideoLoaded(true)}
            onEnded={nextSlide}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#fbfaf8] via-transparent to-transparent opacity-80" />

      {/* Integrated Control Group in Bottom Left */}
      <div className="absolute bottom-12 left-6 md:left-24 z-[40] flex flex-col gap-6 items-start">
        
        {/* Cinematic Portfolio Button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-14 bg-[#c5a059] text-white text-[10px] uppercase tracking-[0.3em] font-bold px-12 rounded-full shadow-lg shadow-[#c5a059]/20 whitespace-nowrap"
        >
          Cinematic Portfolio
        </motion.button>

        {/* Volume Button */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMuted(!isMuted)}
          className="w-12 h-12 rounded-full bg-[#c5a059] text-white flex items-center justify-center shadow-lg shadow-[#c5a059]/20 ml-2"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </motion.button>
        
        {/* Play Button & Progress Bar Row */}
        <div className="flex items-center gap-8 mt-2">
          {/* Updated Play Button to match Volume Button Style with Gold Border */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white border-2 border-[#c5a059] text-[#2d2a26] flex items-center justify-center shadow-xl transition-colors"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
          </motion.button>

          {/* Progress Bar Container */}
          <motion.div 
            className="bg-white/10 backdrop-blur-xl rounded-full px-8 py-5 flex items-center gap-8 border border-white/20 shadow-2xl min-w-[280px] md:min-w-[420px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex-grow relative h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-[#c5a059]"
                style={{ width: `${progress}%` }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
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
            <div className="text-[12px] text-white font-mono tracking-widest min-w-[36px] font-bold">
              {progress.toFixed(0)}%
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 w-full px-6 md:px-24 flex flex-col md:flex-row items-center justify-between gap-12 h-full pt-20">
        {/* Left Side: Content */}
        <div className="max-w-2xl w-full mt-auto mb-64 md:mb-72">
          <motion.div
            key={`content-${activeIdx}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-[1px] bg-[#c5a059]/50"></span>
              <span className="text-[#c5a059] text-[10px] uppercase tracking-widest font-bold font-mono">
                {HERO_SLIDES_DATA[activeIdx].location}
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[8.5rem] font-bold leading-[0.85] tracking-tighter mb-8 font-serif text-[#2d2a26]">
              {HERO_SLIDES_DATA[activeIdx].title.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {word}<br />
                </React.Fragment>
              ))}
            </h1>

            <p className="text-[#2d2a26]/60 text-sm md:text-base max-w-sm mb-10 leading-relaxed font-light">
              {HERO_SLIDES_DATA[activeIdx].description}
            </p>
          </motion.div>
        </div>

        {/* Right Side: Thumbnails */}
        <div className="hidden lg:flex flex-col items-end gap-8 self-end pb-12 overflow-visible mr-[-2rem]">
          <div className="flex flex-row items-center gap-6">
            {HERO_SLIDES_DATA.map((slide, idx) => (
               <motion.div
                 key={slide.id}
                 onClick={() => setActiveIdx(idx)}
                 initial={{ opacity: 0, x: 50 }}
                 animate={{ 
                   opacity: 1, 
                   x: 0,
                   scale: activeIdx === idx ? 1.05 : 0.9,
                   borderColor: activeIdx === idx ? '#c5a059' : 'rgba(197, 160, 89, 0.1)',
                 }}
                 whileHover={{ scale: 1.1 }}
                 className="relative cursor-pointer w-40 aspect-[9/16] rounded-2xl overflow-hidden group border-2 transition-all duration-500 bg-white"
               >
                 <img 
                    src={slide.imageUrl} 
                    alt={slide.title} 
                    className={`w-full h-full object-cover transition-all duration-1000 ${activeIdx === idx ? 'grayscale-0 opacity-100' : 'grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0'}`} 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#2d2a26]/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                    <span className="text-[8px] text-white/70 uppercase tracking-widest mb-1">{slide.category}</span>
                    <h4 className="text-[10px] font-bold leading-tight uppercase text-white">{slide.title}</h4>
                 </div>
               </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-8 pr-4">
             <div className="text-4xl font-bold font-serif text-[#c5a059]/20 italic">
              0{activeIdx + 1}
            </div>
            <div className="w-32 h-[1px] bg-[#c5a059]/10 relative overflow-hidden rounded-full">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-[#c5a059]"
                initial={false}
                animate={{ width: `${((activeIdx + 1) / HERO_SLIDES_DATA.length) * 100}%` }}
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border border-[#c5a059]/10 bg-white flex items-center justify-center hover:bg-[#c5a059] hover:text-white transition-all group"
              >
                <ChevronLeft size={18} className="text-[#c5a059] group-hover:text-white" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border border-[#c5a059]/10 bg-white flex items-center justify-center hover:bg-[#c5a059] hover:text-white transition-all group"
              >
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