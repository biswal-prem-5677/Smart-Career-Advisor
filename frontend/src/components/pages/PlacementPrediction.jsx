import React, { useState } from 'react';
import { api } from '../../api/api';
import {
    Briefcase, Award, TrendingUp, BookOpen, User,
    CheckCircle2, XCircle, Loader2, Sparkles, Building2, MapPin
} from 'lucide-react';

const PlacementPrediction = () => {
    const [formData, setFormData] = useState({
        Gender: 'Male',
        board_10: 'CBSE',
        marks_10: '',
        board_12: 'CBSE',
        marks_12: '',
        Stream: 'Science',
        Cgpa: '',
        Internships: 'No',
        Training: 'No',
        Backlog_5th: 'No',
        Innovative_Project: 'No',
        Communication_level: 5,
        Technical_Course: 'No'
    });

    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            // Prepare payload (convert types)
            const payload = {
                ...formData,
                marks_10: parseFloat(formData.marks_10),
                marks_12: parseFloat(formData.marks_12),
                Cgpa: parseFloat(formData.Cgpa),
                Communication_level: parseInt(formData.Communication_level)
            };

            const response = await fetch('http://localhost:8000/api/placement/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Prediction failed");
            const data = await response.json();

            // Simulate delay for "Thinking" effect
            setTimeout(() => {
                setResult(data);
                setIsLoading(false);
            }, 1500);

        } catch (err) {
            setError("Could not connect to Prediction Engine.");
            setIsLoading(false);
        }
    };

    const InputField = ({ label, name, type = "text", placeholder, icon: Icon }) => (
        <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    {Icon && <Icon size={18} />}
                </div>
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-slate-800 placeholder:text-slate-300 shadow-sm"
                />
            </div>
        </div>
    );

    const SelectField = ({ label, name, options, icon: Icon }) => (
        <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    {Icon && <Icon size={18} />}
                </div>
                <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-slate-800 shadow-sm appearance-none"
                >
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-10 text-center space-y-4 animate-enter">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm border border-indigo-100">
                    <Sparkles size={16} /> Placement Predictor AI
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                    Will You Get <span className="text-indigo-600">Placed?</span>
                </h1>
                <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                    Analyzing historical data to predict your placement probability and suggested companies.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* FORM SECTION */}
                <div className="lg:col-span-7">
                    <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl shadow-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-50"></div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Academic Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <BookOpen size={16} /> Academic Profile
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="10th Marks (%)" name="marks_10" type="number" placeholder="e.g. 85" icon={Award} />
                                    <InputField label="12th Marks (%)" name="marks_12" type="number" placeholder="e.g. 88" icon={Award} />
                                    <SelectField label="12th Board" name="board_12" options={['CBSE', 'ICSE', 'State Board']} icon={Building2} />
                                    <SelectField label="Stream" name="Stream" options={['Science', 'Commerce', 'Arts']} icon={BookOpen} />
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* College Performance */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <TrendingUp size={16} /> Performance & Skills
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="CGPA (Current)" name="Cgpa" type="number" placeholder="e.g. 8.5" icon={TrendingUp} />
                                    <SelectField label="Communication Skill (1-10)" name="Communication_level" options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} icon={User} />
                                    <SelectField label="Internships?" name="Internships" options={['Yes', 'No']} icon={Briefcase} />
                                    <SelectField label="Projects?" name="Innovative_Project" options={['Yes', 'No']} icon={Sparkles} />
                                    <SelectField label="Backlogs?" name="Backlog_5th" options={['Yes', 'No']} icon={XCircle} />
                                    <SelectField label="Technical Course?" name="Technical_Course" options={['Yes', 'No']} icon={Award} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" /> Analyzing Profile...
                                    </>
                                ) : (
                                    <>
                                        Predict Probability <Sparkles size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RESULT SECTION */}
                <div className="lg:col-span-5 space-y-6">

                    {/* Placeholder or Result Card */}
                    {!result && !isLoading && (
                        <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                <Briefcase size={32} className="text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-400">Ready to Predict</h3>
                            <p className="text-slate-400 max-w-xs mt-2">Fill out your academic details to generate a placement probability report.</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="h-full min-h-[400px] bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 animate-pulse border border-indigo-50">
                            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center animate-spin mb-6">
                                <Loader2 size={40} className="text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800">Processing Data...</h3>
                            <p className="text-slate-500 mt-2">Running XGBoost Pipeline</p>
                        </div>
                    )}

                    {result && (
                        <div className="animate-enter">
                            {/* Main Result Card */}
                            <div className={`
                                relative p-8 rounded-3xl shadow-2xl overflow-hidden mb-6 text-white text-center
                                ${result.prediction === 'Placed'
                                    ? 'bg-gradient-to-br from-emerald-500 to-teal-700 shadow-emerald-500/30'
                                    : 'bg-gradient-to-br from-rose-500 to-orange-600 shadow-rose-500/30'}
                            `}>
                                {/* Confetti / Background */}
                                <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>

                                <div className="relative z-10">
                                    <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 ring-4 ring-white/10">
                                        {result.prediction === 'Placed' ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
                                    </div>

                                    <h2 className="text-4xl font-black mb-2">{result.prediction}!</h2>
                                    <p className="text-white/80 font-medium text-lg">
                                        {(result.probability * 100).toFixed(1)}% Probability
                                    </p>
                                </div>
                            </div>

                            {/* Recommendations Card */}
                            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    {result.prediction === 'Placed' ? '🎯 Recommended Companies' : '📈 Improvement Roadmap'}
                                </h3>

                                {result.recommendations && result.prediction === 'Placed' ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                            <p className="text-emerald-800 font-bold mb-1">Target Role</p>
                                            <p className="text-emerald-600 text-sm">{result.recommendations.role}</p>
                                        </div>
                                        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                            <p className="text-indigo-800 font-bold mb-1">Expected Package</p>
                                            <p className="text-indigo-600 text-3xl font-black">{result.recommendations.avg_package}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Top Recruiters</p>
                                            <div className="flex flex-wrap gap-2">
                                                {result.recommendations.list.map((company, i) => (
                                                    <span key={i} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-sm border border-slate-200">
                                                        {company}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                                            <p className="text-rose-800 font-bold mb-2">Key Gaps Identified</p>
                                            <ul className="list-disc pl-4 space-y-1 text-sm text-rose-600">
                                                {result.recommendations?.reasons?.map((r, i) => <li key={i}>{r}</li>)}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recommended Resources</p>
                                            <div className="space-y-2">
                                                {result.recommendations?.resources?.map((res, i) => (
                                                    <a key={i} href={res.link} target="_blank" rel="noreferrer" className="block p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-100 flex items-center justify-between group">
                                                        <span className="font-medium text-slate-700">{res.name}</span>
                                                        <TrendingUp size={16} className="text-slate-400 group-hover:text-indigo-500" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlacementPrediction;
