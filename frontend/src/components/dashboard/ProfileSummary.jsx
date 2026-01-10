import React from 'react';
import { User, MapPin, Briefcase, GraduationCap, Edit2 } from 'lucide-react';

const ProfileSummary = ({ data }) => {
    // Dynamic Name & Avatar Logic
    const name = data?.candidate_name || "Candidate";
    const initial = name.charAt(0).toUpperCase();
    const skills = data?.skills?.resume?.slice(0, 5) || ['AI/ML', 'Python', 'Leadership']; // Show top 5 skills

    return (
        <div className="glass-card p-6 rounded-3xl h-full flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <User size={100} />
            </div>

            <div className="relative z-10 flex items-start gap-6">
                {/* Dynamic Initial Avatar */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-lg shrink-0">
                    <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border-2 border-white">
                        <span className="text-4xl font-bold text-indigo-600">{initial}</span>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 break-words">{name}</h2>
                            <p className="text-slate-500 font-medium text-sm mb-3">Aspiring Professional</p>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <Edit2 size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-indigo-400" />
                            <span>Location Detected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase size={14} className="text-indigo-400" />
                            <span>Open to Work</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <GraduationCap size={14} className="text-indigo-400" />
                            <span>Education Parsed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Interests Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
                {skills.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ProfileSummary;
