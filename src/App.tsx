import React, { useState, useEffect } from 'react';
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
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { Scholarship } from './types';
import { VERIFIED_SCHOLARSHIPS } from './data/scholarships';
import { ShieldAlert } from 'lucide-react';

function AppContent() {
  const { user, profile, addTrackedApplication, isAdmin, adminUser, logoutAdmin } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');

  // Modals state
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);
  const [adminBridgeOpen, setAdminBridgeOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // URL route handling for /admin and /admin/login
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin/login' || hash === '#admin/login') {
        setAdminLoginOpen(true);
      } else if (path === '/admin' || hash === '#admin') {
        if (isAdmin) {
          setCurrentView('admin');
        } else {
          setAdminLoginOpen(true);
        }
      }
    };
    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, [isAdmin]);

  const handleNavigate = (view: string) => {
    if (view === 'admin') {
      if (isAdmin) {
        setCurrentView('admin');
        window.history.pushState(null, '', '/admin');
      } else {
        setAdminLoginOpen(true);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // If user clicks dashboard/profile without being logged in, prompt login
    if ((view === 'dashboard' || view === 'profile' || view === 'tracker') && !user) {
      setAuthModalMode('login');
      return;
    }
    setCurrentView(view);
    if (view === 'home') {
      window.history.pushState(null, '', '/');
    }
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
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
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

        {currentView === 'admin' && (
          isAdmin ? (
            <AdminPanel
              onBackToStudentView={() => handleNavigate(user ? 'dashboard' : 'home')}
              onRefreshScholarships={() => {
                // Background sync
              }}
            />
          ) : (
            <div className="py-24 max-w-md mx-auto px-4 text-center space-y-6 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10 border border-amber-200">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Protected System Route
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Administrator Authentication Required
                </h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  The admin console provides real-time access to student records, live scholarship catalog CRUD, and Express server logs. Please sign in with administrator credentials.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 shadow-sm font-mono text-[11px] space-y-1">
                <p className="font-sans font-bold text-slate-700">Hardcoded Administrator Credentials:</p>
                <p>Username: <strong className="text-slate-900">qulli</strong> · Password: <strong className="text-slate-900">qulli</strong></p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <button
                  onClick={() => setAdminLoginOpen(true)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Authenticate Admin</span>
                </button>
                <button
                  onClick={() => handleNavigate('home')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPolicy={(type) => setLegalModalType(type)}
        onOpenAdmin={() => {
          if (isAdmin) {
            handleNavigate('admin');
          } else {
            setAdminLoginOpen(true);
          }
        }}
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

      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onSuccess={() => {
          setAdminLoginOpen(false);
          setCurrentView('admin');
          window.history.pushState(null, '', '/admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
