import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Scholarship, TrackedApplication } from '../types';
import { VERIFIED_SCHOLARSHIPS } from '../data/scholarships';
import { evaluateEligibility } from '../utils/eligibility';
import { ScholarshipCard } from './ScholarshipCard';
import {
  Sparkles,
  Bookmark,
  Layers,
  Calendar,
  Clock,
  ArrowRight,
  User,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onSelectScholarship: (scholarship: Scholarship) => void;
  onAddToTracker: (scholarship: Scholarship) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectScholarship,
  onAddToTracker,
}) => {
  const { user, profile, savedScholarshipIds, trackedApplications, toggleSaveScholarship } = useAuth();

  // Profile completion calculation
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

  const completion = calculateCompletion();

  // Compute matched scholarships with score
  const matchedScholarships = VERIFIED_SCHOLARSHIPS.map((s) => {
    const evalRes = evaluateEligibility(s, profile);
    return {
      ...s,
      matchScore: evalRes.score,
      matchStatus: evalRes.status,
      matchReason: evalRes.summary,
    };
  })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 4);

  // Saved scholarship objects
  const savedScholarships = VERIFIED_SCHOLARSHIPS.filter((s) =>
    savedScholarshipIds.includes(s.id)
  );

  // Group applications by status
  const statusCounts = {
    Interested: trackedApplications.filter((t) => t.status === 'Interested').length,
    'Preparing Documents': trackedApplications.filter((t) => t.status === 'Preparing Documents').length,
    'Ready to Apply': trackedApplications.filter((t) => t.status === 'Ready to Apply').length,
    Applied: trackedApplications.filter((t) => t.status === 'Applied').length,
    Accepted: trackedApplications.filter((t) => t.status === 'Accepted').length,
    Rejected: trackedApplications.filter((t) => t.status === 'Rejected').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Overview Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Personalized Student Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || profile.fullName || 'Scholar'}!
          </h1>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
            Your candidate profile is calibrated for <strong>{profile.preferredDegreeLevel || 'Masters'}</strong> programs in {profile.preferredCountries?.slice(0, 3).join(', ') || 'Europe & Worldwide'}.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('ai-search')}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Launch AI Scholarship Search</span>
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-colors flex items-center gap-1.5"
            >
              <User className="w-4 h-4" />
              <span>Edit My Profile</span>
            </button>
          </div>
        </div>

        {/* Ambient art */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
      </div>

      {/* Metrics Row: Profile Completion + Tracker Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Profile Completeness */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider">Profile Strength</span>
              <span className="font-extrabold text-blue-600 text-sm">{completion}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-3">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {completion === 100
                ? 'Your academic profile is complete and fully optimized for automated eligibility scoring.'
                : 'Complete missing academic fields (such as IELTS subscores or CV) to unlock more accurate AI matches.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigate('profile')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>{completion === 100 ? 'Review Qualifications' : 'Complete Profile'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Metric 2: Application Tracker Pipeline */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider">Application Pipeline</span>
              <span className="font-bold text-slate-900">{trackedApplications.length} Total</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
                <span className="text-lg font-bold text-blue-700">{statusCounts.Interested}</span>
                <p className="text-[10px] text-blue-900 font-medium">Interested</p>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-lg font-bold text-amber-700">{statusCounts['Preparing Documents']}</span>
                <p className="text-[10px] text-amber-900 font-medium">Preparing</p>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-lg font-bold text-emerald-700">{statusCounts.Applied}</span>
                <p className="text-[10px] text-emerald-900 font-medium">Applied</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigate('tracker')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Open Application Tracker</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Metric 3: Saved Scholarships Count */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider">Bookmarked Opportunities</span>
              <span className="font-bold text-slate-900">{savedScholarshipIds.length} Saved</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-blue-600 fill-blue-100 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {savedScholarshipIds.length} Scholarships Saved
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Access official deadlines and requirements anytime.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigate('saved')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View Saved Scholarships</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Profile-Matched Scholarships */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Recommended For You
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked automatically by compatibility with your nationality ({profile.nationality || 'Any'}), degree goal ({profile.preferredDegreeLevel}), and CGPA ({profile.cgpa}/{profile.cgpaScale}).
            </p>
          </div>

          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All Scholarships ({VERIFIED_SCHOLARSHIPS.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matchedScholarships.map((s) => (
            <ScholarshipCard
              key={s.id}
              scholarship={s}
              isSaved={savedScholarshipIds.includes(s.id)}
              onToggleSave={toggleSaveScholarship}
              onViewDetails={onSelectScholarship}
              onAddToTracker={onAddToTracker}
            />
          ))}
        </div>
      </div>

      {/* Quick Application Tracker preview */}
      {trackedApplications.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Active Application Milestones</h3>
            </div>
            <button
              onClick={() => onNavigate('tracker')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Manage Tracker
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {trackedApplications.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate max-w-[180px]">
                    {item.scholarshipTitle}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    {item.status}
                  </span>
                </div>
                <p className="text-slate-500 line-clamp-1">{item.targetDegree}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Deadline:</span>
                  <span className="font-semibold text-slate-700">{item.submissionDeadline ? new Date(item.submissionDeadline).toLocaleDateString() : 'Rolling'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
