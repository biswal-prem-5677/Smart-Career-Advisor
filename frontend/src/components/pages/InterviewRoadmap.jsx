import React, { useState } from 'react';
import { Calendar, Clock, Map, CheckCircle2, Circle, ArrowRight, Target, Briefcase } from 'lucide-react';
import { useReportCard } from '../../context/ReportCardContext';

const InterviewRoadmap = () => {
    const { markFeatureUsed } = useReportCard();
    const [role, setRole] = useState('');
    const [timeFrame, setTimeFrame] = useState('1 month');
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateRoadmap = async () => {
        if (!role.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/prep/roadmap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, time_frame: timeFrame })
            });
            const data = await res.json();
            setRoadmap(data.roadmap);
            // Track Usage
            markFeatureUsed('success_roadmap', { role: role });
        } catch (error) {
            console.error("Failed to generate roadmap", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-6 animate-enter">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-900/30 text-indigo-400 rounded-full text-sm font-bold shadow-sm border border-indigo-500/30">
                        <Map size={16} /> Interview Roadmap
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                        Your Personalized <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Success Plan</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Tell us your goal and timeline. We'll build a week-by-week strategy to get you hired.
                    </p>
                </div>

                {/* Input Section */}
                <div className="bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl -z-10 opacity-10"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                <Briefcase size={16} className="text-indigo-400" /> Target Role
                            </label>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g. Full Stack Developer, Data Scientist"
                                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-600 outline-none font-medium transition-all"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                <Clock size={16} className="text-purple-400" /> Time Until Interview
                            </label>
                            <select
                                value={timeFrame}
                                onChange={(e) => setTimeFrame(e.target.value)}
                                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white outline-none font-medium transition-all"
                            >
                                <option value="1 month">1 Month (Fast Track)</option>
                                <option value="2 months">2 Months (Deep Dive)</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={generateRoadmap}
                        disabled={loading || !role}
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
                    >
                        {loading ? 'Designing Strategy...' : 'Generate Roadmap'}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </div>

                {/* Timeline Result */}
                {roadmap && (
                    <div className="relative pl-8 md:pl-0 animate-enter">
                        {/* Vertical Line */}
                        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-indigo-900/50 -translate-x-1/2 rounded-full"></div>

                        <div className="space-y-12">
                            {roadmap.map((item, idx) => (
                                <div key={idx} className={`relative flex items-center justify-between md:flex-row flex-col ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                    {/* Center Dot */}
                                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-8 h-8 bg-indigo-600 rounded-full border-4 border-slate-950 shadow-lg shadow-indigo-900/50 z-10 hidden md:block"></div>
                                    <div className="absolute left-6 -translate-x-1/2 w-6 h-6 bg-indigo-600 rounded-full border-4 border-slate-950 shadow-lg z-10 md:hidden block"></div>

                                    {/* Content Card */}
                                    <div className="w-full md:w-[45%] pl-12 md:pl-0">
                                        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest bg-indigo-900/20 px-2 py-1 rounded-md border border-indigo-500/20">{item.week}</span>
                                                    <h3 className="text-xl font-bold text-white mt-2 group-hover:text-indigo-400 transition-colors">{item.focus}</h3>
                                                </div>
                                                <Target className="text-slate-700 group-hover:text-indigo-500 transition-colors" size={32} />
                                            </div>
                                            <ul className="space-y-3">
                                                {item.tasks.map((task, tIdx) => (
                                                    <li key={tIdx} className="flex items-start gap-3 text-slate-400 text-sm font-medium">
                                                        <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                                                        {task}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-[45%]"></div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 text-center">
                            <div className="inline-block p-6 bg-emerald-900/10 border border-emerald-900/30 rounded-2xl backdrop-blur-sm">
                                <h3 className="text-lg font-bold text-emerald-400 mb-1">Goal: Interview Ready</h3>
                                <p className="text-emerald-300/70 text-sm">Follow this plan consistently to maximize your chances.</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default InterviewRoadmap;
