import React, { useState, useEffect } from 'react';
import { CheckCircle2, Upload, Cpu, FileText, Globe, Zap, Users, Shield, Award, TrendingUp, BookOpen, Layers, X, Target, BarChart2, Compass, MessageCircle, PlayCircle, ArrowRight, Sparkles } from 'lucide-react';

const LandingPage = ({ onUploadFocus, onNavigate }) => {
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
        },
        {
            title: "Auto Mate Mail",
            icon: Sparkles,
            desc: "Instantly match with HR professionals from top companies like TCS, Microsoft, and Amazon. Our AI analyzes your resume and generates personalized emails, allowing you to apply with one click."
        }
    ];

    return (
        <div className="relative overflow-hidden bg-[#050816] min-h-screen text-slate-200">

            {/* Custom 3D Styles */}
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
                .pulse-glow {
                    animation: pulseGlow 3s ease-in-out infinite;
                }
                .shimmer {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    background-size: 200% 100%;
                    animation: shimmer 2s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(2deg); }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .glass-card-pro {
                    background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                }
                .glass-card-pro:hover {
                     border-color: rgba(99, 102, 241, 0.4);
                     background: rgba(30, 41, 59, 0.5);
                     transform: translateY(-4px) scale(1.02);
                     box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
                }
            `}</style>

            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[100px]"></div>
            </div>


            {/* Feature Modal Overlay */}
            {selectedFeature && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-enter">
                    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl max-w-2xl w-full p-8 relative animate-zoom-out shadow-2xl">
                        <button
                            onClick={() => setSelectedFeature(null)}
                            className="absolute top-6 right-6 p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 shadow-inner border border-indigo-500/20">
                                {(() => {
                                    const Icon = selectedFeature.icon;
                                    return <Icon size={40} />;
                                })()}
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold text-white mb-2">{selectedFeature.title}</h3>
                                <div className="w-16 h-1 bg-indigo-500 rounded-full mx-auto"></div>
                            </div>

                            <p className="text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
                                {selectedFeature.desc}
                            </p>

                            <button
                                onClick={() => setSelectedFeature(null)}
                                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-lg hover:bg-indigo-500 transition-all active:scale-95"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* === HERO SECTION === */}
            <div className="relative pt-24 pb-20 lg:pt-40 lg:pb-32 perspective-container z-10">
                <div className="relative z-10 text-center max-w-5xl mx-auto px-6">

                    {/* Headline with 3D Interaction */}
                    <h1
                        className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight leading-tight card-3d relative"
                        style={{ transform: `rotateX(${-mousePos.y * 0.5}deg) rotateY(${mousePos.x * 0.5}deg)` }}
                    >
                        Find Your Perfect <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x relative inline-block">
                            Career Path
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl -z-10 mix-blend-screen"></div>
                        </span>
                    </h1>

                    <p className="mt-8 text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed animate-enter delay-100 font-light">
                        Unlock your potential with real-time market insights, skill gap analysis, and a personalized roadmap to success.
                    </p>

                    {/* Call to Action Buttons */}
                    <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center animate-enter delay-200">
                        <button
                            onClick={onUploadFocus}
                            className="group relative px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 overflow-hidden shimmer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                            <span className="relative z-10">Start Analysis For Free</span>
                            <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => onNavigate('hr-emailer')}
                            className="px-8 py-4 bg-white/10 hover:bg-white/15 backdrop-blur-md text-white rounded-2xl font-bold text-lg border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3"
                        >
                            <Sparkles className="text-orange-400 group-hover:animate-pulse" />
                            Auto Mate Mail
                        </button>
                    </div>

                </div>
            </div>

            {/* === REST OF CONTENT (Styled) === */}
            <div className="space-y-32 py-12 relative z-10 max-w-7xl mx-auto px-6">

                {/* Why We Built This */}
                <section className="text-center">
                    <div className="inline-block px-4 py-1.5 bg-indigo-900/20 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
                        Our Mission
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 leading-tight">Bridging the Gap Between <br /><span className="text-indigo-400">Education</span> & <span className="text-purple-400">Employability</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {[
                            { icon: Cpu, title: "AI Skill Assessment", desc: "Instantly maps resume keywords to industry standards utilizing NLP." },
                            { icon: TrendingUp, title: "Market Insights", desc: "Real-time salary and demand data to make informed career choices." },
                            { icon: Globe, title: "Multi-Language Support", desc: "Accessible career guidance for regional language students (Hindi/Odia)." }
                        ].map((item, idx) => (
                            <div key={idx} className="glass-card-pro p-10 rounded-[2rem] hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-indigo-500/10"></div>
                                {(() => {
                                    const Icon = item.icon;
                                    return <Icon className="text-indigo-400 mb-6 group-hover:scale-110 transition-transform relative z-10 floating" size={40} />;
                                })()}
                                <h3 className="text-2xl font-bold text-white mb-4 relative z-10 group-hover:text-indigo-300 transition-colors">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed text-lg relative z-10">{item.desc}</p>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Interactive Demo Flow */}
                <section className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-emerald-900/20 -z-10 hidden md:block border-t border-dashed border-slate-700/50"></div>
                    <h2 className="text-4xl font-bold text-center text-white mb-20">How It Works</h2>

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
                                className={`bg-slate-900/50 border border-slate-800/80 p-8 rounded-[2.5rem] relative group transition-all duration-300 backdrop-blur-sm ${item.action ? 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/40' : ''}`}
                            >
                                <div className={`w-16 h-16 mx-auto bg-slate-800/80 text-slate-300 rounded-2xl flex items-center justify-center font-bold text-xl mb-8 shadow-inner border border-slate-700 transition-all ${item.action ? 'group-hover:bg-indigo-600/80 group-hover:border-indigo-400 group-hover:text-white pulse-glow' : ''}`}>
                                    {item.step}
                                </div>
                                <h3 className="font-bold text-2xl text-white mb-3 group-hover:text-indigo-200 transition-colors">{item.title}</h3>
                                <p className="text-slate-400 text-lg">{item.desc}</p>

                                {item.action && (
                                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 floating">
                                        <PlayCircle size={28} />
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Premium Features Grid */}
                <section>
                    <h2 className="text-4xl font-bold text-white text-center mb-16">Premium Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {featureDetails.map((feat, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedFeature(feat)}
                                className="flex flex-col items-center justify-center p-8 bg-slate-900/40 rounded-3xl border border-slate-800/60 hover:border-indigo-500/40 hover:bg-slate-800/60 transition-all duration-300 hover:-translate-y-2 group backdrop-blur-sm shadow-lg shadow-black/20 relative overflow-hidden"
                            >
                                <div className="w-16 h-16 bg-slate-800/80 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-slate-700/80 group-hover:border-indigo-400 floating">
                                    {(() => {
                                        const Icon = feat.icon;
                                        return <Icon size={28} />;
                                    })()}
                                </div>
                                <span className="font-bold text-white text-lg mb-2 group-hover:text-indigo-100 transition-colors">{feat.title}</span>
                                <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider font-semibold">Click for details</span>
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Impact Section */}
                <section className="bg-gradient-to-br from-indigo-950 to-slate-950 rounded-[3rem] p-12 md:p-20 text-white overflow-hidden relative shadow-2xl border border-slate-800/80">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[150px] opacity-[0.08]"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-[0.08]"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Empowering Your Future</h2>
                            <ul className="space-y-6">
                                {[
                                    "Build better portfolios with targeted projects",
                                    "Choose the right skills earlier in college",
                                    "Increase employability by 3x",
                                    "Access career clarity instantly"
                                ].map((text, idx) => (
                                    <li key={idx} className="flex items-center gap-4">
                                        <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <span className="text-slate-300 text-lg">{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { val: "500+", label: "Roles Analyzed" },
                                { val: "250+", label: "Skills Mapped" },
                                { val: "40%", label: "Demand Growth" },
                                { val: "4.8/5", label: "User Rating" },
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white/[0.03] backdrop-blur-md p-8 rounded-3xl border border-white/[0.05] text-center hover:bg-white/[0.08] hover:border-indigo-500/20 transition-all">
                                    <div className="text-4xl font-bold text-white mb-2">{stat.val}</div>
                                    <div className="text-xs text-indigo-300 uppercase tracking-widest font-semibold">{stat.label}</div>
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
