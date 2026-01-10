import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Briefcase, ChevronRight, Sparkles, User, Bot } from 'lucide-react';
import axios from 'axios';
import { api } from '../api/api'; // Using axios directly for custom endpoint if needed or add to api.js

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! I can help you find the perfect AI/ML role. Try asking "Tell me about NLP jobs" or "Data Science roles".' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const userMsg = { type: 'user', text: `Uploaded resume: ${file.name}` };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat-analyze`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setTimeout(() => {
                const botResponse = {
                    type: 'bot',
                    text: response.data.response,
                    roles: response.data.roles
                };
                setMessages(prev => [...prev, botResponse]);
                setIsTyping(false);
            }, 1000);

        } catch (error) {
            console.error(error);
            setIsTyping(false);
            setMessages(prev => [...prev, { type: 'bot', text: "Failed to analyze resume. Please try again." }]);
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = { type: 'user', text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Call Backend
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/chat-query`, { query: userMsg.text });

            // Simulate typing delay for "natural" feel
            setTimeout(() => {
                const botResponse = {
                    type: 'bot',
                    text: response.data.response,
                    roles: response.data.roles, // Array of job objects
                    suggestions: response.data.suggestions // Fallback suggestions
                };
                setMessages(prev => [...prev, botResponse]);
                setIsTyping(false);
            }, 800);

        } catch (error) {
            console.error(error);
            setIsTyping(false);
            setMessages(prev => [...prev, { type: 'bot', text: "I'm having trouble connecting to the job database right now. Please try again later." }]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">

            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[380px] h-[600px] glass-card rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-white/40 animate-enter origin-bottom-right">

                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold">Career Assistant</h3>
                                <p className="text-xs text-indigo-100 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-slate-50/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 ${msg.type === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-white shadow-sm border border-slate-100 text-slate-700 rounded-tl-none'
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.text}</p>

                                    {/* Job Cards Rendering */}
                                    {msg.roles && (
                                        <div className="mt-3 space-y-3">
                                            {msg.roles.map((role, rIdx) => (
                                                <div key={rIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors group">
                                                    <h4 className="font-bold text-slate-800 text-sm">{role.job_title}</h4>
                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{role.description}</p>
                                                    <a
                                                        href={role.apply_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-2 text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all"
                                                    >
                                                        Apply Now <ChevronRight size={12} />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Suggestions Rendering */}
                                    {msg.suggestions && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {msg.suggestions.map((s, sIdx) => (
                                                <button
                                                    key={sIdx}
                                                    onClick={() => { setInputValue(`Tell me about ${s}`); handleSend(); }}
                                                    className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white shadow-sm border border-slate-100 rounded-2xl rounded-tl-none p-4 flex gap-1">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 absolute bottom-0 w-full">
                        <div className="flex items-center gap-2 bg-white p-1 pl-2 rounded-full border border-slate-200 shadow-lg focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all transform hover:scale-[1.02]">

                            {/* Upload Button */}
                            <label className="p-2 cursor-pointer hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-indigo-600">
                                <Briefcase size={18} />
                                <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileUpload} />
                            </label>

                            <input
                                type="text"
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700 placeholder-slate-400 font-medium"
                                placeholder="Ask jobs or upload CV..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isTyping}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isTyping}
                                className={`p-2.5 rounded-full transition-all duration-300 ${inputValue.trim()
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg rotate-0 scale-100'
                                    : 'bg-slate-100 text-slate-400 scale-90'
                                    }`}
                            >
                                <Send size={16} className={inputValue.trim() ? "translate-x-0.5 translate-y-0.5" : ""} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300
                    ${isOpen ? 'bg-indigo-600 rotate-90 scale-90' : 'bg-slate-900 hover:scale-105 hover:bg-slate-800'}
                `}
            >
                {isOpen ? (
                    <X className="text-white" size={28} />
                ) : (
                    <div className="relative">
                        <MessageSquare className="text-white" size={28} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-slate-900 rounded-full"></span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default ChatBot;
