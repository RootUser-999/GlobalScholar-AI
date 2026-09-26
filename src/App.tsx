import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { AISearchView } from './components/AISearchView';
import { GuidelinesSection } from './components/GuidelinesSection';
import { AboutView } from './components/AboutView';
import { DashboardView } from './components/DashboardView';
import { ProfileView } from './components/ProfileView';
import { OnboardingWizard } from './components/OnboardingWizard';
import { SavedScholarshipsView } from './components/SavedScholarshipsView';
import { ApplicationTrackerView } from './components/ApplicationTrackerView';
import { ScholarshipDetailModal } from './components/ScholarshipDetailModal';
import { AuthModals } from './components/AuthModals';
import { AdminBridgeModal } from './components/AdminBridgeModal';
import { LegalModals } from './components/LegalModals';
import { Scholarship } from './types';
import { VERIFIED_SCHOLARSHIPS } from './data/scholarships';

function AppContent() {
  const { user, profile, addTrackedApplication } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');

  // Modals state
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);
  const [adminBridgeOpen, setAdminBridgeOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  const handleNavigate = (view: string) => {
    // If user clicks dashboard/profile without being logged in, prompt login
    if ((view === 'dashboard' || view === 'profile' || view === 'tracker') && !user) {
      setAuthModalMode('login');
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchFromHome = (query: string) => {
    setSearchInitialQuery(query);
    setCurrentView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToTracker = async (scholarship: Scholarship) => {
    if (!user) {
      setAuthModalMode('login');
      return;
    }
    await addTrackedApplication({
      scholarshipId: scholarship.id,
      scholarshipTitle: scholarship.title,
      provider: scholarship.provider,
      country: scholarship.country,
      status: 'Interested',
      targetDegree: profile.preferredDegreeLevel || 'Masters',
      submissionDeadline: scholarship.deadlineDate,
      officialUrl: scholarship.officialUrl,
    });
    // Navigate to tracker so the student can customize their notes
    setCurrentView('tracker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={(mode) => setAuthModalMode(mode)}
        onOpenAdminBridge={() => setAdminBridgeOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onSearch={handleSearchFromHome}
            onExplore={() => handleNavigate('explore')}
            onOpenWizard={() => handleNavigate(user ? 'onboarding' : 'profile')}
            onSelectScholarship={(s) => setSelectedScholarship(s)}
            onOpenAuth={(mode) => setAuthModalMode(mode)}
          />
        )}

        {currentView === 'explore' && (
          <ExploreView
            initialQuery={searchInitialQuery}
            onSelectScholarship={(s) => setSelectedScholarship(s)}
            onAddToTracker={handleAddToTracker}
          />
        )}

        {currentView === 'ai-search' && (
          <AISearchView
            onSelectScholarship={(s) => setSelectedScholarship(s)}
            onAddToTracker={handleAddToTracker}
          />
        )}

        {currentView === 'guidelines' && (
          <div className="py-8">
            <GuidelinesSection
              onStartMatching={() => handleNavigate(user ? 'ai-search' : 'onboarding')}
            />
          </div>
        )}

        {currentView === 'about' && (
          <AboutView
            onStartSearch={() => handleNavigate('ai-search')}
            onExplore={() => handleNavigate('explore')}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            onNavigate={handleNavigate}
            onSelectScholarship={(s) => setSelectedScholarship(s)}
            onAddToTracker={handleAddToTracker}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            onNavigateToAiSearch={() => handleNavigate('ai-search')}
            onOpenWizard={() => handleNavigate('onboarding')}
          />
        )}

        {currentView === 'onboarding' && (
          <OnboardingWizard
            onComplete={() => handleNavigate('dashboard')}
            onCancel={() => handleNavigate('home')}
          />
        )}

        {currentView === 'saved' && (
          <SavedScholarshipsView
            onExplore={() => handleNavigate('explore')}
            onSelectScholarship={(s) => setSelectedScholarship(s)}
            onAddToTracker={handleAddToTracker}
          />
        )}

        {currentView === 'tracker' && (
          <ApplicationTrackerView
            onExploreScholarships={() => handleNavigate('explore')}
            onOpenDetails={(id) => {
              const found = VERIFIED_SCHOLARSHIPS.find((s) => s.id === id);
              if (found) setSelectedScholarship(found);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPolicy={(type) => setLegalModalType(type)}
      />

      {/* Global Modals */}
      <ScholarshipDetailModal
        scholarship={selectedScholarship}
        onClose={() => setSelectedScholarship(null)}
        onAddToTracker={handleAddToTracker}
      />

      <AuthModals
        mode={authModalMode}
        onClose={() => setAuthModalMode(null)}
        onSuccess={() => {
          setAuthModalMode(null);
          // If profile onboarding is incomplete, navigate to onboarding, otherwise dashboard
          if (!profile.onboardingCompleted) {
            setCurrentView('onboarding');
          } else {
            setCurrentView('dashboard');
          }
        }}
        onSwitchMode={(mode) => setAuthModalMode(mode)}
      />

      {adminBridgeOpen && (
        <AdminBridgeModal onClose={() => setAdminBridgeOpen(false)} />
      )}

      <LegalModals
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
