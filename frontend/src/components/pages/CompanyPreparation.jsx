import React, { useState } from 'react';
import { Building2, Code, Laptop, Calendar, CheckCircle, BookOpen, Clock, Loader, Search, TrendingUp, HelpCircle } from 'lucide-react';
import { useReportCard } from '../../context/ReportCardContext';

const CompanyPreparation = () => {
    const { markFeatureUsed } = useReportCard();
    const [companyType, setCompanyType] = useState('Product'); // 'Product' or 'Service'
    const [companyName, setCompanyName] = useState('');
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPlan = async () => {
        if (!companyName.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/prep/company`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_type: companyType,
                    company_name: companyName,
                    time_period: "4 Weeks"
                })
            });
            const data = await response.json();

            if (data.success) {
                setPlan(data.plan);
                // Track Usage
                markFeatureUsed('company_prep', { company: companyName });
            } else {
                setError("Failed to generate plan. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Connection failed. Check backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-8 animate-enter">
                {/* Header Section */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-700">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-white pointer-events-none">
                        <Building2 size={400} />
                    </div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20"></div>

                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Company-wise <span className="text-indigo-400">Preparation</span></h1>
                        <p className="text-slate-300 max-w-2xl text-lg leading-relaxed mb-10">
                            Get a detailed 4-week roadmap and hiring insights tailored for any company.
                        </p>

                        {/* Controls */}
                        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                            <div className="inline-flex bg-slate-950/50 p-1.5 rounded-2xl backdrop-blur-md border border-slate-700/50">
                                <button
                                    onClick={() => setCompanyType('Product')}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${companyType === 'Product' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Code size={18} /> Product
                                </button>
                                <button
                                    onClick={() => setCompanyType('Service')}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${companyType === 'Service' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Laptop size={18} /> Service
                                </button>
                            </div>

                            <div className="flex-1 w-full md:w-auto relative group">
                                <input
                                    type="text"
                                    placeholder="Enter Company Name (e.g. Google, TCS, Amazon)..."
                                    className="w-full bg-slate-950/50 border border-slate-600/50 rounded-2xl px-5 py-4 pl-12 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all font-medium"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchPlan()}
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                            </div>

                            <button
                                onClick={fetchPlan}
                                disabled={loading || !companyName.trim()}
                                className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-xl"
                            >
                                {loading ? 'Analyzing...' : 'Generate Plan'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Loader size={48} className="animate-spin text-indigo-500 mb-6" />
                        <p className="text-xl font-semibold text-white">Analyzing hiring trends for {companyName}...</p>
                        <p className="text-sm mt-2">Connecting to Knowledge Base</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-900/20 text-red-400 p-6 rounded-3xl border border-red-900/50 flex items-center gap-4 animate-enter">
                        <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center shrink-0 border border-red-500/20">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Generation Failed</h4>
                            <p className="text-sm opacity-80">{error}</p>
                        </div>
                    </div>
                )}

                {/* Results */}
                {!loading && !error && plan && (
                    <div className="space-y-8 animate-enter">

                        {/* Insights Section */}
                        {plan.insights && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-3 bg-indigo-900/20 border border-indigo-500/20 p-8 rounded-[2rem] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl"></div>
                                    <h3 className="text-xl font-bold text-indigo-300 mb-4 flex items-center gap-2">
                                        <TrendingUp size={24} /> 3-Year Hiring Pattern
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed text-lg">{plan.insights.hiring_trend}</p>
                                </div>

                                <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-lg">
                                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <HelpCircle className="text-orange-500" size={20} /> Frequent Topics
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {plan.insights.frequent_topics?.map((topic, i) => (
                                            <span key={i} className="bg-orange-900/20 text-orange-400 px-4 py-1.5 rounded-lg text-sm font-semibold border border-orange-500/20">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-lg">
                                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <CheckCircle className="text-emerald-500" size={20} /> Common Rounds
                                    </h4>
                                    <ul className="space-y-3">
                                        {plan.insights.common_rounds?.map((round, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-300 font-medium">
                                                <span className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 shrink-0 shadow-lg shadow-emerald-500/50" />
                                                {round}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-lg flex flex-col justify-center items-center text-center">
                                    <h4 className="font-bold text-slate-400 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <Clock className="text-blue-500" size={16} /> Difficulty Level
                                    </h4>
                                    <div className="text-3xl font-black text-white">
                                        {plan.insights.difficulty_level || "Medium"}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Timeline View */}
                        {plan.weeks && plan.weeks.map((week, idx) => (
                            <div key={idx} className="bg-slate-900 rounded-[2rem] shadow-xl border border-slate-800 overflow-hidden hover:border-indigo-500/30 transition-colors">

                                {/* Week Header */}
                                <div className="bg-slate-800/50 p-6 border-b border-slate-700/50 flex flex-wrap gap-4 justify-between items-center backdrop-blur-sm">
                                    <div>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Calendar size={20} /></div>
                                            Week {week.week_number}: <span className="text-indigo-300">{week.theme}</span>
                                        </h3>
                                    </div>
                                    <div className="hidden sm:block">
                                        <span className="bg-indigo-900/30 text-indigo-300 px-4 py-2 rounded-full text-xs font-bold border border-indigo-500/30">
                                            {week.days.length} Days Plan
                                        </span>
                                    </div>
                                </div>

                                {/* Daily Tasks */}
                                <div className="divide-y divide-slate-800">
                                    {week.days.map((day, dIdx) => (
                                        <div key={dIdx} className="p-6 hover:bg-slate-800/30 transition-colors group">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Day Badge */}
                                                <div className="shrink-0 flex flex-col items-center">
                                                    <span className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-xl border border-slate-700 group-hover:border-indigo-500/50 group-hover:text-white transition-all">
                                                        D{day.day}
                                                    </span>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 space-y-4">
                                                    <div>
                                                        <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                                            {day.topic}
                                                            {day.priority === 'High' && <span className="text-[10px] bg-rose-900/30 text-rose-400 px-2 py-1 rounded-full border border-rose-500/30 uppercase tracking-wide">Critical</span>}
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                            {day.subtopics.map((sub, sIdx) => (
                                                                <span key={sIdx} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg font-medium">{sub}</span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Resources & Practice */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="bg-blue-900/10 p-5 rounded-2xl border border-blue-500/20 hover:bg-blue-900/20 transition-colors">
                                                            <p className="text-xs font-bold text-blue-400 uppercase mb-3 flex items-center gap-2">
                                                                <BookOpen size={14} /> Learning Resources
                                                            </p>
                                                            <ul className="list-disc list-inside text-sm text-slate-300 space-y-2">
                                                                {day.resources.map((res, rIdx) => (
                                                                    <li key={rIdx} className="marker:text-blue-500">{res}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className="bg-emerald-900/10 p-5 rounded-2xl border border-emerald-500/20 hover:bg-emerald-900/20 transition-colors">
                                                            <p className="text-xs font-bold text-emerald-400 uppercase mb-3 flex items-center gap-2">
                                                                <CheckCircle size={14} /> Practice Question
                                                            </p>
                                                            <p className="text-sm text-slate-300 font-medium italic">"{day.practice_question}"</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyPreparation;
