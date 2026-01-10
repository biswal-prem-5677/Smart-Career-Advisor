import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, Loader2, X, CloudUpload } from 'lucide-react';

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
            className={`relative group cursor-pointer flex flex-col items-center justify-center min-h-[220px] rounded-[2rem] border-2 border-dashed transition-all duration-500 overflow-hidden
            ${activeDrag === type ? 'border-indigo-500 bg-indigo-50/50 scale-105 shadow-xl' : 'border-slate-200 hover:border-indigo-400 hover:bg-white/40 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1'}
            ${file ? 'border-solid border-emerald-500/30 bg-emerald-50/30' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setActiveDrag(type); }}
            onDragLeave={() => setActiveDrag(null)}
            onDrop={(e) => handleDrop(e, type)}
        >
            <input type="file" id={type} className="hidden" accept=".pdf,.docx,.txt" onChange={(e) => handleFileChange(e, type)} />

            {/* Background Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 transition-all duration-500 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 ${file ? 'opacity-0' : 'opacity-100'}`} />

            {file ? (
                <div className="relative z-10 flex flex-col items-center animate-enter">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                        <CheckCircle size={32} />
                    </div>
                    <p className="font-bold text-slate-800 text-lg mb-1 max-w-[200px] truncate">{file.name}</p>
                    <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-4">Ready for Analysis</p>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFile(null); }}
                        className="px-4 py-2 bg-white text-rose-500 text-xs font-bold rounded-full shadow-sm border border-rose-100 hover:bg-rose-50 transition-colors flex items-center gap-2"
                    >
                        <X size={12} /> Remove File
                    </button>
                </div>
            ) : (
                <div className="relative z-10 flex flex-col items-center text-center p-6">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-lg shadow-indigo-100 text-indigo-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        {type === 'resume' ? <UserIcon size={36} /> : <FileText size={36} />}
                    </div>
                    <span className="font-bold text-slate-700 text-lg mb-2">{label}</span>
                    <span className="text-slate-400 text-sm max-w-[200px] leading-relaxed">{subLabel}</span>

                    <div className="mt-6 px-4 py-2 bg-white/60 rounded-full text-xs font-bold text-indigo-500 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                        Click or Drag File
                    </div>
                </div>
            )}
        </label>
    );

    return (
        <div className="relative isolate">
            {/* Decorative Background for Section */}
            <div className="absolute inset-0 -z-10 overflow-hidden rounded-[3rem]">
                <div className="absolute -top-[50%] -left-[20%] w-[70%] h-[70%] bg-indigo-200/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] bg-purple-200/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <div className="glass-panel p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/60 relative overflow-hidden">
                <h2 className="text-3xl font-black text-slate-900 mb-3 text-center">Start Your Analysis</h2>
                <p className="text-slate-500 text-center mb-10 max-w-lg mx-auto">Upload your documents to unlock personalized career insights and AI-powered recommendations.</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <UploadBox
                            type="resume"
                            file={resume}
                            setFile={setResume}
                            label="Your Resume"
                            subLabel="Supported formats: PDF, DOCX (Optional for general trends)"
                        />
                        <UploadBox
                            type="jd"
                            file={jd}
                            setFile={setJd}
                            label="Target Job Description"
                            subLabel="Paste specific requirements for tailored matching"
                        />
                    </div>

                    <div className="relative flex justify-center pt-4">
                        <button
                            type="submit"
                            disabled={!jd || isLoading}
                            className={`
                                group relative w-full md:w-auto px-12 py-5 rounded-2xl font-bold text-md tracking-wide uppercase transition-all duration-300
                                ${!jd || isLoading
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1'
                                }
                            `}
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Analyzing Profiles...
                                    </>
                                ) : (
                                    <>
                                        Analyze Compatibility <CloudUpload size={20} className="group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Simple User Icon helper as lucide User might be used elsewhere or to keep it self-contained
const UserIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);


export default FileUpload;
