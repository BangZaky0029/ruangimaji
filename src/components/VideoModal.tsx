
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import VideoEmbed from './VideoEmbed';

interface VideoModalProps {
  url: string | null;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ url, onClose }) => {
  useEffect(() => {
    if (url) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [url]);

  return (
    <AnimatePresence>
      {url && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[500] bg-[#2d2a26]/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12"
          onClick={onClose}
        >
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose} 
            className="absolute top-8 right-8 w-14 h-14 rounded-full bg-white/10 hover:bg-[#c5a059] text-white flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl z-[510] transition-all"
          >
            <X size={28} />
          </motion.button>

          <motion.div 
            initial={{ scale: 0.9, y: 30, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            className="w-full max-w-6xl pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <VideoEmbed url={url} />
          </motion.div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">Ruang Imaji Production</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;
