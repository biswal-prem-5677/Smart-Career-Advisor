import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Briefcase, Calculator, TrendingUp, DollarSign, Building, BookOpen, CheckCircle } from 'lucide-react';


// ... (imports)

const InputGroup = ({ title, children }) => (
    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);

const JobRolePrediction = ({ onBack }) => {
    const [formData, setFormData] = useState({
        gender: 'M',
        ssc_p: '',
        ssc_b: 'Central',
        hsc_p: '',
        hsc_b: 'Central',
        hsc_s: 'Science',
        degree_p: '',
        degree_t: 'Sci&Tech',
        workex: 'No',
        etest_p: '',
        specialisation: 'Mkt&HR',
        mba_p: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                gender: formData.gender,
                ssc_p: parseFloat(formData.ssc_p) || 0,
                ssc_b: formData.ssc_b,
                hsc_p: parseFloat(formData.hsc_p) || 0,
                hsc_b: formData.hsc_b,
                hsc_s: formData.hsc_s,
                degree_p: parseFloat(formData.degree_p) || 0,
                degree_t: formData.degree_t,
                workex: formData.workex,
                etest_p: parseFloat(formData.etest_p) || 0,
                specialisation: formData.specialisation,
                mba_p: parseFloat(formData.mba_p) || 0
            };

            const response = await axios.post(`/api/predict/job-role`, payload);
            setResult(response.data);
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
                {/* Left Panel: Input Form */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-700 p-6 h-fit">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-purple-900/40 text-purple-400 rounded-xl">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-400">Job Role Predictor</h1>
                                <p className="text-slate-400 text-xs">Analyze your profile for the best fit.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Personal & Basic */}
                            <InputGroup title="Personal & Experience">
                                <div>
                                    <label className="text-xs font-semibold text-slate-200">Gender</label>
                                    <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-purple-500/20 text-sm text-slate-200">
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-200">Work Exp</label>
                                    <select value={formData.workex} onChange={(e) => setFormData({ ...formData, workex: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-purple-500/20 text-sm text-slate-200">
                                        <option value="No">No</option>
                                        <option value="Yes">Yes</option>
                                    </select>
                                </div>
                            </InputGroup>

                            {/* Schooling */}
                            <InputGroup title="Schooling (10th & 12th)">
                                <div>
                                    <label className="text-xs font-semibold text-slate-200">10th %</label>
                                    <input type="number" step="0.1" required value={formData.ssc_p} onChange={(e) => setFormData({ ...formData, ssc_p: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-purple-500/20 text-sm text-slate-200 placeholder-slate-500" placeholder="e.g. 85" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-200">12th %</label>
                                    <input type="number" step="0.1" required value={formData.hsc_p} onChange={(e) => setFormData({ ...formData, hsc_p: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-purple-500/20 text-sm text-slate-200 placeholder-slate-500" placeholder="e.g. 88" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-200">12th Stream</label>
                                    <select value={formData.hsc_s} onChange={(e) => setFormData({ ...formData, hsc_s: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/50 outline-none text-sm text-slate-200">
                                        <option value="Science">Science</option>
                                        <option value="Commerce">Commerce</option>
                                        <option value="Arts">Arts</option>
                                    </select>
                                </div>
                            </InputGroup>

                            {/* Higher Ed */}
                            <InputGroup title="Higher Education">
                                <div>
                                    <label className="text-xs font-semibold text-slate-200">Degree %</label>
                                    <input type="number" step="0.1" required value={formData.degree_p} onChange={(e) => setFormData({ ...formData, degree_p: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-purple-500/20 text-sm text-slate-200 placeholder-slate-500" placeholder="e.g. 75" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-200">MBA %</label>
                                    <input type="number" step="0.1" required value={formData.mba_p} onChange={(e) => setFormData({ ...formData, mba_p: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-purple-500/20 text-sm text-slate-200 placeholder-slate-500" placeholder="e.g. 70" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-200">E-Test %</label>
                                    <input type="number" step="0.1" required value={formData.etest_p} onChange={(e) => setFormData({ ...formData, etest_p: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-purple-500/20 text-sm text-slate-200 placeholder-slate-500" placeholder="e.g. 80" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-200">Specialisation</label>
                                    <select value={formData.specialisation} onChange={(e) => setFormData({ ...formData, specialisation: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/50 outline-none text-sm text-slate-200">
                                        <option value="Mkt&HR">Mkt&HR</option>
                                        <option value="Mkt&Fin">Mkt&Fin</option>
                                    </select>
                                </div>
                            </InputGroup>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Analyzing...' : <><Calculator size={20} /> Predict Role</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Panel: Advanced Dashboard */}
                <div className="lg:col-span-8">
                    {result ? (
                        <div className="space-y-6 animate-enter">
                            {/* Hero Card */}
                            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4 opacity-80">
                                        <div className="p-2 bg-white/10 rounded-lg"><Briefcase size={20} /></div>
                                        <span className="text-sm font-medium tracking-wide uppercase">Top Career Match</span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-bold mb-2">{result.Job_Domain}</h1>
                                    <div className="flex items-center gap-4 mt-4">
                                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold border border-green-500/30 flex items-center gap-2">
                                            <CheckCircle size={14} /> {(result.Confidence * 100).toFixed(0)}% Match Confidence
                                        </span>
                                    </div>
                                    <p className="mt-6 text-indigo-100 leading-relaxed max-w-2xl text-lg">
                                        {result.details?.description}
                                    </p>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Salary Card */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                                    <div className="p-3 bg-green-100 text-green-600 rounded-xl shrink-0"><DollarSign size={24} /></div>
                                    <div>
                                        <h3 className="text-slate-500 font-medium text-sm">Average Salary</h3>
                                        <p className="text-xl font-bold text-slate-800 mt-1">{result.details?.avg_salary}</p>
                                        <p className="text-xs text-green-600 mt-1">+12% Annual Growth</p>
                                    </div>
                                </div>
                                {/* Growth Card */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0"><TrendingUp size={24} /></div>
                                    <div>
                                        <h3 className="text-slate-500 font-medium text-sm">Industry Growth</h3>
                                        <p className="text-xl font-bold text-slate-800 mt-1">{result.details?.growth}</p>
                                        <p className="text-xs text-blue-600 mt-1">High Demand Role</p>
                                    </div>
                                </div>
                            </div>

                            {/* Skills & Companies */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BookOpen size={18} className="text-purple-500" /> Key Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.details?.skills?.map(skill => (
                                            <span key={skill} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-100">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Building size={18} className="text-indigo-500" /> Top Recruiters</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.details?.companies?.map(comp => (
                                            <span key={comp} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-100">{comp}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Roadmap CTA */}
                            {result.details?.roadmap_link && (
                                <a href={result.details.roadmap_link} className="block group">
                                    <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between hover:shadow-xl hover:bg-slate-800 transition-all">
                                        <div>
                                            <h3 className="text-lg font-bold">Start Your Personal Roadmap</h3>
                                            <p className="text-slate-400 text-sm">Step-by-step guide to become a {result.Job_Domain}</p>
                                        </div>
                                        <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-all">
                                            <ArrowLeft size={24} className="rotate-180" />
                                        </div>
                                    </div>
                                </a>
                            )}
                        </div>
                    ) : (
                        <div className="bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-800 p-8 h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                            <div className="p-4 bg-slate-800 rounded-full shadow-sm text-slate-300">
                                <Briefcase size={64} />
                            </div>
                            <div className="max-w-xs">
                                <h3 className="text-lg font-bold text-slate-400">Ready to Predict</h3>
                                <p className="text-slate-400 text-sm mt-2">Enter your academic details to discover the career path that best fits your profile.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobRolePrediction;
