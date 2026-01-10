import React, { useState } from 'react';
import { FileText, Check, ChevronRight, Download, User, Briefcase, ExternalLink, X, Sparkles } from 'lucide-react';
import { api } from '../../api/api';

const ResumeBuilder = () => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [jdText, setJdText] = useState('');
    const [personalInfo, setPersonalInfo] = useState({ name: '', email: '', phone: '', location: '', linkedin: '' });
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [skillsKey, setSkillsKey] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analyzingWrapper, setAnalyzingWrapper] = useState(false);
    const [resumeHtml, setResumeHtml] = useState(null);
    const [error, setError] = useState(null);

    // Scroll to top on step change
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    // Step 1: Handle JD Input & Get Questions
    const handleJdSubmit = async () => {
        if (!jdText.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.generateQuestions(jdText);
            setQuestions(data.questions || []);
            setStep(2);
        } catch (err) {
            console.error("Failed to get questions", err);
            setError("Failed to generate questions. Please try again or check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Handle Personal Info
    const handleInfoSubmit = () => {
        if (!personalInfo.name.trim()) {
            setError("Please name is required to proceed.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (!personalInfo.email.trim() && !personalInfo.phone.trim()) {
            setError("Please provide at least one contact method (Email or Phone).");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setError(null);
        setStep(3);
    };

    // Step 3: Handle Generation
    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Parse skills
            const skillList = skillsKey.split(',').map(s => s.trim()).filter(s => s);

            // Construct payload from state
            const payload = {
                personal_info: personalInfo,
                summary: `Professional with experience in: ${Object.values(answers).join('. ')}`,
                experience: [
                    {
                        role: "Target Role",
                        company: "Previous Experience",
                        duration: "Recent",
                        description: Object.values(answers).join('\n\n')
                    }
                ],
                education: [
                    { degree: "B.Tech/S.Degree", institution: "University Name", year: "2024" }
                ],
                skills: skillList.length > 0 ? skillList : ["Python", "Communication", "Problem Solving"]
            };

            const data = await api.generateResume(payload);
            setResumeHtml(data.html_content);
            setStep(4);
        } catch (err) {
            console.error("Failed to generate resume", err);
            setError("Failed to generate resume. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyze = async () => {
        setAnalyzingWrapper(true);
        try {
            const skillList = skillsKey.split(',').map(s => s.trim()).filter(s => s);
            const userSkills = skillList.length > 0 ? skillList : ["Python", "Communication"];

            const response = await fetch('http://localhost:8000/api/analyze-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    skills: userSkills,
                    jd_text: jdText
                })
            });
            const data = await response.json();
            setAnalysisResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setAnalyzingWrapper(false);
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'width=800,height=900');
        printWindow.document.write(resumeHtml);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-enter">
            {/* Steps Indicator */}
            <div className="flex items-center justify-center mb-10 space-x-4">
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        {step > s ? <Check size={20} /> : s}
                    </div>
                ))}
            </div>

            <div className="glass-card p-8 rounded-[2rem] border border-white/50 shadow-xl min-h-[500px] relative">

                {/* Step 1: Job Description */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto flex items-center justify-center text-blue-600 mb-4">
                                <Briefcase size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800">Target Role</h2>
                            <p className="text-slate-500">Paste the Job Description to get tailored interview questions.</p>
                        </div>
                        <textarea
                            className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-slate-50"
                            placeholder="Paste Job Description here..."
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                        />
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}
                        <button
                            onClick={handleJdSubmit}
                            disabled={!jdText || isLoading}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? 'Analyzing...' : 'Next: Personal Details'} <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {/* Step 2: Personal Info */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl mx-auto flex items-center justify-center text-purple-600 mb-4">
                                <User size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800">Personal Details</h2>
                            <p className="text-slate-500">Let's start with your contact information.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Full Name" className="input-field p-3 border rounded-xl" value={personalInfo.name} onChange={e => setPersonalInfo({ ...personalInfo, name: e.target.value })} />
                            <input type="email" placeholder="Email" className="input-field p-3 border rounded-xl" value={personalInfo.email} onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })} />
                            <input type="text" placeholder="Phone" className="input-field p-3 border rounded-xl" value={personalInfo.phone} onChange={e => setPersonalInfo({ ...personalInfo, phone: e.target.value })} />
                            <input type="text" placeholder="Location" className="input-field p-3 border rounded-xl" value={personalInfo.location} onChange={e => setPersonalInfo({ ...personalInfo, location: e.target.value })} />
                            <input type="text" placeholder="LinkedIn URL (Optional)" className="input-field p-3 border rounded-xl md:col-span-2" value={personalInfo.linkedin} onChange={e => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })} />
                        </div>

                        <button
                            onClick={handleInfoSubmit}
                            disabled={!personalInfo.name}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            Next: Interview Questions <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {/* Step 3: Questions */}
                {step === 3 && (
                    <div className="space-y-8">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl mx-auto flex items-center justify-center text-indigo-600 mb-4">
                                <FileText size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800">Refining Your Profile</h2>
                            <p className="text-slate-500">Answer these questions and list your key skills.</p>
                        </div>

                        <div className="space-y-6">
                            {questions.map((q, idx) => (
                                <div key={idx} className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">{q}</label>
                                    <textarea
                                        className="w-full h-24 p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm"
                                        placeholder="Type your answer here..."
                                        onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                                    />
                                </div>
                            ))}

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">Key Skills (Comma Separated)</label>
                                <input
                                    type="text"
                                    className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                                    placeholder="e.g. Python, React, Project Management, SQL"
                                    value={skillsKey}
                                    onChange={(e) => setSkillsKey(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? 'Generating Resume...' : 'Generate Professional Resume'} <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {/* Step 4: Preview */}
                {step === 4 && resumeHtml && (
                    <div className="h-full flex flex-col items-center">
                        <div className="text-center space-y-2 mb-8">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl mx-auto flex items-center justify-center text-green-600 mb-4">
                                <Check size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800">Your Resume is Ready!</h2>
                            <p className="text-slate-500">Review your AI-generated resume below. You can download it or get an AI analysis.</p>
                        </div>
                        <div className="w-full max-w-3xl bg-white shadow-2xl border border-slate-200 rounded-sm overflow-hidden mb-8 transform scale-95 origin-top relative">
                            {/* Analysis Overlay Modal */}
                            {analysisResult && (
                                <div className="absolute inset-0 bg-white/95 z-50 p-8 overflow-y-auto animate-enter">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-bold text-slate-800">AI Resume Analysis</h3>
                                        <button onClick={() => setAnalysisResult(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={24} /></button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div className="bg-indigo-50 p-6 rounded-2xl text-center">
                                            <div className="text-sm text-indigo-600 font-semibold mb-1">MATCH SCORE</div>
                                            <div className="text-4xl font-bold text-indigo-700">{analysisResult.score}%</div>
                                        </div>
                                        <div className="md:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl">
                                            <h4 className="font-semibold text-slate-700 mb-2">AI Verbal Feedback</h4>
                                            <div className="space-y-1">
                                                {analysisResult.advice.map((line, i) => (
                                                    <p key={i} className="text-slate-600 text-sm">• {line}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold text-red-500 mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Missing Skills (Critical)</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResult.missing_skills.length > 0 ? analysisResult.missing_skills.map(s => (
                                                    <span key={s} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{s}</span>
                                                )) : <span className="text-green-600 text-sm">No critical skills missing!</span>}
                                            </div>
                                        </div>

                                        {Object.keys(analysisResult.resources || {}).length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Recommended Learning Resources</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {Object.entries(analysisResult.resources).map(([skill, url]) => (
                                                        <a key={skill} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-green-500 transition-colors group">
                                                            <span className="font-medium text-slate-700">{skill}</span>
                                                            <ExternalLink size={16} className="text-slate-400 group-hover:text-green-500" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <iframe
                                srcDoc={resumeHtml}
                                title="Resume Preview"
                                className="w-full h-[600px] pointer-events-none"
                                style={{ border: 'none' }}
                            />
                        </div>

                        <div className="flex gap-4 flex-wrap justify-center">
                            <button
                                onClick={handleAnalyze}
                                disabled={analyzingWrapper}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2 animate-pulse"
                            >
                                {analyzingWrapper ? 'Analyzing...' : <><Sparkles size={20} /> Analyze with AI</>}
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center gap-2"
                            >
                                <Download size={20} /> Download PDF
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="px-8 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all"
                            >
                                Start Over
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeBuilder;
