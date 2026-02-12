import React from 'react';
import { Target, Lightbulb, Zap, Users, Shield, TrendingUp, Globe, Heart, Award, Cpu, BookOpen, Layers } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 pt-20 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto space-y-16 animate-enter">

                {/* Header / Mission */}
                <section className="text-center max-w-4xl mx-auto space-y-6">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-sm font-bold tracking-wide uppercase mb-2">
                        Our Mission
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                        Democratizing Career Guidance with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI Innovation</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
                        We aim to make career discovery smarter, inclusive, and future-ready. By leveraging AI and labor market data, we provide personalized, data-driven guidance to democratize access for all learners.
                    </p>
                </section>

                {/* What We Do */}
                <section className="bg-slate-900 rounded-[2.5rem] border border-slate-700 p-8 md:p-12 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                        <div className="flex-1 space-y-8">
                            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 transform -rotate-3 border border-indigo-500/50">
                                <Cpu size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-white">What The Platform Does</h2>
                            <div className="space-y-6 text-lg">
                                <p className="text-slate-300 leading-relaxed">
                                    Students often struggle to choose the right careers due to limited exposure and outdated advice.
                                    <strong className="text-indigo-400"> CareerPath AI</strong> analyzes student skills, interests, and learning patterns, then matches them with trending careers using market data and AI-driven Fit Scores.
                                </p>
                                <p className="text-slate-300 leading-relaxed">
                                    The platform identifies skill gaps, recommends courses, provides learning roadmaps, and connects students with relevant mentors to accelerate career readiness.
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            {[
                                { icon: Target, label: "Fit Score Matching", color: "bg-blue-900/20 text-blue-400 border-blue-500/20" },
                                { icon: TrendingUp, label: "Market Analytics", color: "bg-emerald-900/20 text-emerald-400 border-emerald-500/20" },
                                { icon: Layers, label: "Skill Gap Analysis", color: "bg-purple-900/20 text-purple-400 border-purple-500/20" },
                                { icon: BookOpen, label: "Learning Paths", color: "bg-orange-900/20 text-orange-400 border-orange-500/20" }
                            ].map((item, idx) => (
                                <div key={idx} className={`${item.color} p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 border transition-all hover:-translate-y-1 hover:shadow-lg`}>
                                    <item.icon size={32} />
                                    <span className="font-bold">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Key Innovations */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Key Innovations</h2>
                        <p className="text-slate-400">Why our solution stands out in the EdTech landscape.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "AI Skill Extraction", desc: "Automated parsing of resumes to identify implicit and explicit skills.", icon: Zap },
                            { title: "Multi-Language", desc: "Native support for Hindi, Odia, and English to reach rural students.", icon: Globe },
                            { title: "Predictive Trends", desc: "Forecasting future job demands using real-time market data.", icon: TrendingUp },
                            { title: "Mentorship Match", desc: "Connecting students with alumni in their target roles.", icon: Users },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-lg hover:border-indigo-500/50 transition-all group hover:-translate-y-1">
                                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-slate-700 group-hover:border-indigo-500/50">
                                    <item.icon size={22} />
                                </div>
                                <h3 className="font-bold text-lg text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Impact & Future */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Impact */}
                    <section className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden border border-slate-700">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600 rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-pink-900/30 rounded-lg text-pink-500">
                                    <Heart fill="currentColor" size={20} />
                                </div>
                                <h2 className="text-2xl font-bold">Impact & Value</h2>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    "Helps students choose careers early with confidence",
                                    "Reduces confusion and career anxiety",
                                    "Supports regional and rural first-generation learners",
                                    "Bridges the gap between education & industry requirements"
                                ].map((text, idx) => (
                                    <li key={idx} className="flex items-start gap-4 text-slate-300">
                                        <div className="p-1 rounded-full bg-pink-500/20 text-pink-400 mt-0.5">
                                            <div className="w-2 h-2 rounded-full bg-current"></div>
                                        </div>
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Future Scope */}
                    <section className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden border border-indigo-500/30">
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-500/20 rounded-lg text-yellow-300">
                                    <Lightbulb fill="currentColor" size={20} />
                                </div>
                                <h2 className="text-2xl font-bold">Future Scope</h2>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    "Internship matching & College placement analytics",
                                    "Corporate hiring partnerships",
                                    "Localized language expansion to 10+ languages",
                                    "Mobile app version for better accessibility"
                                ].map((text, idx) => (
                                    <li key={idx} className="flex items-start gap-4 text-indigo-100">
                                        <div className="p-1 rounded-full bg-indigo-500/40 text-indigo-200 mt-0.5">
                                            <div className="w-2 h-2 rounded-full bg-current"></div>
                                        </div>
                                        <span>{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </div>

                {/* Team & Disclaimer */}
                <section className="text-center pt-8 border-t border-slate-800">
                    <p className="text-slate-500 mb-6">
                        Developed by a multidisciplinary team combining AI, software engineering, and education for <strong className="text-slate-300">Hackathon 2025</strong>.
                    </p>

                    <div className="inline-flex items-center gap-2 px-4 py-3 bg-amber-900/10 rounded-xl text-amber-500 text-xs font-medium border border-amber-500/20 max-w-2xl mx-auto shadow-sm">
                        <Shield size={14} className="shrink-0" />
                        <span>
                            Responsible AI Disclaimer: All recommendations are guidance-oriented. Students should complement AI insights with mentorship and personal research.
                        </span>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default AboutPage;
