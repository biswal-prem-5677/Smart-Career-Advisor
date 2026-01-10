import React, { useState } from 'react';
import { Calendar, Clock, Map, CheckCircle2, Circle, ArrowRight, Target, Briefcase } from 'lucide-react';

const InterviewRoadmap = () => {
    const [role, setRole] = useState('');
    const [timeFrame, setTimeFrame] = useState('1 month');
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateRoadmap = async () => {
        if (!role.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/prep/roadmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role, time_frame: timeFrame })
            });
            const data = await res.json();
            setRoadmap(data.roadmap);
        } catch (error) {
            console.error("Failed to generate roadmap", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold shadow-sm border border-indigo-100">
                        <Map size={16} /> Interview Roadmap
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900">
                        Your Personalized <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Success Plan</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Tell us your goal and timeline. We'll build a week-by-week strategy to get you hired.
                    </p>
                </div>

                {/* Input Section */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Briefcase size={16} className="text-indigo-500" /> Target Role
                            </label>
                            <input
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g. Full Stack Developer, Data Scientist"
                                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium text-slate-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Clock size={16} className="text-purple-500" /> Time Until Interview
                            </label>
                            <select
                                value={timeFrame}
                                onChange={(e) => setTimeFrame(e.target.value)}
                                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium text-slate-800"
                            >
                                <option value="1 month">1 Month (Fast Track)</option>
                                <option value="2 months">2 Months (Deep Dive)</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={generateRoadmap}
                        disabled={loading || !role}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Designing Strategy...' : 'Generate Roadmap'}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </div>

                {/* Timeline Result */}
                {roadmap && (
                    <div className="relative pl-8 md:pl-0 animate-enter">
                        {/* Vertical Line */}
                        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-indigo-100 -translate-x-1/2 rounded-full"></div>

                        <div className="space-y-12">
                            {roadmap.map((item, idx) => (
                                <div key={idx} className={`relative flex items-center justify-between md:flex-row flex-col ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                    {/* Center Dot */}
                                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-8 h-8 bg-indigo-600 rounded-full border-4 border-white shadow-lg z-10 hidden md:block"></div>
                                    <div className="absolute left-6 -translate-x-1/2 w-6 h-6 bg-indigo-600 rounded-full border-4 border-white shadow-lg z-10 md:hidden block"></div>

                                    {/* Content Card */}
                                    <div className="w-full md:w-[45%] pl-12 md:pl-0">
                                        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:-translate-y-1 transition-transform duration-300">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md">{item.week}</span>
                                                    <h3 className="text-xl font-bold text-slate-900 mt-2">{item.focus}</h3>
                                                </div>
                                                <Target className="text-indigo-200" size={32} />
                                            </div>
                                            <ul className="space-y-3">
                                                {item.tasks.map((task, tIdx) => (
                                                    <li key={tIdx} className="flex items-start gap-3 text-slate-600 text-sm font-medium">
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
                            <div className="inline-block p-4 bg-green-50 border border-green-200 rounded-2xl">
                                <h3 className="text-lg font-bold text-green-800 mb-1">Goal: Interview Ready</h3>
                                <p className="text-green-600 text-sm">Follow this plan consistently to maximize your chances.</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default InterviewRoadmap;
