import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, BookOpen, ExternalLink, Plus, X } from 'lucide-react';

const SkillMatchPrediction = ({ onBack }) => {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/predict/skill-match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skills: skills })
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Prediction failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-enter">
            <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Models
            </button>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 h-[calc(100vh-200px)] flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-cyan-100 text-cyan-600 rounded-xl">
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Skill Match & Resources</h1>
                        <p className="text-slate-500">Get curated learning resources for your current skill stack.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full overflow-hidden">
                    <div className="flex flex-col h-full">
                        <form onSubmit={addSkill} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add a skill (e.g. React, SQL)"
                                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-cyan-500/50"
                            />
                            <button type="submit" className="p-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors">
                                <Plus size={20} />
                            </button>
                        </form>

                        <div className="flex-1 border border-slate-100 rounded-xl p-4 overflow-y-auto mb-4 bg-slate-50/50 flex flex-col">
                            {skills.length > 0 && (
                                <div className="flex justify-end mb-2">
                                    <button onClick={clearSkills} className="text-xs text-red-500 hover:underline">Clear All</button>
                                </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {skills.length === 0 && (
                                    <p className="text-slate-400 text-sm italic w-full text-center mt-10">Add skills to see your stack here</p>
                                )}
                                {skills.map(skill => (
                                    <div key={skill} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-sm text-slate-700">
                                        {skill}
                                        <button onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || skills.length === 0}
                            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Finding Resources...' : <><BookOpen size={20} /> Get Recommendations</>}
                        </button>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 overflow-y-auto border border-slate-100">
                        {result ? (
                            <div className="space-y-4 animate-enter">
                                <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Recommended Learning Resources</h3>
                                {Object.keys(result.resources).length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {Object.entries(result.resources).map(([skill, url]) => {
                                            const domain = new URL(url).hostname.replace('www.', '');
                                            return (
                                                <a key={skill} href={url} target="_blank" rel="noopener noreferrer" className="block group">
                                                    <div className="p-4 bg-white rounded-xl border border-slate-200 hover:border-cyan-500 hover:shadow-md transition-all flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-10 h-10 shrink-0 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-sm">
                                                                {skill.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="font-medium text-slate-800 capitalize truncate" title={skill}>{skill}</h4>
                                                                <p className="text-xs text-slate-500 truncate">{domain}</p>
                                                            </div>
                                                        </div>
                                                        <ExternalLink size={18} className="text-slate-400 group-hover:text-cyan-600 shrink-0" />
                                                    </div>
                                                </a>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 italic">No specific top-tier resources found for these exact keywords. Try "Python", "Java", "Machine Learning", etc.</p>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <BookOpen size={64} className="mx-auto mb-4 opacity-20" />
                                <p>Add skills and click recommend</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillMatchPrediction;
