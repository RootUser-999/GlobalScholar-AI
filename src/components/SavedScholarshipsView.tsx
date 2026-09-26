import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Scholarship } from '../types';
import { VERIFIED_SCHOLARSHIPS } from '../data/scholarships';
import { ScholarshipCard } from './ScholarshipCard';
import { Bookmark, ArrowRight, Compass } from 'lucide-react';

interface SavedScholarshipsViewProps {
  onExplore: () => void;
  onSelectScholarship: (scholarship: Scholarship) => void;
  onAddToTracker: (scholarship: Scholarship) => void;
}

export const SavedScholarshipsView: React.FC<SavedScholarshipsViewProps> = ({
  onExplore,
  onSelectScholarship,
  onAddToTracker,
}) => {
  const { savedScholarshipIds, toggleSaveScholarship } = useAuth();

  const savedList = VERIFIED_SCHOLARSHIPS.filter((s) =>
    savedScholarshipIds.includes(s.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-600 fill-blue-100" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Saved Scholarships
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            You have bookmarked {savedList.length} global scholarship opportunities. Review requirements or launch official applications.
          </p>
        </div>

        <button
          onClick={onExplore}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <Compass className="w-4 h-4" />
          <span>Explore More Opportunities</span>
        </button>
      </div>

      {/* Grid of Saved Scholarships */}
      {savedList.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No Saved Scholarships Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Browse our catalog of verified international scholarships and click the bookmark icon to save them for easy reference.
            </p>
          </div>
          <button
            onClick={onExplore}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow"
          >
            Explore Fellowships Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              isSaved={true}
              onToggleSave={toggleSaveScholarship}
              onViewDetails={onSelectScholarship}
              onAddToTracker={onAddToTracker}
            />
          ))}
        </div>
      )}
    </div>
  );
};
