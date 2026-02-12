import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, Loader2, X, CloudUpload, User } from 'lucide-react';

const FileUpload = ({ onUpload, isLoading }) => {
    const [resume, setResume] = useState(null);
    const [jd, setJd] = useState(null);
    const [activeDrag, setActiveDrag] = useState(null);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) type === 'resume' ? setResume(file) : setJd(file);
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        setActiveDrag(null);
        const file = e.dataTransfer.files[0];
        if (file) type === 'resume' ? setResume(file) : setJd(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (jd) onUpload(resume, jd);
    };

    const UploadBox = ({ type, file, setFile, label, subLabel }) => (
        <label
            htmlFor={type}
            className={`relative group cursor-pointer flex flex-col items-center justify-center min-h-[220px] rounded-[2.5rem] border-2 border-dashed transition-all duration-500 overflow-hidden backdrop-blur-sm
            ${activeDrag === type ? 'border-indigo-500 bg-indigo-500/10 scale-105 shadow-2xl shadow-indigo-500/20' : 'border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1'}
            ${file ? 'border-solid border-emerald-500/40 bg-emerald-500/5' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setActiveDrag(type); }}
            onDragLeave={() => setActiveDrag(null)}
            onDrop={(e) => handleDrop(e, type)}
        >
            <input type="file" id={type} className="hidden" accept=".pdf,.docx,.txt" onChange={(e) => handleFileChange(e, type)} />

            {/* Background Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 transition-all duration-500 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 ${file ? 'opacity-0' : 'opacity-100'}`} />

            {file ? (
                <div className="relative z-10 flex flex-col items-center animate-enter">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-emerald-500/20">
                        <CheckCircle size={32} />
                    </div>
                    <p className="font-bold text-white text-lg mb-1 max-w-[200px] truncate">{file.name}</p>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-5">Verified & Ready</p>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFile(null); }}
                        className="px-5 py-2.5 bg-slate-800 text-rose-400 text-[10px] font-bold rounded-full shadow-lg border border-slate-700 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all flex items-center gap-2 group/btn"
                    >
                        <X size={12} className="group-hover/btn:rotate-90 transition-transform" /> Remove File
                    </button>
                </div>
            ) : (
                <div className="relative z-10 flex flex-col items-center text-center p-6">
                    <div className="w-20 h-20 bg-slate-800/80 rounded-[1.75rem] shadow-2xl shadow-black/40 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-slate-700/50 group-hover:border-indigo-500/50">
                        {type === 'resume' ? <User size={36} /> : <FileText size={36} />}
                    </div>
                    <span className="font-bold text-white text-lg mb-2 group-hover:text-indigo-200 transition-colors uppercase tracking-tight">{label}</span>
                    <span className="text-slate-400 text-sm max-w-[200px] leading-relaxed font-medium">{subLabel}</span>

                    <div className="mt-8 px-6 py-2.5 bg-indigo-600/10 rounded-full text-[10px] font-black text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-400 transition-all uppercase tracking-[0.15em] shadow-lg shadow-indigo-500/5">
                        Click or Drag File
                    </div>
                </div>
            )}
        </label>
    );

    return (
        <div className="relative isolate px-4 md:px-0">
            {/* Decorative Background for Section */}
            <div className="absolute inset-0 -z-10 overflow-hidden rounded-[3rem]">
                <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[80%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[20%] -right-[20%] w-[70%] h-[70%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl p-8 md:p-14 rounded-[3.5rem] shadow-2xl border border-slate-800/50 relative overflow-hidden">
                {/* Section Header */}
                <div className="mb-12">
                    <h2 className="text-4xl font-black text-white mb-4 text-center tracking-tight">Start Your Analysis</h2>
                    <div className="w-20 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-6"></div>
                    <p className="text-slate-400 text-center max-w-xl mx-auto text-lg leading-relaxed font-medium">Upload your documents to unlock personalized career insights and AI-powered recommendations.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <UploadBox
                            type="resume"
                            file={resume}
                            setFile={setResume}
                            label="Your Resume"
                            subLabel="PDF, DOCX supported. Optional for general trends."
                        />
                        <UploadBox
                            type="jd"
                            file={jd}
                            setFile={setJd}
                            label="Target Job Description"
                            subLabel="Paste specific requirements for tailored matching."
                        />
                    </div>

                    <div className="relative flex justify-center pt-6">
                        <button
                            type="submit"
                            disabled={!jd || isLoading}
                            className={`
                                group relative w-full md:w-auto px-16 py-5 rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all duration-500
                                ${!jd || isLoading
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50 opacity-50'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1.5 active:scale-95 border border-indigo-400/50'
                                }
                            `}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-4">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Analyzing Profiles...
                                    </>
                                ) : (
                                    <>
                                        Analyze Compatibility <CloudUpload size={24} className="group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </span>
                            {/* Inner Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl"></div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Simple User Icon helper as lucide User might be used elsewhere or to keep it self-contained
const UserIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);


export default FileUpload;
