import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Moon, Sun, ChevronDown, CheckCircle, Settings, Shield } from 'lucide-react';
import { useVisualEffects } from '../context/VisualEffectsContext';

const UserProfile = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false); // New sub-menu state
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { isSnowing, toggleSnow, isAntiGravity, toggleAntiGravity } = useVisualEffects();
    const dropdownRef = useRef(null);

    // Close click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setShowSettings(false); // Reset to main menu on close
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const initial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-2 rounded-full hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700/50 group"
            >
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-white leading-tight">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-slate-800/50">
                    <span className="text-white font-bold text-lg">{initial}</span>
                </div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-3 w-72 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 animate-enter z-50 overflow-hidden text-left">
                    {/* Header in Dropdown */}
                    <div className="p-5 bg-slate-800/40 border-b border-slate-800 flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center text-xl font-bold border border-indigo-500/20">
                            {initial}
                        </div>
                        <div>
                            <h4 className="font-bold text-white">{user?.name}</h4>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit mt-1.5 uppercase tracking-wider border border-emerald-500/20">
                                <CheckCircle size={10} /> Pro Member
                            </span>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-1">
                        {!showSettings ? (
                            // Main Menu
                            <>
                                <button
                                    onClick={() => setShowSettings(true)}
                                    className="w-full p-3 rounded-xl hover:bg-slate-800/60 flex items-center justify-between text-slate-300 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Settings size={20} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                                        <span className="font-medium text-sm">Account Settings</span>
                                    </div>
                                    <ChevronDown size={16} className="text-slate-500 -rotate-90" />
                                </button>

                                <button className="w-full p-3 rounded-xl hover:bg-slate-800/60 flex items-center gap-3 text-slate-300 transition-all group">
                                    <Shield size={20} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                                    <span className="font-medium text-sm">Privacy & Security</span>
                                </button>
                            </>
                        ) : (
                            // Settings Sub-menu
                            <div className="animate-fade-in-right">
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="w-full p-2 mb-2 rounded-lg hover:bg-slate-800/40 flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors text-[10px] font-black uppercase tracking-widest"
                                >
                                    <ChevronDown size={14} className="rotate-90" /> Back
                                </button>

                                {/* Dark Mode */}
                                <button
                                    onClick={toggleTheme}
                                    className="w-full p-3 rounded-xl hover:bg-slate-800/60 flex items-center justify-between text-slate-300 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        {isDarkMode ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-amber-400" />}
                                        <span className="font-medium text-sm">Dark Mode</span>
                                    </div>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-4' : 'translate-x-0'} shadow-sm`}></div>
                                    </div>
                                </button>

                                {/* Winter Mode */}
                                <button
                                    onClick={toggleSnow}
                                    className="w-full p-3 rounded-xl hover:bg-slate-800/60 flex items-center justify-between text-slate-300 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">❄️</span>
                                        <span className="font-medium text-sm">Winter Mode</span>
                                    </div>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isSnowing ? 'bg-blue-500' : 'bg-slate-700'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isSnowing ? 'translate-x-4' : 'translate-x-0'} shadow-sm`}></div>
                                    </div>
                                </button>

                                {/* Particle Effect */}
                                <button
                                    onClick={toggleAntiGravity}
                                    className="w-full p-3 rounded-xl hover:bg-slate-800/60 flex items-center justify-between text-slate-300 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">⚡</span>
                                        <span className="font-medium text-sm">Particle Effect</span>
                                    </div>
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isAntiGravity ? 'bg-purple-500' : 'bg-slate-700'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isAntiGravity ? 'translate-x-4' : 'translate-x-0'} shadow-sm`}></div>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-slate-800 my-1 mx-2"></div>

                    <div className="p-2">
                        <button
                            onClick={onLogout}
                            className="w-full p-3 rounded-xl hover:bg-red-500/10 text-red-500 flex items-center gap-3 transition-all group"
                        >
                            <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                            <span className="font-bold text-sm">Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
