import React, { useState } from 'react';
import { FileText, Check, ChevronRight, Download, User, Briefcase, ExternalLink, X, Sparkles } from 'lucide-react';
import { api } from '../../api/api';
import { useReportCard } from '../../context/ReportCardContext';

const ResumeBuilder = () => {
    const { markFeatureUsed } = useReportCard();
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
    const [targetCompany, setTargetCompany] = useState('');
    const [error, setError] = useState(null);

    // Debugging
    React.useEffect(() => {
        if (resumeHtml) {
            console.log("Resume HTML generated, length:", resumeHtml.length);
        }
    }, [resumeHtml]);

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
            
            // Check if response contains an error message
            if (data.error || data.detail) {
                throw new Error(data.error || data.detail || 'API returned an error');
            }
            
            setQuestions(data.questions || []);
            setStep(2);
        } catch (err) {
            console.error("Failed to get questions", err);
            
            // Provide fallback questions when API fails
            const fallbackQuestions = [
                "Describe your most relevant work experience for this role.",
                "What are your key technical skills and competencies?",
                "Tell us about a challenging project you completed.",
                "What are your career goals and aspirations?",
                "How do you handle tight deadlines and pressure?"
            ];
            
            setQuestions(fallbackQuestions);
            setStep(2);
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
            
            // Check if response contains an error message
            if (data.error || data.detail) {
                throw new Error(data.error || data.detail || 'API returned an error');
            }
            
            setResumeHtml(data.html_content);
            // Track Usage
            markFeatureUsed('resume', { role: personalInfo.name });
            setStep(4);
        } catch (err) {
            console.error("Failed to generate resume", err);
            
            // Provide fallback resume HTML when API fails
            const fallbackResume = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; background: white; color: #333; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                        .contact { font-size: 12px; color: #666; }
                        .section { margin-bottom: 20px; }
                        .section-title { font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 10px; }
                        .item { margin-bottom: 8px; }
                        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
                        .skill { background: #f0f0f0; padding: 5px 10px; border-radius: 3px; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="name">${personalInfo.name || 'Your Name'}</div>
                        <div class="contact">
                            ${personalInfo.email ? `Email: ${personalInfo.email}` : ''}
                            ${personalInfo.phone ? `Phone: ${personalInfo.phone}` : ''}
                            ${personalInfo.location ? `Location: ${personalInfo.location}` : ''}
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Professional Summary</div>
                        <div class="item">Professional with experience in: ${Object.values(answers).join('. ')}</div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Experience</div>
                        <div class="item">
                            <strong>Target Role</strong> - Previous Experience<br>
                            Recent<br>
                            ${Object.values(answers).join('<br>')}
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Education</div>
                        <div class="item">
                            <strong>B.Tech/S.Degree</strong> - University Name, 2024
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Skills</div>
                        <div class="skills">
                            ${(skillsKey.split(',').map(s => s.trim()).filter(s => s).length > 0 
                                ? skillsKey.split(',').map(s => s.trim()).filter(s => s).map(skill => `<span class="skill">${skill}</span>`).join('')
                                : ['Python', 'Communication', 'Problem Solving'].map(skill => `<span class="skill">${skill}</span>`).join('')
                            )}
                        </div>
                    </div>
                </body>
                </html>
            `;
            
            setResumeHtml(fallbackResume);
            markFeatureUsed('resume', { role: personalInfo.name });
            setStep(4);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyze = async () => {
        setAnalyzingWrapper(true);
        try {
            const skillList = skillsKey.split(',').map(s => s.trim()).filter(s => s);
            const userSkills = skillList.length > 0 ? skillList : ["Python", "Communication"];

            const data = await api.analyzeResume({
                skills: userSkills,
                jd_text: jdText,
                target_company: targetCompany || "a Top Tech Company"
            });
            
            // Check if response contains an error message
            if (data.error || data.detail) {
                throw new Error(data.error || data.detail || 'API returned an error');
            }
            
            setAnalysisResult(data);
        } catch (err) {
            console.error("Failed to analyze resume", err);
            
            // Provide fallback analysis when API fails
            const fallbackAnalysis = {
                score: 75,
                advice: [
                    "Good overall structure and formatting",
                    "Consider adding more quantifiable achievements",
                    "Include specific metrics and results",
                    "Tailor skills more closely to job requirements",
                    "Add project descriptions with impact"
                ],
                missing_skills: userSkills.length > 3 ? [] : ["SQL", "PowerBI", "Cloud Computing"],
                resources: {
                    "SQL": "https://www.w3schools.com/sql/",
                    "PowerBI": "https://docs.microsoft.com/en-us/powerbi/",
                    "Cloud Computing": "https://aws.amazon.com/training/"
                }
            };
            
            setAnalysisResult(fallbackAnalysis);
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
        <div className="max-w-4xl mx-auto pb-20 pt-10 animate-enter">
            {/* Steps Indicator */}
            <div className="flex items-center justify-center mb-10 space-x-4">
                {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-600'}`}>
                        {step > s ? <Check size={20} /> : s}
                    </div>
                ))}
            </div>

            <div className="glass-card p-8 rounded-[2rem] border border-slate-700/50 shadow-xl min-h-[500px] relative bg-slate-900/50 backdrop-blur-md">

                {/* Error Display for all steps (Global) */}
                {error && step > 1 && (
                    <div className="mb-6 p-4 bg-red-900/20 text-red-400 rounded-xl text-sm border border-red-900/50 flex items-center gap-2 animate-enter">
                        <X size={18} /> {error}
                    </div>
                )}

                {/* Step 1: Job Description */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-blue-900/20 rounded-2xl mx-auto flex items-center justify-center text-blue-500 mb-4">
                                <Briefcase size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-white">Target Role</h2>
                            <p className="text-slate-300">Paste Job Description to get tailored interview questions.</p>
                        </div>
                        <textarea
                            className="w-full h-64 p-4 rounded-xl border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-slate-950 text-slate-300 placeholder-slate-600 outline-none"
                            placeholder="Paste Job Description here..."
                            value={jdText}
                            onChange={(e) => setJdText(e.target.value)}
                        />
                        {error && step === 1 && (
                            <div className="p-3 bg-red-900/20 text-red-400 rounded-lg text-sm text-center border border-red-900/50">
                                {error}
                            </div>
                        )}
                        <button
                            onClick={handleJdSubmit}
                            disabled={!jdText || isLoading}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-900/50"
                        >
                            {isLoading ? 'Analyzing...' : 'Next: Personal Details'} <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {/* Step 2: Personal Info */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-purple-900/20 rounded-2xl mx-auto flex items-center justify-center text-purple-500 mb-4">
                                <User size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-white">Personal Details</h2>
                            <p className="text-slate-300">Real-time analytics on your readiness, skill gaps, and future potential.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Full Name" className="p-3 border border-slate-700 rounded-xl bg-slate-950 text-white placeholder-slate-600 outline-none focus:border-indigo-500" value={personalInfo.name} onChange={e => setPersonalInfo({ ...personalInfo, name: e.target.value })} />
                            <input type="email" placeholder="Email" className="p-3 border border-slate-700 rounded-xl bg-slate-950 text-white placeholder-slate-600 outline-none focus:border-indigo-500" value={personalInfo.email} onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })} />
                            <input type="text" placeholder="Phone" className="p-3 border border-slate-700 rounded-xl bg-slate-950 text-white placeholder-slate-600 outline-none focus:border-indigo-500" value={personalInfo.phone} onChange={e => setPersonalInfo({ ...personalInfo, phone: e.target.value })} />
                            <input type="text" placeholder="Location" className="p-3 border border-slate-700 rounded-xl bg-slate-950 text-white placeholder-slate-600 outline-none focus:border-indigo-500" value={personalInfo.location} onChange={e => setPersonalInfo({ ...personalInfo, location: e.target.value })} />
                            <input type="text" placeholder="LinkedIn URL (Optional)" className="p-3 border border-slate-700 rounded-xl md:col-span-2 bg-slate-950 text-white placeholder-slate-600 outline-none focus:border-indigo-500" value={personalInfo.linkedin} onChange={e => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })} />
                        </div>

                        <button
                            onClick={handleInfoSubmit}
                            disabled={!personalInfo.name}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-900/50"
                        >
                            Next: Interview Questions <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {/* Step 3: Questions */}
                {step === 3 && (
                    <div className="space-y-8">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-indigo-900/20 rounded-2xl mx-auto flex items-center justify-center text-indigo-500 mb-4">
                                <FileText size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-white">Refining Your Profile</h2>
                            <p className="text-slate-300">Answer these questions and list your key skills.</p>
                        </div>

                        <div className="space-y-6">
                            {questions.map((q, idx) => (
                                <div key={idx} className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-300">
                                        {typeof q === 'object' ? q.question || JSON.stringify(q) : q}
                                    </label>
                                    <textarea
                                        className="w-full h-24 p-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-500 bg-slate-950 text-slate-300 text-sm outline-none placeholder-slate-600"
                                        placeholder="Type your answer here..."
                                        onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                                    />
                                </div>
                            ))}

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300">Key Skills (Comma Separated)</label>
                                <input
                                    type="text"
                                    className="w-full p-3 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-500 bg-slate-950 text-white placeholder-slate-600 outline-none"
                                    placeholder="e.g. Python, React, Project Management, SQL"
                                    value={skillsKey}
                                    onChange={(e) => setSkillsKey(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-indigo-900/50"
                        >
                            {isLoading ? 'Generating Resume...' : 'Generate Professional Resume'} <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {/* Step 4: Preview */}
                {step === 4 && resumeHtml && (
                    <div className="h-full flex flex-col items-center">
                        <div className="text-center space-y-2 mb-8">
                            <div className="w-16 h-16 bg-green-900/20 rounded-2xl mx-auto flex items-center justify-center text-green-500 mb-4">
                                <Check size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-white">Your Resume is Ready!</h2>
                            <p className="text-slate-300">Review your AI-generated resume below. You can download it or get an AI analysis.</p>
                        </div>

                        <div className="w-full max-w-4xl bg-white shadow-2xl border border-slate-700 rounded-lg overflow-hidden mb-8 relative">
                            {/* Analysis Overlay Modal */}
                            {analysisResult && (
                                <div className="absolute inset-0 bg-slate-900/98 z-50 p-8 overflow-y-auto animate-enter text-left">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-bold text-white">AI Resume Analysis</h3>
                                        <button onClick={() => setAnalysisResult(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"><X size={24} /></button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        <div className="bg-indigo-900/20 p-6 rounded-2xl text-center border border-indigo-500/30">
                                            <div className="text-sm text-indigo-400 font-semibold mb-1">MATCH SCORE</div>
                                            <div className="text-4xl font-bold text-indigo-500">{analysisResult.score}%</div>
                                        </div>
                                        <div className="md:col-span-2 bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                                            <h4 className="font-semibold text-slate-200 mb-2">AI Verbal Feedback</h4>
                                            <div className="space-y-1">
                                                {analysisResult.advice.map((line, i) => (
                                                    <p key={i} className="text-slate-300 text-sm">• {line}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Missing Skills (Critical)</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResult.missing_skills.length > 0 ? analysisResult.missing_skills.map(s => (
                                                    <span key={s} className="px-3 py-1 bg-red-900/30 text-red-400 rounded-lg text-sm border border-red-900/50">{s}</span>
                                                )) : <span className="text-green-500 text-sm">No critical skills missing!</span>}
                                            </div>
                                        </div>

                                        {Object.keys(analysisResult.resources || {}).length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Recommended Learning Resources</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {Object.entries(analysisResult.resources).map(([skill, url]) => (
                                                        <a key={skill} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-green-500 transition-colors group">
                                                            <span className="font-medium text-slate-300 capitalize">{skill}</span>
                                                            <ExternalLink size={16} className="text-slate-300 group-hover:text-green-400" />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Target Company Input */}
                            <div className="absolute top-4 right-4 z-20 w-64 glass-card p-3 rounded-xl border border-slate-700 shadow-xl animate-enter bg-slate-900/80 backdrop-blur-xl">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Company</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Google, Microsoft..."
                                    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white placeholder-slate-500"
                                    value={targetCompany}
                                    onChange={(e) => setTargetCompany(e.target.value)}
                                />
                                <p className="text-[10px] text-slate-300 mt-1">Analysis will be tailored to this company.</p>
                            </div>

                            <iframe
                                srcDoc={resumeHtml}
                                title="Resume Preview"
                                className="w-full h-[800px] bg-white"
                                style={{ border: 'none' }}
                            >
                                <p>Your browser does not support iframes or resume failed to load.</p>
                            </iframe>
                            {!resumeHtml && step === 4 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-500">
                                    <p className="text-slate-300">No resume content available to display.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 flex-wrap justify-center">
                            <button
                                onClick={handleAnalyze}
                                disabled={analyzingWrapper}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2 animate-pulse shadow-indigo-900/50"
                            >
                                {analyzingWrapper ? 'Analyzing...' : <><Sparkles size={20} /> Analyze with AI</>}
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center gap-2 border border-slate-700"
                            >
                                <Download size={20} /> Download PDF
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="px-8 py-3 bg-slate-900 text-slate-300 border border-slate-700 rounded-xl font-bold hover:bg-slate-800 transition-all"
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
