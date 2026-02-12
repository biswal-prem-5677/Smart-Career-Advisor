import React from 'react';
import { Briefcase, DollarSign, Target, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react';

const ModelPredictionHub = ({ onNavigate }) => {
    const models = [
        {
            id: 'placement-prediction',
            title: 'Placement AI',
            description: 'Predict your chances of getting placed and get company recommendations.',
            icon: <TrendingUp size={32} className="text-white" />,
            color: 'from-blue-500 to-indigo-600',
            delay: 'delay-0'
        },
        {
            id: 'job-role-prediction',
            title: 'Job Role Prediction',
            description: 'Find the technical role that best fits your academic performance.',
            icon: <Briefcase size={32} className="text-white" />,
            color: 'from-purple-500 to-pink-600',
            delay: 'delay-100'
        },
        {
            id: 'salary-prediction',
            title: 'Salary Prediction',
            description: 'Estimate your potential salary based on your profile and market trends.',
            icon: <DollarSign size={32} className="text-white" />,
            color: 'from-emerald-500 to-teal-600',
            delay: 'delay-200'
        },
        {
            id: 'domain-fit-prediction',
            title: 'Domain Fit Prediction',
            description: 'Discover the tech domain that matches your personality and skills.',
            icon: <Target size={32} className="text-white" />,
            color: 'from-orange-500 to-red-600',
            delay: 'delay-300'
        },
        {
            id: 'skill-match-prediction',
            title: 'Skill Match Recommender',
            description: 'Get AI-driven skill recommendations and learning resources.',
            icon: <CheckCircle size={32} className="text-white" />,
            color: 'from-cyan-500 to-blue-600',
            delay: 'delay-400'
        }
    ];

    return (
        <div className="space-y-12 animate-enter min-h-screen bg-slate-950 p-8 rounded-3xl">
            <div className="text-center space-y-6">
                <h1 className="text-4xl md:text-5xl font-black text-white">AI Prediction Models</h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Leverage our suite of advanced machine learning models to gain insights into your career path, potential earnings, and skill gaps.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {models.map((model) => (
                    <button
                        key={model.id}
                        onClick={() => onNavigate(model.id)}
                        className={`group relative p-8 rounded-[2rem] bg-slate-900 border border-slate-800 shadow-xl hover:shadow-2xl hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-300 text-left animate-enter ${model.delay} hover:-translate-y-2 overflow-hidden`}
                    >
                        <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity`}>
                            {React.cloneElement(model.icon, { size: 120, className: 'text-white' })}
                        </div>

                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${model.color} flex items-center justify-center shadow-lg mb-8 group-hover:scale-110 transition-transform duration-300`}>
                            {model.icon}
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                            {model.title}
                        </h3>
                        <p className="text-slate-400 mb-8 line-clamp-3 leading-relaxed text-base">
                            {model.description}
                        </p>

                        <div className="flex items-center text-sm font-bold text-slate-500 group-hover:text-white transition-colors uppercase tracking-wider">
                            Try Model <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform text-indigo-500 group-hover:text-indigo-400" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ModelPredictionHub;
