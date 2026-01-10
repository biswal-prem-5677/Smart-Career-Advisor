import React, { useState } from 'react';
import AIPipelineViz from '../AIPipelineViz';
import {
    HelpCircle, FileQuestion, MessageCircle, Play,
    CheckCircle, BarChart, User, Settings, Shield,
    Globe, Mail, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';

const HelpPage = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-16 animate-enter pb-20">

            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold tracking-wide uppercase">
                    <HelpCircle size={16} /> Help Center
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                    How Can We <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Help You?</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Master the platform with our comprehensive guides, tutorials, and support resources.
                </p>
            </div>

            {/* 1. Getting Started Guide */}
            <section className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"></div>

                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <Play className="text-indigo-600" /> Getting Started
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full"></div>

                    {[
                        { step: 1, title: "Create Profile", icon: User },
                        { step: 2, title: "Enter Skills", icon: CheckCircle },
                        { step: 3, title: "Select Goal", icon: Settings },
                        { step: 4, title: "Run Analysis", icon: Play },
                        { step: 5, title: "View Roadmap", icon: BarChart },
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center gap-4 bg-white md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none shadow-sm md:shadow-none border md:border-none border-slate-100">
                            <div className="w-12 h-12 bg-white border-2 border-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg shadow-sm z-10 relative">
                                {item.step}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2 & 3. Features & What to Ask */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* What Users Can Ask */}
                <div className="glass-card p-8 rounded-[2rem]">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <MessageCircle className="text-pink-500" /> What You Can Ask AI
                    </h2>
                    <ul className="space-y-4">
                        {[
                            "What career suits my customized profile?",
                            "How do I become a Data Scientist from non-tech?",
                            "Identify missing skills for 'Full Stack Dev'.",
                            "Recommend free courses for Machine Learning.",
                            "Explain the day-to-day of a Product Manager.",
                            "Analyze my resume for ATS compatibility."
                        ].map((query, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-slate-600">
                                <div className="mt-1 w-6 h-6 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center shrink-0 text-xs font-bold">Q</div>
                                <span className="font-medium">"{query}"</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Feature Guide */}
                <div className="bg-slate-900 text-slate-300 p-8 rounded-[2rem]">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <Settings className="text-indigo-400" /> Feature Guide
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-indigo-300 font-bold mb-1">Skill Assessment</h3>
                            <p className="text-sm">Upload your resume or manually input skills to get a baseline profile.</p>
                        </div>
                        <div>
                            <h3 className="text-indigo-300 font-bold mb-1">Fit Score & Gap Analysis</h3>
                            <p className="text-sm">We calculate a 0-100 match score against your target role and highlight exactly what you're missing.</p>
                        </div>
                        <div>
                            <h3 className="text-indigo-300 font-bold mb-1">AI Resume Builder</h3>
                            <p className="text-sm">Generate a professional CV by answering role-specific behaviorial questions.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4 & 5. Input Requirements & Output */}
            <section className="space-y-8">
                <h2 className="text-2xl font-bold text-slate-900 text-center">How It Works (The Pipeline)</h2>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <AIPipelineViz />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                        <h3 className="font-bold text-amber-800 mb-2">📥 Input Requirements</h3>
                        <p className="text-amber-700">Resume (PDF/DOCX), List of technical/soft Skills, Career Interests, Education Details.</p>
                    </div>
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <h3 className="font-bold text-emerald-800 mb-2">📊 Output Produced</h3>
                        <p className="text-emerald-700">Fit Score (0-100), Skill Gap Report, Personalized Roadmap, Course Recommendations, Resume Suggestions.</p>
                    </div>
                </div>
            </section>

            {/* 6. FAQ */}
            <section className="max-w-3xl mx-auto w-full">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        { q: "Can freshers use this platform?", a: "Absolutely! We specialize in guiding students and early-career professionals by identifying transferable skills and potential." },
                        { q: "Does the AI guarantee a job?", a: "No. The AI provides guidance, roadmaps, and optimization. Job success depends on your effort and interview performance." },
                        { q: "Is my data safe?", a: "Yes. Uploaded resumes are processed in-memory for extraction only and are not permanently stored on our servers." },
                        { q: "What languages are supported?", a: "Currently, we support English, Hindi, and Odia for career queries and interface navigation." },
                        { q: "How accurate is the Fit Score?", a: "It uses industry-standard skill taxonomies. It's a strong indicator but should be used as a directional guide." }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                            <button
                                onClick={() => toggleFaq(idx)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-bold text-slate-800">{item.q}</span>
                                {openFaq === idx ? <ChevronUp className="text-indigo-600" /> : <ChevronDown className="text-slate-400" />}
                            </button>
                            {openFaq === idx && (
                                <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-4">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Support & Footer Info */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-slate-200">
                    <Globe className="text-indigo-600 mb-3" />
                    <h3 className="font-bold mb-1">Language Support</h3>
                    <p className="text-sm text-slate-500">English, Hindi, Odia supported.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-slate-200">
                    <Shield className="text-indigo-600 mb-3" />
                    <h3 className="font-bold mb-1">Responsible AI</h3>
                    <p className="text-sm text-slate-500">Guidance only. Use with personal research.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-slate-200">
                    <Mail className="text-indigo-600 mb-3" />
                    <h3 className="font-bold mb-1">Contact Us</h3>
                    <p className="text-sm text-slate-500">support@careermind.ai | GitHub</p>
                </div>
            </section>

            {/* Troubleshooting */}
            <div className="bg-slate-50 rounded-2xl p-6 text-sm text-slate-500 text-center">
                <h3 className="font-bold text-slate-700 mb-2 flex items-center justify-center gap-2">
                    <AlertCircle size={16} /> Troubleshooting
                </h3>
                <p>
                    If the dashboard isn't updating, try refreshing the page or re-uploading your resume.
                    Ensure your file is a valid PDF or DOCX under 5MB.
                </p>
            </div>

        </div>
    );
};

export default HelpPage;
