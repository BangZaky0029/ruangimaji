
import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolioScreenshots } from '../../hooks/useSupabaseData';
import { Camera, Loader2, Image as ImageIcon } from 'lucide-react';

interface PortfolioGalleryProps {
  projectId: string;
}

const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ projectId }) => {
  const { screenshots, loading } = usePortfolioScreenshots(projectId);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/20">Fetching visuals...</span>
      </div>
    );
  }

  if (screenshots.length === 0) return null;

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 px-4">
        <div className="w-8 h-8 rounded-lg bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059]">
          <Camera size={16} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#2d2a26]/40">Production Gallery</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {screenshots.map((shot, idx) => (
          <motion.div
            key={shot.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative rounded-[2.5rem] overflow-hidden bg-white shadow-xl border border-[#2d2a26]/5"
          >
            <img 
              src={shot.image_url} 
              alt={shot.caption || 'Screenshot'} 
              className="w-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            {shot.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <p className="text-xs text-white/80 font-medium italic">{shot.caption}</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                  <ImageIcon size={20} />
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioGallery;
