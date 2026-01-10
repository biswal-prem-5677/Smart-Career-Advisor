import React from 'react';
import { FileText, ScanSearch, BrainCircuit, Target, ArrowRight } from 'lucide-react';

const AIPipelineViz = () => {
    const steps = [
        { icon: FileText, label: "Document Parsing", desc: "PDF/Docx Extraction" },
        { icon: ScanSearch, label: "Skill Recognition", desc: "NLP Keyword Matching" },
        { icon: BrainCircuit, label: "Fit Prediction", desc: "XGBoost Classifier" },
        { icon: Target, label: "Gap Analysis", desc: "Strategic Scoring" },
    ];

    return (
        <div className="w-full py-12 animate-enter">
            <div className="text-center mb-10">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    Transparent AI Logic
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-4">How It Works</h2>
            </div>

            <div className="relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-emerald-200 -z-10"></div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-4 relative z-10 transition-transform group-hover:scale-110 group-hover:shadow-indigo-100 group-hover:border-indigo-200">
                                    <Icon className="text-indigo-600" size={24} />
                                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                                        {index + 1}
                                    </div>
                                </div>
                                <h3 className="font-bold text-slate-800 mb-1">{step.label}</h3>
                                <p className="text-xs text-slate-500">{step.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AIPipelineViz;
