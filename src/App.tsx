import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CommandPalette } from './components/CommandPalette';
import { ScoreBreakdownModal } from './components/ScoreBreakdownModal';
import { AIApplicationDrawer } from './components/AIApplicationDrawer';
import { JobDetailsModal } from './components/JobDetailsModal';
import { CoverLetterModal } from './components/CoverLetterModal';
import { ResumeReshapeModal } from './components/ResumeReshapeModal';
import { Micro1ResearchModal } from './components/Micro1ResearchModal';
import { OpenTrainResearchModal } from './components/OpenTrainResearchModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PlanUpgradeModal } from './components/PlanUpgradeModal';
import { ExploreResumeMatcherModal } from './components/ExploreResumeMatcherModal';
import { ApplyIntelligenceModal } from './components/ApplyIntelligenceModal';
import { TaskPlatformIntelligenceModal } from './components/TaskPlatformIntelligenceModal';
import { AITaskAssistantModal } from './components/AITaskAssistantModal';
import { JobCategorySidebar } from './components/JobCategorySidebar';
import { AppSidebar } from './components/AppSidebar';
import { PostJobModal } from './components/PostJobModal';
import { EmailAlertModal } from './components/EmailAlertModal';

// Views
import { DiscoverView } from './views/DiscoverView';
import { EarnPlatformsView } from './views/EarnPlatformsView';
import { AIWorkView } from './views/AIWorkView';
import { BountiesView } from './views/BountiesView';
import { BeginnerHubView } from './views/BeginnerHubView';
import { ResumeAnalyzerView } from './views/ResumeAnalyzerView';
import { CareerRoadmapView } from './views/CareerRoadmapView';
import { MarketIntelligenceView } from './views/MarketIntelligenceView';
import { CareerPlaybookView } from './views/CareerPlaybookView';
import { ConnectorHealthView } from './views/ConnectorHealthView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { PricingView } from './views/PricingView';
import { SavedJobsView } from './views/SavedJobsView';
import { LandingPageView } from './views/LandingPageView';
import { SettingsView } from './views/SettingsView';
import { AuthView } from './views/AuthView';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    selectedJobForScoreBreakdown, 
    setSelectedJobForScoreBreakdown,
    selectedJobForDetails,
    setSelectedJobForDetails,
    selectedJobForPitch,
    setSelectedJobForPitch,
    isCoverLetterModalOpen,
    setIsCoverLetterModalOpen,
    selectedJobForCoverLetter,
    selectedJobForResumeReshape,
    setSelectedJobForResumeReshape,
    isResumeReshapeModalOpen,
    setIsResumeReshapeModalOpen,
    isMicro1ResearchModalOpen,
    setIsMicro1ResearchModalOpen,
    isOpenTrainResearchModalOpen,
    setIsOpenTrainResearchModalOpen,
    isTaskIntelligenceModalOpen,
    closeTaskPlatformIntelligence,
    selectedPlatformForIntelligence,
    isTaskAssistantModalOpen,
    closeTaskAssistant,
    selectedTaskForAssistant,
    taskAssistantInitialTab,
    isSidebarOpen,
    setIsSidebarOpen
  } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'discover':
        return <DiscoverView />;
      case 'earn':
      case 'platforms':
        return <EarnPlatformsView />;
      case 'aiwork':
        return <AIWorkView />;
      case 'bounties':
        return <BountiesView />;
      case 'beginner':
      case 'beginner_hub':
        return <BeginnerHubView />;
      case 'resume':
        return <ResumeAnalyzerView />;
      case 'roadmap':
        return <CareerRoadmapView />;
      case 'market':
      case 'trends':
        return <MarketIntelligenceView />;
      case 'playbook':
        return <CareerPlaybookView />;
      case 'connector_health':
      case 'connectors':
        return <ConnectorHealthView />;
      case 'admin':
        return <AdminDashboardView />;
      case 'pricing':
        return <PricingView />;
      case 'saved':
        return <SavedJobsView />;
      case 'settings':
      case 'skills_sync':
        return <SettingsView />;
      case 'auth':
      case 'signin':
        return <AuthView initialMode="signin" />;
      case 'signup':
        return <AuthView initialMode="signup" />;
      case 'landing':
      case 'home':
        return <LandingPageView />;
      default:
        return <DiscoverView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1A1A1A] flex flex-col font-sans w-full max-w-full overflow-x-hidden selection:bg-[#D84315]/20 selection:text-[#D84315]">
      
      {/* Top Main Navigation */}
      <Navbar />

      {/* Main Container Layout */}
      {activeTab === 'landing' ? (
        <main className="flex-1 w-full mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-28 md:pb-12 overflow-x-hidden">
          {renderActiveView()}
        </main>
      ) : activeTab === 'discover' ? (
        <div className="flex-1 flex w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 gap-4 xl:gap-6 pt-3 sm:pt-5 pb-28 md:pb-12 overflow-x-hidden">
          {/* Job Category Sidebar - specifically for search & filter catalog */}
          <JobCategorySidebar />

          {/* Active View Container */}
          <main className="flex-1 min-w-0 max-w-full overflow-x-hidden">
            {renderActiveView()}
          </main>
        </div>
      ) : (
        <div className="flex-1 w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-28 md:pb-12 overflow-x-hidden">
          <main className="w-full">
            {renderActiveView()}
          </main>
        </div>
      )}

      {/* Application Navigation Sidebar Drawer */}
      <AppSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Modals and Drawers */}
      <CommandPalette />
      <OnboardingModal />
      <PlanUpgradeModal />
      <ExploreResumeMatcherModal />

      {/* AI Pitch Drawer */}
      {selectedJobForPitch && (
        <AIApplicationDrawer
          job={selectedJobForPitch}
          onClose={() => setSelectedJobForPitch(null)}
        />
      )}

      {/* Personalized Cover Letter Modal */}
      {isCoverLetterModalOpen && (
        <CoverLetterModal
          job={selectedJobForCoverLetter}
          onClose={() => setIsCoverLetterModalOpen(false)}
        />
      )}

      {/* AI Resume Reshaper & Rewriter Modal */}
      {isResumeReshapeModalOpen && selectedJobForResumeReshape && (
        <ResumeReshapeModal
          job={selectedJobForResumeReshape}
          onClose={() => {
            setIsResumeReshapeModalOpen(false);
            setSelectedJobForResumeReshape(null);
          }}
        />
      )}

      {/* Micro1 Deep Research & Ingestion Results Modal */}
      <Micro1ResearchModal
        isOpen={isMicro1ResearchModalOpen}
        onClose={() => setIsMicro1ResearchModalOpen(false)}
      />

      {/* OpenTrain AI Deep Research & Opportunities Modal */}
      <OpenTrainResearchModal
        isOpen={isOpenTrainResearchModalOpen}
        onClose={() => setIsOpenTrainResearchModalOpen(false)}
      />

      {/* Task & Freelance Platform AI Intelligence & First-Dollar Roadmap Modal */}
      <TaskPlatformIntelligenceModal
        isOpen={isTaskIntelligenceModalOpen}
        onClose={closeTaskPlatformIntelligence}
        platformData={selectedPlatformForIntelligence}
      />

      {/* AI Task Assistant Modal: Analyze Task, Help Complete Task, Ask AI About Task */}
      <AITaskAssistantModal
        isOpen={isTaskAssistantModalOpen}
        onClose={closeTaskAssistant}
        taskData={selectedTaskForAssistant}
        initialTab={taskAssistantInitialTab}
      />

      {/* Score Breakdown Modal */}
      {selectedJobForScoreBreakdown && (
        <ScoreBreakdownModal
          job={selectedJobForScoreBreakdown}
          onClose={() => setSelectedJobForScoreBreakdown(null)}
        />
      )}

      {/* Full Job Details Modal */}
      {selectedJobForDetails && (
        <JobDetailsModal
          job={selectedJobForDetails}
          onClose={() => setSelectedJobForDetails(null)}
        />
      )}

      {/* Application Readiness, Job Info & Question Suggestions Modal */}
      <ApplyIntelligenceModal />

      {/* Post a Remote Job Modal (Employers) */}
      <PostJobModal />

      {/* Free Remote Job Email Alerts Modal (Talent) */}
      <EmailAlertModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
