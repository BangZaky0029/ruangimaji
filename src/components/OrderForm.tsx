
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ChevronRight, ChevronLeft, CheckCircle2, Loader2, Globe, Palette, Layout, Briefcase, Check, ChevronDown, Instagram, Facebook, Linkedin, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface OrderFormProps {
  onClose: () => void;
  packages: any[];
  whatsappNumber: string;
}

const STEPS = [
  { id: 1, title: 'Paket', icon: <Layout size={14} /> },
  { id: 2, title: 'Bisnis', icon: <Briefcase size={14} /> },
  { id: 3, title: 'Web', icon: <Globe size={14} /> },
  { id: 4, title: 'Fitur', icon: <Palette size={14} /> },
  { id: 5, title: 'Final', icon: <CheckCircle2 size={14} /> },
];

const TikTokIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.14 2.8-.23 5.6-.4 8.39-.18 2.37-1.18 4.75-3.04 6.27-1.99 1.62-4.8 2.06-7.14 1.34-2.45-.77-4.48-2.9-5.11-5.38-.72-2.73-.02-5.83 1.88-7.97 1.61-1.8 4.1-2.6 6.44-2.12.01 1.42-.01 2.84 0 4.26-1.16-.36-2.5-.2-3.41.6-.96.81-1.29 2.19-1.04 3.39.22 1.13 1.05 2.11 2.1 2.5 1.09.43 2.41.22 3.25-.6.94-.92 1.19-2.31 1.17-3.56-.01-3.69-.01-7.39-.01-11.08z" />
  </svg>
);

const formatIDR = (amount?: number) => {
  if (!amount) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount).replace('Rp', 'Rp ');
};

