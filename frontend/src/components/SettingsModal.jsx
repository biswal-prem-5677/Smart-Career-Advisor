import React from 'react';
import { X, Snowflake, Zap, Palette } from 'lucide-react';
import { useVisualEffects } from '../context/VisualEffectsContext';

const SettingsModal = ({ onClose }) => {
    const { isSnowing, toggleSnow, isAntiGravity, toggleAntiGravity } = useVisualEffects();

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-scale-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Palette className="text-indigo-600" /> Appearance Settings
                </h2>

                <div className="space-y-4">

                    {/* Snowfall Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100/50 text-blue-600 rounded-lg">
                                <Snowflake size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-700">Winter Mode</h3>
                                <p className="text-xs text-slate-500">Enable snowfall effect</p>
                            </div>
                        </div>

                        <button
                            onClick={toggleSnow}
                            className={`w-12 h-6 rounded-full transition-colors relative ${isSnowing ? 'bg-indigo-600' : 'bg-slate-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${isSnowing ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Anti-Gravity Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-purple-100 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100/50 text-purple-600 rounded-lg">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-700">Anti-Gravity Cursor</h3>
                                <p className="text-xs text-slate-500">Enable particle trail effect</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleAntiGravity}
                            className={`w-12 h-6 rounded-full transition-colors relative ${isAntiGravity ? 'bg-purple-600' : 'bg-slate-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${isAntiGravity ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                </div>

                <div className="mt-8 text-center text-xs text-slate-400">
                    More customization coming soon!
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
