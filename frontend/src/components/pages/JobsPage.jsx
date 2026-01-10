import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, DollarSign, Briefcase, ChevronRight, BookOpen, ExternalLink } from 'lucide-react';

const JobsPage = () => {
    const [jobsData, setJobsData] = useState({});
    const [selectedDomain, setSelectedDomain] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/data`);
                setJobsData(res.data);
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
        <div className="min-h-screen bg-slate-50 pt-20 pb-10 px-4 md:px-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12 text-center animate-fade-in-up">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                    Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dream Career</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Explore high-paying roles in AI, ML, and Data Science. Get detailed roadmaps on how to crack them.
                </p>

                {/* Search Bar */}
                <div className="mt-8 relative max-w-xl mx-auto">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for roles, companies..."
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto mb-10 overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex gap-3 justify-center min-w-max">
                    {allDomains.map((domain, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedDomain(domain)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${selectedDomain === domain
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            {domain}
                        </button>
                    ))}
                </div>
            </div>

            {/* Job Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayJobs.map((job, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                        onClick={() => setSelectedJob(job)}
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>

                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.job_title}</h3>
                                <p className="text-sm text-slate-500 font-medium">{job.company || "Top Tech Co."}</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-xl font-bold text-blue-600">
                                {job.company ? job.company[0] : "T"}
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 relative z-10">
                            {job.package && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <DollarSign size={16} className="text-green-500" />
                                    <span>{job.package}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <MapPin size={16} className="text-red-400" />
                                <span>{job.location || "Remote / Hybrid"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Briefcase size={16} className="text-purple-400" />
                                <span>{job.domain}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                            <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                View Details <ChevronRight size={14} />
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {displayJobs.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No jobs found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
            )}

            {/* Job Details Modal */}
            {selectedJob && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up md:p-8 p-6 relative">
                        <button
                            onClick={() => setSelectedJob(null)}
                            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl font-bold text-blue-600 shrink-0">
                                {selectedJob.company ? selectedJob.company[0] : "T"}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedJob.job_title}</h2>
                                <h3 className="text-lg text-blue-600 font-medium mb-2">{selectedJob.company}</h3>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                                        {selectedJob.package}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                                        {selectedJob.location || "Remote"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h4 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
                                    <BookOpen size={20} className="text-indigo-500" />
                                    About the Role
                                </h4>
                                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    {selectedJob.description}
                                </p>
                            </div>

                            {selectedJob.how_to_get && (
                                <div>
                                    <h4 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
                                        <Briefcase size={20} className="text-indigo-500" />
                                        How to Get This Job
                                    </h4>
                                    <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                                        <ul className="space-y-3">
                                            {selectedJob.how_to_get.split('\n').map((step, idx) => (
                                                <li key={idx} className="flex gap-3 text-slate-700">
                                                    <span className="w-6 h-6 bg-indigo-200 text-indigo-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                                        {idx + 1}
                                                    </span>
                                                    <span>{step.replace(/^\d+\.\s*/, '')}</span>
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
                                    className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                                >
                                    Apply Now <ExternalLink size={18} />
                                </a>
                                <button className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
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
