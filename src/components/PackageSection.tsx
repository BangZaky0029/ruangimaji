
// C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji-1\src\components\PackageSection.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Send, ChevronRight, Layout, Star } from 'lucide-react';
import { usePackages } from '../hooks/usePackages';
import type { Service, Package } from '../hooks/usePackages';

const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount).replace('Rp', 'Rp ');
};

/**
 * Enhanced dictionary-based "auto-translator" for agency, tech, and photography terms
 */
const autoTranslateToIndo = (text: string): string => {
  const dictionary: Record<string, string> = {
    // Branding & Design
    "Design Branding": "Desain Branding",
    "Basic Brand Guidelines": "Panduan Dasar Brand",
    "Feed Template Designs": "Desain Templat Feed",
    "Story Template Pack": "Paket Templat Story",
    "Content Creator": "Kreator Konten",
    "Feed Posts / Month": "Postingan Feed / Bulan",
    "Instagram Stories / Week": "Instagram Stories / Minggu",
    "Professional Caption Writing": "Penulisan Caption Profesional",
    "Content Scheduling & Posting": "Penjadwalan & Posting Konten",
    
    // Basic Tech & Web
    "Website": "Situs Web",
    "Up to": "Hingga",
    "Pages": "Halaman",
    "Responsive Design": "Desain Responsif",
    "Mobile Friendly": "Ramah Seluler",
    "Basic SEO Setup": "Pengaturan SEO Dasar",
    "Contact Form Integration": "Integrasi Formulir Kontak",
    "Social Media Integration": "Integrasi Media Sosial",
    "Fast Loading Speed Optimization": "Optimasi Kecepatan Loading Cepat",
    "1 Month Free Maintenance": "Gratis Pemeliharaan 1 Bulan",
    "Hosting Setup Guidance": "Panduan Pengaturan Hosting",
    "Custom UI/UX Design": "Desain UI/UX Kustom",
    "Fully Responsive & Mobile Optimized": "Responsif Sepenuhnya & Dioptimalkan untuk Seluler",
    "Advanced SEO Optimization": "Optimasi SEO Lanjutan",
    "CMS Integration": "Integrasi CMS",
    "Easy Content Update": "Pembaruan Konten Mudah",
    "Performance Optimization": "Optimasi Performa",
    "SSL Certificate": "Sertifikat SSL",
    "Basic Security": "Keamanan Dasar",
    "Google Analytics Integration": "Integrasi Google Analytics",
    "3 Months Maintenance & Support": "Pemeliharaan & Dukungan 3 Bulan",
    "Training Session for Content Management": "Sesi Pelatihan untuk Manajemen Konten",
    "Unlimited Pages": "Halaman Tanpa Batas",
    "Fully Custom Design System & Branding": "Sistem Desain & Branding Kustom Sepenuhnya",
    "Advanced Responsive Design (All Devices)": "Desain Responsif Lanjutan (Semua Perangkat)",
    "Enterprise SEO Strategy & Implementation": "Strategi & Implementasi SEO Tingkat Perusahaan",
    "Headless CMS + API Integration": "Integrasi Headless CMS + API",
    "E-commerce Ready (Shopping Cart System)": "Siap E-commerce (Sistem Keranjang Belanja)",
    "Maximum Performance (95+ PageSpeed Score)": "Performa Maksimal (Skor PageSpeed 95+)",
    "Advanced Security & WAF Protection": "Keamanan Lanjutan & Perlindungan WAF",
    "Advanced Analytics & Heatmap Tracking": "Analitik Lanjutan & Pelacakan Heatmap",
    "6 Months Full Maintenance & Updates": "Pemeliharaan & Pembaruan Penuh 6 Bulan",
    "Complete Training & Documentation": "Pelatihan & Dokumentasi Lengkap",
    "Priority Support & Dedicated Account Manager": "Dukungan Prioritas & Manajer Akun Khusus",
    
    // Photography & Wedding specific
    "Lead Photographer": "Fotografer Utama",
    "Assistant Photographers": "Asisten Fotografer",
    "Assistant Photographer": "Asisten Fotografer",
    "Unlimited Session Time": "Waktu Sesi Tanpa Batas",
    "Session Time": "Waktu Sesi",
    "Unlimited": "Tanpa Batas",
    "Professional Editing": "Editing Profesional",
    "Photo Session": "Sesi Foto",
    "Video Highlights": "Cuplikan Video",
    "Drone Footage": "Rekaman Drone",
    "High Resolution": "Resolusi Tinggi",
    "Full Gallery": "Galeri Lengkap",
    "Teaser Video": "Video Cuplikan",
    "Cinematic": "Sinematik",
    "Daily Content Posting": "Postingan Konten Harian",
    "Account Management": "Manajemen Akun",
    "Content Creation": "Pembuatan Konten",
    "Engagement Strategy": "Strategi Interaksi",
    "Monthly Report": "Laporan Bulanan",
    "Engagement Session": "Sesi Pertunangan",
    "Wedding Day": "Hari Pernikahan",
    "Prewedding": "Prewedding",
    "Hours of Coverage": "Jam Liputan",
    "Edited Photos": "Foto Terpilih (Sunting)",
    "All Raw Files": "Semua File Mentah",
    "Canvas Print": "Cetak Kanvas",
    "Premium Album": "Album Premium",
    "Wooden Box": "Kotak Kayu Exclusive"
  };

  // Try exact match first
  if (dictionary[text]) return dictionary[text];

  // Sorting keys by length descending to ensure longer phrases are replaced first
  const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);

  let translated = text;
  sortedKeys.forEach((en) => {
    const id = dictionary[en];
    const regex = new RegExp(en, 'gi');
    translated = translated.replace(regex, id);
  });

  return translated;
};

