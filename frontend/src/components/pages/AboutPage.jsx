import React from 'react';
import { Target, Lightbulb, Zap, Users, Shield, TrendingUp, Globe, Heart, Award, Cpu, BookOpen, Layers } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-16 animate-enter pb-20">

            {/* Header / Mission */}
            <section className="text-center max-w-4xl mx-auto space-y-6">
                <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold tracking-wide uppercase mb-2">
                    Our Mission
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                    Democratizing Career Guidance with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI Innovation</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                    We aim to make career discovery smarter, inclusive, and future-ready. By leveraging AI and labor market data, we provide personalized, data-driven guidance to democratize access for all learners.
                </p>
            </section>

            {/* What We Do */}
            <section className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"></div>

                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 transform -rotate-3">
                            <Cpu size={28} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">What The Platform Does</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Students often struggle to choose the right careers due to limited exposure and outdated advice.
                            <strong> CareerPath AI</strong> analyzes student skills, interests, and learning patterns, then matches them with trending careers using market data and AI-driven Fit Scores.
                        </p>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            The platform identifies skill gaps, recommends courses, provides learning roadmaps, and connects students with relevant mentors to accelerate career readiness.
                        </p>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { icon: Target, label: "Fit Score Matching", color: "bg-blue-50 text-blue-600" },
                            { icon: TrendingUp, label: "Market Analytics", color: "bg-green-50 text-green-600" },
                            { icon: Layers, label: "Skill Gap Analysis", color: "bg-purple-50 text-purple-600" },
                            { icon: BookOpen, label: "Learning Paths", color: "bg-orange-50 text-orange-600" }
                        ].map((item, idx) => (
                            <div key={idx} className={`${item.color} p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 border border-transparent hover:border-black/5 transition-all hover:-translate-y-1`}>
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
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Key Innovations</h2>
                    <p className="text-slate-500">Why our solution stands out in the EdTech landscape.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "AI Skill Extraction", desc: "Automated parsing of resumes to identify implicit and explicit skills.", icon: Zap },
                        { title: "Multi-Language", desc: "Native support for Hindi, Odia, and English to reach rural students.", icon: Globe },
                        { title: "Predictive Trends", desc: "Forecasting future job demands using real-time market data.", icon: TrendingUp },
                        { title: "Mentorship Match", desc: "Connecting students with alumni in their target roles.", icon: Users },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <item.icon size={22} />
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Impact & Future */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Impact */}
                <section className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Heart className="text-pink-500" fill="currentColor" size={24} />
                            <h2 className="text-2xl font-bold">Impact & Value</h2>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Helps students choose careers early with confidence",
                                "Reduces confusion and career anxiety",
                                "Supports regional and rural first-generation learners",
                                "Bridges the gap between education & industry requirements"
                            ].map((text, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-slate-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 shrink-0"></span>
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Future Scope */}
                <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Lightbulb className="text-yellow-300" fill="currentColor" size={24} />
                            <h2 className="text-2xl font-bold">Future Scope</h2>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Internship matching & College placement analytics",
                                "Corporate hiring partnerships",
                                "Localized language expansion to 10+ languages",
                                "Mobile app version for better accessibility"
                            ].map((text, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-indigo-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white mt-2.5 shrink-0"></span>
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>

            {/* Team & Disclaimer */}
            <section className="text-center pt-8 border-t border-slate-200">
                <p className="text-slate-500 mb-6">
                    Developed by a multidisciplinary team combining AI, software engineering, and education for <strong>Hackathon 2025</strong>.
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg text-amber-700 text-xs font-medium border border-amber-100 max-w-2xl mx-auto">
                    <Shield size={14} />
                    <span>
                        Responsible AI Disclaimer: All recommendations are guidance-oriented. Students should complement AI insights with mentorship and personal research.
                    </span>
                </div>
            </section>

        </div>
    );
};

export default AboutPage;
