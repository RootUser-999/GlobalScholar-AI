import React, { useState, useEffect } from 'react';
import { Scholarship, EligibilityResult } from '../types';
import { useAuth } from '../context/AuthContext';
import { evaluateEligibility } from '../utils/eligibility';
import {
  X,
  ExternalLink,
  Bookmark,
  Calendar,
  Building,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  DollarSign,
  Plane,
  HeartPulse,
  Home,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  onClose: () => void;
  onAddToTracker?: (scholarship: Scholarship) => void;
}

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  onClose,
  onAddToTracker,
}) => {
  const { profile, savedScholarshipIds, toggleSaveScholarship } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'eligibility' | 'process'>('details');
  const [deepAiLoading, setDeepAiLoading] = useState(false);
  const [deepAiAnalysis, setDeepAiAnalysis] = useState<string | null>(null);

  if (!scholarship) return null;

  const isSaved = savedScholarshipIds.includes(scholarship.id);
  const localEval: EligibilityResult = evaluateEligibility(scholarship, profile);

  // Fetch server-side deep AI analysis if requested
  const handleFetchDeepAi = async () => {
    setDeepAiLoading(true);
    try {
      const res = await fetch('/api/gemini/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholarshipId: scholarship.id, profile }),
      });
      const data = await res.json();
      if (data.aiDetailedAnalysis) {
        setDeepAiAnalysis(data.aiDetailedAnalysis);
      }
    } catch (err) {
      console.warn('AI analysis call failed:', err);
    } finally {
      setDeepAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1 font-semibold text-slate-200">
                  <span className="text-base">{scholarship.flagEmoji}</span>
                  <span>{scholarship.country}</span>
                </span>
                <span className="text-slate-400">·</span>
                <span className="font-semibold text-emerald-300">{scholarship.fundingType}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-300">{scholarship.degreeLevels.join(', ')}</span>
                <span className="text-slate-400">·</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Official Record
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {scholarship.title}
              </h2>
              <p className="text-sm text-slate-300 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{scholarship.provider}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'details'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              1. Overview & Funding Coverage
            </button>
            <button
              onClick={() => setActiveTab('eligibility')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'eligibility'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              2. AI Profile Eligibility
            </button>
            <button
              onClick={() => setActiveTab('process')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === 'process'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              3. Checklist & Application Steps
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* TAB 1: DETAILS & FUNDING */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* 1. Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  1. Scholarship Overview
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {scholarship.overview}
                </p>
              </div>

              {/* 8, 9, 10, 11: Funding Coverage Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Funding Coverage & Financial Benefits
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 uppercase">Tuition Fee Coverage</h5>
                      <p className="text-xs text-slate-700 mt-1">{scholarship.coverageDetails.tuition}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 uppercase">Monthly Living Allowance / Stipend</h5>
                      <p className="text-xs text-slate-700 mt-1 font-semibold text-emerald-800">
                        {scholarship.coverageDetails.monthlyStipend}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 flex items-start gap-3">
                    <Plane className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 uppercase">Travel & Airfare</h5>
                      <p className="text-xs text-slate-700 mt-1">{scholarship.coverageDetails.airfare}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 flex items-start gap-3">
                    <HeartPulse className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 uppercase">Health & Medical Insurance</h5>
                      <p className="text-xs text-slate-700 mt-1">{scholarship.coverageDetails.healthInsurance}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 flex items-start gap-3 sm:col-span-2">
                    <Home className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 uppercase">Accommodation & Relocation Support</h5>
                      <p className="text-xs text-slate-700 mt-1">{scholarship.coverageDetails.accommodation}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3, 4, 5: Scope & Nationalities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Eligible Nationalities & Regions
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1">
                    {scholarship.eligibleNationalities.map((nat, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{nat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Eligible Disciplines & Fields of Study
                  </h4>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {scholarship.fieldsOfStudy.map((f, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 6, 7: Academic and Language Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Academic Requirements
                  </h4>
                  <div className="text-xs text-slate-700 space-y-1.5">
                    <p>
                      <strong>Minimum CGPA:</strong> {scholarship.academicRequirements.minCGPA} / {scholarship.academicRequirements.cgpaScale}
                    </p>
                    {scholarship.academicRequirements.equivalentPercentage && (
                      <p>
                        <strong>Equivalency:</strong> {scholarship.academicRequirements.equivalentPercentage}
                      </p>
                    )}
                    <p>
                      <strong>Prerequisite:</strong> {scholarship.academicRequirements.degreePrerequisite}
                    </p>
                    {scholarship.academicRequirements.additionalRequirements && (
                      <p className="text-slate-600">
                        <strong>Additional:</strong> {scholarship.academicRequirements.additionalRequirements}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Language Proficiency Requirements
                  </h4>
                  <div className="text-xs text-slate-700 space-y-1.5">
                    <p>
                      <strong>IELTS Required:</strong> {scholarship.languageRequirements.ieltsRequired ? 'Yes' : 'No general mandate'}
                    </p>
                    {scholarship.languageRequirements.minIeltsOverall && (
                      <p>
                        <strong>Minimum IELTS Score:</strong> {scholarship.languageRequirements.minIeltsOverall} overall
                      </p>
                    )}
                    {scholarship.languageRequirements.toeflAccepted && (
                      <p>
                        <strong>TOEFL iBT:</strong> Accepted (Min: {scholarship.languageRequirements.minToefl || '85-100'})
                      </p>
                    )}
                    {scholarship.languageRequirements.waiverPossible && (
                      <p className="text-emerald-700 font-medium">
                        <strong>Waiver Policy:</strong> {scholarship.languageRequirements.waiverCondition}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 16, 17: Source & Last Verified Date */}
              <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Source: <strong>{scholarship.source}</strong></span>
                </span>
                <span>Last Verified: <strong>{scholarship.lastVerified}</strong></span>
              </div>
            </div>
          )}

          {/* TAB 2: AI ELIGIBILITY EXPLANATION */}
          {activeTab === 'eligibility' && (
            <div className="space-y-6">
              {/* Summary score card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                      Personalized Eligibility Assessment
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {localEval.summary}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Calculated by comparing your academic profile ({profile.fullName || 'Student'} · {profile.nationality || 'International'} · CGPA {profile.cgpa}/{profile.cgpaScale} · IELTS {profile.ieltsOverall || 'Not taken'}) against published institutional rules.
                    </p>
                  </div>
                  <div className="text-center sm:text-right shrink-0">
                    <span className="text-3xl font-extrabold text-indigo-700">{localEval.score}%</span>
                    <p className="text-[11px] font-semibold text-indigo-900 uppercase">Match Compatibility</p>
                  </div>
                </div>
              </div>

              {/* Criteria breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Requirement-by-Requirement Analysis
                </h4>

                {/* Nationality */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3 text-xs">
                  {localEval.criteria.nationality.pass ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold text-slate-900">Nationality & Regional Quota</p>
                    <p className="text-slate-600 mt-0.5">{localEval.criteria.nationality.details}</p>
                  </div>
                </div>

                {/* Degree Target */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3 text-xs">
                  {localEval.criteria.degreeLevel.pass ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold text-slate-900">Degree Level Target</p>
                    <p className="text-slate-600 mt-0.5">{localEval.criteria.degreeLevel.details}</p>
                  </div>
                </div>

                {/* CGPA */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3 text-xs">
                  {localEval.criteria.academicCGPA.pass ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold text-slate-900">Academic Standing & CGPA Threshold</p>
                    <p className="text-slate-600 mt-0.5">{localEval.criteria.academicCGPA.details}</p>
                  </div>
                </div>

                {/* Language */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start gap-3 text-xs">
                  {localEval.criteria.language.pass ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-bold text-slate-900">Language Requirement (IELTS / TOEFL / Waiver)</p>
                    <p className="text-slate-600 mt-0.5">{localEval.criteria.language.details}</p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {localEval.recommendations.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                  <h5 className="font-bold uppercase tracking-wider text-amber-800">
                    Recommendations to Strengthen Application
                  </h5>
                  <ul className="space-y-1 list-disc list-inside">
                    {localEval.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Server-side deep AI analysis trigger */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Comprehensive Admissions Advisory</h5>
                    <p className="text-xs text-slate-500">
                      Query Gemini to generate a tailored admissions strategy based on your statement of purpose and background.
                    </p>
                  </div>
                  <button
                    onClick={handleFetchDeepAi}
                    disabled={deepAiLoading}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{deepAiLoading ? 'Analyzing...' : 'Generate Deep AI Strategy'}</span>
                  </button>
                </div>

                {deepAiAnalysis && (
                  <div className="mt-4 p-4 rounded-lg bg-white border border-indigo-100 text-xs text-slate-700 whitespace-pre-line leading-relaxed shadow-sm">
                    {deepAiAnalysis}
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="p-3 rounded-lg bg-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{localEval.disclaimer}</span>
              </div>
            </div>
          )}

          {/* TAB 3: CHECKLIST & PROCESS */}
          {activeTab === 'process' && (
            <div className="space-y-6">
              {/* 13. Required Documents */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  13. Mandatory Supporting Documents
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {scholarship.requiredDocuments.map((doc, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 14. Application Process */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  14. Official Step-by-Step Application Process
                </h4>
                <div className="space-y-3">
                  {scholarship.applicationProcess.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 12. Application Deadline */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="text-xs font-bold">Official Application Deadline</p>
                    <p className="text-sm font-extrabold text-amber-950">{scholarship.deadline}</p>
                  </div>
                </div>
                <span className="text-xs bg-amber-200/80 text-amber-900 font-semibold px-2.5 py-1 rounded-md">
                  Strict Cutoff
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveScholarship(scholarship.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600 text-blue-600' : ''}`} />
              <span>{isSaved ? 'Saved to My Account' : 'Save Scholarship'}</span>
            </button>

            {onAddToTracker && (
              <button
                onClick={() => {
                  onAddToTracker(scholarship);
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
              >
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Add to Tracker</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Close
            </button>
            {/* 15. Official Application Link */}
            <a
              href={scholarship.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
            >
              <span>Apply on Official Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
