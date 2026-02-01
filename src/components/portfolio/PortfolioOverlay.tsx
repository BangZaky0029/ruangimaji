
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Hash } from 'lucide-react';
import type { PortfolioProject } from '../../hooks/useSupabaseData';
import PortfolioIframePreview from './PortfolioIframePreview';
import PortfolioGallery from './PortfolioGallery';

interface PortfolioOverlayProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const PortfolioOverlay: React.FC<PortfolioOverlayProps> = ({ 
  project, 
  onClose, 
  onPrev, 
  onNext,
  hasPrev,
  hasNext
}) => {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-[#fbfaf8] flex flex-col"
        >
          {/* Top Navbar */}
          <div className="sticky top-0 z-50 px-6 py-6 md:px-12 md:py-10 bg-white/80 backdrop-blur-3xl border-b border-[#2d2a26]/5 flex justify-between items-center">
             <div className="flex items-center gap-6">
                <div className="hidden sm:block">
                  <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.4em] mb-1 block">Case Study</span>
                  <h2 className="text-xl md:text-3xl font-serif font-bold text-[#2d2a26] leading-none">{project.title}</h2>
                </div>
                <div className="sm:hidden text-center flex-grow">
                   <h2 className="text-lg font-serif font-bold text-[#2d2a26] truncate max-w-[150px]">{project.title}</h2>
                </div>
             </div>

             <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 mr-8">
                  <button 
                    disabled={!hasPrev}
                    onClick={onPrev}
                    className="w-12 h-12 rounded-full border border-[#2d2a26]/5 flex items-center justify-center text-[#2d2a26] hover:bg-[#c5a059] hover:text-white transition-all disabled:opacity-20"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    disabled={!hasNext}
                    onClick={onNext}
                    className="w-12 h-12 rounded-full border border-[#2d2a26]/5 flex items-center justify-center text-[#2d2a26] hover:bg-[#c5a059] hover:text-white transition-all disabled:opacity-20"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <button 
                  onClick={onClose}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#2d2a26] text-white flex items-center justify-center shadow-xl hover:bg-[#c5a059] transition-all"
                >
                  <X size={24} />
                </button>
             </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar">
             <div className="container mx-auto px-6 md:px-12 py-16 md:py-24 max-w-7xl">
                
                {/* Header Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-24 items-start">
                   <div className="lg:col-span-7 space-y-10">
                      <div>
                        <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.4em] mb-4 block">Introduction</span>
                        <h3 className="text-4xl md:text-7xl font-serif font-bold text-[#2d2a26] leading-tight mb-8">
                          {project.short_description}
                        </h3>
                        <div className="h-[2px] w-24 bg-[#c5a059]/20 rounded-full" />
                      </div>
                      
                      <div className="prose prose-lg prose-stone max-w-none">
                        <p className="text-[#2d2a26]/60 text-lg md:text-xl leading-relaxed font-light">
                          {project.full_description}
                        </p>
                      </div>
                   </div>

                   <div className="lg:col-span-5 space-y-10">
                      <div className="bg-[#f3eee5]/50 rounded-[3rem] p-10 border border-[#2d2a26]/5 shadow-sm">
                         <div className="space-y-10">
                            <div>
                               <h5 className="text-[9px] font-bold text-[#c5a059] uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                                  <Hash size={12} /> Tech Stack & Tools
                               </h5>
                               <div className="flex flex-wrap gap-2">
                                  {project.tech_stack?.map((tech) => (
                                    <span key={tech} className="px-5 py-2.5 bg-white rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40 border border-[#2d2a26]/5">
                                      {tech}
                                    </span>
                                  ))}
                               </div>
                            </div>
                            
                            <div>
                               <h5 className="text-[9px] font-bold text-[#c5a059] uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                                  Category
                               </h5>
                               <p className="text-xl font-serif font-bold text-[#2d2a26] italic">{project.category}</p>
                            </div>

                            {project.live_url && (
                              <a 
                                href={project.live_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full py-5 bg-[#c5a059] text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 shadow-xl shadow-[#c5a059]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                              >
                                LAUNCH LIVE PROJECT
                              </a>
                            )}
                         </div>
                      </div>
                   </div>
                </div>

                {/* Iframe Preview */}
                {(project.preview_url || project.live_url) && (
                  <div className="mb-32">
                    <PortfolioIframePreview 
                      url={project.preview_url || project.live_url} 
                      title={project.title} 
                    />
                  </div>
                )}

                {/* Gallery */}
                <div className="mb-32">
                   <PortfolioGallery projectId={project.id} />
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center justify-between border-t border-[#2d2a26]/5 pt-12">
                   <button 
                     disabled={!hasPrev}
                     onClick={onPrev}
                     className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40"
                   >
                     <ChevronLeft size={20} /> Prev Project
                   </button>
                   <button 
                     disabled={!hasNext}
                     onClick={onNext}
                     className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40"
                   >
                     Next Project <ChevronRight size={20} />
                   </button>
                </div>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PortfolioOverlay;
