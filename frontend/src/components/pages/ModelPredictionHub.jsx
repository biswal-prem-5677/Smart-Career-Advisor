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
        <div className="space-y-8 animate-enter">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-slate-800">AI Prediction Models</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Leverage our suite of advanced machine learning models to gain insights into your career path, potential earnings, and skill gaps.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {models.map((model) => (
                    <button
                        key={model.id}
                        onClick={() => onNavigate(model.id)}
                        className={`group relative p-6 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 text-left animate-enter ${model.delay} hover:-translate-y-1`}
                    >
                        <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                            {React.cloneElement(model.icon, { size: 120, className: 'text-slate-900' })}
                        </div>

                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                            {model.icon}
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                            {model.title}
                        </h3>
                        <p className="text-slate-600 mb-6 line-clamp-2">
                            {model.description}
                        </p>

                        <div className="flex items-center text-sm font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                            Try Model <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ModelPredictionHub;
