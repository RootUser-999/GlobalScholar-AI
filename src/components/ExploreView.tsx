import React, { useState } from 'react';
import { Scholarship } from '../types';
import { COUNTRIES_LIST, DEGREE_LEVELS, FIELDS_OF_STUDY, VERIFIED_SCHOLARSHIPS } from '../data/scholarships';
import { evaluateEligibility } from '../utils/eligibility';
import { useAuth } from '../context/AuthContext';
import { ScholarshipCard } from './ScholarshipCard';
import {
  Compass,
  Search,
  Filter,
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface ExploreViewProps {
  onSelectScholarship: (scholarship: Scholarship) => void;
  onAddToTracker: (scholarship: Scholarship) => void;
  initialQuery?: string;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectScholarship,
  onAddToTracker,
  initialQuery = '',
}) => {
  const { profile, savedScholarshipIds, toggleSaveScholarship } = useAuth();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedDegree, setSelectedDegree] = useState('All');
  const [selectedFunding, setSelectedFunding] = useState('All');
  const [selectedField, setSelectedField] = useState('All');
  const [onlyNoIelts, setOnlyNoIelts] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'title'>('match');

  // Filter scholarships
  const filtered = VERIFIED_SCHOLARSHIPS.filter((s) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        s.title.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.overview.toLowerCase().includes(q) ||
        s.fieldsOfStudy.some((f) => f.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (selectedCountry !== 'All' && s.country.toLowerCase() !== selectedCountry.toLowerCase()) {
      return false;
    }

    if (selectedDegree !== 'All' && !s.degreeLevels.includes(selectedDegree as any)) {
      return false;
    }

    if (selectedFunding !== 'All' && s.fundingType !== selectedFunding) {
      return false;
    }

    if (selectedField !== 'All') {
      const fieldMatches =
        s.fieldsOfStudy.includes('All Fields') ||
        s.fieldsOfStudy.some((f) => f.toLowerCase().includes(selectedField.toLowerCase()));
      if (!fieldMatches) return false;
    }

    if (onlyNoIelts && s.languageRequirements.ieltsRequired && !s.languageRequirements.waiverPossible) {
      return false;
    }

    return true;
  });

  // Evaluate match scores
  const evaluated = filtered.map((s) => {
    const evalRes = evaluateEligibility(s, profile);
    return {
      ...s,
      matchScore: evalRes.score,
      matchStatus: evalRes.status,
      matchReason: evalRes.summary,
    };
  });

  // Sort
  if (sortBy === 'match') {
    evaluated.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  } else if (sortBy === 'deadline') {
    evaluated.sort((a, b) => new Date(a.deadlineDate).getTime() - new Date(b.deadlineDate).getTime());
  } else if (sortBy === 'title') {
    evaluated.sort((a, b) => a.title.localeCompare(b.title));
  }

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCountry('All');
    setSelectedDegree('All');
    setSelectedFunding('All');
    setSelectedField('All');
    setOnlyNoIelts(false);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCountry !== 'All' ||
    selectedDegree !== 'All' ||
    selectedFunding !== 'All' ||
    selectedField !== 'All' ||
    onlyNoIelts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Explore Verified Scholarships
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse our institutional database of verified government grants and fully funded university fellowships worldwide.
          </p>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-start md:self-auto text-xs">
          <span className="text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold focus:outline-none"
          >
            <option value="match">Profile Match Compatibility</option>
            <option value="deadline">Upcoming Deadline</option>
            <option value="title">Scholarship Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by scholarship name, country, university, or subject area..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              Destination Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="All">All Countries</option>
              {COUNTRIES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              Target Degree
            </label>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="All">All Degree Levels</option>
              {DEGREE_LEVELS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              Funding Coverage
            </label>
            <select
              value={selectedFunding}
              onChange={(e) => setSelectedFunding(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="All">All Funding Types</option>
              <option value="Fully Funded">Fully Funded</option>
              <option value="Partially Funded">Partially Funded</option>
              <option value="Tuition Waiver">Tuition Waiver Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              Field of Study
            </label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="All">All Disciplines</option>
              {FIELDS_OF_STUDY.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-slate-700">
            <input
              type="checkbox"
              checked={onlyNoIelts}
              onChange={(e) => setOnlyNoIelts(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Show only scholarships with IELTS waivers / no strict IELTS</span>
          </label>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Scholarships Count and Results */}
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-4">
          Showing {evaluated.length} verified scholarship opportunities
        </p>

        {evaluated.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <p className="text-base font-bold text-slate-800">No scholarships matched these filters</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try broadening your country or subject criteria, or reset your filters to see all available grants.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {evaluated.map((s) => (
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
        )}
      </div>
    </div>
  );
};