const PackageSection: React.FC = () => {
  const { services, loading } = usePackages();
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);

  const activeService = services[activeServiceIdx];

  const getTabLabel = (name: string) => {
    const cleanName = name.replace('Paket ', '').toUpperCase();
    if (cleanName.includes('WEBSITE')) return 'JASA PEMBUATAN WEBSITE';
    if (cleanName.includes('MEDSOS') || cleanName.includes('SOCIAL')) return 'KELOLA AKUN MEDSOS';
    if (cleanName.includes('PREWEDDING')) return 'PREWEDDING DAN WEDDING';
    return cleanName;
  };

  const handleBooking = (pkg: Package, service: Service) => {
    const phoneNumber = "62895428433006";
    const discountPrice = formatIDR(pkg.discount_amount);
    
    const featuresList = pkg.features
      .map(f => `- ${f.feature}`)
      .join('\n');
    
    const message = `Halo Ruang Imaji, saya tertarik untuk booking paket *${pkg.name}* dari layanan *${service.name}*.\n\n` +
                    `*Harga Promo:* ${discountPrice}\n\n` +
                    `*Detail Layanan:*\n${featuresList}\n\n` +
                    `Bisa bantu proses selanjutnya?`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <section id="packages" className="py-24 md:py-48 bg-[#fbfaf8] relative overflow-hidden flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#c5a059]/20 border-t-[#c5a059] rounded-full animate-spin" />
          <p className="text-[#c5a059] font-bold uppercase tracking-widest text-[10px]">Syncing Pricing Data...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="packages" className="py-24 md:py-48 bg-[#fbfaf8] relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-8xl font-serif font-bold text-[#2d2a26] leading-[1.1] tracking-tight mb-8">
            TRANSPARENT <br />
            <span className="italic text-[#c5a059]">CREATIVE</span> SOLUTIONS.
          </h2>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-24">
          <div className="inline-flex flex-wrap md:flex-nowrap gap-4 bg-white/50 backdrop-blur-xl p-3 rounded-[3rem] border border-[#c5a059]/5 shadow-2xl shadow-[#c5a059]/5 items-center">
            {services.map((service, idx) => (
              <button
                key={service.id}
                onClick={() => setActiveServiceIdx(idx)}
                className={`px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap relative group ${
                  activeServiceIdx === idx 
                    ? 'bg-[#c5a059] text-white shadow-lg shadow-[#c5a059]/30 ring-1 ring-black/80 scale-105' 
                    : 'text-[#2d2a26]/30 hover:text-[#2d2a26]'
                }`}
              >
                <span className="relative z-10">{getTabLabel(service.name)}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeService && (
            <motion.div
              key={activeService.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "circOut" }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {activeService.packages.map((pkg, idx) => {
                  const savings = pkg.price_amount - pkg.discount_amount;
                  return (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className={`relative p-10 md:p-14 rounded-[3rem] bg-white border-2 flex flex-col transition-all duration-700 hover:shadow-2xl hover:shadow-[#c5a059]/15 group ${
                        pkg.is_popular ? 'border-[#c5a059] shadow-xl shadow-[#c5a059]/5 scale-105 z-10' : 'border-[#c5a059]/5'
                      }`}
                    >
                      {/* Popular Badge */}
                      {pkg.is_popular && (
                        <div className="absolute top-8 right-8 bg-[#c5a059] text-white px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest shadow-lg animate-pulse flex items-center gap-2">
                          <Star size={10} fill="currentColor" /> POPULAR CHOICE
                        </div>
                      )}

                      <div className="mb-10">
                        <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.4em] mb-2 block">{pkg.tier}</span>
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#2d2a26] mb-6 leading-tight">{pkg.name}</h3>
                        
                        <div className="space-y-1">
                          <span className="text-xs text-[#2d2a26]/30 line-through block font-medium">
                            {formatIDR(pkg.price_amount)}
                          </span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl md:text-5xl font-bold text-[#c5a059] tracking-tighter">
                              {formatIDR(pkg.discount_amount)}
                            </span>
                          </div>
                          
                          {savings > 0 && (
                            <div className="inline-block mt-3 px-3 py-1 bg-[#f3eee5] rounded-lg border border-[#c5a059]/10">
                              <span className="text-[9px] font-bold text-[#c5a059] uppercase tracking-widest">
                                HEMAT {formatIDR(savings)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-grow mb-14">
                        <div className="space-y-6">
                          {pkg.features.map((feature) => (
                            <div key={feature.id} className="flex items-start gap-4 group/item">
                              <div className="w-5 h-5 rounded-full bg-[#f3eee5] flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-[#c5a059] transition-all duration-300">
                                <Check size={10} className="text-[#c5a059] group-hover/item:text-white transition-colors" />
                              </div>
                              <div className="flex flex-col">
                                <p className="text-[13px] md:text-sm text-[#2d2a26]/70 leading-relaxed font-medium">
                                  {feature.feature}
                                </p>

                                <p className="text-[10px] md:text-[11px] text-[#c5a059]/60 italic font-light mt-0.5">
                                  {autoTranslateToIndo(feature.feature)}
                                </p>

                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleBooking(pkg, activeService)}
                        className={`w-full py-5 rounded-[1.25rem] font-bold uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 transition-all ${
                          pkg.is_popular 
                            ? 'bg-[#c5a059] text-white shadow-xl shadow-[#c5a059]/20' 
                            : 'bg-[#fbfaf8] text-[#2d2a26]/60 border border-[#2d2a26]/5 hover:bg-[#c5a059] hover:text-white hover:shadow-lg'
                        }`}
                      >
                        SECURE RESERVATION <Send size={12} />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Service Description Footer */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-20 p-10 md:p-14 rounded-[3.5rem] bg-[#2d2a26] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#c5a059]/5 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="max-w-xl relative z-10 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-5">
                    <div className="w-10 h-10 bg-[#c5a059] rounded-xl flex items-center justify-center shadow-lg">
                      <Layout size={20} className="text-white" />
                    </div>
                    <h4 className="text-2xl font-serif font-bold tracking-tight">{activeService.name}</h4>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed font-light">
                    {activeService.description || "Kami menyediakan manajemen produksi khusus untuk proyek skala besar dan strategi konten multi-platform."}
                  </p>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(`https://wa.me/62895428433006?text=${encodeURIComponent(`Halo Ruang Imaji, saya ingin konsultasi mengenai ${activeService.name}.`)}`, '_blank')}
                  className="px-12 py-5 bg-[#c5a059] text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] whitespace-nowrap shadow-xl shadow-[#c5a059]/20 flex items-center gap-3 group relative z-10"
                >
                  GET CUSTOM QUOTATION <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PackageSection;
