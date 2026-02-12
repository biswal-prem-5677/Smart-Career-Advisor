import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, DollarSign, Briefcase, ChevronRight, BookOpen, ExternalLink, Filter } from 'lucide-react';
import { useReportCard } from '../../context/ReportCardContext';

const JobsPage = () => {
    const { markFeatureUsed } = useReportCard();
    const [jobsData, setJobsData] = useState({});
    const [selectedDomain, setSelectedDomain] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/jobs/search`);
                setJobsData(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const allDomains = ['All', ...Object.keys(jobsData).map(k => jobsData[k][0]?.domain || k)];

    const getFlattenedJobs = () => {
        let allJobs = [];
        Object.keys(jobsData).forEach(key => {
            jobsData[key].forEach(cat => {
                allJobs = [...allJobs, ...cat.roles.map(r => ({ ...r, domain: cat.domain }))];
            });
        });
        return allJobs;
    };

    const displayJobs = getFlattenedJobs().filter(job => {
        const matchesDomain = selectedDomain === 'All' || job.domain === selectedDomain;
        const matchesSearch = job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDomain && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-10 px-4 md:px-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12 text-center animate-enter">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                    Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Dream Career</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Explore high-paying roles in AI/ML, Data Science, Software Engineering, Blockchain, Cloud Computing, and more. Get detailed roadmaps on how to crack them.
                </p>

                {/* Search Bar */}
                <div className="mt-10 relative max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="text-slate-500" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for roles, companies..."
                        className="w-full pl-12 pr-4 py-4 rounded-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xl outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto mb-10 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex gap-3 justify-center min-w-max px-4">
                    {allDomains.map((domain, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedDomain(domain)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 border ${selectedDomain === domain
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 border-blue-500'
                                : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            {domain}
                        </button>
                    ))}
                </div>
            </div>

            {/* Job Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-enter">
                {displayJobs.map((job, idx) => (
                    <div
                        key={idx}
                        className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-lg hover:shadow-2xl hover:border-blue-500/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                        onClick={() => {
                            setSelectedJob(job);
                            markFeatureUsed('jobs', { action: 'view_job', job: job.job_title });
                        }}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/10 to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>

                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{job.job_title}</h3>
                                <p className="text-sm text-slate-400 font-medium">{job.company || "Top Tech Co."}</p>
                            </div>
                            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-xl font-bold text-blue-500 border border-slate-700">
                                {job.company ? job.company[0] : "T"}
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 relative z-10">
                            {job.package && (
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                    <div className="p-1.5 rounded-lg bg-emerald-900/30 text-emerald-400">
                                        <DollarSign size={14} />
                                    </div>
                                    <span className="font-semibold">{job.package}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <div className="p-1.5 rounded-lg bg-rose-900/30 text-rose-400">
                                    <MapPin size={14} />
                                </div>
                                <span className="font-medium">{job.location || "Remote / Hybrid"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                <div className="p-1.5 rounded-lg bg-purple-900/30 text-purple-400">
                                    <Briefcase size={14} />
                                </div>
                                <span className="font-medium">{job.domain}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800 flex items-center justify-between relative z-10">
                            <span className="text-xs font-bold text-blue-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                                View Details <ChevronRight size={14} />
                            </span>
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-800 px-2 py-1 rounded">FULL TIME</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {displayJobs.length === 0 && (
                <div className="text-center py-20 animate-enter">
                    <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
                        <Search size={40} className="text-slate-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No jobs found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
            )}

            {/* Job Details Modal */}
            {selectedJob && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-enter">
                    <div className="bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700 animate-scale-up md:p-8 p-6 relative custom-scrollbar">
                        <button
                            onClick={() => setSelectedJob(null)}
                            className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex flex-col md:flex-row gap-6 mb-8 border-b border-slate-800 pb-8">
                            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center text-4xl font-bold text-blue-500 shrink-0 border border-slate-700 shadow-lg">
                                {selectedJob.company ? selectedJob.company[0] : "T"}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">{selectedJob.job_title}</h2>
                                <h3 className="text-xl text-blue-400 font-medium mb-4">{selectedJob.company}</h3>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-4 py-1.5 bg-emerald-900/30 text-emerald-400 rounded-full text-sm font-bold border border-emerald-500/30">
                                        {selectedJob.package}
                                    </span>
                                    <span className="px-4 py-1.5 bg-blue-900/30 text-blue-400 rounded-full text-sm font-bold border border-blue-500/30">
                                        {selectedJob.location || "Remote"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h4 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                                    <BookOpen size={20} className="text-indigo-400" />
                                    About the Role
                                </h4>
                                <div className="text-slate-300 leading-relaxed bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                                    {selectedJob.description}
                                </div>
                            </div>

                            {selectedJob.how_to_get && (
                                <div>
                                    <h4 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                                        <Briefcase size={20} className="text-purple-400" />
                                        How to Get This Job
                                    </h4>
                                    <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                                        <ul className="space-y-4">
                                            {selectedJob.how_to_get.split('\n').map((step, idx) => (
                                                <li key={idx} className="flex gap-4 text-slate-300">
                                                    <span className="w-8 h-8 bg-indigo-900/50 text-indigo-400 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border border-indigo-500/30">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="mt-1">{step.replace(/^\d+\.\s*/, '')}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <a
                                    href={selectedJob.apply_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 hover:-translate-y-1 transform duration-200"
                                >
                                    Apply Now <ExternalLink size={20} />
                                </a>
                                <button className="px-8 py-4 border border-slate-600 rounded-xl font-bold text-slate-300 hover:bg-slate-800 transition-colors hover:text-white">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobsPage;
