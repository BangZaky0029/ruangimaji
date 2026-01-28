
//C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji\src\components\PackageSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Send, Zap } from 'lucide-react';
import { usePackages } from '../hooks/useSupabaseData';

// Helper to translate common creative agency terms
const translateFeature = (text: string): string => {
  const dictionary: Record<string, string> = {
    "1 Lead Photographer": "1 Fotografer Utama",
    "2 Professional Photographers": "2 Fotografer Profesional",
    "Lead + 2 Team Photographers": "Ketua + 2 Fotografer Tim",
    "4 Hours Session": "Sesi 4 Jam",
    "8 Hours Full Session": "Sesi Penuh 8 Jam",
    "Unlimited Hours (12h+)": "Jam Tak Terbatas (12 jam+)",
    "50 High-res Edited Photos": "50 Foto Edit Resolusi Tinggi",
    "150 High-res Edited Photos": "150 Foto Edit Resolusi Tinggi",
    "All Best Edited Photos": "Semua Foto Edit Terbaik",
    "Online Gallery Access": "Akses Galeri Online",
    "Physical Photo Album": "Album Foto Fisik",
    "Large Canvas Print": "Cetak Kanvas Besar",
    "1 Minute Highlight Film": "Film Highlight 1 Menit",
    "3-5 Minute Cinematic Film": "Film Sinematik 3-5 Menit",
    "10+ Minute Mini-Documentary": "Mini-Dokumenter 10+ Menit",
    "1 Videographer": "1 Videografer",
    "2 Videographers": "2 Videografer",
    "Full Production Crew": "Kru Produksi Lengkap",
    "Basic Color Grading": "Pewarnaan Dasar",
    "Drone Aerial Footage": "Rekaman Udara Drone",
    "4K Cinema Delivery": "Pengiriman Bioskop 4K",
    "Music Licensing": "Lisensi Musik",
    "Professional Sound Design": "Desain Suara Profesional",
    "Social Media Teasers": "Teaser Media Sosial",
  };

  // Try direct match
  if (dictionary[text]) return dictionary[text];

  // Try some generic replacements for numbers/hours
  let translated = text;
  translated = translated.replace(/Hours Session/g, "Jam Sesi");
  translated = translated.replace(/High-res Edited Photos/g, "Foto Edit Resolusi Tinggi");
  translated = translated.replace(/Minute Highlight Film/g, "Menit Film Highlight");

  return translated !== text ? translated : "";
};

// Helper to calculate savings from string like "Rp 4,9 JT" and "Rp 3,9 JT"
const calculateSavings = (original: string, discounted: string): string | null => {
  try {
    const parse = (str: string) => {
      const val = parseFloat(str.replace(/Rp /g, "").replace(/ JT/g, "").replace(/,/g, "."));
      return val;
    };
    const origVal = parse(original);
    const discVal = parse(discounted);
    if (isNaN(origVal) || isNaN(discVal)) return null;
    
    const diff = (origVal - discVal).toFixed(1);
    return `Rp ${diff.replace(".", ",")} JT`;
  } catch {
    return null;
  }
};

const PackageSection: React.FC = () => {
  const { packages, loading } = usePackages();
  
  const handleBooking = (pkg: any | 'Enterprise') => {
    const phoneNumber = "62895428433006";
    let message = "";

    if (pkg === 'Enterprise') {
      message = "Halo Ruang Imaji, saya tertarik dengan layanan Enterprise & Global Campaigns. Bisa bantu proses penawaran custom?";
    } else {
      const photoDetails = pkg.deliverables.photo.map((item: string) => `- ${item}`).join('\n');
      const videoDetails = pkg.deliverables.video.map((item: string) => `- ${item}`).join('\n');
      
      message = `Halo Ruang Imaji, saya tertarik untuk booking paket *${pkg.name}* (Harga Promo: ${pkg.discount}).\n\n` +
                `*Detail Photography:*\n${photoDetails}\n\n` +
                `*Detail Videography:*\n${videoDetails}\n\n` +
                `Bisa bantu proses selanjutnya?`;
    }
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <section id="packages" className="py-24 md:py-48 bg-[#fbfaf8] relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center text-[#c5a059]/40 animate-pulse">Loading packages...</div>
        </div>
      </section>
    );
  }

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
            Kami menawarkan berbagai paket produksi yang dirancang khusus untuk meningkatkan skala ambisi brand Anda. Mulai dari konten cepat hingga produksi sinema kelas atas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {packages.map((pkg, idx) => {
            const savings = calculateSavings(pkg.price, (pkg as any).discount);
            return (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-10 md:p-14 rounded-[3rem] bg-white border-2 transition-all duration-500 hover:shadow-2xl hover:shadow-[#c5a059]/5 group ${pkg.color}`}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif font-bold text-[#2d2a26]">{pkg.name}</h3>
                    <div className="flex flex-col">
                      <span className="text-sm text-[#2d2a26]/40 line-through decoration-[#c5a059]/40">{pkg.price}</span>
                      <span className="text-3xl font-bold text-[#c5a059]">{(pkg as any).discount}</span>
                    </div>
                    {savings && (
                      <div className="inline-block mt-2 px-3 py-1 bg-[#c5a059]/10 rounded-full border border-[#c5a059]/20">
                         <span className="text-[9px] font-bold text-[#c5a059] uppercase tracking-wider">
                           Anda Hemat {savings}
                         </span>
                      </div>
                    )}
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
                    <ul className="space-y-6">
                      {pkg.deliverables.photo.map((item, i) => {
                        const translation = translateFeature(item);
                        return (
                          <li key={i} className="flex items-start gap-4">
                            <Check size={16} className="text-[#c5a059] shrink-0 mt-0.5" /> 
                            <div className="flex flex-col">
                              <span className="text-sm text-[#2d2a26]/70 leading-relaxed font-medium">{item}</span>
                              {translation && <span className="text-[10px] text-[#2d2a26]/30 italic">{translation}</span>}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/30 mb-6 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" /> Videography
                    </h4>
                    <ul className="space-y-6">
                      {pkg.deliverables.video.map((item, i) => {
                        const translation = translateFeature(item);
                        return (
                          <li key={i} className="flex items-start gap-4">
                            <Check size={16} className="text-[#c5a059] shrink-0 mt-0.5" /> 
                            <div className="flex flex-col">
                              <span className="text-sm text-[#2d2a26]/70 leading-relaxed font-medium">{item}</span>
                              {translation && <span className="text-[10px] text-[#2d2a26]/30 italic">{translation}</span>}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#c5a059', color: '#fff' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBooking(pkg)}
                  className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${pkg.name === 'PREMIUM' ? 'bg-[#c5a059] text-white shadow-lg shadow-[#c5a059]/20' : 'bg-[#f3eee5] text-[#2d2a26]'}`}
                >
                  Secure Reservation <Send size={14} />
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-24 p-10 md:p-14 rounded-[3rem] bg-[#2d2a26] text-white flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h4 className="text-2xl md:text-3xl font-serif font-bold mb-4">Enterprise & Global Campaigns?</h4>
            <p className="text-white/40 text-sm leading-relaxed">
              Kami menyediakan manajemen produksi khusus untuk pemotretan komersial skala besar, proyek tujuan internasional, dan strategi konten multi-platform. Mari bangun proposal khusus untuk kebutuhan Anda.
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
