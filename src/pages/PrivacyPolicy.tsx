// C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji-1\src\pages\PrivacyPolicy.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Cookie, Mail, FileText } from 'lucide-react';

interface PrivacyPolicyProps {
    onNavigate?: (page: 'home' | 'privacy' | 'terms') => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onNavigate }) => {
    const sections = [
        {
            icon: <FileText size={24} />,
            title: "Information We Collect",
            content: "When you engage with RUANG IMAJI for creative services, we collect information necessary to deliver exceptional visual narratives. This includes your name, contact details, project requirements, and any creative briefs you share with us. We may also collect technical data when you visit our website to improve your browsing experience."
        },
        {
            icon: <Eye size={24} />,
            title: "How We Use Your Information",
            content: "Your information helps us craft personalized creative solutions. We use it to communicate about your projects, provide quotes, deliver services, and share updates about our work. We may showcase completed projects in our portfolio with your permission. Your data also helps us improve our services and understand client needs better."
        },
        {
            icon: <Lock size={24} />,
            title: "Data Protection & Security",
            content: "At RUANG IMAJI, we treat your information with the utmost care. We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. Our team is trained in data privacy best practices, and we regularly review our security protocols to ensure your information remains safe."
        },
        {
            icon: <Cookie size={24} />,
            title: "Cookies & Tracking",
            content: "Our website uses cookies to enhance your experience and analyze site traffic. These small data files help us remember your preferences and understand how you interact with our content. You can control cookie settings through your browser, though some features may be limited if you disable them."
        },
        {
            icon: <Shield size={24} />,
            title: "Third-Party Services",
            content: "We work with trusted partners to deliver our services, including cloud storage providers, communication platforms, and analytics tools. These partners are carefully selected and bound by strict confidentiality agreements. We never sell your personal information to third parties for marketing purposes."
        },
        {
            icon: <Mail size={24} />,
            title: "Your Rights & Choices",
            content: "You have the right to access, correct, or delete your personal information at any time. You can opt out of marketing communications while still receiving essential project-related updates. If you have questions about your data or wish to exercise your rights, contact us at hello@ruangimaji.id."
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[#fbfaf8] pt-32 md:pt-40 pb-24"
        >
            <div className="container mx-auto px-6 md:px-12 max-w-5xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="text-[#c5a059] font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Legal</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#2d2a26] mb-8 leading-tight">
                        Privacy <span className="italic text-[#c5a059]">Policy</span>
                    </h1>
                    <p className="text-[#2d2a26]/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Your privacy is paramount to us. This policy outlines how RUANG IMAJI collects, uses, and protects your personal information.
                    </p>
                    <p className="text-[#2d2a26]/40 text-sm mt-6">
                        Last Updated: February 2, 2026
                    </p>
                </motion.div>

                {/* Sections */}
                <div className="space-y-12">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white rounded-3xl p-8 md:p-12 border border-[#2d2a26]/5 shadow-sm hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-[#f3eee5] flex items-center justify-center text-[#c5a059] shrink-0">
                                    {section.icon}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2d2a26] mb-4">
                                        {section.title}
                                    </h2>
                                    <p className="text-[#2d2a26]/70 leading-relaxed text-base">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Contact Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-20 p-8 md:p-12 bg-[#2d2a26] rounded-3xl text-center"
                >
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                        Questions About Your Privacy?
                    </h3>
                    <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                        We're here to help. If you have any concerns or questions about how we handle your data, please don't hesitate to reach out.
                    </p>
                    <a
                        href="https://wa.me/6281995770190"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-10 py-4 bg-[#c5a059] hover:bg-[#b38d47] text-white font-bold uppercase tracking-[0.3em] text-[10px] rounded-full transition-all shadow-lg"
                    >
                        Get in Touch
                    </a>
                </motion.div>

                {/* Back to Home */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="mt-16 text-center"
                >
                    <button
                        onClick={() => onNavigate?.('home')}
                        className="text-[#2d2a26]/40 hover:text-[#c5a059] text-sm font-bold uppercase tracking-[0.3em] transition-all"
                    >
                        ← Back to Home
                    </button>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-40 right-0 w-64 h-64 bg-[#c5a059]/5 rounded-full blur-[120px] pointer-events-none -mr-20" />
            <div className="absolute bottom-40 left-0 w-64 h-64 bg-[#2d2a26]/5 rounded-full blur-[100px] pointer-events-none -ml-20" />
        </motion.div>
    );
};

export default PrivacyPolicy;
