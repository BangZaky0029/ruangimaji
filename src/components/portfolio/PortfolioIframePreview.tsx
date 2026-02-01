
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Loader2, Globe } from 'lucide-react';

interface PortfolioIframePreviewProps {
  url: string;
  title: string;
}

const PortfolioIframePreview: React.FC<PortfolioIframePreviewProps> = ({ url, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059]">
            <Globe size={16} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#2d2a26]/40">Live Preview</span>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-[#2d2a26] text-white rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#c5a059] transition-all"
          >
            Visit Site <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className="relative aspect-video w-full bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-[#2d2a26]/5">
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#fbfaf8] z-10"
            >
              <Loader2 className="w-10 h-10 text-[#c5a059] animate-spin mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2d2a26]/30">Connecting to {title}...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <iframe
          src={url}
          title={title}
          className={`w-full h-full border-none transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setError(true)}
          loading="lazy"
        />

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
               <Globe size={32} />
            </div>
            <h4 className="text-lg font-serif font-bold text-[#2d2a26] mb-2">Iframe Preview Restricted</h4>
            <p className="text-sm text-[#2d2a26]/40 max-w-sm mb-6">Situs ini membatasi pratinjau melalui iframe untuk alasan keamanan.</p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-3 bg-[#c5a059] text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[#c5a059]/20"
            >
              Buka di Tab Baru
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioIframePreview;
