// New Feature Imports
import JobRolePrediction from './components/pages/JobRolePrediction';
import SalaryPrediction from './components/pages/SalaryPrediction';
import DomainFitPrediction from './components/pages/DomainFitPrediction';
import SkillMatchPrediction from './components/pages/SkillMatchPrediction';
import ModelPredictionHub from './components/pages/ModelPredictionHub';

// Existing imports...
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import SkillAnalysis from './components/SkillAnalysis';
import AIRecommendations from './components/AIRecommendations';
import MarketTrends from './components/MarketTrends';
import AIPipelineViz from './components/AIPipelineViz';
import ProfileSummary from './components/dashboard/ProfileSummary';
import CareerFitRadar from './components/dashboard/CareerFitRadar';
import ProgressTracker from './components/dashboard/ProgressTracker';
import IndustryMatch from './components/dashboard/IndustryMatch';
import HelpPage from './components/pages/HelpPage';
import LandingPage from './components/pages/LandingPage';
import AboutPage from './components/pages/AboutPage';
import ResumeBuilder from './components/pages/ResumeBuilder';
import CodeEditor from './components/pages/CodeEditor';
import JobPreparation from './components/pages/JobPreparation';
import JobsPage from './components/pages/JobsPage';
import CareerRoadmap from './components/pages/CareerRoadmap';
import PlacementPrediction from './components/pages/PlacementPrediction'; // New Feature
import InterviewRoadmap from './components/pages/InterviewRoadmap';

import Footer from './components/Footer';
import VoiceAssistant from './components/VoiceAssistant';
import ChatBot from './components/ChatBot';
import { api } from './api/api';
import LoginPage from './components/pages/LoginPage';
import UserProfile from './components/UserProfile';

