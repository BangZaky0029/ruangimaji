
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ChevronRight, ChevronLeft, CheckCircle2, Loader2, Globe, Palette, Layout, Briefcase, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OrderFormProps {
  onClose: () => void;
  packages: any[];
  whatsappNumber: string;
}

const STEPS = [
  { id: 1, title: 'Pilih Paket', icon: <Layout size={18} /> },
  { id: 2, title: 'Profil Bisnis', icon: <Briefcase size={18} /> },
  { id: 3, title: 'Detail Website', icon: <Globe size={18} /> },
  { id: 4, title: 'Fitur & Konten', icon: <Palette size={18} /> },
  { id: 5, title: 'Konfirmasi', icon: <CheckCircle2 size={18} /> },
];

const formatIDR = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount).replace('Rp', 'Rp ');
};

const OrderForm: React.FC<OrderFormProps> = ({ onClose, packages, whatsappNumber }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1: Package
    selected_package_id: packages[0]?.id || '',
    selected_package_name: packages[0]?.name || '',
    selected_package_price: packages[0]?.discount_amount || 0,
    
    // Step 2: Business Profile
    customer_name: '',
    brand_name: '',
    business_description: '',
    email: '',
    whatsapp: '',
    city: '',
    
    // Step 3: Website Details
    website_type: 'Company Profile',
    custom_website_type: '',
    total_pages: '1–3 Halaman',
    design_style: [] as string[],
    color_preference: '',
    reference_url: '',
    
    // Step 4: Content & Features
    has_content: 'Sudah punya konten',
    form_features: ['Nama', 'Email', 'WhatsApp', 'Pesan'],
    social_integration: [] as string[],
    
    // Step 5: Final
    has_domain: 'Belum',
    domain_name: '',
    need_recommendation: false,
    additional_notes: '',
    agree_terms: false
  });

  const handleNext = () => setStep(s => Math.min(STEPS.length, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const toggleArrayItem = (key: 'design_style' | 'form_features' | 'social_integration', item: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].includes(item) 
        ? prev[key].filter(i => i !== item) 
        : [...prev[key], item]
    }));
  };

  const selectPackage = (pkg: any) => {
    setFormData(prev => ({
      ...prev,
      selected_package_id: pkg.id,
      selected_package_name: pkg.name,
      selected_package_price: pkg.discount_amount,
      // Default total pages based on package if necessary
      total_pages: pkg.tier === 'BASIC' ? '1–3 Halaman' : '4–5 Halaman'
    }));
    handleNext();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agree_terms) return;
    
    setIsSubmitting(true);
    try {
      // 1. Insert into Supabase - Correcting column names based on user feedback/error
      const { error } = await supabase.from('orders').insert([{
        customer_name: formData.customer_name,
        brand_name: formData.brand_name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        city: formData.city,
        website_type: formData.website_type === 'Lainnya' ? formData.custom_website_type : formData.website_type,
        total_pages: parseInt(formData.total_pages.split('–')[0]) || 1,
        page_range: formData.total_pages,
        design_style: formData.design_style,
        color_preference: formData.color_preference,
        reference_url: formData.reference_url,
        has_content: formData.has_content === 'Sudah punya konten',
        has_domain: formData.has_domain === 'Ya',
        domain_name: formData.domain_name,
        need_domain_recommendation: formData.need_recommendation,
        // Columns updated to match Supabase schema
        package_id: formData.selected_package_id,
        package_name_snapshot: formData.selected_package_name,
        package_price_snapshot: formData.selected_package_price,
        business_description: formData.business_description,
        social_media: {
            integrations: formData.social_integration,
            form_fields: formData.form_features
        },
        notes: formData.additional_notes,
        status: 'new'
      }]);

      if (error) throw error;

      // 2. Prepare WhatsApp Message
      const message = `📝 *FORM PEMESANAN WEBSITE - RUANG IMAJI*\n\n` +
        `*📦 PAKET DIPILIH*\n` +
        `- Paket: *${formData.selected_package_name}*\n` +
        `- Harga: *${formatIDR(formData.selected_package_price)}*\n\n` +
        `*1️⃣ PROFIL BISNIS*\n` +
        `- Nama PIC: ${formData.customer_name}\n` +
        `- Nama Brand: ${formData.brand_name}\n` +
        `- Deskripsi: ${formData.business_description}\n` +
        `- WhatsApp: ${formData.whatsapp}\n\n` +
        `*2️⃣ DETAIL WEBSITE*\n` +
        `- Jenis: ${formData.website_type === 'Lainnya' ? formData.custom_website_type : formData.website_type}\n` +
        `- Halaman: ${formData.total_pages}\n` +
        `- Gaya: ${formData.design_style.join(', ')}\n` +
        `- Warna: ${formData.color_preference}\n\n` +
        `*3️⃣ FITUR & KONTEN*\n` +
        `- Status Konten: ${formData.has_content}\n` +
        `- Integrasi Sosial: ${formData.social_integration.join(', ') || '-'}\n\n` +
        `*4️⃣ DOMAIN & LAINNYA*\n` +
        `- Punya Domain: ${formData.has_domain}\n` +
        `- Nama Domain: ${formData.domain_name || '-'}\n` +
        `- Catatan: ${formData.additional_notes || '-'}`;

      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
      onClose();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem. Mohon hubungi admin melalui WhatsApp secara manual.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-2 md:p-8"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl relative"
      >
        {/* Header */}
        <div className="p-6 md:p-10 border-b border-[#2d2a26]/5 flex justify-between items-center bg-[#fbfaf8]">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-[#c5a059] flex items-center justify-center text-white shadow-xl">
                <Layout size={24} />
             </div>
             <div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#2d2a26]">Mulai Project Website Anda</h2>
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#c5a059]">Isi informasi untuk mempermudah pengerjaan kami</p>
             </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-[#2d2a26]/10 flex items-center justify-center text-[#2d2a26] hover:bg-red-50 hover:text-red-500 transition-all"><X size={20} /></button>
        </div>

        {/* Steps Indicator */}
        <div className="px-6 md:px-10 py-5 bg-[#f3eee5]/30 flex justify-between items-center border-b border-[#2d2a26]/5 overflow-x-auto no-scrollbar gap-4">
           {STEPS.map((s) => (
             <div key={s.id} className="flex items-center gap-2 shrink-0">
                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${step >= s.id ? 'bg-[#c5a059] text-white shadow-md' : 'bg-white text-[#2d2a26]/20 border border-[#2d2a26]/10'}`}>
                   {step > s.id ? <Check size={14} /> : s.id}
                </div>
                <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${step === s.id ? 'text-[#c5a059]' : 'text-[#2d2a26]/20'}`}>
                   {s.title}
                </span>
                {s.id !== STEPS.length && <div className="w-4 h-[1px] bg-[#2d2a26]/10 ml-1" />}
             </div>
           ))}
        </div>

        {/* Form Content */}
        <div className="flex-grow overflow-y-auto p-6 md:p-10 scroll-smooth">
          <form id="order-form" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="text-center max-w-xl mx-auto mb-10">
                    <h3 className="text-2xl font-serif font-bold text-[#2d2a26] mb-2">Pilih Paket Layanan</h3>
                    <p className="text-sm text-[#2d2a26]/50">Pilih paket yang paling sesuai dengan kebutuhan bisnis Anda saat ini.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => selectPackage(pkg)}
                        className={`p-8 rounded-[2rem] border-2 text-left transition-all relative group flex flex-col h-full ${formData.selected_package_id === pkg.id ? 'border-[#c5a059] bg-[#c5a059]/5' : 'border-[#2d2a26]/5 bg-white hover:border-[#c5a059]/30'}`}
                      >
                        <div className="mb-4">
                          <span className="text-[9px] font-bold text-[#c5a059] uppercase tracking-widest">{pkg.tier}</span>
                          <h4 className="text-xl font-bold text-[#2d2a26]">{pkg.name}</h4>
                        </div>
                        <div className="text-2xl font-bold text-[#c5a059] mb-6">{formatIDR(pkg.discount_amount)}</div>
                        <div className="flex-grow space-y-3 mb-8">
                          {pkg.features.slice(0, 4).map((f: any) => (
                            <div key={f.id} className="flex items-start gap-2 text-[11px] text-[#2d2a26]/60">
                              <Check size={12} className="text-[#c5a059] shrink-0 mt-0.5" />
                              <span>{f.feature}</span>
                            </div>
                          ))}
                        </div>
                        <div className={`w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-center transition-all ${formData.selected_package_id === pkg.id ? 'bg-[#c5a059] text-white shadow-lg' : 'bg-[#f3eee5] text-[#2d2a26]/40'}`}>
                          {formData.selected_package_id === pkg.id ? 'PAKET TERPILIH' : 'PILIH PAKET INI'}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="bg-[#c5a059]/5 p-6 rounded-2xl border border-[#c5a059]/10 mb-8 flex items-center justify-between">
                     <div>
                       <span className="text-[9px] font-bold text-[#c5a059] uppercase tracking-widest block">Paket Terpilih</span>
                       <h4 className="text-lg font-bold text-[#2d2a26]">{formData.selected_package_name}</h4>
                     </div>
                     <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold text-[#c5a059] border-b border-[#c5a059]">Ubah Paket</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField label="Nama PIC / Pemesan" required value={formData.customer_name} onChange={(v:string) => setFormData({...formData, customer_name: v})} placeholder="Siapa yang kami hubungi?" />
                    <InputField label="Nama Brand / Usaha" required value={formData.brand_name} onChange={(v:string) => setFormData({...formData, brand_name: v})} placeholder="Contoh: Kedai Imaji" />
                    <div className="md:col-span-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40 mb-3 block">Deskripsi Bisnis / Visi Misi</label>
                       <textarea 
                         value={formData.business_description}
                         onChange={e => setFormData({...formData, business_description: e.target.value})}
                         placeholder="Ceritakan sedikit tentang bisnis Anda untuk kami tuangkan dalam website..."
                         className="w-full bg-[#f3eee5] border-none rounded-2xl px-6 py-4 outline-none min-h-[120px] text-sm focus:ring-2 focus:ring-[#c5a059] transition-all"
                       />
                    </div>
                    <InputField label="Nomor WhatsApp PIC" required type="tel" value={formData.whatsapp} onChange={(v:string) => setFormData({...formData, whatsapp: v})} placeholder="0812xxxxxxx" />
                    <InputField label="Email (Opsional)" type="email" value={formData.email} onChange={(v:string) => setFormData({...formData, email: v})} placeholder="bisnis@anda.com" />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-3">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Jenis Website</label>
                         <select 
                           value={formData.website_type} 
                           onChange={e => setFormData({...formData, website_type: e.target.value})}
                           className="w-full bg-[#f3eee5] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#c5a059] transition-all text-sm"
                         >
                            <option>Company Profile</option>
                            <option>Toko Online (Katalog)</option>
                            <option>Landing Page Produk</option>
                            <option>Personal Portfolio</option>
                            <option>Restoran / Menu Digital</option>
                            <option>Lainnya</option>
                         </select>
                      </div>

                      <div className="flex flex-col gap-3">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Alamat / Lokasi Bisnis</label>
                         <input 
                           type="text" 
                           placeholder="Kota atau alamat lengkap"
                           value={formData.city}
                           onChange={e => setFormData({...formData, city: e.target.value})}
                           className="w-full bg-[#f3eee5] border-none rounded-2xl px-6 py-4 outline-none text-sm"
                         />
                      </div>

                      <div className="md:col-span-2 space-y-4">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Tema Visual yang Diinginkan</label>
                         <div className="flex flex-wrap gap-3">
                            {['Modern', 'Minimalis', 'Profesional', 'Elegan', 'Playful', 'Dark Theme'].map(style => (
                              <button 
                                key={style}
                                type="button"
                                onClick={() => toggleArrayItem('design_style', style)}
                                className={`px-6 py-3 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${formData.design_style.includes(style) ? 'bg-[#c5a059] text-white border-[#c5a059]' : 'bg-white text-[#2d2a26]/40 border-[#2d2a26]/10'}`}
                              >
                                {style}
                              </button>
                            ))}
                         </div>
                      </div>

                      <InputField label="Warna Identitas (Contoh: Biru & Putih)" value={formData.color_preference} onChange={(v:string) => setFormData({...formData, color_preference: v})} placeholder="Hitam, Emas, Putih" />
                      <InputField label="Referensi Website (Jika ada)" value={formData.reference_url} onChange={(v:string) => setFormData({...formData, reference_url: v})} placeholder="https://apple.com" />
                   </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                   <div className="space-y-6">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Kesiapan Konten (Foto & Teks)</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {['Sudah punya konten', 'Minta tolong dibuatkan teks'].map(opt => (
                           <button 
                             key={opt}
                             type="button"
                             onClick={() => setFormData({...formData, has_content: opt})}
                             className={`p-5 rounded-2xl border text-left transition-all flex items-center justify-between ${formData.has_content === opt ? 'bg-[#c5a059]/5 border-[#c5a059] text-[#c5a059]' : 'bg-white border-[#2d2a26]/10 text-[#2d2a26]/60'}`}
                           >
                              <span className="font-bold text-sm">{opt}</span>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.has_content === opt ? 'border-[#c5a059] bg-[#c5a059]' : 'border-[#2d2a26]/10'}`}>
                                 {formData.has_content === opt && <Check size={10} className="text-white" />}
                              </div>
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Sosial Media yang Mau Dipasang</label>
                         <div className="grid grid-cols-2 gap-3">
                            {['Instagram', 'WhatsApp', 'TikTok', 'Facebook', 'LinkedIn'].map(s => (
                              <div key={s} className="flex items-center gap-2">
                                 <input 
                                   type="checkbox" 
                                   checked={formData.social_integration.includes(s)} 
                                   onChange={() => toggleArrayItem('social_integration', s)}
                                   className="w-4 h-4 accent-[#c5a059]"
                                 />
                                 <span className="text-xs font-medium text-[#2d2a26]/60">{s}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Fitur Tambahan</label>
                         <p className="text-[10px] text-[#c5a059] italic">*Tersedia gratis sesuai paket yang dipilih</p>
                         <div className="grid grid-cols-1 gap-2">
                            <div className="flex items-center gap-2">
                               <Check size={12} className="text-[#c5a059]" />
                               <span className="text-xs text-[#2d2a26]/60">Google Maps Integration</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <Check size={12} className="text-[#c5a059]" />
                               <span className="text-xs text-[#2d2a26]/60">WhatsApp Float Button</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-3">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Sudah Punya Domain?</label>
                         <div className="flex bg-[#f3eee5] rounded-2xl p-1.5">
                            {['Ya', 'Belum'].map(opt => (
                              <button 
                                key={opt} 
                                type="button"
                                onClick={() => setFormData({...formData, has_domain: opt})}
                                className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${formData.has_domain === opt ? 'bg-white text-[#c5a059] shadow-sm' : 'text-[#2d2a26]/40'}`}
                              >
                                {opt}
                              </button>
                            ))}
                         </div>
                      </div>
                      
                      {formData.has_domain === 'Ya' ? (
                        <InputField label="Nama Domain Anda" value={formData.domain_name} onChange={(v:string) => setFormData({...formData, domain_name: v})} placeholder="contoh: tokokami.com" />
                      ) : (
                        <div className="flex items-center gap-3 pt-6">
                           <input 
                             type="checkbox" 
                             id="recom"
                             checked={formData.need_recommendation} 
                             onChange={e => setFormData({...formData, need_recommendation: e.target.checked})}
                             className="w-4 h-4 accent-[#c5a059]"
                           />
                           <label htmlFor="recom" className="text-xs font-medium text-[#2d2a26]/60">Bantu cari nama domain yang bagus</label>
                        </div>
                      )}
                   </div>

                   <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Catatan Lain</label>
                      <textarea 
                        value={formData.additional_notes}
                        onChange={e => setFormData({...formData, additional_notes: e.target.value})}
                        placeholder="Ada hal lain yang mau ditanyakan atau disampaikan?"
                        className="w-full bg-[#f3eee5] border-none rounded-2xl px-6 py-4 outline-none min-h-[100px] text-sm focus:ring-1 focus:ring-[#c5a059]"
                      />
                   </div>

                   <div className="p-6 rounded-2xl bg-[#c5a059]/5 border border-[#c5a059]/20 flex items-start gap-4">
                      <input 
                        required
                        type="checkbox" 
                        id="terms"
                        checked={formData.agree_terms} 
                        onChange={e => setFormData({...formData, agree_terms: e.target.checked})}
                        className="w-5 h-5 accent-[#c5a059] mt-1 shrink-0"
                      />
                      <label htmlFor="terms" className="text-[11px] leading-relaxed text-[#2d2a26]/70">
                         Saya mengkonfirmasi pemesanan paket <span className="text-[#c5a059] font-bold">{formData.selected_package_name}</span>. Data yang saya isi benar dan akan dilanjutkan ke WhatsApp admin RUANG IMAJI.
                      </label>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 md:p-10 border-t border-[#2d2a26]/5 bg-[#fbfaf8] flex justify-between items-center">
           <button 
             onClick={handlePrev} 
             disabled={step === 1 || isSubmitting}
             className="px-6 py-3 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] text-[#2d2a26]/40 hover:text-[#2d2a26] flex items-center gap-2 transition-all disabled:opacity-0"
           >
              <ChevronLeft size={16} /> Kembali
           </button>

           {step < STEPS.length ? (
             <button 
               onClick={handleNext}
               className="px-10 py-4 bg-[#c5a059] text-white rounded-xl font-bold uppercase tracking-[0.3em] text-[10px] shadow-lg shadow-[#c5a059]/20 flex items-center gap-3 group"
             >
                Lanjutkan <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
           ) : (
             <button 
               type="submit"
               form="order-form"
               disabled={!formData.agree_terms || isSubmitting}
               className="px-12 py-5 bg-[#2d2a26] text-white rounded-xl font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
             >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> KIRIM KE WHATSAPP</>}
             </button>
           )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const InputField = ({ label, required, type = "text", value, onChange, placeholder }: any) => (
  <div className="flex flex-col gap-3">
    <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      required={required}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#f3eee5] border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#c5a059] transition-all text-sm placeholder:text-[#2d2a26]/20"
    />
  </div>
);

export default OrderForm;
