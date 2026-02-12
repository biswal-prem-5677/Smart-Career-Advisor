import React, { useState, lazy, Suspense } from 'react';
import FileUpload from './components/FileUpload';
import SkillAnalysis from './components/SkillAnalysis';
import AIRecommendations from './components/AIRecommendations';
import MarketTrends from './components/MarketTrends';
import AIPipelineViz from './components/AIPipelineViz';
import ProfileSummary from './components/dashboard/ProfileSummary';
import CareerFitRadar from './components/dashboard/CareerFitRadar';
import ProgressTracker from './components/dashboard/ProgressTracker';
import IndustryMatch from './components/dashboard/IndustryMatch';

// Lazy load page components for better performance
const HelpPage = lazy(() => import('./components/pages/HelpPage'));
import LandingPage from './components/pages/LandingPage';
const AboutPage = lazy(() => import('./components/pages/AboutPage'));
const ResumeBuilder = lazy(() => import('./components/pages/ResumeBuilder'));
const JobPreparation = lazy(() => import('./components/pages/JobPreparation'));
const JobsPage = lazy(() => import('./components/pages/JobsPage'));
const CareerRoadmap = lazy(() => import('./components/pages/CareerRoadmap'));
const PlacementPrediction = lazy(() => import('./components/pages/PlacementPrediction'));
const InterviewRoadmap = lazy(() => import('./components/pages/InterviewRoadmap'));
const CompanyPreparation = lazy(() => import('./components/pages/CompanyPreparation'));
const JobRolePrediction = lazy(() => import('./components/pages/JobRolePrediction'));
const SalaryPrediction = lazy(() => import('./components/pages/SalaryPrediction'));
const DomainFitPrediction = lazy(() => import('./components/pages/DomainFitPrediction'));
const SkillMatchPrediction = lazy(() => import('./components/pages/SkillMatchPrediction'));
const ModelPredictionHub = lazy(() => import('./components/pages/ModelPredictionHub'));
const ReportCard = lazy(() => import('./components/pages/ReportCard'));
const HREmailGenerator = lazy(() => import('./components/pages/HREmailGenerator'));

import Footer from './components/Footer';
import VoiceAssistant from './components/VoiceAssistant';
import ChatBot from './components/ChatBot';
import { api } from './api/api';
import LoginPage from './components/pages/LoginPage';
import UserProfile from './components/UserProfile';

// Visual Effects
import { VisualEffectsProvider, useVisualEffects } from './context/VisualEffectsContext';
import { ReportCardProvider } from './context/ReportCardContext';
import Snowfall from './components/effects/Snowfall';
import AntiGravityCursor from './components/effects/AntiGravityCursor';

import { LayoutDashboard, Sparkles, BookOpen, Briefcase, ChevronRight, Github, Map, Menu, X, User, HelpCircle, Info, Code, ArrowRightLeft, TrendingUp, Cpu, Building2, Settings, ClipboardList } from 'lucide-react';

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-400 font-medium">Loading...</p>
    </div>
  </div>
);

// Main App Structure Wrapper for Context
function App() {
  return (
    <VisualEffectsProvider>
      <ReportCardProvider>
        <MainApp />
      </ReportCardProvider>
    </VisualEffectsProvider>
  );
}

