import React, { useState, useEffect } from 'react';
import { Mail, Upload, Send, User, Briefcase, ExternalLink, Check, AlertCircle, FileText, Sparkles, Search } from 'lucide-react';
import { api } from '../../api/api';
import hrData from '../../assets/hr_data.json';

const HREmailGenerator = () => {
    const [resumeFile, setResumeFile] = useState(null);
    const [profile, setProfile] = useState(null);
    const [matchedHRs, setMatchedHRs] = useState([]);
    const [emailContent, setEmailContent] = useState('');
    const [selectedHR, setSelectedHR] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [targetRole, setTargetRole] = useState('Data Analyst');

    // Handle Resume Upload & Analysis
    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setResumeFile(file);
        setIsAnalyzing(true);
        setError(null);

        try {
            const result = await api.hrEmailerAnalyze(file);
            if (result.name) {
                setProfile(result);
                // Initial match based on resume's suggested roles
                const roles = result.suggested_roles || ['Software Engineer'];
                matchHRs(roles[0]);
                setTargetRole(roles[0]);
            } else {
                setError("Failed to analyze resume. Please try again.");
            }
        } catch (err) {
            setError("Error processing resume.");
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const matchHRs = (role) => {
        const matches = hrData.filter(hr =>
            hr.hiring_domains.some(domain =>
                domain.toLowerCase().includes(role.toLowerCase()) ||
                role.toLowerCase().includes(domain.toLowerCase())
            )
        );
        // If no direct role match, show top few
        setMatchedHRs(matches.length > 0 ? matches : hrData.slice(0, 5));
    };

    const handleGenerateEmail = async (hr) => {
        if (!profile) return;

        setSelectedHR(hr);
        setIsLoading(true);
        try {
            const result = await api.generateHREmailFromAI({
                hr_name: hr.hr_name,
                company: hr.company,
                user_name: profile.name,
                skills: profile.skills,
                target_role: targetRole
            });
            setEmailContent(result.email_content);
        } catch (err) {
            setError("Failed to generate email.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMail = () => {
        if (!emailContent || !selectedHR) return;

        const subject = encodeURIComponent(`Application for ${targetRole} - ${profile.name}`);
        const body = encodeURIComponent(emailContent);
        window.location.href = `mailto:${selectedHR.email}?subject=${subject}&body=${body}`;
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 pt-6 animate-enter">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-xl">
                <div className="space-y-2 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 text-indigo-400 text-xs font-black uppercase tracking-widest border border-indigo-500/20">
                        <Sparkles size={14} /> Auto Mate Mail
                    </div>
                    <h1 className="text-4xl font-black text-white">HR Email <span className="text-indigo-500">Generator</span></h1>
                    <p className="text-slate-400">Analyze your resume and connect with top HRs instantly.</p>
                </div>

                <div className="relative group">
                    <input
                        type="file"
                        id="fast-resume"
                        className="hidden"
                        onChange={handleResumeUpload}
                        accept=".pdf,.docx,.txt"
                    />
                    <label
                        htmlFor="fast-resume"
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold cursor-pointer transition-all active:scale-95 shadow-lg ${isAnalyzing
                                ? 'bg-slate-800 text-slate-500 cursor-wait'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-600/25 hover:scale-[1.02]'
                            }`}
                    >
                        {isAnalyzing ? (
                            <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : <Upload size={20} />}
                        {profile ? 'Update Resume' : 'Fast Upload Resume'}
                    </label>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-2xl flex items-center gap-3 animate-shake">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left: Profile & Search (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {profile && (
                        <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-md animate-enter">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <User size={18} className="text-indigo-400" /> Parsed Profile
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Candidate</p>
                                    <p className="text-white font-medium">{profile.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Skills</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {profile.skills.map((s, i) => (
                                            <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 rounded-lg text-[10px] border border-slate-700">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-800">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Target Role</p>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                                        <select
                                            value={targetRole}
                                            onChange={(e) => { setTargetRole(e.target.value); matchHRs(e.target.value); }}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                                        >
                                            {profile.suggested_roles.map((r, i) => <option key={i} value={r}>{r}</option>)}
                                            <option value="Software Engineer">Software Engineer</option>
                                            <option value="Data Analyst">Data Analyst</option>
                                            <option value="Full Stack Developer">Full Stack Developer</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-md">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Search size={18} className="text-indigo-400" /> Find Companies
                        </h3>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search TCS, Wipro..."
                                onChange={(e) => {
                                    const val = e.target.value.toLowerCase();
                                    const filtered = hrData.filter(h => h.company.toLowerCase().includes(val));
                                    setMatchedHRs(filtered);
                                }}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest text-center">Showing {matchedHRs.length} Matches</p>
                    </div>
                </div>

                {/* Right: HR Cards & Email (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* HR Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matchedHRs.map((hr, idx) => (
                            <div
                                key={idx}
                                className={`p-5 rounded-3xl border transition-all cursor-pointer group hover:bg-slate-800/40 ${selectedHR?.email === hr.email
                                        ? 'bg-indigo-900/20 border-indigo-500/50'
                                        : 'bg-slate-900/30 border-slate-800/50'
                                    }`}
                                onClick={() => handleGenerateEmail(hr)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="bg-white/5 p-2 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                                        <Briefcase size={20} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">{hr.company}</span>
                                        <a href={hr.linkedin} target="_blank" className="text-slate-500 hover:text-indigo-400 transition-colors">
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                                <h4 className="text-white font-bold">{hr.hr_name}</h4>
                                <p className="text-xs text-slate-400 mb-3">{hr.designation}</p>
                                <div className="flex flex-wrap gap-1">
                                    {hr.hiring_domains.slice(0, 2).map((d, i) => (
                                        <span key={i} className="text-[9px] bg-slate-950 px-2 py-0.5 rounded-full text-slate-500 border border-slate-800">{d}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Email View */}
                    {selectedHR && (
                        <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl overflow-hidden animate-enter">
                            <div className="bg-indigo-900/20 px-6 py-4 border-b border-indigo-500/20 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {selectedHR.hr_name[0]}
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-white font-bold">{selectedHR.hr_name}</p>
                                        <p className="text-slate-400 text-xs">To: {selectedHR.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSendMail}
                                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-900/20"
                                >
                                    One-Click Send <Send size={14} />
                                </button>
                            </div>
                            <div className="p-8">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-slate-500 text-sm italic">AI is personalizing your email...</p>
                                    </div>
                                ) : (
                                    <div className="relative group">
                                        <pre className="text-slate-300 text-sm font-sans whitespace-pre-wrap leading-relaxed">
                                            {emailContent}
                                        </pre>
                                        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { navigator.clipboard.writeText(emailContent); alert("Copied!"); }}
                                                className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white"
                                            >
                                                Copy
                                            </button>
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

export default HREmailGenerator;
