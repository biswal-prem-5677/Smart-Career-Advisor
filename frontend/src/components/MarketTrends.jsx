import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, Briefcase } from 'lucide-react';

const MarketTrends = ({ role = "Data Scientist" }) => {
    // Simulated data based on role - "Hackathon Magic"
    const salaryData = [
        { name: 'Entry', salary: 65, fill: '#818cf8' }, // Indigo-400
        { name: 'Mid', salary: 120, fill: '#6366f1' },   // Indigo-500
        { name: 'Senior', salary: 185, fill: '#4f46e5' }, // Indigo-600
        { name: 'Lead', salary: 240, fill: '#4338ca' },   // Indigo-700
    ];

    const demandData = [
        { year: '2023', demand: 100 },
        { year: '2024', demand: 145 },
        { year: '2025', demand: 210 },
        { year: '2026', demand: 350 },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-enter delay-200">
            {/* Salary Chart */}
            <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <DollarSign className="text-emerald-500" size={20} />
                            Salary Insights
                        </h3>
                        <p className="text-xs text-slate-500">Annual compensation (in $000s)</p>
                    </div>
                    <div className="bg-emerald-100 p-2 rounded-lg">
                        <span className="text-emerald-700 font-bold text-sm">+12% YoY</span>
                    </div>
                </div>

                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salaryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <Tooltip
                                cursor={{ fill: '#f1f5f9' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="salary" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Demand Growth */}
            <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <TrendingUp className="text-indigo-500" size={20} />
                            Market Demand
                        </h3>
                        <p className="text-xs text-slate-500">Projected job openings growth</p>
                    </div>
                    <div className="bg-indigo-100 p-2 rounded-lg">
                        <span className="text-indigo-700 font-bold text-sm">High Growth</span>
                    </div>
                </div>

                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={demandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area type="monotone" dataKey="demand" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default MarketTrends;
