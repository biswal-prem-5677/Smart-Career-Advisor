import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp } from 'lucide-react';

const SkillAnalysis = ({ data }) => {
    const { analysis, skills } = data;

    // Helper to determine color based on score
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 border-green-200 bg-green-50';
        if (score >= 60) return 'text-yellow-600 border-yellow-200 bg-yellow-50';
        return 'text-red-600 border-red-200 bg-red-50';
    };

    const getScoreGradient = (score) => {
        if (score >= 80) return 'from-green-500 to-emerald-500';
        if (score >= 60) return 'from-yellow-400 to-orange-500';
        return 'from-red-500 to-pink-500';
    }

    const SkillBadge = ({ skill, type }) => {
        let styles = "bg-slate-100 text-slate-700 border-slate-200";
        let Icon = null;

        if (type === 'matched') {
            styles = "bg-emerald-50 text-emerald-700 border-emerald-100";
            Icon = CheckCircle2;
        } else if (type === 'missing') {
            styles = "bg-rose-50 text-rose-700 border-rose-100";
            Icon = XCircle;
        } else {
            styles = "bg-indigo-50 text-indigo-700 border-indigo-100";
            Icon = AlertCircle;
        }

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${styles} transition-all hover:scale-105`}>
                {Icon && <Icon size={12} />}
                {skill}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Score Card */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp size={120} />
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Match Analysis</h2>
                        <p className="text-slate-500 max-w-md">
                            Based on keyword overlap between your resume and the job description.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-4">
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prediction</span>
                                <span className="text-lg font-bold text-slate-800">{analysis?.prediction?.prediction || "Not Available"}</span>
                            </div>
                            <div className="w-px h-10 bg-slate-200"></div>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Keywords</span>
                                <span className="text-lg font-bold text-slate-800">{skills.matched.length} Matched</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Circular Progress Placeholder - pure CSS ring */}
                        <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center relative">
                            <div
                                className={`absolute inset-0 rounded-full border-8 border-transparent border-t-indigo-500 border-r-indigo-500 animate-[spin_1s_ease-out_reverse]`}
                                style={{ clipPath: 'circle(50% at 50% 50%)' }}
                            ></div>
                            <div className="text-center">
                                <span className="text-3xl font-bold text-slate-800 block">{Math.round(analysis.match_score)}%</span>
                                <span className="text-[10px] text-slate-400 font-semibold uppercase">Fit Score</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Matched Skills */}
                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                            <CheckCircle2 size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800">Matched Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {skills?.matched?.length > 0 ? (
                            skills.matched.map((skill, index) => (
                                <SkillBadge key={index} skill={skill} type="matched" />
                            ))
                        ) : (
                            <p className="text-sm text-slate-400 italic">No exact matches found.</p>
                        )}
                    </div>
                </div>

                {/* Missing Skills */}
                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                            <XCircle size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800">Missing Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {skills?.missing?.length > 0 ? (
                            skills.missing.map((skill, index) => (
                                <SkillBadge key={index} skill={skill} type="missing" />
                            ))
                        ) : (
                            <p className="text-sm text-slate-400 italic">Nothing missing! Great job.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SkillAnalysis;
