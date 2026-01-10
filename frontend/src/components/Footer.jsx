import React from 'react';
import { Sparkles, Mail, Github, Globe } from 'lucide-react';

const Footer = ({ onNavigate = () => { } }) => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* 1. Main Grid: Brand + 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand & Attribution */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                                <Sparkles size={18} />
                            </div>
                            <span className="font-bold text-xl text-white">CareerPath AI</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Built for Hackathon 2025 — Team Next Mind. <br />
                            Designed to support regional language students and first-generation learners.
                        </p>
                        <div className="pt-2">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-indigo-400">
                                <Globe size={12} />
                                Available in English, Hindi & Odia
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Navigation</h4>
                        <ul className="space-y-3 text-sm">
                            <li><button onClick={() => onNavigate('home')} className="hover:text-indigo-400 transition-colors text-left">Home</button></li>
                            <li><button className="hover:text-indigo-400 transition-colors text-left">About</button></li>
                            <li><button className="hover:text-indigo-400 transition-colors text-left">Features</button></li>
                            <li><button className="hover:text-indigo-400 transition-colors text-left">Dashboard</button></li>
                            <li><button onClick={() => onNavigate('help')} className="hover:text-indigo-400 transition-colors text-left">Help & Support</button></li>
                        </ul>
                    </div>

                    {/* Legal & Policy */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Legal & Policy</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Data & Consent</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">AI/ML Disclaimer</a></li>
                        </ul>
                    </div>

                    {/* Contact & Feedback */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Connect</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <Mail size={16} />
                                <a href="mailto:pharisubhranshu@gmail.com" className="hover:text-indigo-400 transition-colors">pharisubhranshu@gmail.com</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Github size={16} />
                                <a href="#" className="hover:text-indigo-400 transition-colors">GitHub Repo</a>
                            </li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors mt-2 block">Submit Feedback</a></li>
                        </ul>
                    </div>
                </div>



                {/* 3. Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 pt-8 border-t border-slate-800">
                    <div>
                        © 2026 CareerPath AI — Built for Innovation
                    </div>
                    <div className="mt-2 md:mt-0">
                        All Rights Reserved
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
