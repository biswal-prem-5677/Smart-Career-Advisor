import React, { useState, useEffect } from 'react';
import { CheckCircle2, Upload, Cpu, FileText, Globe, Zap, Users, Shield, Award, TrendingUp, BookOpen, Layers, X, Target, BarChart2, Compass, MessageCircle, PlayCircle, ArrowRight, Sparkles } from 'lucide-react';

const LandingPage = ({ onUploadFocus }) => {
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Parallax Effect Logic
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const featureDetails = [
        {
            title: "Skill Extraction",
            icon: Cpu,
            desc: "Our AI analyzes student resumes, transcripts, and portfolios to detect both technical and soft skills. This helps identify strengths such as programming languages, tools, domain knowledge, communication skills, and problem-solving capabilities—all without manual entry."
        },
        {
            title: "Job Trends Analytics",
            icon: TrendingUp,
            desc: "We track real-time labor market data from job portals to understand which roles, skills, and industries are in demand. This ensures recommendations stay aligned with future workforce needs rather than outdated assumptions."
        },
        {
            title: "Skill Gap Mapping",
            icon: Zap,
            desc: "By comparing a student’s current skillset with the requirements of trending careers, our platform highlights missing skills and recommends actionable steps to bridge those gaps—making career planning more targeted and efficient."
        },
        {
            title: "Fit Score",
            icon: Target,
            desc: "Using AI-powered similarity matching, we compute personalized Fit Scores that indicate how well a student aligns with different career paths. This helps students explore roles they may not have considered yet, while validating their strongest options."
        },
        {
            title: "Mentorship Match",
            icon: Users,
            desc: "(Optional Feature) We connect students with alumni and industry professionals who have succeeded in the roles that match their profiles. Mentors provide guidance, portfolio review, and roadmaps to accelerate career readiness."
        },
        {
            title: "Multi-Language Support",
            icon: Globe,
            desc: "To make career guidance accessible for students across regions, the platform supports multiple languages including English, Hindi, and Odia. This reduces barriers for first-generation learners and promotes inclusive learning."
        },
        {
            title: "Course Recommendations",
            icon: BookOpen,
            desc: "Based on identified skill gaps and Fit Scores, the platform recommends curated learning resources and certifications through Coursera, Udemy, Google Career Certificates, and more—creating a guided, outcome-oriented learning path."
        },
        {
            title: "Progress Tracking",
            icon: BarChart2,
            desc: "Students can monitor their growth as they complete courses, acquire new skills, or update portfolios. The system dynamically updates Fit Scores and roadmaps, providing continuous career optimization instead of a one-time assessment."
        }
    ];

    return (
        <div className="relative overflow-hidden">

            {/* Custom 3D & Dark Mode Styles */}
            <style>{`
                .perspective-container {
                    perspective: 1000px;
                }
                .card-3d {
                    transition: transform 0.1s ease-out;
                    transform-style: preserve-3d;
                }
                .floating {
                    animation: float 6s ease-in-out infinite;
                }
                .floating-delayed {
                    animation: float 6s ease-in-out infinite 3s;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(2deg); }
                }
                .glass-card-pro {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
                }
                /* Dark Mode Overrides */
                .dark-theme .glass-card-pro {
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }
                .dark-theme .text-slate-900 { color: #f8fafc; }
                .dark-theme .text-slate-800 { color: #f1f5f9; }
                .dark-theme .text-slate-700 { color: #e2e8f0; }
                .dark-theme .text-slate-600 { color: #cbd5e1; }
                .dark-theme .text-slate-500 { color: #94a3b8; }
                .dark-theme .bg-white { background-color: #1e293b; }
                .dark-theme .border-slate-100 { border-color: rgba(255, 255, 255, 0.1); }
                .dark-theme .hover\\:bg-slate-50:hover { background-color: #334155; }
            `}</style>

            {/* Feature Modal Overlay */}
            {selectedFeature && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-enter">
                    <div className="glass-card-pro rounded-3xl max-w-2xl w-full p-8 relative animate-zoom-out">
                        <button
                            onClick={() => setSelectedFeature(null)}
                            className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors dark:text-gray-300"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
                                <selectedFeature.icon size={40} />
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{selectedFeature.title}</h3>
                                <div className="w-16 h-1 bg-indigo-500 rounded-full mx-auto"></div>
                            </div>

                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
                                {selectedFeature.desc}
                            </p>

                            <button
                                onClick={() => setSelectedFeature(null)}
                                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* === HERO SECTION === */}
            <div className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 perspective-container">

                {/* 3D Background Elements */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl floating"></div>
                <div className="absolute bottom-20 right-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl floating-delayed"></div>

                <div className="relative z-10 text-center max-w-5xl mx-auto px-6">

                    {/* Headline with 3D Interaction */}
                    <h1
                        className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-tight card-3d"
                        style={{ transform: `rotateX(${-mousePos.y * 0.5}deg) rotateY(${mousePos.x * 0.5}deg)` }}
                    >
                        Find Your Perfect <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 animate-gradient-x relative inline-block">
                            Career Path
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl -z-10 mix-blend-multiply dark:mix-blend-screen"></div>
                        </span>
                    </h1>

                    <p className="mt-8 text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed animate-enter delay-100">
                        Unlock your potential with real-time market insights, skill gap analysis, and a personalized roadmap to success.
                    </p>

                    {/* Call to Action Buttons */}
                    <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center animate-enter delay-200">
                        <button
                            onClick={onUploadFocus}
                            className="group relative px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                            <span className="relative z-10">Start Analysis For Free</span>
                            <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                </div>
            </div>

            {/* === REST OF CONTENT (Styled) === */}
            <div className="space-y-32 py-12 relative z-10 max-w-7xl mx-auto px-6">

                {/* Why We Built This */}
                <section className="text-center">
                    <div className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-500/30 rounded-full text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
                        Our Mission
                    </div>
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-12">Bridging the Gap Between <br />Education & Employability</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {[
                            { icon: Cpu, title: "AI Skill Assessment", desc: "Instantly maps resume keywords to industry standards utilizing NLP." },
                            { icon: TrendingUp, title: "Market Insights", desc: "Real-time salary and demand data to make informed career choices." },
                            { icon: Globe, title: "Multi-Language Support", desc: "Accessible career guidance for regional language students (Hindi/Odia)." }
                        ].map((item, idx) => (
                            <div key={idx} className="glass-card-pro p-8 rounded-3xl hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 group">
                                <item.icon className="text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform" size={32} />
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Interactive Demo Flow */}
                <section className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-indigo-100 via-purple-100 to-emerald-100 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-emerald-900/30 -z-10 hidden md:block"></div>
                    <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-16">How It Works</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
                        {[
                            {
                                step: "01",
                                title: "Upload Job Description",
                                desc: "Drop target Job Description (PDF/TXT)",
                                icon: Upload,
                                action: () => {
                                    const fileInput = document.getElementById('resume-upload');
                                    if (fileInput) fileInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                            },
                            {
                                step: "02",
                                title: "AI Analysis",
                                desc: "Engine extracts skills & gaps",
                                icon: Zap,
                                action: null
                            },
                            {
                                step: "03",
                                title: "Get Roadmap",
                                desc: "Receive personalized learning path",
                                icon: Layers,
                                action: () => document.querySelector('button[type="submit"]')?.click()
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                onClick={item.action}
                                className={`glass-card-pro bg-white dark:bg-slate-800 p-8 rounded-3xl relative group transition-all duration-300 ${item.action ? 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20' : ''}`}
                            >
                                <div className={`w-14 h-14 mx-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-lg transition-colors ${item.action ? 'group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500' : ''}`}>
                                    {item.step}
                                </div>
                                <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>

                                {item.action && (
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 dark:text-indigo-400">
                                        <PlayCircle size={24} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Premium Features Grid */}
                <section>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">Premium Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {featureDetails.map((feat, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedFeature(feat)}
                                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                            >
                                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <feat.icon size={26} />
                                </div>
                                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{feat.title}</span>
                                <span className="text-xs text-slate-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click for details</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Impact Section */}
                <section className="bg-slate-900 rounded-3xl p-12 text-white overflow-hidden relative shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Empowering Your Future</h2>
                            <ul className="space-y-4">
                                {[
                                    "Build better portfolios with targeted projects",
                                    "Choose the right skills earlier in college",
                                    "Increase employability by 3x",
                                    "Access career clarity instantly"
                                ].map((text, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <CheckCircle2 className="text-emerald-400" size={20} />
                                        <span className="text-slate-300">{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { val: "500+", label: "Roles Analyzed" },
                                { val: "250+", label: "Skills Mapped" },
                                { val: "40%", label: "Demand Growth" },
                                { val: "4.8/5", label: "User Rating" },
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center hover:bg-white/20 transition-colors">
                                    <div className="text-3xl font-bold text-white mb-1">{stat.val}</div>
                                    <div className="text-xs text-indigo-200 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LandingPage;
