import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Mail, Send, ArrowUp, Phone, MapPin } from 'lucide-react';
import { NAV_LINKS, CATEGORIES } from '../constants';
import logo from "../assets/image/imaji_logo_1.png";

interface FooterProps {
  onLinkClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onLinkClick }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
  };

  const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.14 2.8-.23 5.6-.4 8.39-.18 2.37-1.18 4.75-3.04 6.27-1.99 1.62-4.8 2.06-7.14 1.34-2.45-.77-4.48-2.9-5.11-5.38-.72-2.73-.02-5.83 1.88-7.97 1.61-1.8 4.1-2.6 6.44-2.12.01 1.42-.01 2.84 0 4.26-1.16-.36-2.5-.2-3.41.6-.96.81-1.29 2.19-1.04 3.39.22 1.13 1.05 2.11 2.1 2.5 1.09.43 2.41.22 3.25-.6.94-.92 1.19-2.31 1.17-3.56-.01-3.69-.01-7.39-.01-11.08z" />
    </svg>
  );

  const socials = [
    { id: 'instagram', icon: <Instagram size={18} />, href: '#' },
    { id: 'tiktok', icon: <TikTokIcon />, href: '#' },
    { id: 'twitter', icon: <Twitter size={18} />, href: '#' },
    { id: 'telegram', icon: <Send size={18} className="rotate-[-20deg]" />, href: '#' },
  ];

  return (
    <footer className="bg-white pt-24 pb-12 border-t border-[#c5a059]/10 relative">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          <div className="lg:col-span-1 space-y-6">
            <div className="flex flex-col items-start">
              <img 
                src={logo} 
                alt="RUANG IMAJI" 
                className="h-32 md:h-44 w-auto object-contain -ml-6 -mb-6 grayscale brightness-50"
              />
              <p className="text-sm text-[#2d2a26]/60 leading-relaxed font-light pr-4 mt-2">
                Full-service creative studio specializing in cinematic visual narratives and timeless brand identity. Transforming bold ideas into immersive realities since 2018.
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              {socials.map((social) => (
                <motion.a
                  key={social.id}
                  href={social.href}
                  whileHover={{ y: -3, backgroundColor: '#c5a059', color: '#fff' }}
                  className="w-10 h-10 rounded-full border border-[#c5a059]/20 flex items-center justify-center text-[#c5a059] transition-all"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-[#2d2a26]">Company</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm text-[#2d2a26]/40 hover:text-[#c5a059] transition-all flex items-center gap-2 group"
                  >
                    <span className="w-0 h-[1px] bg-[#c5a059] group-hover:w-4 transition-all"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-[#2d2a26]">Expertise</h4>
            <ul className="grid grid-cols-1 gap-4">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <span className="text-sm text-[#2d2a26]/40 hover:text-[#2d2a26] cursor-default transition-all flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-[#c5a059]"></span>
                    {cat}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-[#2d2a26]">Connect</h4>
            <div className="space-y-6">
              <a href="mailto:hello@ruangimaji.id" className="flex items-start gap-4 group">
                <div className="mt-1 text-[#c5a059]"><Mail size={16} /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#2d2a26]/30 tracking-widest mb-1">Email Inquiry</p>
                  <p className="text-sm text-[#2d2a26] group-hover:text-[#c5a059] transition-colors">hello@ruangimaji.id</p>
                </div>
              </a>
              <a href="tel:+628988761937" className="flex items-start gap-4 group">
                <div className="mt-1 text-[#c5a059]"><Phone size={16} /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#2d2a26]/30 tracking-widest mb-1">Office Line</p>
                  <p className="text-sm text-[#2d2a26] group-hover:text-[#c5a059] transition-colors">+62 898 876 1937</p>
                </div>
              </a>
              <div className="flex items-start gap-4">
                <div className="mt-1 text-[#c5a059]"><MapPin size={16} /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#2d2a26]/30 tracking-widest mb-1">Location</p>
                  <p className="text-sm text-[#2d2a26] leading-relaxed">Creative Hub, Level 4<br />Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#f3eee5] pt-12 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[10px] text-[#2d2a26]/30 tracking-widest uppercase font-bold">
              &copy; {new Date().getFullYear()} RUANG IMAJI Creative Agency.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-[9px] text-[#2d2a26]/20 hover:text-[#c5a059] uppercase font-bold tracking-widest transition-colors">Privacy Policy</a>
              <span className="w-1 h-1 rounded-full bg-[#f3eee5]"></span>
              <a href="#" className="text-[9px] text-[#2d2a26]/20 hover:text-[#c5a059] uppercase font-bold tracking-widest transition-colors">Terms of Service</a>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <motion.button 
              onClick={scrollToTop}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a059] border-b border-transparent hover:border-[#c5a059] transition-all pb-1"
            >
              Back to top <ArrowUp size={14} />
            </motion.button>
            <div className="h-6 w-[1px] bg-[#f3eee5]" />
            <div className="text-[10px] text-[#2d2a26]/30 uppercase font-bold tracking-widest italic">
              Jakarta <span className="text-[#c5a059]">/</span> Indonesia
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a059]/5 rounded-full blur-[120px] pointer-events-none -mr-20 -mt-20" />
    </footer>
  );
};

export default Footer;