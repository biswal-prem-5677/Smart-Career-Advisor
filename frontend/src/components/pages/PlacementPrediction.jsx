import React, { useState } from 'react';
import { api } from '../../api/api';
import {
    Briefcase, Award, TrendingUp, BookOpen, User,
    CheckCircle2, XCircle, Loader2, Sparkles, Building2, MapPin
} from 'lucide-react';
import { useReportCard } from '../../context/ReportCardContext';

const InputField = ({ label, name, type = "text", placeholder, icon: Icon, value, onChange }) => (
    <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-300 ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                {Icon && <Icon size={18} />}
            </div>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                min={name.includes('marks') ? 0 : name === 'Cgpa' ? 0 : undefined}
                max={name.includes('marks') ? 100 : name === 'Cgpa' ? 10 : undefined}
                step={name === 'Cgpa' ? "0.01" : "1"}
                className="w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-white placeholder:text-slate-600 shadow-sm"
            />
        </div>
    </div>
);

const SelectField = ({ label, name, options, icon: Icon, value, onChange }) => (
    <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-300 ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                {Icon && <Icon size={18} />}
            </div>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-white shadow-sm appearance-none"
            >
                {options.map(opt => <option key={opt} value={opt} className="bg-slate-900 text-white">{opt}</option>)}
            </select>
        </div>
    </div>
);

