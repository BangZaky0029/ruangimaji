
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BrandCarousel from '../components/BrandCarousel';
import WorkSection from '../components/WorkSection';
import AgencySection from '../components/AgencySection';
import PackageSection from '../components/PackageSection';
import ContactSection from '../components/ContactSection';
import CategoryGallery from '../components/CategoryGallery';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const [activeGallery, setActiveGallery] = useState<'Photo' | 'Video' | null>(null);

  const resetGalleryAndNavigate = () => {
    setActiveGallery(null);
  };

  const handleStartProject = () => {
    const phoneNumber = "628988761937";
    const message = "Halo Ruang Imaji, saya tertarik untuk mulai project baru. Bisa ngobrol sebentar?";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative w-full overflow-x-hidden bg-[#fbfaf8]"
    >
      <Navbar 
        onLogoClick={() => setActiveGallery(null)} 
        onLinkClick={resetGalleryAndNavigate}
      />
      
      <AnimatePresence mode="wait">
        {!activeGallery ? (
          <motion.div 
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <main>
              {/* Home */}
              <div id="home">
                <Hero />
              </div>
              
              <BrandCarousel />

              {/* Agency */}
              <AgencySection />

              {/* Work */}
              <WorkSection onSeeAll={(type) => setActiveGallery(type)} />

              {/* Packages */}
              <PackageSection />

              {/* Contacts */}
              <ContactSection />

              {/* Cinematic Exit Section */}
              <section className="relative py-48 md:py-72 overflow-hidden bg-[#2d2a26] flex items-center justify-center text-white">
                  
                  {/* 
                      Infinite Vertical Scrolling Background Text (RUANG IMAJI)
                      Moving downwards infinitely, tall and condensed style
                  */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-[0.04] flex justify-around">
                    {[0, 1, 2, 3, 4].map((col) => (
                      <div key={col} className="flex flex-col flex-shrink-0">
                        <motion.div 
                          initial={{ y: "-50%" }}
                          animate={{ y: "0%" }}
                          transition={{ 
                            duration: 25 + (col * 4), 
                            repeat: Infinity, 
                            ease: "linear" 
                          }}
                          className="flex flex-col items-center"
                        >
                          {Array.from({ length: 15 }).map((_, i) => (
                            <div 
                              key={i} 
                              className="text-[12vw] font-black uppercase tracking-tighter leading-[0.8] py-2 scale-y-[1.5] origin-center"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              RUANG IMAJI
                            </div>
                          ))}
                        </motion.div>
                        {/* Loop clone */}
                        <motion.div 
                          initial={{ y: "-50%" }}
                          animate={{ y: "0%" }}
                          transition={{ 
                            duration: 25 + (col * 4), 
                            repeat: Infinity, 
                            ease: "linear" 
                          }}
                          className="flex flex-col items-center"
                        >
                          {Array.from({ length: 15 }).map((_, i) => (
                            <div 
                              key={i} 
                              className="text-[12vw] font-black uppercase tracking-tighter leading-[0.8] py-2 scale-y-[1.5] origin-center"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              RUANG IMAJI
                            </div>
                          ))}
                        </motion.div>
                      </div>
                    ))}
                  </div>

                  <div className="relative z-10 text-center max-w-4xl px-6">
                      <motion.h2 
                        initial={{ opacity: 0, y: 30 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        className="text-5xl md:text-8xl font-serif font-bold mb-12 drop-shadow-2xl"
                      >
                        CRAFTING <span className="italic text-[#c5a059]">IMMERSIVE</span> EXPERIENCES.
                      </motion.h2>
                      <motion.button 
                        whileHover={{ scale: 1.1, backgroundColor: '#b38d47' }} 
                        whileTap={{ scale: 0.9 }}
                        onClick={handleStartProject}
                        className="px-14 py-6 bg-[#c5a059] text-white font-bold uppercase tracking-[0.4em] text-sm shadow-2xl transition-all"
                      >
                        Start Your Project
                      </motion.button>
                  </div>
              </section>
            </main>
            <Footer onLinkClick={resetGalleryAndNavigate} />
          </motion.div>
        ) : (
          <CategoryGallery 
            key={`gallery-${activeGallery}`}
            type={activeGallery} 
            onBack={() => setActiveGallery(null)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;
