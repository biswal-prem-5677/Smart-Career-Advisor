import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Briefcase, ChevronRight, Sparkles, User, Bot } from 'lucide-react';
import axios from 'axios';
import { api } from '../api/api';
import ReactMarkdown from 'react-markdown';

const Typewriter = ({ text, onComplete, onTick }) => {
    const [displayedText, setDisplayedText] = useState('');
    const index = useRef(0);

    useEffect(() => {
        index.current = 0;
        setDisplayedText('');

        const timer = setInterval(() => {
            if (index.current < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index.current));
                index.current++;
                if (onTick) onTick();
            } else {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, 10); // Reduced from 20ms to 10ms for faster typing

        return () => clearInterval(timer);
    }, [text]);

    return (
        <div className="markdown-content">
            <ReactMarkdown
                components={{
                    // Headings
                    h1: ({ node, ...props }) => <h1 className="text-xl font-black text-white mb-3 mt-4" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-indigo-200 mb-2 mt-3" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-base font-bold text-indigo-300 mb-2 mt-2" {...props} />,
                    // Paragraph
                    p: ({ node, ...props }) => <p className="text-sm leading-relaxed font-medium mb-2" {...props} />,
                    // Lists
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 my-2 ml-2" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 my-2 ml-2" {...props} />,
                    li: ({ node, ...props }) => <li className="text-sm leading-relaxed" {...props} />,
                    // Emphasis
                    strong: ({ node, ...props }) => <strong className="font-black text-indigo-200" {...props} />,
                    em: ({ node, ...props }) => <em className="italic text-indigo-300" {...props} />,
                    // Code
                    code: ({ node, inline, ...props }) =>
                        inline
                            ? <code className="bg-slate-900/60 text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono border border-slate-700" {...props} />
                            : <code className="block bg-slate-900/60 text-indigo-300 p-3 rounded-lg text-xs font-mono border border-slate-700 my-2 overflow-x-auto" {...props} />,
                    // Links
                    a: ({ node, ...props }) => <a className="text-indigo-400 hover:text-indigo-300 underline font-semibold" target="_blank" rel="noopener noreferrer" {...props} />,
                    // Blockquote
                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-slate-300 my-2" {...props} />,
                }}
            >
                {displayedText}
            </ReactMarkdown>
        </div>
    );
};

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! I can help you find the perfect AI/ML role. Try asking "Tell me about NLP jobs" or "Data Science roles".' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingCompleted, setTypingCompleted] = useState({}); // Track typing status by message index
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, typingCompleted, isTyping]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const userMsg = { type: 'user', text: `Uploaded resume: ${file.name}` };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`/api/chat-analyze`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const botResponse = {
                type: 'bot',
                text: response.data.response,
                roles: response.data.roles
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);

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
            const response = await axios.post(`/api/chat-query`, { query: userMsg.text });

            // Simulate typing delay for "natural" feel
            const botResponse = {
                type: 'bot',
                text: response.data.response,
                roles: response.data.roles, // Array of job objects
                suggestions: response.data.suggestions // Fallback suggestions
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);

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
                <div className="mb-4 w-[400px] h-[640px] bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-800 animate-enter origin-bottom-right shadow-black/60">

                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between text-white border-b border-indigo-400/20">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                                <Sparkles size={24} className="animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg tracking-tight">Career Assistant</h3>
                                <p className="text-[10px] text-indigo-100 flex items-center gap-1.5 font-black uppercase tracking-widest">
                                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></span> Online
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2.5 hover:bg-white/10 rounded-full transition-all hover:rotate-90 active:scale-95"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 pb-28 space-y-6 scrollbar-hide">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-[1.5rem] p-4 shadow-xl ${msg.type === 'user'
                                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none shadow-indigo-600/20'
                                    : 'bg-slate-800/80 border border-slate-700/50 text-slate-100 rounded-tl-none shadow-black/20'
                                    }`}>
                                    {msg.type === 'bot' && idx === messages.length - 1 && !typingCompleted[idx] ? (
                                        <Typewriter
                                            text={msg.text}
                                            onTick={scrollToBottom}
                                            onComplete={() => {
                                                setTypingCompleted(prev => ({ ...prev, [idx]: true }));
                                                scrollToBottom();
                                            }}
                                        />
                                    ) : msg.type === 'bot' ? (
                                        <div className="markdown-content">
                                            <ReactMarkdown
                                                components={{
                                                    h1: ({ node, ...props }) => <h1 className="text-xl font-black text-white mb-3 mt-4" {...props} />,
                                                    h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-indigo-200 mb-2 mt-3" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-base font-bold text-indigo-300 mb-2 mt-2" {...props} />,
                                                    p: ({ node, ...props }) => <p className="text-sm leading-relaxed font-medium mb-2" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 my-2 ml-2" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 my-2 ml-2" {...props} />,
                                                    li: ({ node, ...props }) => <li className="text-sm leading-relaxed" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-black text-indigo-200" {...props} />,
                                                    em: ({ node, ...props }) => <em className="italic text-indigo-300" {...props} />,
                                                    code: ({ node, inline, ...props }) =>
                                                        inline
                                                            ? <code className="bg-slate-900/60 text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono border border-slate-700" {...props} />
                                                            : <code className="block bg-slate-900/60 text-indigo-300 p-3 rounded-lg text-xs font-mono border border-slate-700 my-2 overflow-x-auto" {...props} />,
                                                    a: ({ node, ...props }) => <a className="text-indigo-400 hover:text-indigo-300 underline font-semibold" target="_blank" rel="noopener noreferrer" {...props} />,
                                                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-slate-300 my-2" {...props} />,
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                                    )}

                                    {/* Job Cards Rendering */}
                                    {msg.roles && (typingCompleted[idx] || idx < messages.length - 1) && (
                                        <div className="mt-4 space-y-3 animate-enter">
                                            {msg.roles.map((role, rIdx) => (
                                                <div key={rIdx} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700 hover:border-indigo-500/40 transition-all group backdrop-blur-sm">
                                                    <h4 className="font-bold text-indigo-300 text-sm group-hover:text-indigo-200 transition-colors uppercase tracking-tight">{role.job_title}</h4>
                                                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{role.description}</p>
                                                    <a
                                                        href={role.apply_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-3 text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2 group-hover:text-indigo-300 transition-all"
                                                    >
                                                        Apply Now <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Suggestions Rendering */}
                                    {msg.suggestions && (typingCompleted[idx] || idx < messages.length - 1) && (
                                        <div className="mt-4 flex flex-wrap gap-2 animate-enter">
                                            {msg.suggestions.map((s, sIdx) => (
                                                <button
                                                    key={sIdx}
                                                    onClick={() => { setInputValue(`Tell me about ${s}`); handleSend(); }}
                                                    className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-full border border-indigo-500/20 hover:bg-indigo-500/20 transition-all uppercase tracking-wider"
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
                                <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-tl-none p-4 flex gap-1.5 shadow-xl">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce shadow-lg shadow-indigo-500/40"></span>
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100 shadow-lg shadow-indigo-500/40"></span>
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200 shadow-lg shadow-indigo-500/40"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-5 bg-slate-900/60 backdrop-blur-xl border-t border-slate-800/50 absolute bottom-0 w-full shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
                        <div className="flex items-center gap-3 bg-slate-800/80 p-1.5 pl-3 rounded-full border border-slate-700 shadow-2xl focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500/50 transition-all transform hover:scale-[1.01]">

                            {/* Upload Button */}
                            <label className="p-2.5 cursor-pointer hover:bg-slate-700 rounded-full transition-all text-slate-400 hover:text-indigo-400 active:scale-90 group/upload">
                                <Briefcase size={20} className="group-hover:-rotate-6 transition-transform" />
                                <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileUpload} />
                            </label>

                            <input
                                type="text"
                                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-slate-200 placeholder-slate-500 font-medium"
                                placeholder="Ask about jobs or upload CV..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isTyping}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isTyping}
                                className={`p-3 rounded-full transition-all duration-300 ${inputValue.trim()
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/40 scale-100 hover:scale-105 active:scale-95'
                                    : 'bg-slate-700/50 text-slate-600 scale-90'
                                    }`}
                            >
                                <Send size={18} className={inputValue.trim() ? "translate-x-0.5" : ""} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center transition-all duration-500
                    ${isOpen ? 'bg-indigo-600 rotate-90 scale-90 rounded-full' : 'bg-slate-900 border border-slate-800 hover:scale-110 hover:shadow-indigo-500/20 active:scale-95'}
                `}
            >
                {isOpen ? (
                    <X className="text-white" size={32} />
                ) : (
                    <div className="relative">
                        <MessageSquare className="text-white" size={32} />
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default ChatBot;
