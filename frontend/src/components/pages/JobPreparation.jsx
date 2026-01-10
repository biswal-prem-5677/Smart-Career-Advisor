import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { CheckCircle, Lock, Unlock, ArrowRight, Brain, Code, Mic, BookOpen, Video, StopCircle, PlayCircle, Loader, X, BarChart2, Award, Target, Building } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const JobPreparation = () => {
    const [currentStage, setCurrentStage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null); // 'aptitude', 'tech', 'coding', 'interview'

    // AI Question State
    const [questionData, setQuestionData] = useState(null);
    const [loadingQuestion, setLoadingQuestion] = useState(false);

    // Interview State
    const [recording, setRecording] = useState(false);
    const webcamRef = useRef(null);

    // Analysis Report State
    const [analysisReport, setAnalysisReport] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    const stages = [
        {
            id: 1,
            title: "Aptitude Round",
            description: "Logic, reasoning, and quantitative ability.",
            icon: <Brain size={24} />,
            color: "from-blue-500 to-cyan-500",
            status: currentStage > 1 ? 'completed' : currentStage === 1 ? 'active' : 'locked',
            endpoint: '/api/prep/aptitude'
        },
        {
            id: 2,
            title: "Technical Assessment",
            description: "Core domain knowledge checks.",
            icon: <BookOpen size={24} />,
            color: "from-purple-500 to-pink-500",
            status: currentStage > 2 ? 'completed' : currentStage === 2 ? 'active' : 'locked',
            endpoint: '/api/prep/technical'
        },
        {
            id: 3,
            title: "Coding Challenge",
            description: "Data Structures & Algorithms.",
            icon: <Code size={24} />,
            color: "from-amber-500 to-orange-500",
            status: currentStage > 3 ? 'completed' : currentStage === 3 ? 'active' : 'locked',
            action: "Go to Code Editor",
            endpoint: '/api/prep/coding'
        },
        {
            id: 4,
            title: "HR & Tech Interview",
            description: "Verbal and behavioral screening.",
            icon: <Mic size={24} />,
            color: "from-emerald-500 to-green-500",
            status: currentStage > 4 ? 'completed' : currentStage === 4 ? 'active' : 'locked',
            action: "Open AI Interview",
            endpoint: '/api/prep/interview'
        }
    ];

    const fetchQuestion = async (type, endpoint) => {
        setLoadingQuestion(true);
        setQuestionData(null);
        setAnalysisReport(null); // Reset report
        try {
            const res = await fetch(`http://localhost:8000${endpoint}`);
            const data = await res.json();
            setQuestionData(data);
            setModalType(type);
            setShowModal(true);
        } catch (error) {
            console.error("Failed to fetch question", error);
        } finally {
            setLoadingQuestion(false);
        }
    };

    const completeStage = () => {
        setShowModal(false);
        setRecording(false);
        if (currentStage < 4) setCurrentStage(currentStage + 1);
    };

    const finishInterview = async () => {
        setRecording(false);
        setAnalyzing(true);
        try {
            const res = await fetch('http://localhost:8000/api/prep/interview/analyze', { method: 'POST' });
            const data = await res.json();
            setAnalysisReport(data);
        } catch (error) {
            console.error(error);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleStartRound = (stage) => {
        if (stage.status === 'locked') return; // Prevent clicking locked
        let type = 'aptitude';
        if (stage.id === 2) type = 'tech';
        if (stage.id === 3) type = 'coding';
        if (stage.id === 4) type = 'interview';

        fetchQuestion(type, stage.endpoint);
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 px-4 pb-20">
            <div className="max-w-5xl mx-auto">

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                        Your Path to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Hired</span>
                    </h1>
                    <p className="text-lg text-slate-600">
                        Complete these 4 stages to be 100% job-ready.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-slate-200 -translate-x-1/2 rounded-full hidden md:block"></div>
                    <div
                        className="absolute left-1/2 top-0 w-2 bg-gradient-to-b from-blue-500 to-green-500 -translate-x-1/2 rounded-full transition-all duration-1000 hidden md:block"
                        style={{ height: `${((currentStage - 1) / 3) * 100}%` }}
                    ></div>

                    <div className="space-y-24">
                        {stages.map((stage, idx) => (
                            <div key={stage.id} className={`relative flex items-center justify-between md:flex-row flex-col ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Center Node */}
                                <div className={`absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 z-10 flex items-center justify-center transition-all duration-500 hidden md:flex ${stage.status === 'completed' ? 'bg-green-500 border-green-200 text-white' :
                                    stage.status === 'active' ? 'bg-white border-blue-500 text-blue-500 shadow-xl scale-125' :
                                        'bg-slate-200 border-slate-100 text-slate-400'
                                    }`}>
                                    {stage.status === 'completed' ? <CheckCircle size={24} /> :
                                        stage.status === 'locked' ? <Lock size={20} /> : <Unlock size={20} />}
                                </div>

                                {/* Content Card */}
                                <div className="w-full md:w-[42%] group">
                                    <div
                                        onClick={() => handleStartRound(stage)} // Allow clicking card too if active
                                        className={`p-8 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden cursor-pointer ${stage.status === 'locked'
                                            ? 'bg-slate-50 border-slate-100 opacity-70 grayscale cursor-not-allowed'
                                            : 'bg-white border-transparent shadow-xl hover:-translate-y-2'
                                            }`}
                                    >
                                        {/* Background Gradient */}
                                        {stage.status !== 'locked' && (
                                            <div className={`absolute inset-0 opacity-5 bg-gradient-to-r ${stage.color}`}></div>
                                        )}

                                        <div className="relative z-10 flex items-start gap-4 mb-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${stage.color} shadow-lg`}>
                                                {stage.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">{stage.title}</h3>
                                                <p className="text-slate-500 font-medium">{stage.description}</p>
                                            </div>
                                        </div>

                                        {stage.status === 'active' && (
                                            <div
                                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-4"
                                            >
                                                {loadingQuestion ? <Loader className="animate-spin" size={18} /> : (stage.action || "Start Round")} {!loadingQuestion && <ArrowRight size={18} />}
                                            </div>
                                        )}
                                        {stage.status === 'completed' && (
                                            <div className="mt-4 flex items-center gap-2 text-green-600 font-bold">
                                                <CheckCircle size={20} />
                                                Round Cleared!
                                            </div>
                                        )}
                                        {stage.status === 'locked' && (
                                            <div className="mt-4 flex items-center gap-2 text-slate-400 font-medium">
                                                <Lock size={16} />
                                                Complete previous round to unlock
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Placeholder for opposite side spacing */}
                                <div className="w-full md:w-[42%]"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Modal */}
                {showModal && questionData && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-enter">
                        <div className={`bg-white rounded-3xl w-full shadow-2xl animate-enter overflow-hidden flex flex-col ${modalType === 'interview' && !analysisReport ? 'max-w-4xl h-[80vh]' : 'max-w-lg'}`}>

                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {analysisReport ? 'Interview Analysis Report' :
                                            (modalType === 'aptitude' ? 'Aptitude Challenge' :
                                                modalType === 'tech' ? 'Technical Assessment' :
                                                    modalType === 'coding' ? 'Coding Problem' : 'AI Interviewer')
                                        }
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        {analysisReport ? 'Detailed Assessment' : 'AI-Generated Round'}
                                    </p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-all">
                                    Close
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 overflow-y-auto flex-1">
                                {analysisReport ? (
                                    // ANALYSIS REPORT VIEW
                                    <div className="space-y-8 animate-enter">
                                        {/* Status Header */}
                                        <div className={`p-6 rounded-2xl border-2 flex items-center gap-4 ${analysisReport.status === 'Hired' ? 'bg-green-50 border-green-200' : analysisReport.status === 'Shortlisted' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl ${analysisReport.status === 'Hired' ? 'bg-green-500' : analysisReport.status === 'Shortlisted' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                                {analysisReport.score}
                                            </div>
                                            <div>
                                                <h3 className={`text-2xl font-bold ${analysisReport.status === 'Hired' ? 'text-green-700' : analysisReport.status === 'Shortlisted' ? 'text-yellow-700' : 'text-red-700'}`}>
                                                    {analysisReport.status}
                                                </h3>
                                                <p className="text-slate-600 font-medium">Predicted Interview Outcome</p>
                                            </div>
                                        </div>

                                        {/* Performance Graph */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="h-64">
                                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart2 size={18} /> Performance Analysis</h4>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analysisReport.graph_data}>
                                                        <PolarGrid />
                                                        <PolarAngleAxis dataKey="subject" />
                                                        <PolarRadiusAxis />
                                                        <Radar name="Student" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Target size={18} /> Feedback</h4>
                                                <div className="space-y-2">
                                                    {analysisReport.feedback.map((f, i) => (
                                                        <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
                                                            • {f}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recommendations */}
                                        {analysisReport.status === 'Hired' ? (
                                            <div>
                                                <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2"><Building size={18} /> Recommended Companies</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysisReport.companies.map((c, i) => (
                                                        <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200">{c}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2"><Award size={18} /> Focus Areas for Improvement</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysisReport.focus_areas.map((c, i) => (
                                                        <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold border border-red-200">{c}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <button onClick={completeStage} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg">
                                            Return to Dashboard
                                        </button>
                                    </div>
                                ) : (
                                    // STANDARD QUESTION / INTERVIEW VIEW
                                    modalType === 'interview' ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                            <div className="space-y-6">
                                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                                    <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">Question</h3>
                                                    <p className="text-lg font-medium text-slate-800 leading-relaxed">{questionData.question}</p>
                                                </div>
                                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">Your Answer</h3>
                                                    {recording ? (
                                                        <div className="flex items-center gap-3 text-red-500 animate-pulse font-medium">
                                                            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                                            Recording...
                                                        </div>
                                                    ) : analyzing ? (
                                                        <div className="flex items-center gap-3 text-indigo-500 font-medium">
                                                            <Loader className="animate-spin" size={20} />
                                                            AI is Analyzing your response...
                                                        </div>
                                                    ) : (
                                                        <p className="text-slate-400 italic">Press record to start answering...</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="bg-black rounded-2xl overflow-hidden relative flex items-center justify-center bg-slate-900">
                                                <Webcam
                                                    audio={false}
                                                    ref={webcamRef}
                                                    screenshotFormat="image/jpeg"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                                                    {!recording ? (
                                                        <button disabled={analyzing} onClick={() => setRecording(true)} className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 transition-all shadow-lg disabled:opacity-50">
                                                            <Mic size={24} />
                                                        </button>
                                                    ) : (
                                                        <button onClick={finishInterview} className="p-4 bg-slate-800 text-white rounded-full hover:bg-slate-700 hover:scale-110 transition-all shadow-lg border-2 border-white/20">
                                                            <StopCircle size={24} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white/80 text-xs font-medium flex items-center gap-2">
                                                    <Video size={12} /> Live Camera
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Aptitude / Tech / Coding
                                        <div className="space-y-6">
                                            <div className="p-5 rounded-2xl border border-slate-200 hover:border-blue-500 transition-colors bg-slate-50">
                                                <p className="text-lg font-medium text-slate-800 leading-relaxed">
                                                    {questionData.q || questionData.problem}
                                                </p>
                                            </div>

                                            {modalType === 'coding' ? (
                                                <div className="space-y-4">
                                                    <textarea
                                                        className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-0 outline-none h-64 font-mono text-sm bg-slate-900 text-blue-100"
                                                        placeholder="# Write your python code here..."
                                                    ></textarea>
                                                    <button onClick={completeStage} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">Submit Code</button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {questionData.options?.map((opt, idx) => (
                                                        <button key={idx} onClick={completeStage} className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group flex items-center gap-3">
                                                            <span className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-600 flex items-center justify-center font-bold text-sm transition-colors">
                                                                {String.fromCharCode(65 + idx)}
                                                            </span>
                                                            <span className="font-medium text-slate-700 group-hover:text-slate-900">{opt}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobPreparation;
