
//C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji\src\components\Navbar.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import logo from "../assets/image/imaji_logo_1.png";

interface NavbarProps {
  onLinkClick?: () => void;
  onLogoClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLinkClick, onLogoClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (onLinkClick) onLinkClick();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[130] transition-all duration-700 ${isScrolled ? 'bg-white/30 backdrop-blur-2xl py-4 border-b border-white/20' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => { if (onLogoClick) onLogoClick(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center cursor-pointer flex-shrink-0"
          >
            <img 
              src={logo}
              alt="RUANG IMAJI" 
              className="h-28 md:h-52 w-auto -my-20 md:-my-20"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  const textFallback = document.createElement('span');
                  textFallback.className = "text-xl font-bold tracking-tighter uppercase text-[#2d2a26] font-serif italic";
                  textFallback.innerText = "RUANG IMAJI";
                  parent.appendChild(textFallback);
                }
              }}
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10 ml-auto">
            {NAV_LINKS.map((link, idx) => (
              <motion.a 
                key={link.label} 
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.1 }} 
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2d2a26] hover:text-[#c5a059] transition-all relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#c5a059] transition-all group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>

          {/* Mobile Toggle - High Z-index ensures it stays above the overlay */}
          <div className="md:hidden flex items-center text-[#2d2a26]">
             <motion.button 
               whileTap={{ scale: 0.9 }}
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="w-12 h-12 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md border border-white/30 shadow-sm relative z-[150]"
             >
               <AnimatePresence mode="wait">
                 {isMobileMenuOpen ? (
                   <motion.div
                     key="close"
                     initial={{ rotate: -90, opacity: 0 }}
                     animate={{ rotate: 0, opacity: 1 }}
                     exit={{ rotate: 90, opacity: 0 }}
                     transition={{ duration: 0.2 }}
                   >
                     <X size={24} />
                   </motion.div>
                 ) : (
                   <motion.div
                     key="menu"
                     initial={{ rotate: 90, opacity: 0 }}
                     animate={{ rotate: 0, opacity: 1 }}
                     exit={{ rotate: -90, opacity: 0 }}
                     transition={{ duration: 0.2 }}
                   >
                     <Menu size={24} />
                   </motion.div>
                 )}
               </AnimatePresence>
             </motion.button>
          </div>
        </div>
      </nav>

      {/* Full Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-[#fbfaf8] z-[120] flex flex-col items-center justify-center min-h-[100dvh] w-full"
          >
            {/* Background Branding for Mobile Menu */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none flex flex-col justify-center items-center opacity-[0.02]">
              <h2 className="text-[40vw] font-serif font-black italic -rotate-12">Imaji</h2>
            </div>

             <div className="relative z-10 flex flex-col gap-10 text-center px-6">
                {NAV_LINKS.map((link, idx) => (
                  <motion.a 
                    key={link.label} 
                    href={link.href} 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.05) }}
                    onClick={(e) => handleNavClick(e, link.href)} 
                    className="text-5xl font-serif font-bold text-[#2d2a26] hover:text-[#c5a059] transition-colors leading-tight"
                  >
                    {link.label}
                  </motion.a>
                ))}
             </div>

             <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center w-full">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2d2a26]/20">Creative Studio / Jakarta</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
