import React, { useState } from 'react';
import axios from 'axios';
import { Map, Flag, CheckCircle, Book, ExternalLink, Sparkles, Trophy } from 'lucide-react';
import { useReportCard } from '../../context/ReportCardContext';

const CareerRoadmap = () => {
    const { markFeatureUsed } = useReportCard();
    const [domain, setDomain] = useState('');
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!domain) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/prep/career-roadmap`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ domain }),
            });
            const data = await res.json();
            setRoadmap(data);
            // Track Usage
            markFeatureUsed('career_roadmap', { domain: domain });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 pt-24 px-4 pb-20">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 animate-enter">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 text-blue-400 rounded-full text-sm font-bold shadow-sm border border-blue-500/30 mb-6">
                        <Trophy size={16} /> Career Success Path
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                        AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Career Roadmap</span>
                    </h1>
                    <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Enter your dream role or domain, and we'll generate a step-by-step learning path for you to master it.
                    </p>

                    <div className="relative group max-w-xl mx-auto">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                        <div className="relative flex bg-slate-900 rounded-2xl p-2 gap-2 border border-slate-700">
                            <input
                                type="text"
                                placeholder="e.g. Machine Learning Engineer, Data Scientist..."
                                className="flex-1 px-6 py-4 rounded-xl bg-transparent text-white placeholder-slate-500 outline-none font-medium"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={loading || !domain}
                                className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg flex items-center gap-2 ${loading ? 'bg-slate-700 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
                                    }`}
                            >
                                {loading ? 'Planning...' : <><Sparkles size={18} /> Generate</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 animate-enter">
                        <div className="w-20 h-20 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                        <p className="text-slate-400 text-lg font-medium animate-pulse">Consulting AI Knowledge Base...</p>
                    </div>
                )}

                {/* Timeline Visualization */}
                {roadmap && !loading && (
                    <div className="relative animate-enter pb-20">
                        {/* Vertical Line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-800 hidden md:block -translate-x-1/2 rounded-full"></div>
                        <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-800 md:hidden rounded-full"></div>

                        <div className="space-y-16">
                            {roadmap.roadmap.map((phase, idx) => (
                                <div key={idx} className={`relative flex items-center justify-between md:flex-row flex-col ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                    {/* Timeline Node */}
                                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-blue-600 border-4 border-slate-950 shadow-[0_0_15px_rgba(37,99,235,0.5)] z-10 hidden md:block"></div>
                                    <div className="absolute left-8 -translate-x-1/2 w-5 h-5 rounded-full bg-blue-600 border-4 border-slate-950 z-10 md:hidden block"></div>

                                    {/* Content Card Side */}
                                    <div className="w-full md:w-[45%] pl-20 md:pl-0">
                                        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-700 shadow-xl hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 group hover:-translate-y-1">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <span className="text-xs font-bold text-blue-400 bg-blue-900/20 px-4 py-1.5 rounded-full uppercase tracking-wider mb-3 inline-block border border-blue-500/20">
                                                        Weeks {phase.weeks}
                                                    </span>
                                                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{phase.phase}</h3>
                                                </div>
                                                <div className="p-3 bg-slate-800 rounded-xl text-slate-400 group-hover:text-white group-hover:bg-blue-600 transition-colors">
                                                    <Flag size={24} />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2 uppercase tracking-wide">
                                                        <CheckCircle size={16} className="text-green-500" />
                                                        Key Topics
                                                    </h4>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {phase.topics.map((topic, i) => (
                                                            <div key={i} className="text-slate-400 text-sm flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                                                                {topic}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2 uppercase tracking-wide">
                                                        <Book size={16} className="text-purple-500" />
                                                        Resources
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {phase.resources.map((res, i) => (
                                                            <a
                                                                key={i}
                                                                href={typeof res === 'string' ? '#' : res.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm text-blue-400 font-medium transition-colors flex items-center justify-between group/link border border-slate-700 hover:border-blue-500/50"
                                                            >
                                                                {typeof res === 'string' ? res : res.name}
                                                                <ExternalLink size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Empty Space for Alignment */}
                                    <div className="w-full md:w-[45%]"></div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-20 p-10 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-[2.5rem] text-white text-center relative overflow-hidden border border-blue-500/30 shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold mb-4">Ready to start your journey?</h3>
                                <p className="text-blue-200 mb-8 max-w-xl mx-auto text-lg">Your roadmap is set. Begin with the foundations, track your progress, and verify your skills with our Mock Interviews.</p>
                                <button className="bg-white text-blue-900 px-10 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:scale-105 active:scale-95">
                                    Start Learning Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareerRoadmap;
