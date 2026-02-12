import React, { useState, useEffect } from 'react';
import { useReportCard } from '../../context/ReportCardContext';
import { api } from '../../api/api';
import {
    Award, Brain, Target, Zap, Clock, TrendingUp, CheckCircle, Lock, Loader2, Sparkles, AlertCircle,
    Download, ChevronRight, Activity, Calendar, DollarSign, Briefcase, MapPin, Search, FileText,
    ExternalLink, ArrowUpRight, CheckCircle2, Circle
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportCard = () => {
    const { reportData, getProgress } = useReportCard();
    const { completed, total, percentage } = getProgress();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activePlanTab, setActivePlanTab] = useState('day_7');
    const [showModuleDetails, setShowModuleDetails] = useState(false);

    const modules = [
        { id: 'jobs', label: 'Job Search', icon: Search },
        { id: 'resume', label: 'Resume Builder', icon: FileText },
        { id: 'job_prep', label: 'Job Preparation', icon: Brain },
        { id: 'success_roadmap', label: 'Success Roadmap', icon: Zap },
        { id: 'career_roadmap', label: 'Career Roadmap', icon: Activity },
        { id: 'company_prep', label: 'Company Prep', icon: Briefcase },
        { id: 'prediction', label: 'Model Predictions', icon: Target },
    ];

    const handleGenerateReport = async () => {
        setLoading(true);
        try {
            const data = await api.analyzeReport(reportData);
            setAnalysis(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        if (!analysis) return;
        const doc = new jsPDF();

        // Header
        doc.setFillColor(15, 23, 42); // slate-950
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text('AI Career Decision Report', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });

        let yPos = 50;

        // Readiness Score
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Career Readiness Score', 20, yPos);
        yPos += 10;

        doc.setFontSize(36);
        doc.setTextColor(139, 92, 246); // violet
        doc.text(`${analysis.readiness_score || percentage}%`, 20, yPos);
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(analysis.status_label || (percentage === 100 ? "Ready" : "In Progress"), 50, yPos);
        yPos += 15;

        // Score Breakdown
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Score Breakdown', 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        Object.entries(analysis.score_breakdown || {}).forEach(([key, val]) => {
            doc.text(`${key}: ${val}%`, 20, yPos);
            yPos += 7;
        });
        yPos += 5;

        // Module Completion Table
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Module Completion Status', 20, yPos);
        yPos += 5;

        const tableData = modules.map(m => [
            m.label,
            reportData[m.id]?.visited ? 'Completed' : 'Pending',
            reportData[m.id]?.last_run ? new Date(reportData[m.id].last_run).toLocaleDateString() : '-',
            '+14%'
        ]);

        doc.autoTable({
            startY: yPos,
            head: [['Module', 'Status', 'Last Run', 'Impact']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [99, 102, 241] }, // indigo
            styles: { fontSize: 10 }
        });

        yPos = doc.lastAutoTable.finalY + 15;

        // Current Snapshot
        if (yPos > 240) { doc.addPage(); yPos = 20; }
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Current Snapshot', 20, yPos);
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Predicted Role: ${analysis.current_snapshot?.predicted_role || 'N/A'}`, 20, yPos);
        yPos += 6;
        doc.text(`Salary Range: ${analysis.current_snapshot?.salary_range || 'N/A'}`, 20, yPos);
        yPos += 6;
        doc.text(`Selection Probability: ${analysis.current_snapshot?.selection_prob || 'N/A'}`, 20, yPos);
        yPos += 6;
        doc.text(`Top Matches: ${(analysis.current_snapshot?.top_companies || []).join(', ')}`, 20, yPos);
        yPos += 10;

        // Gap Analysis
        if (yPos > 240) { doc.addPage(); yPos = 20; }
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Gap Analysis', 20, yPos);
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Missing Skills: ${(analysis.gap_analysis?.missing_skills_tags || []).join(', ')}`, 20, yPos);
        yPos += 10;

        // Final summary
        if (yPos > 240) { doc.addPage(); yPos = 20; }
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Final Verdict', 20, yPos);
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text(`"${analysis.final_summary}"`, 20, yPos, { maxWidth: 170 });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
            doc.text('Smart Career Advisor - AI-Powered Career Insights', 105, 285, { align: 'center' });
        }

        doc.save('Career_Report_Card.pdf');
    };

    return (
        <div className="min-h-screen bg-[#020617] pt-20 pb-20 px-4 md:px-8 font-sans text-slate-200">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight text-center md:text-left">
                            AI Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Report Card</span>
                        </h1>
                        <p className="text-slate-400 mt-2 text-center md:text-left">Your real-time employability and readiness analytics.</p>
                    </div>
                    {analysis && (
                        <button onClick={handleDownloadPDF} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all flex items-center gap-2 group">
                            <Download size={18} className="text-indigo-400 group-hover:-translate-y-1 transition-transform" />
                            Download Report
                        </button>
                    )}
                </div>

                {/* Top Section: Readiness & Module Usage */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Readiness Score Card */}
                    <div className="lg:col-span-4 bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>

                        <div className="flex items-center gap-2 mb-8 self-start">
                            <Activity className="text-indigo-400" size={18} />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Career Readiness</span>
                        </div>

                        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-white/5" />
                                <circle
                                    cx="128"
                                    cy="128"
                                    r="110"
                                    stroke="currentColor"
                                    strokeWidth="16"
                                    fill="transparent"
                                    strokeDasharray={2 * Math.PI * 110}
                                    strokeDashoffset={2 * Math.PI * 110 * (1 - (analysis?.readiness_score || percentage) / 100)}
                                    className="text-indigo-500 transition-all duration-1000 ease-out"
                                    strokeLinecap="round"
                                    style={{ filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))' }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-7xl font-black text-white">{analysis?.readiness_score || percentage}%</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{analysis?.status_label || "READY"}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerateReport}
                            disabled={loading}
                            className="w-full py-4 bg-white text-slate-950 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                            Generate Full Report
                        </button>
                    </div>

                    {/* Module Usage Tracker */}
                    <div className="lg:col-span-8 bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                <Search size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Module Usage Tracker</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 text-slate-500 text-xs font-bold uppercase tracking-widest">
                                        <th className="pb-4">Module</th>
                                        <th className="pb-4">Status</th>
                                        <th className="pb-4">Last Run</th>
                                        <th className="pb-4 text-right">Contribution</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {modules.map((m) => {
                                        const isDone = reportData[m.id]?.visited;
                                        return (
                                            <tr key={m.id} className="group transition-colors">
                                                <td className="py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2.5 rounded-xl ${isDone ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-white/5 text-slate-500 border border-white/5'}`}>
                                                            {(() => {
                                                                const Icon = m.icon;
                                                                return <Icon size={18} />;
                                                            })()}
                                                        </div>
                                                        <span className={`font-bold ${isDone ? 'text-white' : 'text-slate-500'}`}>{m.label}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isDone ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800/50 text-slate-500 border-white/5'}`}>
                                                        {isDone ? 'Completed' : 'Pending'}
                                                    </div>
                                                </td>
                                                <td className="text-slate-400 text-sm font-medium">
                                                    {reportData[m.id]?.last_run ? new Date(reportData[m.id].last_run).toLocaleDateString() : 'Never'}
                                                </td>
                                                <td className="text-right font-black text-indigo-400">+14%</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Analysis Features (Only shown if analysis available) */}
                {analysis && (
                    <div className="space-y-10 animate-enter">

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Score Breakdown */}
                            <div className="lg:col-span-1 bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl">
                                <h3 className="text-xl font-bold text-white mb-8">Score Breakdown</h3>
                                <div className="space-y-6">
                                    {Object.entries(analysis.score_breakdown || {}).map(([key, val]) => (
                                        <div key={key}>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-400 font-medium">{key}</span>
                                                <span className="text-white font-black">{val}%</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                                                    style={{ width: `${val}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Current Snapshot */}
                            <div className="lg:col-span-1 bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group cursor-pointer hover:border-indigo-500/30 transition-all">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Current Snapshot</h3>

                                <div className="space-y-8">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-2">Predicted Role</p>
                                        <h4 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                                            {analysis.current_snapshot?.predicted_role || "Analyst"}
                                        </h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-2">Salary Range</p>
                                            <p className="text-lg font-bold text-emerald-400">{analysis.current_snapshot?.salary_range || "$65K - $85K"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-2">Selection Prob.</p>
                                            <p className="text-lg font-bold text-orange-400">{analysis.current_snapshot?.selection_prob || "72%"}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500 mb-3">Top Matches</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(analysis.current_snapshot?.top_companies || ["Google", "Amazon", "Meta"]).map(comp => (
                                                <span key={comp} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-xs font-bold text-slate-300">
                                                    {comp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Future Potential */}
                            <div className="lg:col-span-1 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>

                                <div className="flex items-center gap-2 mb-8">
                                    <Sparkles size={16} className="text-indigo-400" />
                                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Future Potential (90 Days)</h3>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-indigo-300/60 mb-1">Target Score</p>
                                            <span className="text-4xl font-black text-white">
                                                {analysis.future_snapshot?.expected_score || "82"}%
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-indigo-300/60 mb-1">New Probability</p>
                                            <span className="text-xl font-bold text-emerald-400">
                                                {analysis.future_snapshot?.updated_prob || "75%"}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-indigo-300/60 mb-2">Potential Salary</p>
                                        <p className="text-xl font-black text-white">{analysis.future_snapshot?.updated_salary || "$110k - $145k"}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-indigo-300/60 mb-3">Unlocked Companies</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(analysis.future_snapshot?.updated_companies || ["Microsoft", "NVIDIA"]).map(comp => (
                                                <span key={comp} className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-xs font-bold text-indigo-200">
                                                    {comp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gap Analysis & Improvement Plan */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Gap Analysis Card */}
                            <div className="bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                                        <AlertCircle size={20} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Gap Analysis</h3>
                                </div>

                                <div className="space-y-10">
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-sm font-bold text-slate-400">Missing Critical Skills</p>
                                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded">High Priority</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {(analysis.gap_analysis?.missing_skills_tags || ["TensorFlow", "PyTorch", "Docker", "SQL"]).map(skill => (
                                                <span key={skill} className="px-4 py-2 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-xl text-sm font-bold text-rose-400 transition-all cursor-default">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-slate-400 mb-4">Weak Areas Breakdown</p>
                                        <div className="space-y-4">
                                            {(analysis.gap_analysis?.weak_areas || [{ area: "Cloud Fundamentals", score: 35 }, { area: "Deployment", score: 20 }]).map(area => (
                                                <div key={area.area} className="group">
                                                    <div className="flex justify-between text-xs mb-2">
                                                        <span className="text-slate-300 group-hover:text-white transition-colors">{area.area}</span>
                                                        <span className="text-rose-400 font-bold">{area.score}%</span>
                                                    </div>
                                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-rose-500/40 rounded-full transition-all duration-1000"
                                                            style={{ width: `${area.score}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Improvement Plan Card */}
                            <div className="bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl">
                                <div className="flex items-center justify-between gap-3 mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                            <TrendingUp size={20} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Improvement Plan</h3>
                                    </div>

                                    {/* Plan Tabs */}
                                    <div className="flex bg-white/5 p-1 rounded-xl">
                                        {['day_7', 'day_30', 'day_90'].map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => setActivePlanTab(tab)}
                                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activePlanTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                {tab.replace('day_', '')} Days
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {(analysis.improvement_plan?.[activePlanTab] || [
                                        { task: "Complete Resume Profile with Skills", type: "Urgent" },
                                        { task: "Take Mock Interview for SDE-1", type: "Prep" },
                                        { task: "Learn Docker fundamentals", type: "Skill" }
                                    ]).map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/[0.08] transition-all">
                                            <div className="mt-1 w-5 h-5 flex-shrink-0 border-2 border-white/10 rounded-md group-hover:border-indigo-500 transition-colors flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-sm scale-0 group-hover:scale-100 transition-transform"></div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${item.type === 'Urgent' ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">{item.task}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Final Verdict */}
                        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400 floating">
                                    <Brain size={32} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">AI Summary & Final Verdict</h4>
                                    <p className="text-xl font-medium text-slate-200 leading-relaxed italic">
                                        "{analysis.final_summary}"
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {/* Initial View (No analysis) */}
                {!analysis && (
                    <div className="grid grid-cols-1 gap-8 animate-enter">
                        <div className="bg-slate-900/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px] shadow-2xl">
                            <div className="w-24 h-24 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-center text-indigo-400 pulse-glow mb-4">
                                <Sparkles size={48} />
                            </div>
                            <div className="max-w-md">
                                <h3 className="text-3xl font-black text-white mb-4">Unlock Your Career Dashboard</h3>
                                <p className="text-slate-400 text-lg leading-relaxed">
                                    Complete the career readiness modules (Resume, Job Search, etc.) to generate a comprehensive AI-powered report card.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-indigo-400">
                                <span>{completed}/{total} Modules Completed</span>
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ReportCard;
