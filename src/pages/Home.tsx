
//C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji\src\pages\Home.tsx
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
import PortfolioGrid from '../components/portfolio/PortfolioGrid';
import TestimoniForm from '../components/testimoni/TestimoniForm';
import TestimoniFloatingList from '../components/testimoni/TestimoniFloatingList';
import TestimoniPopUp from '../components/testimoni/TestimoniPopUp';
import TestimoniGalleryOverlay from '../components/testimoni/TestimoniGalleryOverlay';
import { useTestimoni } from '../hooks/useTestimoni';
import type { Testimonial } from '../hooks/useTestimoni';
import Footer from '../components/Footer';
import VideoModal from '../components/VideoModal';
import { PenTool, MessageSquare } from 'lucide-react';

const Home: React.FC = () => {
  const [activeGallery, setActiveGallery] = useState<'Photo' | 'Video' | null>(null);
  const [modalVideoUrl, setModalVideoUrl] = useState<string | null>(null);
  const [exitSectionView, setExitSectionView] = useState<'hero' | 'form'>('hero');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isTestimoniGalleryOpen, setIsTestimoniGalleryOpen] = useState(false);

  // Ambil loading state juga dari hook
  const { testimonials, submitTestimonial, loading: testimoniLoading } = useTestimoni();

  const resetGalleryAndNavigate = () => {
    setActiveGallery(null);
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
        onPortfolioClick={() => setActiveGallery('Photo')}
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
              <div id="home"><Hero /></div>
              <BrandCarousel />
              <AgencySection />
              <WorkSection onSeeAll={(type) => setActiveGallery(type)} onOpenVideo={(url) => setModalVideoUrl(url)} />
              <div id="portfolio"><PortfolioGrid /></div>
              <PackageSection />
              <ContactSection />

              {/* Cinematic Exit Section - Enhanced with Testimonials */}
              <section className="relative min-h-[100dvh] overflow-hidden bg-[#2d2a26] flex items-center justify-center text-white py-32">
                  
                  {/* Infinite Background Branding */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-[0.04] flex justify-around">
                    {[0, 1, 2, 3, 4].map((col) => (
                      <div key={col} className="flex flex-col flex-shrink-0">
                        <motion.div initial={{ y: "-50%" }} animate={{ y: "0%" }} transition={{ duration: 25 + (col * 4), repeat: Infinity, ease: "linear" }} className="flex flex-col items-center">
                          {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="text-[12vw] font-black uppercase tracking-tighter leading-[0.8] py-2 scale-y-[1.5] origin-center" style={{ fontFamily: "'Inter', sans-serif" }}>RUANG IMAJI</div>
                          ))}
                        </motion.div>
                        <motion.div initial={{ y: "-50%" }} animate={{ y: "0%" }} transition={{ duration: 25 + (col * 4), repeat: Infinity, ease: "linear" }} className="flex flex-col items-center">
                          {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="text-[12vw] font-black uppercase tracking-tighter leading-[0.8] py-2 scale-y-[1.5] origin-center" style={{ fontFamily: "'Inter', sans-serif" }}>RUANG IMAJI</div>
                          ))}
                        </motion.div>
                      </div>
                    ))}
                  </div>

                  {/* Floating Testimonials Layer */}
                  <AnimatePresence>
                    {exitSectionView === 'hero' && testimonials.length > 0 && (
                      <TestimoniFloatingList items={testimonials} onItemClick={(item) => setSelectedTestimonial(item)} />
                    )}
                  </AnimatePresence>

                  <div className="container mx-auto px-6 relative z-40">
                      <AnimatePresence mode="wait">
                        {exitSectionView === 'hero' ? (
                          <motion.div 
                            key="exit-hero"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8 }}
                            className="text-center max-w-4xl mx-auto"
                          >
                              <h2 className="text-5xl md:text-8xl font-serif font-bold mb-14 drop-shadow-2xl leading-[0.9] tracking-tighter uppercase">
                                CRAFTING <br /> <span className="italic text-[#c5a059]">IMMERSIVE</span> <br /> EXPERIENCES.
                              </h2>
                              
                              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                                <motion.button 
                                  whileHover={{ scale: 1.05, backgroundColor: '#c5a059' }} 
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setExitSectionView('form')}
                                  className="px-14 py-6 bg-transparent border-2 border-[#c5a059] text-white font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl transition-all flex items-center gap-4 group"
                                >
                                  <PenTool size={16} className="group-hover:rotate-12 transition-transform" />
                                  Write Your Experience
                                </motion.button>

                                <motion.button 
                                  whileHover={{ scale: 1.05, x: 5 }} 
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setIsTestimoniGalleryOpen(true)}
                                  className="px-14 py-6 bg-white/5 backdrop-blur-md border border-white/10 text-white/60 hover:text-white font-bold uppercase tracking-[0.4em] text-[10px] transition-all flex items-center gap-4 group"
                                >
                                  <MessageSquare size={16} className="text-[#c5a059]" />
                                  See More Stories
                                </motion.button>
                              </div>
                          </motion.div>
                        ) : (
                          <TestimoniForm 
                            key="exit-form" 
                            onClose={() => setExitSectionView('hero')} 
                            onSubmit={submitTestimonial}
                          />
                        )}
                      </AnimatePresence>
                  </div>

                  {/* Aesthetic Light Leaks */}
                  <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#c5a059]/5 rounded-full blur-[150px] pointer-events-none -mr-48 -mt-48" />
                  <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c5a059]/5 rounded-full blur-[120px] pointer-events-none -ml-40 -mb-40" />
              </section>
            </main>
            <Footer onLinkClick={resetGalleryAndNavigate} onPortfolioClick={() => setActiveGallery('Photo')} />
          </motion.div>
        ) : (
          <CategoryGallery key={`gallery-${activeGallery}`} type={activeGallery} onBack={() => setActiveGallery(null)} />
        )}
      </AnimatePresence>

      <VideoModal url={modalVideoUrl} onClose={() => setModalVideoUrl(null)} />
      
      <TestimoniPopUp item={selectedTestimonial} onClose={() => setSelectedTestimonial(null)} />

      <TestimoniGalleryOverlay 
        isOpen={isTestimoniGalleryOpen} 
        onClose={() => setIsTestimoniGalleryOpen(false)} 
        items={testimonials} 
        isLoading={testimoniLoading}
        onItemClick={(item) => {
          setIsTestimoniGalleryOpen(false);
          setSelectedTestimonial(item);
        }}
      />
    </motion.div>
  );
};

export default Home;
