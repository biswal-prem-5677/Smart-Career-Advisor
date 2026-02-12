import React, { useState } from 'react';
import axios from 'axios';
import { api } from '../../api/api';
import { ArrowLeft, IndianRupee, TrendingUp, Users, Briefcase, Award, GraduationCap, CheckCircle, Target } from 'lucide-react';

const InputGroup = ({ title, children }) => (
    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);

const SalaryPrediction = ({ onBack }) => {
    const [formData, setFormData] = useState({
        age: '',
        gender: 'Male',
        education: "Bachelor's",
        job_title: 'Software Engineer',
        experience: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                age: parseFloat(formData.age) || 0,
                gender: formData.gender,
                education: formData.education,
                job_title: formData.job_title,
                experience: parseFloat(formData.experience) || 0
            };

            const response = await axios.post(`/api/salary/predict`, payload);
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
                            <div className="p-3 bg-emerald-900/40 text-emerald-400 rounded-xl">
                                <IndianRupee size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-100">Salary Estimator</h1>
                                <p className="text-slate-200 text-xs">Unlock your market value potential.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-2">
                            {/* Personal Details */}
                            <InputGroup title="Personal Details">
                                <div>
                                    <label className="text-xs font-semibold text-slate-200">Age</label>
                                    <input type="number" required value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm text-slate-200 placeholder-slate-500" placeholder="e.g. 25" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-200">Gender</label>
                                    <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/50 outline-none text-sm text-slate-200">
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>
                            </InputGroup>

                            {/* Professional Profile */}
                            <InputGroup title="Professional Profile">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-semibold text-slate-200">Job Role</label>
                                    <select value={formData.job_title} onChange={(e) => setFormData({ ...formData, job_title: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm text-slate-200">
                                        <option>Software Engineer</option>
                                        <option>Data Analyst</option>
                                        <option>Senior Manager</option>
                                        <option>Sales Associate</option>
                                        <option>Director</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-200">Exp (Yrs)</label>
                                    <input type="number" step="0.5" required value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm text-slate-200 placeholder-slate-500" placeholder="e.g. 3.5" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-200">Education</label>
                                    <select value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-700/50 outline-none text-sm text-slate-200">
                                        <option>Bachelor's</option>
                                        <option>Master's</option>
                                        <option>PhD</option>
                                    </select>
                                </div>
                            </InputGroup>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? 'Calculating...' : <><TrendingUp size={20} /> Analyze Market Value</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Panel: Advanced Dashboard */}
                <div className="lg:col-span-8">
                    {result ? (
                        <div className="space-y-6 animate-enter">
                            {/* Hero Card - Salary Range */}
                            <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6 opacity-80">
                                        <div className="p-2 bg-white/10 rounded-lg"><Award size={20} /></div>
                                        <span className="text-sm font-medium tracking-wide uppercase">Your Market Value</span>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-baseline gap-2 mb-2">
                                        <h1 className="text-4xl md:text-5xl font-bold">₹{result.min_salary?.toLocaleString()}</h1>
                                        <span className="text-2xl text-emerald-200">-</span>
                                        <h1 className="text-4xl md:text-5xl font-bold">₹{result.max_salary?.toLocaleString()}</h1>
                                    </div>
                                    <p className="text-emerald-100 mb-6">Estimated Annual Compensation Range</p>

                                    <div className="flex items-center gap-4">
                                        <span className="px-3 py-1 bg-white/10 text-emerald-200 rounded-full text-xs font-semibold border border-emerald-500/30">
                                            Base: ₹{result.predicted_salary?.toLocaleString()}
                                        </span>
                                        <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-lg animate-pulse">
                                            {result.growth_rate} Growth
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Insights Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Market Demand */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0"><Users size={24} /></div>
                                    <div>
                                        <h3 className="text-slate-300 font-medium text-sm">Market Demand</h3>
                                        <p className="text-xl font-bold text-slate-800 mt-1">{result.market_trend || "High"}</p>
                                        <p className="text-xs text-blue-600 mt-1">Based on current openings</p>
                                    </div>
                                </div>
                                {/* Career Tip */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl shrink-0"><Target size={24} /></div>
                                    <div>
                                        <h3 className="text-slate-300 font-medium text-sm">Pro Tip</h3>
                                        <p className="text-sm font-medium text-slate-700 mt-1 leading-relaxed">"{result.tips || "Focus on upskilling."}"</p>
                                    </div>
                                </div>
                            </div>

                            {/* Context/Disclaimer */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
                                <p className="text-slate-300 text-xs">
                                    *Estimations are based on machine learning models trained on historical data. Actual offers may vary based on location, company size, and negotiation skills.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-800 p-8 h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                            <div className="p-4 bg-slate-800 rounded-full shadow-sm text-slate-300">
                                <IndianRupee size={64} />
                            </div>
                            <div className="max-w-xs">
                                <h3 className="text-lg font-bold text-slate-200">Ready to Estimate</h3>
                                <p className="text-slate-300 text-sm mt-2">Enter your professional details to get a comprehensive salary market analysis.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalaryPrediction;