const OrderForm: React.FC<OrderFormProps> = ({ onClose, packages, whatsappNumber }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedPkg, setExpandedPkg] = useState<string | null>(packages[0]?.id || null);
  
  // Disable body scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const [formData, setFormData] = useState({
    // Step 1: Package
    selected_package_id: packages[0]?.id || '',
    selected_package_name: packages[0]?.name || '',
    selected_package_price: packages[0]?.discount_amount || 0,
    selected_package_tier: packages[0]?.tier || 'BASIC',
    
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
    custom_pages: '',
    design_style: [] as string[],
    color_preference: '',
    reference_url: '',
    
    // Step 4: Content & Features
    has_content: 'Sudah punya konten',
    form_features: ['Nama', 'Email', 'WhatsApp', 'Pesan'],
    social_links: {
      Instagram: '',
      TikTok: '',
      Facebook: '',
      LinkedIn: ''
    } as Record<string, string>,
    
    // Step 5: Final
    has_domain: 'Belum',
    domain_name: '',
    need_recommendation: false,
    additional_notes: '',
    agree_terms: false
  });

  const selectedPackageFeatures = useMemo(() => {
    const pkg = packages.find(p => p.id === formData.selected_package_id);
    return pkg?.features || [];
  }, [formData.selected_package_id, packages]);

  const handleNext = () => setStep(s => Math.min(STEPS.length, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const selectPackage = (pkg: any) => {
    let defaultPages = '1–3 Halaman';
    if (pkg.tier === 'PREMIUM') defaultPages = '7–8 Halaman';
    if (pkg.tier === 'PRO') defaultPages = 'Custom';

    setFormData(prev => ({
      ...prev,
      selected_package_id: pkg.id,
      selected_package_name: pkg.name,
      selected_package_price: pkg.discount_amount,
      selected_package_tier: pkg.tier,
      total_pages: defaultPages
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agree_terms) return;
    
    setIsSubmitting(true);
    try {
      const finalPages = formData.selected_package_tier === 'PRO' ? `${formData.custom_pages} Halaman` : formData.total_pages;
      
      const activeSocials = Object.entries(formData.social_links)
        .filter(([_, link]) => link.trim() !== "")
        .reduce((acc, [platform, link]) => ({ ...acc, [platform]: link }), {});

      const { error } = await supabase.from('orders').insert([{
        customer_name: formData.customer_name,
        brand_name: formData.brand_name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        city: formData.city,
        website_type: formData.website_type === 'Lainnya' ? formData.custom_website_type : formData.website_type,
        total_pages: parseInt(finalPages.split('–')[0]) || 1,
        page_range: finalPages,
        design_style: formData.design_style,
        color_preference: formData.color_preference,
        reference_url: formData.reference_url,
        has_content: formData.has_content === 'Sudah punya konten',
        has_domain: formData.has_domain === 'Ya',
        domain_name: formData.domain_name,
        need_domain_recommendation: formData.need_recommendation,
        package_id: formData.selected_package_id,
        package_name_snapshot: formData.selected_package_name,
        package_price_snapshot: formData.selected_package_price,
        business_description: formData.business_description,
        social_media: {
            links: activeSocials,
            form_fields: formData.form_features
        },
        notes: formData.additional_notes,
        status: 'new'
      }]);

      if (error) throw error;

      const featureText = selectedPackageFeatures.map((f: any) => `- ${f.feature}`).join('\n');
      const socialText = Object.entries(activeSocials).map(([p, l]) => `- ${p}: ${l}`).join('\n');

      const message = `📝 *FORM PEMESANAN WEBSITE - RUANG IMAJI*\n\n` +
        `*📦 PAKET DIPILIH*\n` +
        `- Paket: *${formData.selected_package_name}*\n` +
        `- Harga: *${formatIDR(formData.selected_package_price)}*\n` +
        `*Benefit/Fitur Paket:*\n${featureText}\n\n` +
        `*1️⃣ PROFIL BISNIS*\n` +
        `- Nama PIC: ${formData.customer_name}\n` +
        `- Nama Brand: ${formData.brand_name}\n` +
        `- Deskripsi: ${formData.business_description}\n\n` +
        `*2️⃣ DETAIL WEBSITE*\n` +
        `- Jenis: ${formData.website_type}\n` +
        `- Halaman: ${finalPages}\n` +
        `- Gaya: ${formData.design_style.join(', ')}\n\n` +
        `*3️⃣ FITUR & SOSIAL*\n` +
        `- Status Konten: ${formData.has_content}\n` +
        `*Links Sosial Media:*\n${socialText || '-'}\n\n` +
        `*4️⃣ DOMAIN*\n` +
        `- Punya Domain: ${formData.has_domain}\n` +
        `- Nama Domain: ${formData.domain_name || '-'}`;

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
      className="fixed inset-0 z-[999] bg-[#2d2a26]/95 backdrop-blur-3xl flex items-center justify-center p-0 md:p-8"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white md:rounded-[3.5rem] w-full max-w-5xl h-[100dvh] md:h-auto md:max-h-[92vh] overflow-hidden flex flex-col shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] relative"
      >
        {/* Header - Fixed Z-index */}
        <div className="px-6 py-5 md:px-12 md:py-10 border-b border-[#2d2a26]/5 flex justify-between items-center bg-[#fbfaf8] relative z-20">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-[#c5a059] flex items-center justify-center text-white shadow-xl shadow-[#c5a059]/20">
                <Layout size={24} className="md:w-8 md:h-8" />
             </div>
             <div>
                <h2 className="text-lg md:text-3xl font-serif font-bold text-[#2d2a26] leading-tight">Order Website</h2>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a059] mt-1">Langkah Mudah Wujudkan Website Impian</p>
             </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white border border-[#2d2a26]/10 flex items-center justify-center text-[#2d2a26] hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"><X size={20} /></button>
        </div>

        {/* Progress Bar & Steps */}
        <div className="px-6 py-4 md:px-12 md:py-6 bg-[#f3eee5]/40 border-b border-[#2d2a26]/5 overflow-x-auto no-scrollbar relative z-20">
           <div className="flex items-center justify-between min-w-[360px] md:min-w-0">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center gap-2 md:gap-3 shrink-0">
                  <div className={`w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold transition-all duration-500 ${step >= s.id ? 'bg-[#c5a059] text-white shadow-lg' : 'bg-white text-[#2d2a26]/20 border border-[#2d2a26]/10'}`}>
                    {step > s.id ? <Check size={14} className="md:w-5 md:h-5" /> : s.id}
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest ${step === s.id ? 'text-[#c5a059]' : 'text-[#2d2a26]/20'}`}>
                        {s.title}
                    </span>
                  </div>
                  {s.id !== STEPS.length && <div className={`w-3 md:w-8 h-[2px] transition-colors duration-500 ${step > s.id ? 'bg-[#c5a059]' : 'bg-[#2d2a26]/5'}`} />}
              </div>
            ))}
           </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-grow overflow-y-auto p-6 md:p-14 scroll-smooth bg-white custom-scrollbar relative z-10">
          <form id="order-form" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 max-w-4xl mx-auto">
                  <div className="text-center mb-12">
                    <h3 className="text-2xl md:text-4xl font-serif font-bold text-[#2d2a26] mb-3">Pilih Paket Layanan</h3>
                    <p className="text-sm md:text-lg text-[#2d2a26]/50 font-light">Eksplorasi paket kami dan tentukan yang terbaik untuk bisnis Anda.</p>
                  </div>
                  
                  <div className="flex flex-col gap-5">
                    {packages.map((pkg) => (
                      <div 
                        key={pkg.id} 
                        className={`rounded-[2rem] border-2 transition-all duration-500 overflow-hidden ${formData.selected_package_id === pkg.id ? 'border-[#c5a059] bg-[#c5a059]/[0.02] shadow-2xl shadow-[#c5a059]/5' : 'border-[#2d2a26]/5 bg-white hover:border-[#c5a059]/20'}`}
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedPkg(expandedPkg === pkg.id ? null : pkg.id)}
                          className={`w-full p-6 md:p-10 flex items-center justify-between text-left transition-colors ${expandedPkg === pkg.id ? 'bg-[#c5a059]/5' : ''}`}
                        >
                          <div className="flex items-center gap-6">
                            <div 
                              className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${formData.selected_package_id === pkg.id ? 'border-[#c5a059] bg-[#c5a059] text-white' : 'border-[#2d2a26]/10 text-transparent'}`}
                              onClick={(e) => { e.stopPropagation(); selectPackage(pkg); }}
                            >
                                <Check size={18} />
                            </div>
                            <div>
                                <span className="text-[9px] md:text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.4em] block mb-1">{pkg.tier}</span>
                                <h4 className="text-xl md:text-3xl font-serif font-bold text-[#2d2a26] leading-tight">{pkg.name}</h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-[#2d2a26]/30 line-through mb-1">{formatIDR(pkg.price_amount)}</p>
                                <p className="text-xl md:text-2xl font-bold text-[#c5a059]">{formatIDR(pkg.discount_amount)}</p>
                            </div>
                            <motion.div animate={{ rotate: expandedPkg === pkg.id ? 180 : 0 }} className="p-3 rounded-full bg-[#f3eee5]">
                              <ChevronDown size={24} className="text-[#c5a059]" />
                            </motion.div>
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {expandedPkg === pkg.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-[#2d2a26]/5 bg-white"
                            >
                              <div className="p-8 md:p-12">
                                <h5 className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                                    <span className="w-8 h-[1px] bg-[#c5a059]"></span>
                                    Included Features
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                  {pkg.features.map((f: any) => (
                                    <div key={f.id} className="flex items-start gap-4 text-xs md:text-sm text-[#2d2a26]/70 group">
                                      <div className="mt-1 w-5 h-5 rounded-full bg-[#c5a059]/10 flex items-center justify-center shrink-0 group-hover:bg-[#c5a059] group-hover:text-white transition-all">
                                        <Check size={10} />
                                      </div>
                                      <span className="leading-relaxed">{f.feature}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-12 flex justify-center md:justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      selectPackage(pkg);
                                      setStep(2);
                                    }}
                                    className="px-12 py-5 bg-[#2d2a26] text-white rounded-2xl font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-[#c5a059] transition-all shadow-xl shadow-[#2d2a26]/20"
                                  >
                                    PILIH PAKET INI
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 max-w-4xl mx-auto">
                  <div className="bg-[#c5a059] p-8 md:p-10 rounded-[2.5rem] text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full"></div>
                     <div className="relative z-10 text-center md:text-left">
                       <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/60 block mb-2">Paket Terpilih</span>
                       <h4 className="text-2xl md:text-4xl font-serif font-bold">{formData.selected_package_name}</h4>
                     </div>
                     <button type="button" onClick={() => setStep(1)} className="relative z-10 px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-[#c5a059] transition-all">Ganti Paket</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    <InputField label="Nama Lengkap / PIC" required value={formData.customer_name} onChange={(v:string) => setFormData({...formData, customer_name: v})} placeholder="Contoh: Zaky Aulia" />
                    <InputField label="Nama Brand / Usaha" required value={formData.brand_name} onChange={(v:string) => setFormData({...formData, brand_name: v})} placeholder="Nama Bisnis Anda" />
                    <div className="md:col-span-2">
                       <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40 mb-3 block">Ceritakan Bisnis Anda</label>
                       <textarea 
                         value={formData.business_description}
                         onChange={e => setFormData({...formData, business_description: e.target.value})}
                         placeholder="Visi, misi, atau bidang usaha Anda agar kami bisa menyesuaikan desain..."
                         className="w-full bg-[#f3eee5]/50 border-2 border-[#f3eee5] rounded-3xl px-6 py-5 outline-none min-h-[140px] text-sm md:text-base focus:border-[#c5a059] focus:bg-white transition-all shadow-inner"
                       />
                    </div>
                    <InputField label="WhatsApp (Aktif)" required type="tel" value={formData.whatsapp} onChange={(v:string) => setFormData({...formData, whatsapp: v})} placeholder="0812xxxxxxx" />
                    <InputField label="Email (Opsional)" type="email" value={formData.email} onChange={(v:string) => setFormData({...formData, email: v})} placeholder="bisnis@anda.com" />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 max-w-4xl mx-auto">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Jenis Website</label>
                         <select 
                           value={formData.website_type} 
                           onChange={e => setFormData({...formData, website_type: e.target.value})}
                           className="w-full bg-[#f3eee5]/50 border-2 border-[#f3eee5] rounded-2xl px-6 py-4 outline-none focus:border-[#c5a059] focus:bg-white transition-all text-sm font-medium appearance-none cursor-pointer"
                         >
                            <option>Company Profile</option>
                            <option>Toko Online / Katalog</option>
                            <option>Landing Page Produk</option>
                            <option>Personal Portfolio</option>
                            <option>Lainnya</option>
                         </select>
                      </div>
                      
                      <div className="space-y-3">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Jumlah Halaman</label>
                         <div className="space-y-4">
                            {formData.selected_package_tier === 'BASIC' && (
                                <div className="flex bg-[#f3eee5] rounded-2xl p-1.5 gap-2 border border-[#2d2a26]/5">
                                    {['1–3 Halaman', '4–5 Halaman'].map(opt => (
                                    <button 
                                        key={opt} 
                                        type="button"
                                        onClick={() => setFormData({...formData, total_pages: opt})}
                                        className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${formData.total_pages === opt ? 'bg-white text-[#c5a059] shadow-md' : 'text-[#2d2a26]/40'}`}
                                    >
                                        {opt}
                                    </button>
                                    ))}
                                </div>
                            )}
                            {formData.selected_package_tier === 'PREMIUM' && (
                                <div className="flex bg-[#f3eee5] rounded-2xl p-1.5 gap-2 border border-[#2d2a26]/5">
                                    {['7–8 Halaman', '9–10 Halaman'].map(opt => (
                                    <button 
                                        key={opt} 
                                        type="button"
                                        onClick={() => setFormData({...formData, total_pages: opt})}
                                        className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${formData.total_pages === opt ? 'bg-white text-[#c5a059] shadow-md' : 'text-[#2d2a26]/40'}`}
                                    >
                                        {opt}
                                    </button>
                                    ))}
                                </div>
                            )}
                            {formData.selected_package_tier === 'PRO' && (
                                <div className="space-y-4">
                                    <div className="p-5 bg-[#c5a059]/5 border border-[#c5a059]/20 rounded-2xl text-[11px] font-medium text-[#c5a059] flex items-center gap-3">
                                        <CheckCircle2 size={16} /> Paket PRO memungkinkan jumlah halaman kustom (Maksimal 15 Halaman)
                                    </div>
                                    <input 
                                        type="number"
                                        max="15"
                                        min="1"
                                        value={formData.custom_pages}
                                        onChange={(e) => setFormData({...formData, custom_pages: e.target.value})}
                                        placeholder="Tulis Jumlah Halaman (1-15)"
                                        className="w-full bg-[#f3eee5]/50 border-2 border-[#f3eee5] rounded-2xl px-6 py-4 outline-none focus:border-[#c5a059] focus:bg-white text-sm"
                                    />
                                </div>
                            )}
                         </div>
                      </div>

                      <div className="md:col-span-2 space-y-4">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Karakter Visual Website</label>
                         <div className="flex flex-wrap gap-3">
                            {['Modern', 'Minimalis', 'Elegan', 'Playful', 'Dark Mode'].map(style => (
                              <button 
                                key={style}
                                type="button"
                                onClick={() => {
                                    const next = formData.design_style.includes(style) 
                                        ? formData.design_style.filter(s => s !== style)
                                        : [...formData.design_style, style];
                                    setFormData({...formData, design_style: next});
                                }}
                                className={`px-7 py-3 rounded-full border-2 text-[10px] font-bold uppercase tracking-widest transition-all ${formData.design_style.includes(style) ? 'bg-[#c5a059] text-white border-[#c5a059] shadow-lg shadow-[#c5a059]/20' : 'bg-white text-[#2d2a26]/40 border-[#2d2a26]/10 hover:border-[#c5a059]/40'}`}
                              >
                                {style}
                              </button>
                            ))}
                         </div>
                      </div>

                      <InputField label="Preferensi Warna" value={formData.color_preference} onChange={(v:string) => setFormData({...formData, color_preference: v})} placeholder="Contoh: Gold & Black" />
                      <InputField label="Referensi Website (URL)" value={formData.reference_url} onChange={(v:string) => setFormData({...formData, reference_url: v})} placeholder="Contoh: https://apple.com" />
                   </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 max-w-4xl mx-auto">
                   <div className="space-y-6">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Kesiapan Konten (Teks & Foto)</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {['Sudah punya konten', 'Minta tolong dibuatkan teks'].map(opt => (
                           <button 
                             key={opt}
                             type="button"
                             onClick={() => setFormData({...formData, has_content: opt})}
                             className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${formData.has_content === opt ? 'bg-[#c5a059]/5 border-[#c5a059] text-[#c5a059]' : 'bg-white border-[#2d2a26]/5 text-[#2d2a26]/60'}`}
                           >
                              <span className="font-bold text-sm">{opt}</span>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.has_content === opt ? 'border-[#c5a059] bg-[#c5a059] text-white' : 'border-[#2d2a26]/10'}`}>
                                 {formData.has_content === opt && <Check size={12} />}
                              </div>
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-8">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40 block">Link Media Sosial</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-[#2d2a26]/60 mb-1">
                                <Instagram size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Instagram</span>
                            </div>
                            <input 
                                type="text" 
                                value={formData.social_links.Instagram}
                                onChange={(e) => handleSocialLinkChange('Instagram', e.target.value)}
                                placeholder="https://instagram.com/username"
                                className="w-full bg-[#f3eee5]/50 border-2 border-[#f3eee5] rounded-xl px-5 py-3.5 outline-none focus:border-[#c5a059] focus:bg-white text-sm transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-[#2d2a26]/60 mb-1">
                                <TikTokIcon /> <span className="text-xs font-bold uppercase tracking-widest">TikTok</span>
                            </div>
                            <input 
                                type="text" 
                                value={formData.social_links.TikTok}
                                onChange={(e) => handleSocialLinkChange('TikTok', e.target.value)}
                                placeholder="https://tiktok.com/@username"
                                className="w-full bg-[#f3eee5]/50 border-2 border-[#f3eee5] rounded-xl px-5 py-3.5 outline-none focus:border-[#c5a059] focus:bg-white text-sm transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-[#2d2a26]/60 mb-1">
                                <Facebook size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Facebook</span>
                            </div>
                            <input 
                                type="text" 
                                value={formData.social_links.Facebook}
                                onChange={(e) => handleSocialLinkChange('Facebook', e.target.value)}
                                placeholder="https://facebook.com/username"
                                className="w-full bg-[#f3eee5]/50 border-2 border-[#f3eee5] rounded-xl px-5 py-3.5 outline-none focus:border-[#c5a059] focus:bg-white text-sm transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-[#2d2a26]/60 mb-1">
                                <Linkedin size={18} /> <span className="text-xs font-bold uppercase tracking-widest">LinkedIn</span>
                            </div>
                            <input 
                                type="text" 
                                value={formData.social_links.LinkedIn}
                                onChange={(e) => handleSocialLinkChange('LinkedIn', e.target.value)}
                                placeholder="https://linkedin.com/in/username"
                                className="w-full bg-[#f3eee5]/50 border-2 border-[#f3eee5] rounded-xl px-5 py-3.5 outline-none focus:border-[#c5a059] focus:bg-white text-sm transition-all"
                            />
                        </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 max-w-4xl mx-auto">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">Sudah Punya Domain?</label>
                         <div className="flex bg-[#f3eee5] rounded-[1.5rem] p-2 gap-2 border border-[#2d2a26]/5">
                            {['Ya', 'Belum'].map(opt => (
                              <button 
                                key={opt} 
                                type="button"
                                onClick={() => setFormData({...formData, has_domain: opt})}
                                className={`flex-1 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${formData.has_domain === opt ? 'bg-white text-[#c5a059] shadow-lg' : 'text-[#2d2a26]/40 hover:text-[#2d2a26]'}`}
                              >
                                {opt}
                              </button>
                            ))}
                         </div>
                      </div>
                      
                      <div className="flex flex-col justify-end">
                        {formData.has_domain === 'Ya' ? (
                            <InputField label="Nama Domain" value={formData.domain_name} onChange={(v:string) => setFormData({...formData, domain_name: v})} placeholder="contoh: bisnisanda.com" />
                        ) : (
                            <div className="flex items-center gap-4 p-5 bg-[#c5a059]/5 border border-[#c5a059]/20 rounded-2xl h-full mt-auto">
                                <input 
                                    type="checkbox" 
                                    id="recom"
                                    checked={formData.need_recommendation} 
                                    onChange={e => setFormData({...formData, need_recommendation: e.target.checked})}
                                    className="w-6 h-6 accent-[#c5a059] shrink-0"
                                />
                                <label htmlFor="recom" className="text-sm font-medium text-[#2d2a26]/70 cursor-pointer">Bantu carikan rekomendasi nama domain</label>
                            </div>
                        )}
                      </div>
                   </div>

                   <div className="p-8 md:p-12 rounded-[3rem] bg-[#fbfaf8] border-2 border-[#c5a059]/20 shadow-xl relative overflow-hidden">
                      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                        <div className="shrink-0 pt-1">
                            <input 
                                required
                                type="checkbox" 
                                id="terms"
                                checked={formData.agree_terms} 
                                onChange={e => setFormData({...formData, agree_terms: e.target.checked})}
                                className="w-8 h-8 accent-[#c5a059] cursor-pointer"
                            />
                        </div>
                        <div className="space-y-8 flex-grow">
                            <div>
                                <h4 className="text-xl font-bold text-[#2d2a26] mb-2 leading-tight">
                                    Konfirmasi Pesanan Paket <span className="text-[#c5a059] font-serif italic">{formData.selected_package_name}</span>
                                </h4>
                                <p className="text-sm text-[#2d2a26]/50 font-medium">Data Anda akan segera kami teruskan ke tim WhatsApp RUANG IMAJI.</p>
                            </div>
                            
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-[#2d2a26]/5 shadow-sm">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-[#c5a059]/10 flex items-center justify-center text-[#c5a059]"><ExternalLink size={18} /></div>
                                    <h5 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c5a059]">Benefit Utama Paket:</h5>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                    {selectedPackageFeatures.map((f: any) => (
                                        <div key={f.id} className="flex items-start gap-3 text-[11px] md:text-xs text-[#2d2a26]/60">
                                            <div className="mt-0.5"><Check size={12} className="text-[#c5a059]" /></div>
                                            <span>{f.feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-6 md:px-12 md:py-10 border-t border-[#2d2a26]/5 bg-[#fbfaf8] flex items-center justify-between gap-4 relative z-20">
           <button 
             onClick={handlePrev} 
             disabled={step === 1 || isSubmitting}
             className="px-6 py-4 md:px-10 md:py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] text-[#2d2a26]/40 hover:text-[#2d2a26] hover:bg-white flex items-center gap-3 transition-all disabled:opacity-0"
           >
              <ChevronLeft size={18} /> <span className="hidden sm:inline">Kembali</span>
           </button>

           <div className="flex items-center gap-4">
                <button 
                    onClick={onClose}
                    type="button"
                    className="px-8 py-4 md:px-12 md:py-5 border-2 border-red-100 text-red-500 rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-red-50 transition-all shadow-sm"
                >
                    BATAL
                </button>
                {step < STEPS.length ? (
                    <button 
                        onClick={handleNext}
                        className="px-8 py-4 md:px-14 md:py-5 bg-[#c5a059] text-white rounded-2xl font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-[#c5a059]/30 flex items-center gap-4 group transition-all"
                    >
                        LANJUTKAN <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                ) : (
                    <button 
                        type="submit"
                        form="order-form"
                        disabled={!formData.agree_terms || isSubmitting}
                        className="px-8 py-4 md:px-14 md:py-5 bg-[#2d2a26] text-white rounded-2xl font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-[#2d2a26]/20 flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all group"
                    >
                        {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <><Send size={20} className="group-hover:rotate-12 transition-transform" /> KIRIM DATA</>}
                    </button>
                )}
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const InputField = ({ label, required, type = "text", value, onChange, placeholder }: any) => (
  <div className="flex flex-col gap-3">
    <label className="text-[10px] font-bold uppercase tracking-widest text-[#2d2a26]/40">
      {label} {required && <span className="text-red-500 font-bold ml-1">*</span>}
    </label>
    <input 
      required={required}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#f3eee5]/50 border-2 border-[#f3eee5] rounded-2xl px-6 py-4 outline-none focus:border-[#c5a059] focus:bg-white transition-all text-sm md:text-base placeholder:text-[#2d2a26]/20 shadow-inner"
    />
  </div>
);

export default OrderForm;
