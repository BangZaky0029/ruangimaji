// C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji-1\src\pages\TermsOfService.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Briefcase, Copyright, AlertTriangle, Scale, Clock } from 'lucide-react';

interface TermsOfServiceProps {
    onNavigate?: (page: 'home' | 'privacy' | 'terms') => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onNavigate }) => {
    const sections = [
        {
            icon: <FileCheck size={24} />,
            title: "Scope of Services",
            content: "RUANG IMAJI provides professional creative services including photography, videography, brand identity design, and visual storytelling. Each project is tailored to your specific needs through collaborative consultation. We deliver high-quality visual content that aligns with your brand vision and objectives. Services are provided based on agreed-upon contracts and project scopes."
        },
        {
            icon: <Briefcase size={24} />,
            title: "Client Obligations",
            content: "Clients are expected to provide clear project briefs, timely feedback, and necessary materials for production. Payment terms must be honored according to the agreed schedule. You're responsible for obtaining necessary permits or permissions for shoots at specific locations. Respect for our creative team and adherence to scheduled timelines ensures smooth project execution."
        },
        {
            icon: <Copyright size={24} />,
            title: "Intellectual Property",
            content: "Upon full payment, clients receive usage rights to the final delivered content as specified in the contract. RUANG IMAJI retains copyright and the right to showcase completed work in our portfolio unless otherwise agreed. Raw footage, drafts, and working files remain our property. We respect your brand confidentiality and any sensitive information shared during projects."
        },
        {
            icon: <Clock size={24} />,
            title: "Project Timelines & Revisions",
            content: "We commit to delivering projects within agreed timelines, though complex productions may require flexibility. Standard packages include a specified number of revision rounds. Additional revisions beyond the agreed scope may incur extra charges. Delays caused by client-side feedback or material provision may extend delivery timelines accordingly."
        },
        {
            icon: <AlertTriangle size={24} />,
            title: "Liability & Limitations",
            content: "While we strive for excellence in every project, RUANG IMAJI's liability is limited to the total project fee paid. We're not responsible for indirect damages or lost business opportunities. Force majeure events (natural disasters, government restrictions, etc.) may affect project delivery without liability. We maintain insurance coverage for equipment and professional liability."
        },
        {
            icon: <Scale size={24} />,
            title: "Cancellation & Refunds",
            content: "Project cancellations must be made in writing. Deposits are non-refundable once work has commenced. Cancellation fees apply based on project progress: 50% if canceled before production begins, 100% if canceled after production starts. Rush orders and expedited deliveries are subject to additional fees and availability."
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
                        Terms of <span className="italic text-[#c5a059]">Service</span>
                    </h1>
                    <p className="text-[#2d2a26]/60 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        These terms govern your use of RUANG IMAJI services. Please read them carefully before engaging with us.
                    </p>
                    <p className="text-[#2d2a26]/40 text-sm mt-6">
                        Last Updated: February 2, 2026
                    </p>
                </motion.div>

                {/* Intro Notice */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-[#c5a059]/10 border-l-4 border-[#c5a059] rounded-2xl p-6 md:p-8 mb-12"
                >
                    <p className="text-[#2d2a26]/80 leading-relaxed">
                        <strong className="text-[#2d2a26]">By engaging with RUANG IMAJI's services,</strong> you acknowledge and agree to these terms.
                        These terms constitute a legally binding agreement between you and RUANG IMAJI Creative Agency.
                        If you do not agree with any part of these terms, please do not use our services.
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

                {/* Dispute Resolution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="mt-12 p-8 md:p-12 bg-[#f3eee5] rounded-3xl"
                >
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-[#2d2a26] mb-4">
                        Governing Law & Dispute Resolution
                    </h3>
                    <p className="text-[#2d2a26]/70 leading-relaxed mb-4">
                        These terms are governed by the laws of Indonesia. Any disputes arising from our services will be resolved through good-faith negotiation.
                        If resolution cannot be reached, disputes will be subject to the jurisdiction of courts in Jakarta, Indonesia.
                    </p>
                    <p className="text-[#2d2a26]/70 leading-relaxed">
                        We value long-term relationships with our clients and will always strive to resolve any concerns amicably before pursuing formal proceedings.
                    </p>
                </motion.div>

                {/* Contact Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="mt-12 p-8 md:p-12 bg-[#2d2a26] rounded-3xl text-center"
                >
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                        Questions About These Terms?
                    </h3>
                    <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                        We're always happy to clarify any aspect of our terms. Reach out to us for personalized assistance or custom service agreements.
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
                    transition={{ duration: 0.6, delay: 1.1 }}
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

export default TermsOfService;
