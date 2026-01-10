import React, { useState } from 'react';
import { api } from '../api/api';
import { BookOpen, FileText, Lightbulb, Loader2, ArrowRight, Flag, Milestone, CheckCircle2 } from 'lucide-react';

const AIRecommendations = ({ data }) => {
    const [activeTab, setActiveTab] = useState('resources');
    const [loading, setLoading] = useState(false);
    const [enhancedResume, setEnhancedResume] = useState(null);
    const [projectIdeas, setProjectIdeas] = useState(null);

    const fetchEnhancedResume = async () => {
        if (enhancedResume) return;
        setLoading(true);
        try {
            const res = await api.enhanceResume(data.resume_text, data.jd_text, data.skills.missing);
            setEnhancedResume(res.enhanced_content);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectIdeas = async () => {
        if (projectIdeas) return;
        setLoading(true);
        try {
            const res = await api.generateProjectIdeas(data.resume_text, data.skills.resume);
            setProjectIdeas(res.project_ideas);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'resume') fetchEnhancedResume();
        if (tab === 'projects') fetchProjectIdeas();
    };

    const tabs = [
        { id: 'resources', label: 'Learning Roadmap', icon: BookOpen },
        { id: 'resume', label: 'Resume Polish', icon: FileText },
        { id: 'projects', label: 'Project Ideas', icon: Lightbulb },
    ];

    return (
        <div className="glass-panel rounded-3xl overflow-hidden min-h-[600px] flex flex-col shadow-xl shadow-indigo-50/50 border border-white/60">
            {/* Tab Header with Glass Effect */}
            <div className="bg-white/40 backdrop-blur-md border-b border-slate-200/60 p-2 flex gap-2 overflow-x-auto sticky top-0 z-20">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                            ${isActive
                                    ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100 ring-1 ring-indigo-50 scale-100'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 scale-95'}`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Content Area */}
            <div className="p-8 flex-1 bg-gradient-to-b from-white/30 to-white/60 relative">
                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-30">
                        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                        <p className="text-slate-500 font-medium animate-pulse">Generating personalized insights...</p>
                    </div>
                ) : (
                    <div className="animate-enter">

                        {/* RESOURCES TAB - VISUAL ROADMAP */}
                        {activeTab === 'resources' && (
                            <div className="relative">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800">Your Learning Journey</h3>
                                        <p className="text-slate-500">A personalized timeline to master missed skills.</p>
                                    </div>
                                    <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Estimated: 4 Weeks
                                    </div>
                                </div>

                                {data.resources && Object.keys(data.resources).length > 0 ? (
                                    <div className="relative border-l-2 border-indigo-200 ml-4 space-y-12 pb-12">
                                        {Object.entries(data.resources).map(([skill, link], index) => (
                                            <div key={skill} className="relative pl-8 group">
                                                {/* Timeline Node */}
                                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-indigo-500 transition-all group-hover:scale-125 group-hover:border-indigo-600 shadow-sm"></div>

                                                <div className="glass-card p-6 rounded-2xl border border-indigo-50 hover:border-indigo-200 transition-all hover:shadow-lg hover:shadow-indigo-100/50 group-hover:-translate-y-1 bg-white/60">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                                                    Step {index + 1}
                                                                </span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                                <span className="text-xs text-slate-400 font-medium">Week {Math.ceil((index + 1) / 2)}</span>
                                                            </div>
                                                            <h4 className="text-lg font-bold text-slate-800 capitalize mb-1 flex items-center gap-2">
                                                                {skill}
                                                                <CheckCircle2 size={16} className="text-slate-300" />
                                                            </h4>
                                                            <p className="text-sm text-slate-500">Master the fundamentals and build a mini-project.</p>
                                                        </div>
                                                        <a
                                                            href={link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 active:scale-95 whitespace-nowrap"
                                                        >
                                                            Start Course
                                                            <ArrowRight size={16} />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Finish Line */}
                                        <div className="relative pl-8">
                                            <div className="absolute -left-[11px] top-0 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white shadow-md flex items-center justify-center text-white">
                                                <Flag size={10} fill="currentColor" />
                                            </div>
                                            <div className="py-1">
                                                <span className="font-bold text-emerald-600">Job Ready!</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-emerald-50 rounded-3xl border border-emerald-100">
                                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-emerald-900">You are fully prepared!</h3>
                                        <p className="text-emerald-700/80">Your skillset matches this job perfectly. No extra study needed!</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* RESUME TAB */}
                        {activeTab === 'resume' && (
                            <div className="prose prose-indigo max-w-none">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
                                        <FileText size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 m-0">Resume Enhancement</h3>
                                </div>
                                <div className="whitespace-pre-line text-slate-600 leading-relaxed bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                                    {enhancedResume}
                                </div>
                            </div>
                        )}

                        {/* PROJECTS TAB */}
                        {activeTab === 'projects' && (
                            <div className="prose prose-indigo max-w-none">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                                        <Lightbulb size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 m-0">Portfolio Builder</h3>
                                </div>
                                <div className="whitespace-pre-line text-slate-600 leading-relaxed bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                                    {projectIdeas}
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default AIRecommendations;
