import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const CareerFitRadar = () => {
    // Simulated fit scores for different roles
    const data = [
        { subject: 'Data Science', A: 87, fullMark: 100 },
        { subject: 'Frontend', A: 45, fullMark: 100 },
        { subject: 'Backend', A: 65, fullMark: 100 },
        { subject: 'Product', A: 50, fullMark: 100 },
        { subject: 'Analyst', A: 80, fullMark: 100 },
        { subject: 'DevOps', A: 40, fullMark: 100 },
    ];

    return (
        <div className="glass-card p-6 rounded-3xl h-full flex flex-col items-center justify-center relative">
            <h3 className="absolute top-6 left-6 text-lg font-bold text-slate-800">Career Fit Analysis</h3>
            <div className="w-full h-[250px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Fit Score"
                            dataKey="A"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fill="#6366f1"
                            fillOpacity={0.4}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-slate-400 mt-[-10px]">Comparing your profile against top tech roles</p>
        </div>
    );
};

export default CareerFitRadar;
