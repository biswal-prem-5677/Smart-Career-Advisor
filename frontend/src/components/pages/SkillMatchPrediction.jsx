import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, BookOpen, ExternalLink, Plus, X, Target, Zap, AlertCircle, Code } from 'lucide-react';

const SkillMatchPrediction = ({ onBack }) => {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const roles = [
        "Data Scientist", "Data Analyst", "Frontend Developer", "Backend Developer",
        "Full Stack Developer", "Machine Learning Engineer", "DevOps Engineer", "Android Developer"
    ];

    const addSkill = (e) => {
        e.preventDefault();
        if (newSkill && !skills.includes(newSkill)) {
            setSkills([...skills, newSkill]);
            setNewSkill('');
        }
    };

    const removeSkill = (skill) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const clearSkills = () => {
        setSkills([]);
        setResult(null);
    }

    const handleSubmit = async () => {
        if (skills.length === 0) return;
        setLoading(true);
        try {
            const payload = { skills: skills, target_role: targetRole || null };
            const response = await axios.post(`/api/skill_match/predict`, payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            const data = response.data; // axios returns data directly
            setResult(data);
        } catch (error) {
            console.error("Prediction failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-enter p-6">
            <button onClick={onBack} className="flex items-center text-slate-200 hover:text-indigo-300 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Models
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Panel: Inputs */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-700 p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-cyan-900/40 text-cyan-400 rounded-xl">
                                <Target size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Skill Analysis</h1>
                                <p className="text-slate-200 text-xs">Map your skills to a role.</p>
                            </div>
                        </div>

                        {/* Target Role Selector */}
                        <div className="mb-6">
                            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">Target Role (Optional)</label>
                            <select
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-200 focus:bg-slate-700/50 transition-all"
                            >
                                <option value="">-- General Exploration --</option>
                                {roles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>

                        {/* Skill Input */}
                        <div className="mb-4">
                            <label className="block text-xs font-semibold text-slate-100 uppercase tracking-wider mb-2">My Skills</label>
                            <form onSubmit={addSkill} className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="e.g. React, Python"
                                    className="flex-1 px-4 py-2 rounded-xl border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-cyan-500/50 text-slate-200 placeholder-slate-500"
                                />
                                <button type="submit" className="p-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors">
                                    <Plus size={20} />
                                </button>
                            </form>

                            <div className="flex flex-wrap gap-2 min-h-[100px] content-start">
                                {skills.map(skill => (
                                    <div key={skill} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-100 shadow-sm hover:shadow-md">
                                        {skill}
                                        <button onClick={() => removeSkill(skill)} className="text-slate-200 hover:text-red-300"><X size={14} /></button>
                                    </div>
                                ))}
                                <p className="text-slate-100 text-sm italic">Add skills to see analysis...</p>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || skills.length === 0}
                            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Analyzing...' : <><Zap size={20} /> Analyze Match</>}
                        </button>
                    </div>
                </div>

                {/* Right Panel: Advanced Dashboard */}
                <div className="lg:col-span-8">
                    {result ? (
                        <div className="space-y-6 animate-enter">
                            {/* 1. Match Score Card (Only if Role Selected) */}
                            {result.analysis && (
                                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                    <div className="text-center md:text-left">
                                        <h2 className="text-lg font-bold text-white">Role Fit: {result.analysis.role}</h2>
                                        <p className="text-slate-200 text-sm">Based on your current stack</p>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-8 border-slate-100">
                                            <span className={`text-2xl font-bold text-white ${result.analysis.match_score > 70 ? 'text-green-400' : 'text-orange-400'}`}>
                                                {result.analysis.match_score}%
                                            </span>
                                            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="46" fill="transparent" stroke={result.analysis.match_score > 70 ? '#22c55e' : '#f97316'} strokeWidth="8" strokeDasharray={`${result.analysis.match_score * 2.89} 289`} />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="text-sm space-y-1">
                                        <div className="flex items-center gap-2 text-white"><CheckCircle size={16} /> {result.analysis.matched_skills.length} Matched Skills</div>
                                        <div className="flex items-center gap-2 text-white"><AlertCircle size={16} /> {result.analysis.missing_skills.length} Missing</div>
                                    </div>
                                </div>
                            )}

                            {/* 2. Gap Analysis & Projects */}
                            {result.analysis && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                                        <h3 className="font-bold text-white mb-3 flex items-center gap-2"><AlertCircle size={18} /> Missing Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.analysis.missing_skills.map(s => (
                                                <span key={s} className="px-2 py-1 bg-white border border-red-200 text-red-600 rounded-md text-sm font-medium">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                                        <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Code size={18} /> Recommended Projects</h3>
                                        <ul className="list-disc list-inside text-sm text-purple-800 space-y-1">
                                            {result.analysis.projects.map(p => (
                                                <li key={p}>{p}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* 3. Learning Resources */}
                            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><BookOpen size={20} className="text-cyan-600" /> Curated Learning Resources</h3>
                                {Object.keys(result.resources).length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {Object.entries(result.resources).map(([skill, url]) => (
                                            <a key={skill} href={url} target="_blank" rel="noopener noreferrer" className="group p-3 rounded-xl border border-slate-200 hover:border-cyan-500 hover:shadow-sm transition-all flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">{skill.substring(0, 2).toUpperCase()}</div>
                                                    <span className="font-medium text-white capitalize">{skill}</span>
                                                </div>
                                                <ExternalLink size={16} className="text-slate-200 group-hover:text-cyan-300" />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-300 italic text-sm">No specific resources found. Try adding more technical skills.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-800 p-8 h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                            <div className="p-4 bg-slate-800 rounded-full shadow-sm text-slate-300">
                                <Zap size={64} />
                            </div>
                            <div className="max-w-xs">
                                <h3 className="text-lg font-bold text-white">Ready to Match</h3>
                                <p className="text-slate-300 text-sm mt-2">Select a target role and enter your skills to see your personalized gap analysis.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillMatchPrediction;
