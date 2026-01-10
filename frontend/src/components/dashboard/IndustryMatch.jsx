import React from 'react';
import { Building2 } from 'lucide-react';

const IndustryMatch = () => {
    const industries = [
        { name: 'Fintech', match: 92, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        { name: 'EdTech', match: 88, color: 'bg-blue-100 text-blue-700 border-blue-200' },
        { name: 'SaaS', match: 75, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
        { name: 'E-commerce', match: 60, color: 'bg-slate-100 text-slate-600 border-slate-200' },
    ];

    return (
        <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Building2 className="text-slate-500" size={20} />
                Industry Match
            </h3>
            <div className="flex flex-col gap-3">
                {industries.map((ind) => (
                    <div key={ind.name} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{ind.name}</span>
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${ind.color.split(' ')[0].replace('bg-', 'bg-opacity-100 bg-')}`}
                                    style={{ width: `${ind.match}%`, backgroundColor: 'currentColor' }}
                                ></div>
                            </div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${ind.color}`}>
                                {ind.match}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IndustryMatch;
