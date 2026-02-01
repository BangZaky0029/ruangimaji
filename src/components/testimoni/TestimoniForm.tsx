
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Plus, Trash2, Camera, Star, Loader2, CheckCircle2, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface TestimoniFormProps {
  onClose: () => void;
  onSubmit: (payload: any, profileFile?: File, workFiles?: File[]) => Promise<{ success: boolean; error?: string }>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const TestimoniForm: React.FC<TestimoniFormProps> = ({ onClose, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile Picture State
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | undefined>();
  const profileInputRef = useRef<HTMLInputElement>(null);

  // Project Works State
  const [workFiles, setWorkFiles] = useState<File[]>([]);
  const [workPreviews, setWorkPreviews] = useState<string[]>([]);
  const workInputRef = useRef<HTMLInputElement>(null);

  const [rating, setRating] = useState(5);
  const [formData, setFormData] = useState({
    client_name: '',
    client_title: '',
    message: ''
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setErrorMsg("Ukuran foto profil maksimal 5MB");
        return;
      }
      setErrorMsg(null);
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleWorkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 3 - workFiles.length;
    
    if (files.length > remainingSlots) {
      setErrorMsg(`Maksimal 3 foto project. Sisa slot: ${remainingSlots}`);
      return;
    }

    const validFiles = files.filter(f => {
      if (f.size > MAX_FILE_SIZE) {
        setErrorMsg(`File ${f.name} melebihi 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setErrorMsg(null);
      setWorkFiles(prev => [...prev, ...validFiles]);
      
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setWorkPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeWork = (index: number) => {
    setWorkFiles(prev => prev.filter((_, i) => i !== index));
    setWorkPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name || !formData.message) {
      setErrorMsg("Nama dan pesan wajib diisi");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const result = await onSubmit(
      { ...formData, rating }, 
      profileFile, 
      workFiles
    );

    if (result.success) {
      setIsSuccess(true);
      setTimeout(onClose, 3000);
    } else {
      setErrorMsg(result.error || "Gagal mengirim testimoni. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 px-6 bg-white/5 backdrop-blur-3xl rounded-[3.5rem] border border-white/10"
      >
        <div className="w-24 h-24 bg-[#c5a059] rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-[#c5a059]/40">
          <CheckCircle2 size={48} />
        </div>
        <h3 className="text-4xl font-serif font-bold text-white mb-4">Terima Kasih!</h3>
        <p className="text-white/40 text-sm tracking-[0.3em] uppercase max-w-sm mx-auto">Pengalaman Anda sangat berarti bagi perkembangan kreatif kami.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-3xl p-8 md:p-14 rounded-[3.5rem] border border-white/10 shadow-2xl overflow-y-auto max-h-[85vh] custom-scrollbar"
    >
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-3xl font-serif font-bold text-white leading-none">Berbagi Cerita</h3>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#c5a059] mt-2">Kolaborasi Anda, Inspirasi Kami</p>
        </div>
        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#c5a059] transition-all">
          <X size={20} />
        </button>
      </div>

      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold"
        >
          <AlertCircle size={16} /> {errorMsg}
        </motion.div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-10">
        
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row gap-8 items-center bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5">
          <div className="relative group shrink-0">
            <label className="block cursor-pointer">
              <div className="w-28 h-28 rounded-[2rem] overflow-hidden bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center group-hover:border-[#c5a059] transition-all relative">
                {profilePreview ? (
                  <img src={profilePreview} className="w-full h-full object-cover" alt="Profile preview" />
                ) : (
                  <Camera size={28} className="text-white/20 group-hover:text-[#c5a059]" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                   <Plus size={20} className="text-white" />
                </div>
              </div>
              <input 
                ref={profileInputRef}
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleProfileChange} 
              />
            </label>
            <p className="text-[8px] font-bold uppercase text-center mt-3 text-white/30 tracking-widest">Foto Profil</p>
          </div>

          <div className="flex-grow space-y-6 w-full">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nama Lengkap *</label>
              <input 
                required
                type="text"
                placeholder="Misal: Ahmad Fauzi"
                value={formData.client_name}
                onChange={e => setFormData({...formData, client_name: e.target.value})}
                className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#c5a059] focus:bg-white/10 transition-all text-white text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Jabatan / Perusahaan</label>
              <input 
                type="text"
                placeholder="CEO of Creative Studio"
                value={formData.client_title}
                onChange={e => setFormData({...formData, client_title: e.target.value})}
                className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#c5a059] focus:bg-white/10 transition-all text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Bagaimana Pengalaman Anda? *</label>
          <textarea 
            required
            rows={4}
            placeholder="Tuliskan kesan pesan hasil kolaborasi kita..."
            value={formData.message}
            onChange={e => setFormData({...formData, message: e.target.value})}
            className="w-full bg-white/5 border-2 border-white/5 rounded-[2.5rem] px-6 py-6 outline-none focus:border-[#c5a059] focus:bg-white/10 transition-all text-white text-sm placeholder:text-white/10 resize-none shadow-inner"
          />
        </div>

        {/* Project Gallery Upload */}
        <div className="space-y-5">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <ImageIcon size={14} className="text-[#c5a059]" />
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Hasil Project (Maks 3 Foto)</label>
            </div>
            <span className="text-[9px] font-bold text-[#c5a059] tracking-widest">{workFiles.length}/3</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {workPreviews.map((preview, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group bg-black/40"
              >
                <img src={preview} className="w-full h-full object-cover" alt={`Project preview ${idx}`} />
                <button 
                  type="button"
                  onClick={() => removeWork(idx)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
            {workFiles.length < 3 && (
              <label className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#c5a059] hover:bg-white/5 transition-all text-white/20 hover:text-[#c5a059]">
                <Plus size={24} />
                <span className="text-[8px] font-bold uppercase tracking-tighter">Tambah Foto</span>
                <input 
                  ref={workInputRef}
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  multiple 
                  onChange={handleWorkChange} 
                />
              </label>
            )}
          </div>
        </div>

        {/* Rating & Action */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-white/5">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Berikan Rating:</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${rating >= star ? 'bg-[#c5a059] text-white shadow-xl shadow-[#c5a059]/30 scale-110' : 'bg-white/5 text-white/20 hover:bg-white/10'}`}
                >
                  <Star size={18} fill={rating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto px-16 py-5 bg-[#c5a059] text-white rounded-2xl font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-[#c5a059]/40 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span className="ml-2">Mengirim Cerita...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Publish Story</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default TestimoniForm;