const PlacementPrediction = () => {
    const { markFeatureUsed } = useReportCard();
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
            const payload = {
                ...formData,
                marks_10: parseFloat(formData.marks_10),
                marks_12: parseFloat(formData.marks_12),
                Cgpa: parseFloat(formData.Cgpa),
                Communication_level: parseInt(formData.Communication_level)
            };

            const response = await api.post(`/api/placement/predict`, payload);
            const data = response.data;

            setTimeout(() => {
                setResult(data);
                setIsLoading(false);
                // Mark as used
                markFeatureUsed('prediction', { type: 'Placement', result: data.prediction, probability: data.probability });
            }, 1000);

        } catch (err) {
            console.error(err);
            setError("Could not connect to Prediction Engine.");
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 pt-10">
            {/* Header */}
            <div className="mb-10 text-center space-y-4 animate-enter">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-900/30 text-indigo-400 font-bold text-sm border border-indigo-500/30">
                    <Sparkles size={16} /> Model Prediction AI
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    Will You Get <span className="text-indigo-500">Placed?</span>
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    Analyzing historical data to predict your placement probability and suggested companies.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* FORM SECTION */}
                <div className="lg:col-span-7">
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl -z-10 opacity-20"></div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Academic Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <BookOpen size={16} /> Academic Profile
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="10th Marks (%)" name="marks_10" type="number" placeholder="e.g. 85" icon={Award} value={formData.marks_10} onChange={handleChange} />
                                    <InputField label="12th Marks (%)" name="marks_12" type="number" placeholder="e.g. 88" icon={Award} value={formData.marks_12} onChange={handleChange} />
                                    <SelectField label="Gender" name="Gender" options={['Male', 'Female', 'Other']} icon={User} value={formData.Gender} onChange={handleChange} />
                                    <SelectField label="12th Board" name="board_12" options={['CBSE', 'ICSE', 'State Board']} icon={Building2} value={formData.board_12} onChange={handleChange} />
                                    <SelectField label="Stream" name="Stream" options={['Science', 'Commerce', 'Arts']} icon={BookOpen} value={formData.Stream} onChange={handleChange} />
                                </div>
                            </div>

                            <hr className="border-slate-800" />

                            {/* College Performance */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <TrendingUp size={16} /> Performance & Skills
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="CGPA (Current)" name="Cgpa" type="number" placeholder="e.g. 8.5" icon={TrendingUp} value={formData.Cgpa} onChange={handleChange} />
                                    <SelectField label="Communication Level" name="Communication_level" options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} icon={User} value={formData.Communication_level} onChange={handleChange} />
                                    <SelectField label="Internships?" name="Internships" options={['Yes', 'No']} icon={Briefcase} value={formData.Internships} onChange={handleChange} />
                                    <SelectField label="Projects?" name="Innovative_Project" options={['Yes', 'No']} icon={Sparkles} value={formData.Innovative_Project} onChange={handleChange} />
                                    <SelectField label="Backlogs?" name="Backlog_5th" options={['Yes', 'No']} icon={XCircle} value={formData.Backlog_5th} onChange={handleChange} />
                                    <SelectField label="Technical Course?" name="Technical_Course" options={['Yes', 'No']} icon={Award} value={formData.Technical_Course} onChange={handleChange} />
                                </div>
                            </div>

                            {/* Real-time Validation Bar */}
                            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <span>Profile Readiness</span>
                                    <span>{formData.Cgpa ? (Math.min(parseFloat(formData.Cgpa) * 10, 100)).toFixed(0) : 0}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                        style={{ width: `${formData.Cgpa ? Math.min(parseFloat(formData.Cgpa) * 10, 100) : 0}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] text-slate-500 italic text-center">Output will be validated by AI Engine on submission</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/50 hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 border border-indigo-500/50"
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
                        <div className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-slate-900/50">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                                <Briefcase size={32} className="text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-400">Ready to Predict</h3>
                            <p className="text-slate-500 max-w-xs mt-2">Fill out your academic details to generate a placement probability report.</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="h-full min-h-[400px] bg-slate-900 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 animate-pulse border border-slate-700">
                            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center animate-spin mb-6">
                                <Loader2 size={40} className="text-indigo-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Processing Data...</h3>
                            <p className="text-slate-500 mt-2">Running XGBoost Pipeline</p>
                        </div>
                    )}

                    {result && (
                        <div className="animate-enter">
                            {/* Main Result Card */}
                            <div className={`
                                relative p-8 rounded-3xl shadow-2xl overflow-hidden mb-6 text-white text-center
                                ${result.prediction === 'Placed'
                                    ? 'bg-gradient-to-br from-emerald-600 to-teal-800 shadow-emerald-900/30'
                                    : 'bg-gradient-to-br from-rose-600 to-orange-800 shadow-rose-900/30'}
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
                            <div className="bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-700">
                                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                    {result.prediction === 'Placed' ? '🎯 Recommended Companies' : '📈 Improvement Roadmap'}
                                </h3>

                                {result.recommendations && result.prediction === 'Placed' ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-emerald-900/20 rounded-2xl border border-emerald-900/50">
                                            <p className="text-emerald-400 font-bold mb-1">Target Role</p>
                                            <p className="text-emerald-200 text-sm">{result.recommendations.role}</p>
                                        </div>
                                        <div className="p-4 bg-indigo-900/20 rounded-2xl border border-indigo-900/50">
                                            <p className="text-indigo-400 font-bold mb-1">Expected Package</p>
                                            <p className="text-indigo-300 text-3xl font-black">{result.recommendations.avg_package}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Top Recruiters</p>
                                            <div className="flex flex-wrap gap-2">
                                                {result.recommendations.list.map((company, i) => (
                                                    <span key={i} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-lg text-sm border border-slate-700">
                                                        {company}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-rose-900/20 rounded-2xl border border-rose-900/50">
                                            <p className="text-rose-400 font-bold mb-2">Key Gaps Identified</p>
                                            <ul className="list-disc pl-4 space-y-1 text-sm text-rose-300">
                                                {result.recommendations?.reasons?.map((r, i) => <li key={i}>{r}</li>)}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Recommended Resources</p>
                                            <div className="space-y-2">
                                                {result.recommendations?.resources?.map((res, i) => (
                                                    <a key={i} href={res.link} target="_blank" rel="noreferrer" className="block p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700 flex items-center justify-between group">
                                                        <span className="font-medium text-slate-300">{res.name}</span>
                                                        <TrendingUp size={16} className="text-slate-500 group-hover:text-indigo-400" />
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
