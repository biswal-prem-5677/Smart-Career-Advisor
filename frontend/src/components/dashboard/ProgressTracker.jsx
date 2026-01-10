import React from 'react';
import { Trophy, Star, Target, Flame } from 'lucide-react';

const ProgressTracker = () => {
    return (
        <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20} />
                Your Progress
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="bg-white/50 p-4 rounded-2xl border border-white/60 text-center">
                    <div className="w-10 h-10 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                        <Target size={18} />
                    </div>
                    <span className="block text-2xl font-bold text-slate-800">60%</span>
                    <span className="text-xs text-slate-500 font-medium">Goal Status</span>
                </div>

                {/* Metric 2 */}
                <div className="bg-white/50 p-4 rounded-2xl border border-white/60 text-center">
                    <div className="w-10 h-10 mx-auto bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-2">
                        <Flame size={18} />
                    </div>
                    <span className="block text-2xl font-bold text-slate-800">4</span>
                    <span className="text-xs text-slate-500 font-medium">Day Streak</span>
                </div>

                {/* Metric 3 */}
                <div className="bg-white/50 p-4 rounded-2xl border border-white/60 text-center">
                    <div className="w-10 h-10 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                        <Star size={18} />
                    </div>
                    <span className="block text-2xl font-bold text-slate-800">850</span>
                    <span className="text-xs text-slate-500 font-medium">XP Points</span>
                </div>

                {/* Metric 4 */}
                <div className="bg-white/50 p-4 rounded-2xl border border-white/60 text-center">
                    <div className="w-10 h-10 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2">
                        <Trophy size={18} />
                    </div>
                    <span className="block text-2xl font-bold text-slate-800">3</span>
                    <span className="text-xs text-slate-500 font-medium">Badges</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-600">Level 5: Rising Star</span>
                    <span className="text-xs text-slate-400">450 / 1000 XP</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[45%] rounded-full shadow-sm"></div>
                </div>
            </div>
        </div>
    );
};

export default ProgressTracker;
