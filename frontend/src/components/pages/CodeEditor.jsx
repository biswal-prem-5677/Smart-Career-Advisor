import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, CheckCircle, XCircle, Terminal, Code, Cpu, ChevronRight } from 'lucide-react';

const CodeEditor = () => {
    const [problems, setProblems] = useState([]);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/code/problems');
            setProblems(res.data.problems);
            if (res.data.problems.length > 0) {
                selectProblem(res.data.problems[0]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const selectProblem = (problem) => {
        setSelectedProblem(problem);
        setCode(problem.starter_code[language] || '');
        setOutput(null);
    };

    const handleRun = async () => {
        setIsRunning(true);
        setOutput(null);
        try {
            const res = await axios.post('http://localhost:8000/api/code/evaluate', {
                code,
                language,
                problem_id: selectedProblem.id
            });
            setOutput(res.data);
        } catch (err) {
            console.error(err);
            setOutput({ success: false, feedback: "Error connecting to server." });
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#1e1e1e] text-slate-300 font-sans pt-16 overflow-hidden">

            {/* Sidebar - Problem List */}
            <div className="w-1/4 bg-[#252526] border-r border-[#333] flex flex-col">
                <div className="p-4 border-b border-[#333] mb-2">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Code size={16} className="text-blue-400" />
                        Problems ({problems.length})
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {problems.map(prob => (
                        <button
                            key={prob.id}
                            onClick={() => selectProblem(prob)}
                            className={`w-full text-left p-4 hover:bg-[#2a2d2e] border-l-2 transition-all ${selectedProblem?.id === prob.id
                                    ? 'border-blue-500 bg-[#37373d] text-white'
                                    : 'border-transparent text-slate-400'
                                }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{prob.title}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${prob.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                        prob.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                    }`}>
                                    {prob.difficulty}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Editor Header */}
                <div className="h-12 bg-[#1e1e1e] border-b border-[#333] flex items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-blue-400 font-mono">{selectedProblem?.title}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={language}
                            onChange={(e) => {
                                setLanguage(e.target.value);
                                if (selectedProblem) setCode(selectedProblem.starter_code[e.target.value]);
                            }}
                            className="bg-[#333] text-sm text-white px-3 py-1.5 rounded border border-[#444] focus:outline-none focus:border-blue-500"
                        >
                            <option value="python">Python</option>
                            <option value="javascript">JavaScript</option>
                        </select>
                        <button
                            onClick={handleRun}
                            disabled={isRunning}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded text-sm font-medium transition-all ${isRunning
                                    ? 'bg-blue-600/50 cursor-wait'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                                }`}
                        >
                            {isRunning ? <Cpu size={16} className="animate-spin" /> : <Play size={16} />}
                            {isRunning ? 'Running...' : 'Run Code'}
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Problem Description & Editor */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1 p-0 relative">
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full h-full bg-[#1e1e1e] text-slate-100 font-mono text-sm p-4 resize-none focus:outline-none leading-6"
                                spellCheck="false"
                            />
                        </div>
                    </div>

                    {/* Right / Bottom Panel for Results */}
                    {output && (
                        <div className="w-96 bg-[#252526] border-l border-[#333] flex flex-col overflow-y-auto animate-enter-left">
                            <div className="p-4 border-b border-[#333]">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <Terminal size={16} className="text-purple-400" />
                                    Output
                                </h3>
                            </div>

                            <div className="p-6">
                                <div className={`mb-6 flex items-center gap-3 p-4 rounded-lg bg-opacity-10 ${output.success ? 'bg-green-500' : 'bg-red-500'}`}>
                                    {output.success ? <CheckCircle className="text-green-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
                                    <div>
                                        <h4 className={`text-lg font-bold ${output.success ? 'text-green-400' : 'text-red-400'}`}>
                                            {output.success ? 'Accepted' : 'Wrong Answer'}
                                        </h4>
                                        <p className="text-sm text-slate-400">Score: <span className="text-white font-mono">{output.score}/100</span></p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h5 className="text-xs font-semibold text-slate-500 uppercase">Test Cases</h5>
                                    {output.results && output.results.map((res, idx) => (
                                        <div key={idx} className="bg-[#333] rounded p-3 flex justify-between items-center">
                                            <span className="text-sm text-slate-300">{res.case}</span>
                                            <span className={`text-xs px-2 py-1 rounded ${res.status === 'Passed' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                                                }`}>
                                                {res.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {output.feedback && (
                                    <div className="mt-6 pt-4 border-t border-[#333]">
                                        <h5 className="text-xs font-semibold text-slate-500 uppercase mb-2">AI Feedback</h5>
                                        <p className="text-sm text-slate-300 leading-relaxed italic">
                                            "{output.feedback}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Problem Description Footer (if output is hidden or separate panel) */}
                <div className="h-1/3 bg-[#252526] border-t border-[#333] p-4 overflow-y-auto">
                    <h3 className="text-lg font-bold text-slate-100 mb-2">{selectedProblem?.title}</h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">{selectedProblem?.description}</p>

                    <div className="flex gap-8">
                        <div>
                            <span className="text-xs text-slate-500 uppercase block mb-1">Input</span>
                            <code className="bg-[#333] px-2 py-1 rounded text-green-400 text-xs font-mono">{selectedProblem?.example_input}</code>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase block mb-1">Output</span>
                            <code className="bg-[#333] px-2 py-1 rounded text-orange-400 text-xs font-mono">{selectedProblem?.example_output}</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
