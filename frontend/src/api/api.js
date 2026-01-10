import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const analyzeFiles = async (resumeFile, jdFile) => {
    const formData = new FormData();
    if (resumeFile) {
        formData.append('resume', resumeFile);
    }
    formData.append('jd', jdFile);

    const response = await axios.post(`${API_BASE_URL}/analyze-files`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

const enhanceResume = async (resumeText, jdText, missingSkills) => {
    const response = await axios.post(`${API_BASE_URL}/enhance-resume`, {
        resume_text: resumeText,
        jd_text: jdText,
        missing_skills: missingSkills,
    });
    return response.data;
};

const generateProjectIdeas = async (resumeText, resumeSkills) => {
    const response = await axios.post(`${API_BASE_URL}/project-ideas`, {
        resume_text: resumeText,
        resume_skills: resumeSkills,
    });
    return response.data;
};

const generateQuestions = async (jdText) => {
    const response = await axios.post(`${API_BASE_URL}/resume/questions`, {
        jd_text: jdText
    });
    return response.data;
};

const generateResume = async (data) => {
    const response = await axios.post(`${API_BASE_URL}/resume/generate`, data);
    return response.data;
};

// Export as an object to match component usage
export const api = {
    analyzeFiles,
    enhanceResume,
    generateProjectIdeas,
    generateQuestions,
    generateResume
};
