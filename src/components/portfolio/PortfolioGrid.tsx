
import React, { useState } from 'react';
import { usePortfolioProjects } from '../../hooks/useSupabaseData';
import type {PortfolioProject} from '../../hooks/useSupabaseData';
import PortfolioCard from './PortfolioCard';
import PortfolioOverlay from './PortfolioOverlay';
import { LayoutGrid, Sparkles, Loader2 } from 'lucide-react';

const PortfolioGrid: React.FC = () => {
  const { projects, loading, error } = usePortfolioProjects();
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const handleNext = () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
    if (currentIndex < projects.length - 1) {
      setSelectedProject(projects[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
    if (currentIndex > 0) {
      setSelectedProject(projects[currentIndex - 1]);
    }
  };

  if (loading) {
    return (
      <div className="py-48 flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 text-[#c5a059] animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c5a059]">Curating Our Masterpieces...</p>
      </div>
    );
  }

  if (error || projects.length === 0) return null;

  const currentIdx = selectedProject ? projects.findIndex(p => p.id === selectedProject.id) : -1;

  return (
    <section id="portfolio-grid" className="py-24 md:py-48 bg-[#fbfaf8] relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
           <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                 <Sparkles size={18} className="text-[#c5a059]" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c5a059]">Portfolio Selection</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-serif font-bold text-[#2d2a26] leading-[0.9] tracking-tighter">
                SELECTED <br />
                <span className="italic text-[#c5a059]">CASE STUDIES.</span>
              </h2>
           </div>
           
           <div className="hidden lg:flex items-center gap-6 mb-4">
              <div className="h-[1px] w-48 bg-[#2d2a26]/10" />
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#2d2a26]/30">
                 <LayoutGrid size={14} /> Total {projects.length} Productions
              </div>
           </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {projects.map((project) => (
            <PortfolioCard 
              key={project.id} 
              project={project} 
              onClick={(p) => setSelectedProject(p)} 
            />
          ))}
        </div>
      </div>

      {/* Overlay / Modal */}
      <PortfolioOverlay 
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={currentIdx > 0}
        hasNext={currentIdx < projects.length - 1}
      />
    </section>
  );
};

export default PortfolioGrid;
