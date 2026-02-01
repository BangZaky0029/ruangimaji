
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { PortfolioProject } from '../../hooks/useSupabaseData';

interface PortfolioCardProps {
  project: PortfolioProject;
  onClick: (project: PortfolioProject) => void;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, onClick }) => {
  return (
    <motion.div
      layoutId={`card-${project.id}`}
      onClick={() => onClick(project)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative cursor-pointer overflow-hidden rounded-[2rem] bg-[#111] aspect-[4/5] md:aspect-square lg:aspect-[4/5]"
    >
      {/* Thumbnail */}
      <motion.img
        src={project.thumbnail_url}
        alt={project.title}
        className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:opacity-60"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-[#c5a059]/20 backdrop-blur-md border border-[#c5a059]/30 rounded-full text-[8px] font-bold uppercase tracking-widest text-[#c5a059]">
              {project.category}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
            {project.title}
          </h3>
          <p className="text-sm text-white/50 font-light line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {project.short_description}
          </p>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 group-hover:text-[#c5a059] transition-colors">
            View Project <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Top Badge for Featured */}
      {project.is_featured && (
        <div className="absolute top-6 right-6">
           <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest">
             Featured Work
           </div>
        </div>
      )}
    </motion.div>
  );
};

export default PortfolioCard;
