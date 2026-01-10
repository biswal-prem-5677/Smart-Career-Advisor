import React, { useState } from 'react';
import { ArrowRightLeft, Code2, Copy, Check, Sparkles, Zap } from 'lucide-react';

const LANGUAGES = [
    { id: 'c', name: 'C Language', icon: 'C' },
    { id: 'cpp', name: 'C++', icon: 'C++' },
    { id: 'python', name: 'Python', icon: 'Py' },
    { id: 'javascript', name: 'JavaScript', icon: 'JS' },
    { id: 'java', name: 'Java', icon: '☕' },
];

const SYNTAX_DATA = {
    variables: {
        title: "Variable Declaration",
        description: "How to store data values.",
        examples: {
            c: `int age = 25;\nfloat price = 19.99;\nchar grade = 'A';`,
            cpp: `int age = 25;\ndouble price = 19.99;\nauto name = "John";`,
            python: `age = 25\nprice = 19.99\ngrade = 'A'`,
            javascript: `let age = 25;\nconst price = 19.99;\nvar grade = 'A';`,
            java: `int age = 25;\ndouble price = 19.99;\nString grade = "A";`
        }
    },
    functions: {
        title: "Function Definition",
        description: "Defining reusable blocks of code.",
        examples: {
            c: `int add(int a, int b) {\n    return a + b;\n}`,
            cpp: `int add(int a, int b) {\n    return a + b;\n}`,
            python: `def add(a, b):\n    return a + b`,
            javascript: `function add(a, b) {\n    return a + b;\n}\n// Arrow Function\nconst add = (a, b) => a + b;`,
            java: `public int add(int a, int b) {\n    return a + b;\n}`
        }
    },
    loops: {
        title: "Loops (For Loop)",
        description: "Iterating a fixed number of times.",
        examples: {
            c: `for (int i = 0; i < 5; i++) {\n    printf("%d", i);\n}`,
            cpp: `for (int i = 0; i < 5; i++) {\n    cout << i;\n}`,
            python: `for i in range(5):\n    print(i)`,
            javascript: `for (let i = 0; i < 5; i++) {\n    console.log(i);\n}`,
            java: `for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}`
        }
    },
    printing: {
        title: "Output / Printing",
        description: "Displaying text to the console.",
        examples: {
            c: `printf("Hello World");`,
            cpp: `std::cout << "Hello World";`,
            python: `print("Hello World")`,
            javascript: `console.log("Hello World");`,
            java: `System.out.println("Hello World");`
        }
    }
};

const LanguageDiff = () => {
    const [lang1, setLang1] = useState('c');
    const [lang2, setLang2] = useState('javascript');
    const [animating, setAnimating] = useState(false);

    const handleSwap = () => {
        setAnimating(true);
        setTimeout(() => {
            const temp = lang1;
            setLang1(lang2);
            setLang2(temp);
            setAnimating(false);
        }, 300);
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 px-4 pb-20 animate-fade-in">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-12">
                    <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-4 inline-block">
                        <Zap size={14} className="inline mr-1" /> Syntax Comparator
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                        Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Differences</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Visualize how concepts translate between languages. Perfect for polyglot programmers.
                    </p>
                </div>

                {/* Control Bar */}
                <div className="bg-white p-4 rounded-3xl shadow-lg border border-slate-100 mb-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                    {/* Language 1 Select */}
                    <div className="w-full md:w-64">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Base Language</label>
                        <select
                            value={lang1}
                            onChange={(e) => setLang1(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer hover:bg-slate-100"
                        >
                            {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.icon} &nbsp; {l.name}</option>)}
                        </select>
                    </div>

                    {/* Swap Button */}
                    <button
                        onClick={handleSwap}
                        className={`p-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all transform hover:rotate-180 hover:scale-110 active:scale-95 ${animating ? 'rotate-180' : ''}`}
                    >
                        <ArrowRightLeft size={24} />
                    </button>

                    {/* Language 2 Select */}
                    <div className="w-full md:w-64">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Language</label>
                        <select
                            value={lang2}
                            onChange={(e) => setLang2(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all cursor-pointer hover:bg-slate-100"
                        >
                            {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.icon} &nbsp; {l.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 gap-8">
                    {Object.entries(SYNTAX_DATA).map(([key, data], idx) => (
                        <div key={key} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            {/* Header */}
                            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-start gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-indigo-600">
                                    <Code2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{data.title}</h3>
                                    <p className="text-slate-500">{data.description}</p>
                                </div>
                            </div>

                            {/* Comparison Body */}
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                {/* Left Side */}
                                <div className="p-6 bg-[#f8fafc] group relative">
                                    <span className="absolute top-4 right-4 text-xs font-bold text-slate-300 uppercase">{LANGUAGES.find(l => l.id === lang1)?.name}</span>
                                    <pre className="font-mono text-sm text-slate-700 whitespace-pre-wrap bg-white p-4 rounded-xl border border-slate-200 shadow-inner overflow-x-auto group-hover:border-blue-300 transition-colors">
                                        <code>{data.examples[lang1]}</code>
                                    </pre>
                                </div>

                                {/* Right Side */}
                                <div className="p-6 bg-[#f8fafc] group relative">
                                    <span className="absolute top-4 right-4 text-xs font-bold text-slate-300 uppercase">{LANGUAGES.find(l => l.id === lang2)?.name}</span>
                                    <div className={`transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
                                        <pre className="font-mono text-sm text-slate-700 whitespace-pre-wrap bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-100 shadow-inner overflow-x-auto ring-1 ring-transparent group-hover:ring-indigo-200 transition-all">
                                            <code>{data.examples[lang2]}</code>
                                        </pre>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                            <Sparkles size={12} /> Converted
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="mt-16 text-center">
                    <p className="text-slate-400 text-sm font-medium">More languages coming soon...</p>
                </div>
            </div>
        </div>
    );
};

export default LanguageDiff;
