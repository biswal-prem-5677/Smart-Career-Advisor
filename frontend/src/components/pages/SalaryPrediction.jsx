import React, { useState } from 'react';
import { ArrowLeft, IndianRupee, TrendingUp } from 'lucide-react';

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
            const response = await fetch('http://localhost:8000/api/predict/salary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    age: parseFloat(formData.age) || 0,
                    gender: formData.gender,
                    education: formData.education,
                    job_title: formData.job_title,
                    experience: parseFloat(formData.experience) || 0
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

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-enter">
            <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Models
            </button>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                        <IndianRupee size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Salary Prediction</h1>
                        <p className="text-slate-500">Estimate market salary based on experience and role.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                                <input type="number" required value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Experience (Yrs)</label>
                                <input type="number" step="0.5" required value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/50" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                            <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/50">
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Education</label>
                            <select value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/50">
                                <option>Bachelor's</option>
                                <option>Master's</option>
                                <option>PhD</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Job Role</label>
                            <select value={formData.job_title} onChange={(e) => setFormData({ ...formData, job_title: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/50">
                                <option>Software Engineer</option>
                                <option>Data Analyst</option>
                                <option>Senior Manager</option>
                                <option>Sales Associate</option>
                                <option>Director</option>
                            </select>
                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Calculating...' : <><TrendingUp size={20} /> Predict Salary</>}
                        </button>
                    </form>

                    <div className="bg-slate-50 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
                        {result ? (
                            <div className="text-center space-y-4 animate-enter">
                                <div className="inline-block p-4 bg-emerald-100 text-emerald-600 rounded-full mb-2">
                                    <IndianRupee size={40} />
                                </div>
                                <h3 className="text-lg font-medium text-slate-500">Estimated Annual Salary</h3>
                                <div className="text-4xl font-bold text-slate-800">₹{result.predicted_salary.toLocaleString()}</div>
                                <p className="text-xs text-slate-400 max-w-xs mx-auto">Based on market trends and historical data for similar profiles.</p>
                            </div>
                        ) : (
                            <div className="text-center text-slate-400">
                                <IndianRupee size={64} className="mx-auto mb-4 opacity-20" />
                                <p>Enter your details to see the prediction</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalaryPrediction;
