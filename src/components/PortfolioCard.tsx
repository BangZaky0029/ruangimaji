
import React from 'react';
import { motion } from 'framer-motion';
import {ArrowUpRight } from 'lucide-react';
import type { Project } from '../types';

interface PortfolioCardProps {
  project: Project;
  index: number;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="relative flex-shrink-0 group w-[320px] md:w-[450px] aspect-[4/5] bg-[#111] overflow-hidden rounded-2xl cursor-pointer"
    >
      {/* Background Image */}
      <motion.img
        src={project.imageUrl}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
      />

      {/* Overlay Details */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8">
        <motion.div 
          className="overflow-hidden mb-2"
        >
          <motion.p 
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            className="text-yellow-400 text-xs font-bold uppercase tracking-widest"
          >
            {project.category}
          </motion.p>
        </motion.div>

        <h3 className="text-2xl md:text-3xl font-bold mb-3 font-serif group-hover:text-yellow-400 transition-colors">
          {project.title}
        </h3>
        
        <p className="text-sm text-white/60 mb-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 line-clamp-2">
          {project.description}
        </p>

        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-xs uppercase font-bold tracking-widest flex items-center gap-2">
             View Case Study <ArrowUpRight size={14} />
           </span>
        </div>
      </div>

      {/* Indicator for Card Position */}
      <div className="absolute top-6 right-8 text-white/20 font-mono text-lg font-bold">
        / {index + 1 < 10 ? `0${index + 1}` : index + 1}
      </div>
    </motion.div>
  );
};

export default PortfolioCard;
