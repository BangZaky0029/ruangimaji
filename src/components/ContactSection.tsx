// C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji\src\components\ContactSection.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, ChevronDown } from 'lucide-react';
// Fix: Import usePackages from its specific hook file and useCategories from Supabase data hook
import { useCategories } from '../hooks/useSupabaseData';
import { usePackages } from '../hooks/usePackages';

const ContactSection: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [isLocating, setIsLocating] = useState(false);

  // Fix: usePackages hook from usePackages.ts returns 'services' which contains nested packages
  const { services, loading: packagesLoading } = usePackages();
  const { categories, loading: categoriesLoading } = useCategories();

  const [formData, setFormData] = useState({
    name: '',
    selectedPackage: '',
    category: '',
    address: '',
    locationLink: ''
  });

  // Flatten services into a single packages array for the dropdown list
  const packages = (services || []).flatMap(s => s.packages || []);

  const handleGetLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
          setFormData(prev => ({
            ...prev,
            locationLink: mapLink,
            address: prev.address || "Lokasi saat ini (Link Terlampir)"
          }));
          setIsLocating(false);
        },
        () => {
          alert("Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation tidak didukung di browser ini.");
      setIsLocating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = "62895428433006";
    const message = `Halo RUANG IMAJI, saya *${formData.name}*.\n\nSaya ingin reservasi untuk:\n- *Paket*: ${formData.selectedPackage}\n- *Kategori*: ${formData.category}\n- *Alamat*: ${formData.address}\n${formData.locationLink ? `- *Link Lokasi*: ${formData.locationLink}` : ''}\n\nMohon informasi lebih lanjut. Terima kasih!`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const loading = packagesLoading || categoriesLoading;

  return (
    <section id="contact" className="py-32 md:py-48 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[500px] h-[500px] bg-[#c5a059]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#2d2a26]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">

          {/* Left Side: Info & Headline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#c5a059] font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Ready to Begin?</span>
            <h2 className="text-5xl md:text-7xl font-serif font-bold text-[#2d2a26] leading-tight mb-12">
              LET'S START A <br /><span className="italic text-[#c5a059]">CONVERSATION.</span>
            </h2>

            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-[#f3eee5] flex items-center justify-center text-[#c5a059] shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40 mb-1">Email Us</h4>
                  <p className="text-xl font-medium text-[#2d2a26]">hello@ruangimaji.id</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-[#f3eee5] flex items-center justify-center text-[#c5a059] shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40 mb-1">Call Us</h4>
                  <p className="text-xl font-medium text-[#2d2a26]">+62 898 876 1937</p>
                  <p className="text-xl font-medium text-[#2d2a26]">+62 895 4284 33006</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-[#f3eee5] flex items-center justify-center text-[#c5a059] shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40 mb-1">Visit Studio</h4>
                  <p className="text-xl font-medium text-[#2d2a26]">The Creative Hub, Level 4<br />Jakarta, Indonesia 12190</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Specialized Booking Form area */}
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2rem] bg-[#f3eee5] border border-[#c5a059]/10 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer group shadow-lg"
              onClick={() => setIsFormOpen(!isFormOpen)}
            >
              <div>
                <h4 className="text-lg font-bold mb-1 text-[#2d2a26]">Need a custom production?</h4>
                <p className="text-[#2d2a26]/40 text-xs">Large scale commercial projects or international expeditions.</p>
              </div>
              <button className="flex items-center gap-3 font-bold uppercase tracking-widest text-[10px] text-[#c5a059] group-hover:text-[#b38d47] whitespace-nowrap">
                Contact for Quotation
                <motion.div animate={{ rotate: isFormOpen ? 180 : 0 }}>
                  <ChevronDown size={16} />
                </motion.div>
              </button>
            </motion.div>

            <AnimatePresence mode="wait">
              {isFormOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden"
                >
                  {loading ? (
                    <div className="p-14 flex items-center justify-center">
                      <motion.img
                        src="/imajiLogo.svg"
                        className="w-12 h-12"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1, 0.95] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="p-8 md:p-14 rounded-[2.5rem] bg-[#fbfaf8] border border-[#c5a059]/10 shadow-2xl shadow-[#c5a059]/5 space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Nama Lengkap</label>
                          <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Contoh: Budi Santoso"
                            className="bg-[#f3eee5] border-none rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#c5a059] transition-all text-sm"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Paket</label>
                          <select
                            required
                            value={formData.selectedPackage}
                            onChange={(e) => setFormData({ ...formData, selectedPackage: e.target.value })}
                            className="bg-[#f3eee5] border-none rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#c5a059] text-sm"
                          >
                            <option value="">Pilih Paket</option>
                            {packages.map(pkg => (<option key={pkg.name} value={pkg.name}>{pkg.name}</option>))}
                            <option value="Custom">Custom Production</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Kategori</label>
                          <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="bg-[#f3eee5] border-none rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#c5a059] text-sm"
                          >
                            <option value="">Pilih Kategori</option>
                            {categories.map(cat => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
                          </select>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Alamat</label>
                          <div className="flex gap-2">
                            <input
                              required
                              type="text"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              placeholder="Alamat lengkap"
                              className="flex-grow bg-[#f3eee5] border-none rounded-xl px-4 py-3 text-sm"
                            />
                            <button
                              type="button"
                              onClick={handleGetLocation}
                              className="w-12 h-12 rounded-xl bg-[#f3eee5] flex items-center justify-center hover:bg-[#c5a059] hover:text-white transition-all shrink-0"
                            >
                              {isLocating ? <Loader2 className="animate-spin" size={18} /> : <MapPin size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-6 bg-[#c5a059] text-white font-bold uppercase tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-[#c5a059]/20 hover:bg-[#b38d47]"
                      >
                        Send to WhatsApp <Send size={18} />
                      </motion.button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;