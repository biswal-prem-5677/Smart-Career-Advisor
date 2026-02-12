import React, { useState } from 'react';
import { ArrowLeft, Target, Compass, Brain, Code, Briefcase, TrendingUp, CheckCircle, User, Award, BookOpen } from 'lucide-react';

const DomainFitPrediction = ({ onBack }) => {
    const [formData, setFormData] = useState({
        Age: '',
        Gender: 'Male',
        Vocational_Program: 'No',
        Academic_Performance: '',
        Certifications_Count: '',
        Internship_Experience: '',
        Skill_1: '5', // Problem Solving
        Skill_2: '5', // Technical
        Skill_3: '5', // Communication
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`/api/predict/domain-fit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Age: parseFloat(formData.Age) || 20,
                    Gender: formData.Gender,
                    Vocational_Program: formData.Vocational_Program,
                    Academic_Performance: parseFloat(formData.Academic_Performance) || 0,
                    Certifications_Count: parseInt(formData.Certifications_Count) || 0,
                    Internship_Experience: parseInt(formData.Internship_Experience) || 0,
                    Skill_1: parseInt(formData.Skill_1) || 0,
                    Skill_2: parseInt(formData.Skill_2) || 0,
                    Skill_3: parseInt(formData.Skill_3) || 0,
                })
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Prediction failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSliderChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-enter p-6">
            <button onClick={onBack} className="flex items-center text-slate-200 hover:text-indigo-300 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Models
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Input Form */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-700 p-8 h-full">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-gradient-to-br from-orange-900/40 to-amber-900/40 text-orange-400 rounded-xl">
                                <Target size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-100">Domain Fit</h1>
                                <p className="text-slate-200 text-sm">Find your ideal tech career path.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">Age</label>
                                    <input type="number" required value={formData.Age} onChange={(e) => setFormData({ ...formData, Age: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-200 focus:bg-slate-700/50 transition-all placeholder-slate-500" placeholder="e.g. 21" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">CGPA / %</label>
                                    <input type="number" step="0.1" required value={formData.Academic_Performance} onChange={(e) => setFormData({ ...formData, Academic_Performance: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-200 focus:bg-slate-700/50 transition-all placeholder-slate-500" placeholder="e.g. 8.5" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">Gender</label>
                                    <select value={formData.Gender} onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-200 focus:bg-slate-700/50 transition-all">
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">Vocational Pgm.</label>
                                    <select value={formData.Vocational_Program} onChange={(e) => setFormData({ ...formData, Vocational_Program: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-200 focus:bg-slate-700/50 transition-all">
                                        <option value="No">No</option>
                                        <option value="Yes">Yes</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">Certifications</label>
                                    <input type="number" required value={formData.Certifications_Count} onChange={(e) => setFormData({ ...formData, Certifications_Count: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-200 focus:bg-slate-700/50 transition-all placeholder-slate-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">Internships</label>
                                    <input type="number" required value={formData.Internship_Experience} onChange={(e) => setFormData({ ...formData, Internship_Experience: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 outline-none focus:ring-2 focus:ring-orange-500/20 text-slate-200 focus:bg-slate-700/50 transition-all placeholder-slate-500" />
                                </div>
                            </div>

                            {/* Skills Sliders */}
                            <div className="space-y-4 pt-4 border-t border-slate-700">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                            <Brain size={16} className="text-indigo-500" /> Problem Solving
                                        </label>
                                        <span className="text-indigo-400 font-bold">{formData.Skill_1}/10</span>
                                    </div>
                                    <input type="range" min="1" max="10" name="Skill_1" value={formData.Skill_1} onChange={handleSliderChange}
                                        className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                            <Code size={16} className="text-emerald-500" /> Technical Knowledge
                                        </label>
                                        <span className="text-emerald-400 font-bold">{formData.Skill_2}/10</span>
                                    </div>
                                    <input type="range" min="1" max="10" name="Skill_2" value={formData.Skill_2} onChange={handleSliderChange}
                                        className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                            <Briefcase size={16} className="text-orange-500" /> Communication
                                        </label>
                                        <span className="text-orange-400 font-bold">{formData.Skill_3}/10</span>
                                    </div>
                                    <input type="range" min="1" max="10" name="Skill_3" value={formData.Skill_3} onChange={handleSliderChange}
                                        className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-slate-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? 'Analyzing Profile...' : <><Compass size={20} /> Predict Career Path</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right: Results Display */}
                <div className="lg:col-span-7">
                    {result ? (
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 h-full space-y-8 animate-enter">

                            {/* Main Result Header */}
                            <div className="text-center space-y-4 pb-8 border-b border-slate-100">
                                <div className="inline-flex items-center justify-center p-4 bg-indigo-50 text-indigo-600 rounded-full mb-2 ring-4 ring-indigo-50/50">
                                    <Target size={48} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Recommended Domain</h2>
                                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">{result.domain_fit}</h1>
                                </div>
                                <div className="inline-flex items-center px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold shadow-sm">
                                    <CheckCircle size={16} className="mr-2" />
                                    {(result.confidence * 100).toFixed(0)}% Match Confidence
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Description Card */}
                                <div className="col-span-1 md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                                        <User size={20} className="text-blue-500" /> Why this fit?
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        {result.details?.description || "Based on your creative and technical balance, this domain seems to be the perfect environment for your growth."}
                                    </p>
                                </div>

                                {/* Roles Card */}
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                                        <Briefcase size={20} className="text-purple-500" /> Potential Roles
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.details?.roles?.map((role, i) => (
                                            <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-400 font-medium shadow-sm">
                                                {role}
                                            </span>
                                        )) || <span className="text-slate-300">Various roles available</span>}
                                    </div>
                                </div>

                                {/* Salary & Skills Card */}
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
                                    <div>
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                                            <TrendingUp size={20} className="text-green-500" /> Average Salary
                                        </h3>
                                        <p className="text-lg font-mono text-slate-700 font-semibold">
                                            {result.details?.avg_salary || "Market Competitive"}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                                            <Award size={20} className="text-amber-500" /> Key Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.details?.skills_needed?.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-800 p-8 h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="p-4 bg-slate-800 rounded-full shadow-sm text-slate-300">
                                <Target size={64} />
                            </div>
                            <div className="max-w-xs">
                                <h3 className="text-lg font-bold text-slate-200">Ready to Analyze</h3>
                                <p className="text-slate-300 mt-2">Fill in your academic and skill details on the left to get your personalized career domain prediction.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DomainFitPrediction;
