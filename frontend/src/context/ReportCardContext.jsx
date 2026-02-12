import React, { createContext, useState, useContext, useEffect } from 'react';

const ReportCardContext = createContext();

export const useReportCard = () => useContext(ReportCardContext);

export const ReportCardProvider = ({ children }) => {
    // Initial State Structure
    const initialState = {
        jobs: { visited: false, data: null },
        resume: { visited: false, data: null },
        job_prep: { visited: false, data: null },
        success_roadmap: { visited: false, data: null },
        career_roadmap: { visited: false, data: null },
        company_prep: { visited: false, data: null },
        prediction: { visited: false, data: null },
    };

    const [reportData, setReportData] = useState(() => {
        try {
            const saved = localStorage.getItem('career_report_card');
            return saved ? JSON.parse(saved) : initialState;
        } catch (e) {
            return initialState;
        }
    });

    useEffect(() => {
        localStorage.setItem('career_report_card', JSON.stringify(reportData));
    }, [reportData]);

    const markFeatureUsed = (feature, data = null) => {
        setReportData(prev => {
            // Only update if not already visited OR if new data is provided/better
            // if (prev[feature]?.visited && !data) return prev; // Commented out to allow timestamp updates on re-use

            return {
                ...prev,
                [feature]: {
                    visited: true,
                    data: data || prev[feature].data || "Used",
                    last_run: new Date().toISOString(), // Add timestamp
                    status: "Completed"
                }
            };
        });
    };

    const getProgress = () => {
        const total = Object.keys(reportData).length;
        const completed = Object.values(reportData).filter(f => f.visited).length;
        return { completed, total, percentage: Math.round((completed / total) * 100) };
    };

    return (
        <ReportCardContext.Provider value={{ reportData, markFeatureUsed, getProgress }}>
            {children}
        </ReportCardContext.Provider>
    );
};
