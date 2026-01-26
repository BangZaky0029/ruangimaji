
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Send, Zap } from 'lucide-react';
import { PACKAGES, Package } from '../constants';

const PackageSection: React.FC = () => {
  const handleBooking = (pkg: Package | 'Enterprise') => {
    const phoneNumber = "62895428433006";
    let message = "";

    if (pkg === 'Enterprise') {
      message = "Halo Ruang Imaji, saya tertarik dengan layanan Enterprise & Global Campaigns. Bisa bantu proses penawaran custom?";
    } else {
      const photoDetails = pkg.deliverables.photo.map(item => `- ${item}`).join('\n');
      const videoDetails = pkg.deliverables.video.map(item => `- ${item}`).join('\n');
      
      message = `Halo Ruang Imaji, saya tertarik untuk booking paket *${pkg.name}* (${pkg.price}).\n\n` +
                `*Detail Photography:*\n${photoDetails}\n\n` +
                `*Detail Videography:*\n${videoDetails}\n\n` +
                `Bisa bantu proses selanjutnya?`;
    }
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="packages" className="py-24 md:py-48 bg-[#fbfaf8] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a059]/5 blur-[120px] rounded-full -mr-48 -mt-48" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl mb-24">
          <span className="text-[#c5a059] font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Investment Plans</span>
          <h2 className="text-5xl md:text-7xl font-serif font-bold text-[#2d2a26] leading-tight mb-8">
            TRANSPARENT <br /><span className="italic text-[#c5a059]">CREATIVE</span> SOLUTIONS.
          </h2>
          <p className="text-[#2d2a26]/40 text-lg leading-relaxed font-light">
            We offer specialized production tiers designed to scale with your brand's ambition. From quick-turn content to high-end cinema production.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {PACKAGES.map((pkg, idx) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-10 md:p-14 rounded-[3rem] bg-white border-2 transition-all duration-500 hover:shadow-2xl hover:shadow-[#c5a059]/5 group ${pkg.color}`}
            >
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-[#2d2a26] mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#c5a059]">{pkg.price}</span>
                  </div>
                </div>
                {pkg.name === 'PREMIUM' && (
                  <div className="bg-[#c5a059] text-white p-2.5 rounded-2xl shadow-lg">
                    <Zap size={18} fill="currentColor" />
                  </div>
                )}
              </div>

              <div className="space-y-12 mb-16">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/30 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" /> Photography
                  </h4>
                  <ul className="space-y-4">
                    {pkg.deliverables.photo.map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-sm text-[#2d2a26]/70 leading-relaxed">
                        <Check size={16} className="text-[#c5a059] shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/30 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" /> Videography
                  </h4>
                  <ul className="space-y-4">
                    {pkg.deliverables.video.map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-sm text-[#2d2a26]/70 leading-relaxed">
                        <Check size={16} className="text-[#c5a059] shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#c5a059', color: '#fff' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBooking(pkg)}
                className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${pkg.name === 'PREMIUM' ? 'bg-[#c5a059] text-white' : 'bg-[#f3eee5] text-[#2d2a26]'}`}
              >
                Secure Reservation <Send size={14} />
              </motion.button>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 p-10 md:p-14 rounded-[3rem] bg-[#2d2a26] text-white flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h4 className="text-2xl md:text-3xl font-serif font-bold mb-4">Enterprise & Global Campaigns?</h4>
            <p className="text-white/40 text-sm leading-relaxed">
              We provide bespoke production management for large-scale commercial shoots, international destination projects, and multi-platform content strategies. Let's build a custom proposal for your needs.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleBooking('Enterprise')}
            className="px-12 py-5 bg-[#c5a059] text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] whitespace-nowrap shadow-xl"
          >
            Request Quotation
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default PackageSection;
