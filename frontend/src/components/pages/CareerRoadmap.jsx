import React, { useState } from 'react';
import axios from 'axios';
import { Map, Flag, CheckCircle, Book, ExternalLink, ArrowRight } from 'lucide-react';

const CareerRoadmap = () => {
    const [domain, setDomain] = useState('');
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!domain) return;
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/api/roadmap/generate', { domain });
            setRoadmap(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 px-4 pb-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                        AI-Powered <span className="text-blue-600">Career Roadmap</span>
                    </h1>
                    <p className="text-lg text-slate-600 mb-8">
                        Enter your dream role or domain, and we'll generate a step-by-step learning path for you.
                    </p>

                    <div className="flex max-w-lg mx-auto gap-2">
                        <input
                            type="text"
                            placeholder="e.g. Machine Learning Engineer, Data Scientist..."
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none shadow-sm"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className={`px-6 py-3 rounded-xl font-bold text-white transition-all ${loading ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {loading ? 'Generating...' : 'Generate Plan'}
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-500 font-medium animate-pulse">Consulting AI Knowledge Base...</p>
                    </div>
                )}

                {/* Timeline Visualization */}
                {roadmap && !loading && (
                    <div className="relative animate-fade-in-up">
                        <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-200 hidden md:block"></div>

                        <div className="space-y-12">
                            {roadmap.roadmap.map((phase, idx) => (
                                <div key={idx} className="relative flex flex-col md:flex-row gap-8 group">
                                    {/* Timeline Node */}
                                    <div className="absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-md hidden md:block z-10 group-hover:scale-125 transition-transform"></div>

                                    {/* Content Card */}
                                    <div className="md:pl-16 w-full">
                                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all border-l-4 border-l-blue-500">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wide mb-2 inline-block">
                                                        Weeks {phase.weeks}
                                                    </span>
                                                    <h3 className="text-xl font-bold text-slate-900">{phase.phase}</h3>
                                                </div>
                                                <Flag className="text-slate-300" size={24} />
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                                        <CheckCircle size={16} className="text-green-500" />
                                                        Key Topics
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {phase.topics.map((topic, i) => (
                                                            <li key={i} className="text-slate-600 text-sm flex items-start gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5"></span>
                                                                {topic}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                                        <Book size={16} className="text-purple-500" />
                                                        Resources
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {phase.resources.map((res, i) => (
                                                            <a
                                                                key={i}
                                                                href="#"
                                                                className="block p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-blue-600 font-medium transition-colors flex items-center justify-between group/link"
                                                            >
                                                                {res}
                                                                <ExternalLink size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white text-center">
                            <h3 className="text-2xl font-bold mb-2">Ready to start your journey?</h3>
                            <p className="text-blue-100 mb-6">Your roadmap is set. Begin with the foundations and track your progress.</p>
                            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg">
                                Start Learning
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareerRoadmap;
