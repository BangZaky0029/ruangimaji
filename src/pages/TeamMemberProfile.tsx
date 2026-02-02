// C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji-1\src\pages\TeamMemberProfile.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Mail, ExternalLink, ArrowLeft, Award, Zap, Loader2, AlertCircle } from 'lucide-react';
import { useTeamMemberAbout } from '../hooks/useSupabaseData';
import type { TeamMember } from '../hooks/useSupabaseData';

interface TeamMemberProfileProps {
    member: TeamMember;
    onBack: () => void;
    allMembers: TeamMember[];
    onNavigateToMember: (member: TeamMember) => void;
}

const TeamMemberProfile: React.FC<TeamMemberProfileProps> = ({ member, onBack, allMembers, onNavigateToMember }) => {
    const { about, loading, error } = useTeamMemberAbout(member.id);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fbfaf8] flex flex-col items-center justify-center gap-6">
                <Loader2 className="w-16 h-16 text-[#c5a059] animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a059]">Gathering Profile Data...</p>
            </div>
        );
    }

    if (error || !about) {
        return (
            <div className="min-h-screen bg-[#fbfaf8] flex flex-col items-center justify-center p-10 text-center">
                <AlertCircle className="w-16 h-16 text-red-400 mb-6" />
                <h2 className="text-2xl font-serif font-bold text-[#2d2a26] mb-4">Profile Not Found</h2>
                <p className="text-[#2d2a26]/40 mb-8 max-w-md">We couldn't retrieve the detailed information for this team member. Please try again later.</p>
                <button
                    onClick={onBack}
                    className="px-10 py-4 bg-[#c5a059] text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-[#c5a059]/20 transition-all hover:scale-105"
                >
                    Back to Studio
                </button>
            </div>
        );
    }

    const projects = [
        { url: about.project_1, id: 1 },
        { url: about.project_2, id: 2 },
        { url: about.project_3, id: 3 }
    ];

    const getThumbnailUrl = (url: string) => {
        if (!url) return null;
        // If it's an image link
        if (url.match(/\.(jpeg|jpg|gif|png|webp)/i)) {
            return url;
        }
        // If it's a website link, use a screenshot service
        if (url.startsWith('http')) {
            return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=800`;
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[#fbfaf8] pt-40 md:pt-48 pb-24"
        >
            <div className="container mx-auto px-6 md:px-12">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={onBack}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2d2a26]/40 hover:text-[#c5a059] transition-colors mb-20 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Studio
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                    {/* Left Side: Photo & Quick Bio */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-5 space-y-10"
                    >
                        <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden border-[8px] md:border-[12px] border-white shadow-2xl">
                            <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                            <div className="absolute top-6 left-6 md:top-8 md:left-8">
                                <span className="text-[9px] md:text-[10px] font-bold text-white bg-black/40 backdrop-blur-xl px-4 md:px-5 py-2 rounded-full uppercase tracking-widest border border-white/20 shadow-lg">
                                    {member.label}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-[#2d2a26]/5">
                            <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-[#c5a059] mb-4">Core Philosophy</h4>
                            <p className="text-xl md:text-2xl font-serif font-bold italic text-[#2d2a26] leading-relaxed">
                                "{about.motto}"
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Side: Detailed Profile */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-7 space-y-16"
                    >
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-[#2d2a26] leading-tight lg:leading-none">
                                {member.name}
                            </h1>
                            <p className="text-lg md:text-2xl text-[#c5a059] font-medium tracking-tight">
                                {member.role}
                            </p>
                            <div className="w-20 h-1 bg-[#c5a059]/20 rounded-full" />
                            <p className="text-[#2d2a26]/70 text-base md:text-lg leading-relaxed max-w-2xl font-light">
                                {about.bio}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                            {/* Expertise Section */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#c5a059]/10 flex items-center justify-center">
                                        <Zap size={16} className="text-[#c5a059]" />
                                    </div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2d2a26]">Expertise</h4>
                                </div>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {(about.expertise || []).map((exp) => (
                                        <span key={exp} className="px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-[#f3eee5] text-[9px] md:text-[10px] font-bold text-[#2d2a26] uppercase tracking-widest border border-[#c5a059]/10">
                                            {exp}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Achievements Section */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#c5a059]/10 flex items-center justify-center">
                                        <Award size={16} className="text-[#c5a059]" />
                                    </div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2d2a26]">Career Highlights</h4>
                                </div>
                                <ul className="space-y-4">
                                    {(about.achievements || []).map((ach) => (
                                        <li key={ach} className="flex items-start gap-3 text-sm text-[#2d2a26]/60">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] mt-1.5"></span>
                                            <span className="leading-relaxed">{ach}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="pt-12 border-t border-[#2d2a26]/5 flex flex-col sm:flex-row items-center gap-8 md:gap-12">
                            <div className="flex gap-4">
                                <motion.a
                                    whileHover={{ y: -3, backgroundColor: '#c5a059', color: '#fff' }}
                                    className="w-14 h-14 rounded-full border border-[#c5a059]/20 flex items-center justify-center text-[#c5a059] bg-white transition-all shadow-sm"
                                    href={about.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Instagram size={22} />
                                </motion.a>
                                {about.instagram_2 && (
                                    <motion.a
                                        whileHover={{ y: -3, backgroundColor: '#c5a059', color: '#fff' }}
                                        className="w-14 h-14 rounded-full border border-[#c5a059]/20 flex items-center justify-center text-[#c5a059] bg-white transition-all shadow-sm"
                                        href={about.instagram_2}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Instagram size={22} />
                                    </motion.a>
                                )}
                                <motion.a
                                    whileHover={{ y: -3, backgroundColor: '#c5a059', color: '#fff' }}
                                    className="w-14 h-14 rounded-full border border-[#c5a059]/20 flex items-center justify-center text-[#c5a059] bg-white transition-all shadow-sm"
                                    href={`mailto:hello@ruangimaji.id`}
                                >
                                    <Mail size={22} />
                                </motion.a>
                            </div>

                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={`https://wa.me/${about.whatsapp}`}
                                target="_blank"
                                className="w-full sm:w-auto px-12 py-6 bg-[#c5a059] text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-full shadow-xl shadow-[#c5a059]/20 flex items-center justify-center gap-4 group"
                            >
                                Collab with Me <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </motion.a>
                        </div>
                    </motion.div>
                </div>

                {/* Showcase Section */}
                <div className="mt-40">
                    <div className="flex items-center justify-between mb-20 px-0">
                        <div>
                            <span className="text-[#c5a059] font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">Selected Work</span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#2d2a26]">Best <span className="italic text-[#c5a059]">Projects</span></h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {projects.map((proj) => (
                            <motion.div
                                key={proj.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: proj.id * 0.1 }}
                                viewport={{ once: true }}
                                className={`group relative aspect-video rounded-3xl overflow-hidden bg-[#2d2a26] ${proj.url ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                onClick={() => proj.url && window.open(proj.url, '_blank')}
                            >
                                {proj.url ? (
                                    <>
                                        {/* Show thumbnail (image or website screenshot) */}
                                        {getThumbnailUrl(proj.url) ? (
                                            <img
                                                src={getThumbnailUrl(proj.url)!}
                                                alt={`Project ${proj.id}`}
                                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                                                onError={(e) => {
                                                    // Fallback if screenshot fails
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    const parent = (e.target as HTMLImageElement).parentElement;
                                                    if (parent) {
                                                        const placeholder = parent.querySelector('.placeholder-icon');
                                                        if (placeholder) placeholder.classList.remove('hidden');
                                                    }
                                                }}
                                            />
                                        ) : null}

                                        {/* Placeholder Icon (shown if no url or if img fails) */}
                                        <div className={`placeholder-icon absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-80 transition-opacity ${getThumbnailUrl(proj.url) ? 'hidden' : ''}`}>
                                            <ExternalLink size={40} className="text-[#c5a059]" />
                                        </div>

                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">View Experience</span>
                                                <ExternalLink size={12} className="text-white" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 bg-white flex items-center justify-center overflow-hidden">
                                        <img
                                            src="/IMG_3445.PNG"
                                            alt="Coming Soon Background"
                                            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale brightness-125"
                                        />
                                        <div className="relative z-10 flex flex-col items-center">
                                            <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.5em] border border-[#c5a059]/20 px-8 py-3 rounded-full bg-white/50 backdrop-blur-sm">
                                                Coming Soon
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute bottom-10 left-10">
                                    <p className={`text-[9px] font-bold uppercase tracking-[0.4em] mb-2 ${proj.url ? 'text-[#c5a059]' : 'text-[#c5a059]'}`}>Featured Production</p>
                                    <p className={`text-xl md:text-2xl font-serif font-bold ${proj.url ? 'text-white' : 'text-[#2d2a26]'}`}>Project {proj.id}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Navigation to Other Members */}
                <div className="mt-40 pt-24 border-t border-[#2d2a26]/5">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
                        <div className="max-w-2xl">
                            <span className="text-[#c5a059] font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Studio Collective</span>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-[#2d2a26] leading-tight text-balance">
                                Meet <span className="italic text-[#c5a059]">Other</span> Members
                            </h2>
                        </div>
                        <p className="hidden md:block text-[10px] font-bold uppercase tracking-[0.4em] text-[#2d2a26]/30 mb-2">
                            Ruang Imaji / Team
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {allMembers
                            .filter(m => m.id !== member.id)
                            .map((otherMember) => (
                                <motion.div
                                    key={otherMember.id}
                                    whileHover={{ y: -10 }}
                                    onClick={() => onNavigateToMember(otherMember)}
                                    className="group relative cursor-pointer bg-white rounded-[2.5rem] p-8 md:p-14 shadow-xl shadow-black/5 border border-[#2d2a26]/5 hover:border-[#c5a059]/30 transition-all overflow-hidden flex flex-col sm:flex-row items-center gap-8 md:gap-12"
                                >
                                    {/* Small Image Preview */}
                                    <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 md:border-8 border-[#f3eee5] shadow-2xl flex-shrink-0">
                                        <img
                                            src={otherMember.image_url}
                                            alt={otherMember.name}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                        />
                                    </div>

                                    <div className="flex-grow text-center sm:text-left space-y-6">
                                        <div>
                                            <span className="text-[9px] font-bold text-[#c5a059] uppercase tracking-[0.3em] bg-[#c5a059]/5 px-5 py-2 rounded-full mb-4 inline-block">
                                                {otherMember.label}
                                            </span>
                                            <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#2d2a26] group-hover:text-[#c5a059] transition-colors line-clamp-2 leading-tight">
                                                {otherMember.name}
                                            </h3>
                                            <p className="text-base text-[#2d2a26]/40 font-medium tracking-tight mt-2">
                                                {otherMember.role}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5a059] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                            View Profile <ArrowLeft size={14} className="rotate-180" />
                                        </div>
                                    </div>

                                    {/* Background Decorative Text */}
                                    <div className="absolute -right-12 -bottom-16 opacity-[0.02] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity">
                                        <h4 className="text-[12rem] font-serif font-black italic">{otherMember.label}</h4>
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TeamMemberProfile;
