import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Sparkles,
  Bookmark,
  User,
  LayoutDashboard,
  Compass,
  BookOpen,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Layers,
  Database,
  ShieldAlert
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenAdminBridge?: () => void;
  onOpenAdminLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenAdminBridge,
  onOpenAdminLogin,
}) => {
  const { user, profile, savedScholarshipIds, logout, isAdmin, adminUser, logoutAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Compute profile completion percentage
  const calculateCompletion = () => {
    let score = 0;
    if (profile.fullName && profile.nationality) score += 20;
    if (profile.highestCompletedEducation && profile.majorFieldOfStudy) score += 20;
    if (profile.cgpa > 0) score += 20;
    if (profile.ieltsStatus) score += 15;
    if (profile.preferredCountries?.length > 0 && profile.preferredDegreeLevel) score += 15;
    if (profile.workExperienceYears !== undefined || profile.researchExperience) score += 10;
    return Math.min(100, score);
  };

  const completionPercent = calculateCompletion();

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">GlobalScholar</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                  AI
                </span>
              </div>
              <span className="text-[11px] text-slate-500 hidden sm:block">
                International Scholarship Finder
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'home'
                  ? 'text-blue-700 bg-blue-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('explore')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'explore'
                  ? 'text-blue-700 bg-blue-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore Scholarships
            </button>
            <button
              onClick={() => handleNavClick('guidelines')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'guidelines'
                  ? 'text-blue-700 bg-blue-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Guidelines
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'about'
                  ? 'text-blue-700 bg-blue-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              About Us
            </button>

            {/* Authenticated Links */}
            {user && (
              <>
                <div className="h-4 w-px bg-slate-200 mx-1" />
                <button
                  onClick={() => handleNavClick('ai-search')}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    currentView === 'ai-search'
                      ? 'text-indigo-700 bg-indigo-50 font-bold border border-indigo-200'
                      : 'text-indigo-600 hover:bg-indigo-50/60'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                  AI Scholarship Search
                </button>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    currentView === 'dashboard'
                      ? 'text-blue-700 bg-blue-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavClick('saved')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 relative ${
                    currentView === 'saved'
                      ? 'text-blue-700 bg-blue-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  Saved
                  {savedScholarshipIds.length > 0 && (
                    <span className="ml-1 text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-blue-600 text-white leading-none">
                      {savedScholarshipIds.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleNavClick('tracker')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    currentView === 'tracker'
                      ? 'text-blue-700 bg-blue-50/70 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Tracker
                </button>
              </>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Admin Suite Button (If authenticated as admin) */}
            {isAdmin ? (
              <button
                onClick={() => handleNavClick('admin')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                  currentView === 'admin'
                    ? 'bg-amber-400 text-slate-950 font-extrabold shadow'
                    : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Admin Suite</span>
              </button>
            ) : onOpenAdminLogin ? (
              <button
                onClick={onOpenAdminLogin}
                title="Admin Portal Login (qulli)"
                className="text-slate-500 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
              >
                <ShieldAlert className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-600 hidden xl:inline">Admin</span>
              </button>
            ) : null}

            {/* Admin bridge trigger for verifying database */}
            {onOpenAdminBridge && (
              <button
                onClick={onOpenAdminBridge}
                title="Inspect verified scholarships database"
                className="text-slate-500 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
              >
                <Database className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-600 hidden xl:inline">DB View</span>
              </button>
            )}

            {!user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all hover:shadow hover:shadow-blue-600/20"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Profile {completionPercent}%
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                      {/* Mini progress bar */}
                      <div className="mt-2">
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>Profile strength</span>
                          <span className="font-semibold text-blue-600">{completionPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${completionPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Student Dashboard
                      </button>
                      <button
                        onClick={() => handleNavClick('profile')}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile & Qualifications
                      </button>
                      <button
                        onClick={() => handleNavClick('ai-search')}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-indigo-700 hover:bg-indigo-50/60 flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        AI Scholarship Search
                      </button>
                      <button
                        onClick={() => handleNavClick('saved')}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Bookmark className="w-4 h-4 text-slate-400" />
                        Saved Scholarships ({savedScholarshipIds.length})
                      </button>
                      <button
                        onClick={() => handleNavClick('tracker')}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Layers className="w-4 h-4 text-slate-400" />
                        Application Tracker
                      </button>
                      <button
                        onClick={() => handleNavClick('onboarding')}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        Profile Setup Wizard
                      </button>

                      {isAdmin ? (
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full px-4 py-2 text-left text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center gap-2"
                        >
                          <ShieldAlert className="w-4 h-4 text-amber-600" />
                          Administrator Control Suite
                        </button>
                      ) : onOpenAdminLogin ? (
                        <button
                          onClick={() => {
                            onOpenAdminLogin();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <ShieldAlert className="w-4 h-4 text-slate-400" />
                          Admin Login (qulli)
                        </button>
                      ) : null}
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {!user ? (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-md"
              >
                Dashboard
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {user && (
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                Profile {completionPercent}%
              </span>
            </div>
          )}

          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('explore')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-slate-400" />
              Explore Scholarships
            </button>
            <button
              onClick={() => handleNavClick('guidelines')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              Scholarship Guidelines
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              About Us
            </button>

            {user ? (
              <>
                <div className="h-px bg-slate-100 my-2" />
                <button
                  onClick={() => handleNavClick('ai-search')}
                  className="w-full text-left px-3 py-2 text-sm font-bold text-indigo-700 bg-indigo-50/70 rounded-lg flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  AI Scholarship Search
                </button>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavClick('profile')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  My Profile
                </button>
                <button
                  onClick={() => handleNavClick('saved')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-slate-400" />
                    Saved Scholarships
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                    {savedScholarshipIds.length}
                  </span>
                </button>
                <button
                  onClick={() => handleNavClick('tracker')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-slate-400" />
                  Application Tracker
                </button>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm"
                >
                  Sign Up for Free
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
