import React from 'react';
import { motion } from 'framer-motion';
import { Check, Camera, Film } from 'lucide-react';
import { PACKAGES } from '../constants';
import type { Package } from '../constants';

const PackageSection: React.FC = () => {
  const handleBookPackage = (pkg: Package) => {
    const phoneNumber = "628988761937";
    const deliverablesText = [
      ...pkg.deliverables.photo.map(d => `• ${d}`),
      ...pkg.deliverables.video.map(d => `• ${d}`)
    ].join('\n');

    const message = `Halo Ruang Imaji,\n\nSaya tertarik untuk memesan paket *${pkg.name}* (${pkg.price}).\n\n*Detail Paket yang Termasuk:*\n${deliverablesText}\n\nApakah jadwal untuk paket ini tersedia? Terima kasih!`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="packages" className="py-32 bg-[#fbfaf8] relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#c5a059] font-bold uppercase tracking-widest text-xs mb-4 block"
          >
            Pricing & Packages
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-8 text-[#2d2a26]"
          >
            TAILORED SOLUTIONS FOR <br /><span className="italic text-[#c5a059]/40">YOUR VISION</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className={`p-10 rounded-[2.5rem] bg-white border ${pkg.color} flex flex-col shadow-xl shadow-[#2d2a26]/5`}
            >
              <h3 className="text-sm font-bold uppercase tracking-[0.4em] text-[#2d2a26]/30 mb-6 text-center">{pkg.name}</h3>
              
              <div className="flex flex-col items-center mb-10 border-b border-[#f3eee5] pb-8">
                <div className="flex items-center gap-2">
                   <span className="text-4xl font-serif font-light text-[#c5a059] mt-2">Rp</span>
                   <span className="text-6xl font-bold font-serif text-[#2d2a26] tracking-tighter">
                     {pkg.price.replace('Rp ', '')}
                   </span>
                </div>
                <span className="text-[#c5a059] text-[9px] font-bold uppercase tracking-[0.2em] mt-2">Starting from</span>
              </div>

              <div className="space-y-10 flex-grow mb-12">
                {/* Photo Deliverables */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-full bg-[#f3eee5] flex items-center justify-center text-[#c5a059]">
                      <Camera size={14} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2d2a26]/50">Photography</span>
                  </div>
                  <ul className="space-y-4">
                    {pkg.deliverables.photo.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-[#2d2a26]/70 leading-relaxed">
                        <Check size={14} className="text-[#c5a059] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Video Deliverables */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-full bg-[#f3eee5] flex items-center justify-center text-[#c5a059]">
                      <Film size={14} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2d2a26]/50">Cinematography</span>
                  </div>
                  <ul className="space-y-4">
                    {pkg.deliverables.video.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-[#2d2a26]/70 leading-relaxed">
                        <Check size={14} className="text-[#c5a059] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBookPackage(pkg)}
                className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] transition-all text-center shadow-lg ${
                pkg.name === 'PREMIUM' 
                  ? 'bg-[#c5a059] text-white hover:bg-[#b38d47] shadow-[#c5a059]/20' 
                  : 'bg-[#f3eee5] text-[#2d2a26] hover:bg-[#c5a059] hover:text-white shadow-transparent'
              }`}>
                Book Package
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackageSection;