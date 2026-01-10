import React, { useState } from 'react';
import { ArrowLeft, Target, Compass } from 'lucide-react';

const DomainFitPrediction = ({ onBack }) => {
    const [formData, setFormData] = useState({
        Age: '',
        Gender: 'Male',
        Vocational_Program: 'Yes',
        Academic_Performance: '',
        Certifications_Count: '',
        Internship_Experience: '',
        Skill_1: '0',
        Skill_2: '0',
        Skill_3: '0'
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/predict/domain-fit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Age: parseFloat(formData.Age) || 0,
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

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-enter">
            <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
                <ArrowLeft size={20} className="mr-2" /> Back to Models
            </button>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                        <Target size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Domain Fit Prediction</h1>
                        <p className="text-slate-500">Discover which tech domain aligns with your profile.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                                <input type="number" required value={formData.Age} onChange={(e) => setFormData({ ...formData, Age: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Academic Score</label>
                                <input type="number" step="0.1" required value={formData.Academic_Performance} onChange={(e) => setFormData({ ...formData, Academic_Performance: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500/50" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Certifications</label>
                                <input type="number" required value={formData.Certifications_Count} onChange={(e) => setFormData({ ...formData, Certifications_Count: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500/50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Internships (Count)</label>
                                <input type="number" required value={formData.Internship_Experience} onChange={(e) => setFormData({ ...formData, Internship_Experience: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500/50" />
                            </div>
                        </div>

                        {/* Dummy inputs for Skills 1-3 to match model expectations */}
                        <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map(i => (
                                <div key={i}>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Skill {i} Score</label>
                                    <input type="number" value={formData[`Skill_${i}`]} onChange={(e) => setFormData({ ...formData, [`Skill_${i}`]: e.target.value })} className="w-full px-2 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500/50" />
                                </div>
                            ))}
                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? 'Analyzing...' : <><Compass size={20} /> Check Fit</>}
                        </button>
                    </form>

                    <div className="bg-slate-50 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
                        {result && result.domain_fit ? (
                            <div className="text-center space-y-4 animate-enter">
                                <div className="inline-block p-4 bg-orange-100 text-orange-600 rounded-full mb-2">
                                    <Target size={40} />
                                </div>
                                <h3 className="text-lg font-medium text-slate-500">Best Fit Domain</h3>
                                <div className="text-3xl font-bold text-slate-800">{result.domain_fit}</div>
                                <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium">
                                    {(result.confidence * 100).toFixed(1)}% Confidence
                                </div>
                            </div>
                        ) : result ? (
                            <div className="text-center text-red-500 space-y-2 animate-enter">
                                <p className="font-bold text-xl">Prediction Failed</p>
                                <p className="text-slate-600">
                                    {result.message || (result.detail ? "Please ensure all fields are correct." : "Unknown error occurred")}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center text-slate-400">
                                <Target size={64} className="mx-auto mb-4 opacity-20" />
                                <p>Enter your profile stats to find your fit</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DomainFitPrediction;
