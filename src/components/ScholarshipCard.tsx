import React from 'react';
import { Scholarship } from '../types';
import {
  Bookmark,
  ExternalLink,
  Calendar,
  Building,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Plus
} from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onViewDetails: (scholarship: Scholarship) => void;
  onAddToTracker?: (scholarship: Scholarship) => void;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  isSaved,
  onToggleSave,
  onViewDetails,
  onAddToTracker,
}) => {
  // Format match status badge cleanly
  const renderMatchBadge = () => {
    if (!scholarship.matchStatus) return null;

    if (scholarship.matchStatus === 'eligible') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          Appears Eligible ({scholarship.matchScore}%)
        </span>
      );
    }
    if (scholarship.matchStatus === 'potentially_eligible') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          Potentially Eligible ({scholarship.matchScore}%)
        </span>
      );
    }
    if (scholarship.matchStatus === 'attention_required') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          Check Requirements
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
        Review Details
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-6">
        {/* Top Metadata Row: Clean unboxed typography per frontend-design guidelines */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-base">{scholarship.flagEmoji}</span>
            <span className="font-semibold text-slate-700">{scholarship.country}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-medium text-emerald-700">{scholarship.fundingType}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{scholarship.degreeLevels.join(', ')}</span>
          </div>
          <button
            onClick={() => onToggleSave(scholarship.id)}
            title={isSaved ? 'Remove from saved' : 'Save scholarship'}
            className={`p-1.5 rounded-lg border transition-colors ${
              isSaved
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
          </button>
        </div>

        {/* Title & Provider */}
        <h3
          onClick={() => onViewDetails(scholarship)}
          className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer leading-snug"
        >
          {scholarship.title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{scholarship.provider}</span>
        </p>

        {/* Overview snippet */}
        <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
          {scholarship.overview}
        </p>

        {/* Key Highlights */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex items-baseline justify-between text-slate-600">
            <span className="text-slate-400 font-medium">Stipend:</span>
            <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">
              {scholarship.coverageDetails.monthlyStipend}
            </span>
          </div>
          <div className="flex items-baseline justify-between text-slate-600">
            <span className="text-slate-400 font-medium">Min CGPA:</span>
            <span className="font-medium text-slate-800">
              {scholarship.academicRequirements.minCGPA}/{scholarship.academicRequirements.cgpaScale} or equivalent
            </span>
          </div>
          <div className="flex items-baseline justify-between text-slate-600">
            <span className="text-slate-400 font-medium">Language:</span>
            <span className="font-medium text-slate-800">
              {scholarship.languageRequirements.ieltsRequired
                ? `IELTS ${scholarship.languageRequirements.minIeltsOverall}+`
                : 'Not strictly required / Waiver'}
            </span>
          </div>
        </div>

        {/* Match status if available */}
        {scholarship.matchStatus && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            {renderMatchBadge()}
            {scholarship.matchReason && (
              <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-1 italic">
                {scholarship.matchReason}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Deadline & Action Buttons */}
      <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate max-w-[130px] font-medium">{scholarship.deadline}</span>
        </div>

        <div className="flex items-center gap-2">
          {onAddToTracker && (
            <button
              onClick={() => onAddToTracker(scholarship)}
              title="Add to application tracker"
              className="p-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-md border border-slate-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => onViewDetails(scholarship)}
            className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            Details
          </button>
          <a
            href={scholarship.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open official university or government application website"
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
          >
            <span>Apply</span>
            <ExternalLink className="w-3 h-3 text-slate-300" />
          </a>
        </div>
      </div>
    </div>
  );
};
