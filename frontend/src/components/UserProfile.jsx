import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Moon, Sun, ChevronDown, CheckCircle, Settings, Shield } from 'lucide-react';

const UserProfile = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const dropdownRef = useRef(null);

    // Close click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-2 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
            >
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
                    <span className="text-white font-bold text-lg">{initial}</span>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 animate-enter z-50 overflow-hidden text-left">
                    {/* Header in Dropdown */}
                    <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold">
                            {initial}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">{user?.name}</h4>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit mt-1">
                                <CheckCircle size={10} /> Pro Member
                            </span>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-1">
                        <button
                            onClick={toggleTheme}
                            className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between text-slate-700 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                {isDarkMode ? <Moon size={20} className="text-indigo-500" /> : <Sun size={20} className="text-amber-500" />}
                                <span className="font-medium text-sm">Dark Mode</span>
                            </div>
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </div>
                        </button>

                        <button className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center gap-3 text-slate-700 transition-colors">
                            <Settings size={20} className="text-slate-400" />
                            <span className="font-medium text-sm">Account Settings</span>
                        </button>

                        <button className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center gap-3 text-slate-700 transition-colors">
                            <Shield size={20} className="text-slate-400" />
                            <span className="font-medium text-sm">Privacy & Security</span>
                        </button>
                    </div>

                    <div className="h-px bg-slate-100 my-1 mx-2"></div>

                    <div className="p-2">
                        <button
                            onClick={onLogout}
                            className="w-full p-3 rounded-xl hover:bg-red-50 text-red-600 flex items-center gap-3 transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium text-sm">Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