import { LayoutDashboard, Sparkles, BookOpen, Briefcase, ChevronRight, Github, Map, Menu, X, User, HelpCircle, Info, Code, ArrowRightLeft, TrendingUp, Cpu } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('home');

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setAnalysisData(null);
    setActiveView('home');
  };

  // If not logged in, show Login Page
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const handleAnalysis = async (resume, jd) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.analyzeFiles(resume, jd);
      setAnalysisData(data);
    } catch (err) {
      setError("Failed to analyze files. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Helper to render content based on active view
  const renderContent = () => {
    if (activeView === 'help') {
      return <HelpPage />;
    }
    if (activeView === 'about') {
      return <AboutPage />;
    }
    if (activeView === 'resume-builder') {
      return <ResumeBuilder />;
    }
    if (activeView === 'code-editor') {
      return <CodeEditor />;
    }
    if (activeView === 'jobs') {
      return <JobsPage />;
    }
    if (activeView === 'job-prep') {
      return <JobPreparation />;
    }
    if (activeView === 'interview-roadmap') {
      return <InterviewRoadmap />;
    }
    // New Feature: Career Roadmap
    if (activeView === 'career-roadmap') {
      return <CareerRoadmap />;
    }


    // --- Model Prediction Features ---
    if (activeView === 'model-prediction-hub') {
      return <ModelPredictionHub onNavigate={(view) => setActiveView(view)} />;
    }
    if (activeView === 'placement-prediction') {
      return <PlacementPrediction />;
    }
    if (activeView === 'job-role-prediction') {
      return <JobRolePrediction onBack={() => setActiveView('model-prediction-hub')} />;
    }
    if (activeView === 'salary-prediction') {
      return <SalaryPrediction onBack={() => setActiveView('model-prediction-hub')} />;
    }
    if (activeView === 'domain-fit-prediction') {
      return <DomainFitPrediction onBack={() => setActiveView('model-prediction-hub')} />;
    }
    if (activeView === 'skill-match-prediction') {
      return <SkillMatchPrediction onBack={() => setActiveView('model-prediction-hub')} />;
    }

    // Default Home View
    return (
      <div className="space-y-16 pb-20">

        {/* HERO SECTION */}
        {!analysisData && !isLoading && (
          <LandingPage onUploadFocus={() => document.getElementById('resume-upload')?.scrollIntoView({ behavior: 'smooth' })} />
        )}

        {/* UPLOAD SECTION (Centered below Hero) */}
        <div id="resume-upload" className={`transition-all duration-500 ${analysisData ? 'grid grid-cols-1 lg:grid-cols-12 gap-8' : 'max-w-4xl mx-auto'}`}>

          {/* Upload Component */}
          <div className={`${analysisData ? 'lg:col-span-4' : 'w-full'}`}>
            <FileUpload onUpload={handleAnalysis} isLoading={isLoading} />
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2 animate-enter">
                <span className="font-semibold">Error:</span> {error}
              </div>
            )}
          </div>

          {/* Results Section (Only visible when analysisData exists) */}
          {analysisData && (
            <div className="lg:col-span-8 space-y-8 animate-enter delay-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileSummary data={analysisData} />
                <CareerFitRadar />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2"><SkillAnalysis data={analysisData} /></div>
                <div><IndustryMatch /></div>
              </div>
              <AIRecommendations data={analysisData} />
              <div className="grid grid-cols-1 gap-6">
                <MarketTrends />
                <ProgressTracker />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-slate-100">
          <span className="font-bold text-xl text-slate-800">Menu</span>
          <button onClick={toggleSidebar} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-100px)]">
          <button onClick={() => { setActiveView('home'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${activeView === 'home' || activeView === 'dashboard' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
            <LayoutDashboard size={20} className={activeView === 'home' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Dashboard</span>
          </button>

          <button onClick={() => { setActiveView('jobs'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${activeView === 'jobs' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
            <Briefcase size={20} className={activeView === 'jobs' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Find Jobs</span>
          </button>

          <button onClick={() => { setActiveView('resume-builder'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${activeView === 'resume-builder' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
            <BookOpen size={20} className={activeView === 'resume-builder' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Resume Builder</span>
          </button>

          <button onClick={() => { setActiveView('code-editor'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${activeView === 'code-editor' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
            <Code size={20} className={activeView === 'code-editor' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Code Editor</span>
          </button>

          <button onClick={() => { setActiveView('job-prep'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${activeView === 'job-prep' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
            <BookOpen size={20} className={activeView === 'job-prep' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Job Prep</span>
          </button>

          <button onClick={() => { setActiveView('interview-roadmap'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${activeView === 'interview-roadmap' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
            <Map size={20} className={activeView === 'interview-roadmap' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Success Roadmap</span>
          </button>

          <button onClick={() => { setActiveView('career-roadmap'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${activeView === 'career-roadmap' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
            <Map size={20} className={activeView === 'career-roadmap' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Career Roadmap</span>
          </button>



          {/* Feature: Model Prediction (Group) */}
          <button onClick={() => { setActiveView('model-prediction-hub'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${activeView === 'model-prediction-hub' || activeView.includes('-prediction') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
            <Cpu size={20} className={activeView === 'model-prediction-hub' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Model Prediction</span>
          </button>
        </div>
      </div>

      {/* Navbar */}
      <nav className="glass-panel fixed w-full z-40 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Left: Hamburger & Logo */}
            <div className="flex items-center gap-4">
              <button onClick={toggleSidebar} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Menu size={24} />
              </button>

              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-lg text-white">
                  <Sparkles size={20} />
                </div>
                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 hidden sm:block">
                  Career<span className="text-slate-800">Mind</span>
                </span>
              </div>
            </div>

            {/* Right: Home, About, Help */}
            <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
              <button onClick={() => { setActiveView('home'); setAnalysisData(null); }} className={`hidden md:flex items-center gap-1 hover:text-indigo-600 transition-colors ${activeView === 'home' && !analysisData ? 'text-indigo-600 font-bold' : ''}`}>
                Home
              </button>
              <button onClick={() => setActiveView('about')} className={`hidden md:flex items-center gap-1 hover:text-indigo-600 transition-colors ${activeView === 'about' ? 'text-indigo-600 font-bold' : ''}`}>
                About
              </button>
              <button onClick={() => setActiveView('help')} className={`hidden md:flex items-center gap-1 hover:text-indigo-600 transition-colors ${activeView === 'help' ? 'text-indigo-600 font-bold' : ''}`}>
                Help
              </button>

              <div className="w-px h-6 bg-slate-200 mx-2 hidden md:block"></div>

              {/* User Profile Dropdown */}
              <UserProfile user={user} onLogout={handleLogout} />

            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {renderContent()}
      </div>

      {/* Footer */}
      <Footer onNavigate={(view) => { setActiveView(view); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

      {/* AI Voice Assistant */}
      <VoiceAssistant />

      {/* Smart Job Chatbot */}
      <ChatBot />
    </div>
  );
}

export default App;