function MainApp() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error("Failed to parse stored user:", e);
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('user') !== null;
  });

  const { isSnowing, isAntiGravity } = useVisualEffects();

  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setAnalysisData(null);
    setCurrentView('home');
    localStorage.removeItem('user');
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

  // Helper to render content based on current view
  const renderContent = () => {
    if (currentView === 'help') return <Suspense fallback={<PageLoader />}><HelpPage /></Suspense>;
    if (currentView === 'about') return <Suspense fallback={<PageLoader />}><AboutPage /></Suspense>;
    if (currentView === 'resume-builder') return <Suspense fallback={<PageLoader />}><ResumeBuilder /></Suspense>;
    if (currentView === 'jobs') return <Suspense fallback={<PageLoader />}><JobsPage /></Suspense>;
    if (currentView === 'job-prep') return <Suspense fallback={<PageLoader />}><JobPreparation /></Suspense>;
    if (currentView === 'interview-roadmap') return <Suspense fallback={<PageLoader />}><InterviewRoadmap /></Suspense>;
    if (currentView === 'career-roadmap') return <Suspense fallback={<PageLoader />}><CareerRoadmap /></Suspense>;
    if (currentView === 'company-prep') return <Suspense fallback={<PageLoader />}><CompanyPreparation /></Suspense>;
    if (currentView === 'report-card') return <Suspense fallback={<PageLoader />}><ReportCard /></Suspense>;
    if (currentView === 'hr-emailer') return <Suspense fallback={<PageLoader />}><HREmailGenerator /></Suspense>;

    if (currentView === 'model-prediction-hub') return <Suspense fallback={<PageLoader />}><ModelPredictionHub onNavigate={(view) => setCurrentView(view)} /></Suspense>;
    if (currentView === 'placement-prediction') return <Suspense fallback={<PageLoader />}><PlacementPrediction /></Suspense>;
    if (currentView === 'job-role-prediction') return <Suspense fallback={<PageLoader />}><JobRolePrediction onBack={() => setCurrentView('model-prediction-hub')} /></Suspense>;
    if (currentView === 'salary-prediction') return <Suspense fallback={<PageLoader />}><SalaryPrediction onBack={() => setCurrentView('model-prediction-hub')} /></Suspense>;
    if (currentView === 'domain-fit-prediction') return <Suspense fallback={<PageLoader />}><DomainFitPrediction onBack={() => setCurrentView('model-prediction-hub')} /></Suspense>;
    if (currentView === 'skill-match-prediction') return <Suspense fallback={<PageLoader />}><SkillMatchPrediction onBack={() => setCurrentView('model-prediction-hub')} /></Suspense>;

    // Default Home View
    return (
      <div className="space-y-16 pb-20">
        {!analysisData && !isLoading && (
          <LandingPage onNavigate={(view) => setCurrentView(view)} onUploadFocus={() => document.getElementById('resume-upload')?.scrollIntoView({ behavior: 'smooth' })} />
        )}
        <div id="resume-upload" className={`transition-all duration-500 ${analysisData ? 'grid grid-cols-1 lg:grid-cols-12 gap-8' : 'max-w-4xl mx-auto'}`}>
          <div className={`${analysisData ? 'lg:col-span-4' : 'w-full'}`}>
            <FileUpload onUpload={handleAnalysis} isLoading={isLoading} />
            {error && <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
          </div>
          {analysisData && (
            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileSummary data={analysisData} user={user} />
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
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">

      {/* Visual Effects */}
      {isSnowing && <Snowfall />}
      {isAntiGravity && <AntiGravityCursor />}

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar Drawer */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-slate-800">
          <span className="font-bold text-xl text-white">Menu</span>
          <button onClick={toggleSidebar} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-100px)]">
          <button onClick={() => { setCurrentView('home'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentView === 'home' || currentView === 'dashboard' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20} className={currentView === 'home' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Dashboard</span>
          </button>

          <button onClick={() => { setCurrentView('jobs'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentView === 'jobs' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Briefcase size={20} className={currentView === 'jobs' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Find Jobs</span>
          </button>

          <button onClick={() => { setCurrentView('resume-builder'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentView === 'resume-builder' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <BookOpen size={20} className={currentView === 'resume-builder' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Resume Builder</span>
          </button>



          <button onClick={() => { setCurrentView('job-prep'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentView === 'job-prep' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <BookOpen size={20} className={currentView === 'job-prep' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Job Prep</span>
          </button>

          <button onClick={() => { setCurrentView('interview-roadmap'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentView === 'interview-roadmap' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Map size={20} className={currentView === 'interview-roadmap' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Success Roadmap</span>
          </button>

          <button onClick={() => { setCurrentView('career-roadmap'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentView === 'career-roadmap' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Map size={20} className={currentView === 'career-roadmap' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Career Roadmap</span>
          </button>

          <button onClick={() => { setCurrentView('company-prep'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentView === 'company-prep' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Building2 size={20} className={currentView === 'company-prep' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Company Prep</span>
          </button>



          {/* Feature: Model Prediction (Group) */}
          <button onClick={() => { setCurrentView('model-prediction-hub'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentView === 'model-prediction-hub' || currentView.includes('-prediction') ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Cpu size={20} className={currentView === 'model-prediction-hub' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Model Prediction</span>
          </button>

          {/* Feature: Report Card (New) */}
          <button onClick={() => { setCurrentView('report-card'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentView === 'report-card' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <ClipboardList size={20} className={currentView === 'report-card' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Report Card</span>
          </button>

          {/* Feature: Auto Mate Mail (HR Emailer) */}
          <button onClick={() => { setCurrentView('hr-emailer'); toggleSidebar(); }} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentView === 'hr-emailer' ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Sparkles size={20} className={currentView === 'hr-emailer' ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            <span className="font-medium">Auto Mate Mail</span>
          </button>
        </div>
      </div>

      {/* Navbar */}
      <nav className="glass-panel fixed w-full z-40 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Left: Hamburger & Logo */}
            <div className="flex items-center gap-4">
              <button onClick={toggleSidebar} className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">
                <Menu size={24} />
              </button>

              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-lg text-white">
                  <Sparkles size={20} />
                </div>
                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 hidden sm:block">
                  Career<span className="text-white">Mind</span>
                </span>
              </div>
            </div>

            {/* Right: Home, About, Help */}
            <div className="flex items-center gap-6 text-sm font-medium text-slate-300">
              <button onClick={() => { setCurrentView('home'); setAnalysisData(null); }} className={`hidden md:flex items-center gap-1 hover:text-indigo-400 transition-colors ${currentView === 'home' && !analysisData ? 'text-indigo-400 font-bold' : ''}`}>
                Home
              </button>
              <button onClick={() => setCurrentView('about')} className={`hidden md:flex items-center gap-1 hover:text-indigo-400 transition-colors ${currentView === 'about' ? 'text-indigo-400 font-bold' : ''}`}>
                About
              </button>
              <button onClick={() => setCurrentView('help')} className={`hidden md:flex items-center gap-1 hover:text-indigo-400 transition-colors ${currentView === 'help' ? 'text-indigo-400 font-bold' : ''}`}>
                Help
              </button>

              <div className="w-px h-6 bg-slate-700 mx-2 hidden md:block"></div>

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
      <Footer onNavigate={(view) => { setCurrentView(view); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

      {/* AI Voice Assistant */}
      <VoiceAssistant />

      {/* Smart Job Chatbot */}
      <ChatBot />
    </div >
  );
}

export default App;
