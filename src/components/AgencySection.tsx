import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {PanInfo} from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Globe, Award, Users } from 'lucide-react';

const TEAM_MEMBERS = [
  { 
    id: 'member-1', 
    name: "Alex Rivers",
    role: "Creative Strategist",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", 
    label: "VISIONARY" 
  },
  { 
    id: 'member-2', 
    name: "Julian Thorne",
    role: "Creative Director",
    url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800", 
    label: "PRECISION" 
  },
  { 
    id: 'member-3', 
    name: "Sophia Chen",
    role: "Art Lead",
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800", 
    label: "CREATIVE" 
  }
];

const AgencySection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(1);

  const stats = [
    { label: 'Global Projects', value: '150+', icon: <Globe size={18} /> },
    { label: 'Awards Won', value: '24', icon: <Award size={18} /> },
    { label: 'Happy Clients', value: '80+', icon: <Users size={18} /> },
  ];

  const nextMember = () => {
    setActiveIdx((prev) => (prev + 1) % TEAM_MEMBERS.length);
  };

  const prevMember = () => {
    setActiveIdx((prev) => (prev - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length);
  };

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (info.offset.x > 50) prevMember();
    else if (info.offset.x < -50) nextMember();
  };

  return (
    <section id="agency" className="py-24 md:py-48 bg-[#fbfaf8] relative overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex flex-col justify-around items-center opacity-[0.04] z-0">
        <h2 className="text-[35vw] md:text-[30vw] font-serif font-bold italic tracking-tighter leading-none -rotate-12 translate-x-[-15%] select-none">Studio</h2>
        <h2 className="text-[30vw] md:text-[25vw] font-serif font-bold italic tracking-tighter leading-none -rotate-12 translate-x-[20%] select-none">Our Team</h2>
        <h2 className="text-[35vw] md:hidden font-serif font-bold italic tracking-tighter leading-none -rotate-12 translate-x-[-10%] opacity-40 select-none">Agency</h2>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles size={20} className="text-[#c5a059]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c5a059]">The Visionary Way</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-8 text-[#2d2a26]">
              WE ARE A <span className="text-[#c5a059]">FULL-SERVICE</span> STUDIO DRIVEN BY PURE PASSION.
            </h2>
            
            <p className="text-[#2d2a26]/60 text-lg leading-relaxed mb-10 max-w-lg">
              RUANG IMAJI specializes in high-end identity development and immersive visual content. We don't just create; we transform bold ideas into unforgettable, cinematic realities.
            </p>

            <div className="flex flex-wrap gap-8 md:gap-12 mt-12">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col gap-1"
                >
                  <div className="flex items-center gap-2 text-[#c5a059]">
                    {stat.icon}
                    <span className="text-3xl font-serif font-bold text-[#2d2a26]">{stat.value}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/30">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="relative w-full z-20 mt-16 lg:mt-0">
            <div className="text-center mb-8 md:mb-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={TEAM_MEMBERS[activeIdx].id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#2d2a26]">{TEAM_MEMBERS[activeIdx].name}</h3>
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#c5a059]">{TEAM_MEMBERS[activeIdx].role}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative w-full h-[450px] md:h-[600px] flex items-center justify-center perspective-[1500px]">
              <motion.div 
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing transform-gpu"
              >
                {TEAM_MEMBERS.map((member, index) => {
                  let offset = index - activeIdx;
                  
                  if (offset > 1) offset -= 3;
                  if (offset < -1) offset += 3;

                  const isCenter = index === activeIdx;
                  const absOffset = Math.abs(offset);

                  return (
                    <motion.div
                      key={member.id}
                      initial={false}
                      animate={{
                        x: offset * (window.innerWidth < 768 ? 130 : 220),
                        scale: 1 - absOffset * 0.22,
                        rotateY: offset * -38,
                        zIndex: 10 - absOffset,
                        opacity: 1 - absOffset * 0.45,
                      }}
                      transition={{ type: "spring", stiffness: 120, damping: 22 }}
                      onClick={() => setActiveIdx(index)}
                      className="absolute w-[180px] md:w-[300px] aspect-[4/6] rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border-[6px] md:border-[10px] border-white transform-gpu isolation-auto"
                      style={{ 
                        isolation: 'isolate',
                        boxShadow: isCenter 
                          ? '0 60px 120px -30px rgba(197, 160, 89, 0.4)' 
                          : '0 25px 50px -12px rgba(0,0,0,0.15)'
                      }}
                    >
                      <motion.img 
                        src={member.url} 
                        alt={member.name} 
                        animate={{ filter: isCenter ? 'grayscale(0%)' : 'grayscale(100%)' }}
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />
                      
                      <div className="absolute top-8 left-8">
                        <span className="text-[8px] md:text-[9px] font-bold text-white bg-black/30 backdrop-blur-xl px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-white/30 shadow-sm">
                          {member.label}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8">
              <motion.button 
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevMember}
                className="w-14 h-14 rounded-full bg-white border border-[#2d2a26]/5 text-[#c5a059] flex items-center justify-center shadow-xl hover:bg-[#c5a059] hover:text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </motion.button>

              <div className="flex gap-2.5">
                {TEAM_MEMBERS.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveIdx(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${activeIdx === i ? 'w-10 bg-[#c5a059]' : 'w-2 bg-[#2d2a26]/10'}`}
                  />
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextMember}
                className="w-14 h-14 rounded-full bg-[#c5a059] text-white flex items-center justify-center shadow-xl hover:bg-[#b38d47] transition-colors"
              >
                <ChevronRight size={24} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgencySection;