import React, { useState } from 'react';
import { ArrowLeft, Briefcase, Calculator } from 'lucide-react';
import { api } from '../../api/api';

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
            // In a real app, you'd have an API wrapper. Here we fetch directly or extend api.js
            const response = await fetch('http://localhost:8000/api/predict/job-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
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
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                        <Briefcase size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Job Role Prediction</h1>
                        <p className="text-slate-500">Enter your academic scores to find your ideal job role.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                                <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none bg-white">
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Work Experience</label>
                                <select value={formData.workex} onChange={(e) => setFormData({ ...formData, workex: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none bg-white">
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'SSC Percentage (10th)', name: 'ssc_p' },
                                { label: 'HSC Percentage (12th)', name: 'hsc_p' },
                                { label: 'Degree Percentage', name: 'degree_p' },
                                { label: 'Employability Test %', name: 'etest_p' },
                                { label: 'MBA Percentage', name: 'mba_p' },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={formData[field.name]}
                                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                                        placeholder="e.g. 85.5"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <label className="block font-medium text-slate-700 mb-1">SSC Board</label>
                                <select value={formData.ssc_b} onChange={(e) => setFormData({ ...formData, ssc_b: e.target.value })} className="w-full px-2 py-2 rounded-lg border border-slate-200 bg-white">
                                    <option value="Central">Central</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium text-slate-700 mb-1">HSC Board</label>
                                <select value={formData.hsc_b} onChange={(e) => setFormData({ ...formData, hsc_b: e.target.value })} className="w-full px-2 py-2 rounded-lg border border-slate-200 bg-white">
                                    <option value="Central">Central</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium text-slate-700 mb-1">HSC Stream</label>
                                <select value={formData.hsc_s} onChange={(e) => setFormData({ ...formData, hsc_s: e.target.value })} className="w-full px-2 py-2 rounded-lg border border-slate-200 bg-white">
                                    <option value="Science">Science</option>
                                    <option value="Commerce">Commerce</option>
                                    <option value="Arts">Arts</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-medium text-slate-700 mb-1">Degree Type</label>
                                <select value={formData.degree_t} onChange={(e) => setFormData({ ...formData, degree_t: e.target.value })} className="w-full px-2 py-2 rounded-lg border border-slate-200 bg-white">
                                    <option value="Sci&Tech">Sci&Tech</option>
                                    <option value="Comm&Mgmt">Comm&Mgmt</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block font-medium text-slate-700 mb-1">MBA Specialisation</label>
                                <select value={formData.specialisation} onChange={(e) => setFormData({ ...formData, specialisation: e.target.value })} className="w-full px-2 py-2 rounded-lg border border-slate-200 bg-white">
                                    <option value="Mkt&HR">Mkt&HR</option>
                                    <option value="Mkt&Fin">Mkt&Fin</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Analyzing...' : <><Calculator size={20} /> Predict Role</>}
                        </button>
                    </form>

                    <div className="bg-slate-50 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
                        {result && result.Job_Domain ? (
                            <div className="text-center space-y-4 animate-enter">
                                <div className="inline-block p-4 bg-green-100 text-green-600 rounded-full mb-2">
                                    <Briefcase size={40} />
                                </div>
                                <h3 className="text-lg font-medium text-slate-500">Recommended Role</h3>
                                <div className="text-3xl font-bold text-slate-800">{result.Job_Domain}</div>
                                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                    {(result.Confidence * 100).toFixed(1)}% Confidence
                                </div>
                            </div>
                        ) : result ? (
                            <div className="text-center text-red-500 space-y-2 animate-enter">
                                <p className="font-bold text-xl">Prediction Failed</p>
                                <p className="text-slate-600">
                                    {result.message || (result.detail ? "Please ensure all fields including Work Experience are filled." : "Unknown error occurred")}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center text-slate-400">
                                <Briefcase size={64} className="mx-auto mb-4 opacity-20" />
                                <p>Enter your details to see the prediction</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobRolePrediction;
