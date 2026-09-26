import React, { useState } from 'react';
import { Scholarship } from '../types';
import { FeaturedCarousel } from './FeaturedCarousel';
import { GuidelinesSection } from './GuidelinesSection';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Sparkles,
  ArrowRight,
  Globe2,
  ShieldCheck,
  Award,
  Users2,
  GraduationCap,
  CheckCircle2,
  Building,
  Clock,
  Compass,
  FileText
} from 'lucide-react';
import { COUNTRIES_LIST, DEGREE_LEVELS, FIELDS_OF_STUDY, VERIFIED_SCHOLARSHIPS } from '../data/scholarships';

interface HomeViewProps {
  onSearch: (query: string) => void;
  onExplore: () => void;
  onOpenWizard: () => void;
  onSelectScholarship: (scholarship: Scholarship) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSearch,
  onExplore,
  onOpenWizard,
  onSelectScholarship,
  onOpenAuth,
}) => {
  const { user } = useAuth();
  const [heroQuery, setHeroQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedDegree, setSelectedDegree] = useState('All');

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let combinedQuery = heroQuery.trim();
    if (selectedCountry !== 'All') combinedQuery += ` in ${selectedCountry}`;
    if (selectedDegree !== 'All') combinedQuery += ` for ${selectedDegree}`;
    onSearch(combinedQuery);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI-Driven International Scholarship Discovery</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Find Scholarships That <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 bg-clip-text text-transparent">Match Your Future</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover verified fully funded higher education opportunities worldwide. Match by your exact nationality, degree level, CGPA, and language scores with grounded eligibility explanations.
          </p>

          {/* Hero Search Bar */}
          <div className="max-w-3xl mx-auto pt-4">
            <form
              onSubmit={handleHeroSubmit}
              className="bg-white p-2.5 rounded-2xl sm:rounded-full shadow-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex items-center gap-2.5 px-4 flex-1 w-full">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  placeholder="Scholarship name, country, degree level, or subject..."
                  className="w-full py-2.5 text-sm text-slate-900 focus:outline-none placeholder:text-slate-400 font-medium"
                />
              </div>

              {/* Destination dropdown */}
              <div className="w-full sm:w-auto px-2">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  aria-label="Filter by destination country"
                  className="w-full sm:w-auto py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-full focus:outline-none"
                >
                  <option value="All">All Countries</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Germany">Germany</option>
                  <option value="European Union">European Union</option>
                  <option value="Australia">Australia</option>
                  <option value="Japan">Japan</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Turkey">Turkey</option>
                </select>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 shrink-0 hover:scale-[1.02]"
              >
                <span>Search Scholarships</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Secondary CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {!user ? (
              <>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Build Profile & Match with AI</span>
                </button>
                <button
                  onClick={onExplore}
                  className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Compass className="w-4 h-4 text-slate-500" />
                  <span>Browse 40+ Verified Grants</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenWizard}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Update Academic Profile & AI Matches</span>
              </button>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
              <p className="text-2xl font-extrabold text-blue-700">$100M+</p>
              <p className="text-xs text-slate-500 mt-0.5">International Funding Value</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
              <p className="text-2xl font-extrabold text-indigo-700">160+</p>
              <p className="text-xs text-slate-500 mt-0.5">Eligible Nationalities</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
              <p className="text-2xl font-extrabold text-emerald-700">100%</p>
              <p className="text-xs text-slate-500 mt-0.5">Verified Government Grants</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
              <p className="text-2xl font-extrabold text-slate-900">0%</p>
              <p className="text-xs text-slate-500 mt-0.5">Fabricated Data Policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SCHOLARSHIPS SLIDESHOW */}
      <FeaturedCarousel
        scholarships={VERIFIED_SCHOLARSHIPS}
        onSelectScholarship={onSelectScholarship}
      />

      {/* SCHOLARSHIP GUIDELINES SECTION ("How to Achieve Your Dream Scholarship") */}
      <GuidelinesSection onStartMatching={onOpenWizard} />

      {/* TRUST & VERIFICATION ADVANTAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Direct Official Portals Only</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every single listing directs you straight to accredited government agencies (e.g. chevening.org, daad.de, fulbrightprogram.org) without third-party redirects or intermediary fees.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Live Google Search Grounding</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Powered by Google Gemini with live web grounding to track real-time application cycle openings, deadline changes, and quota adjustments across embassies.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Scale-Aware CGPA & IELTS Logic</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our matching algorithm respects distinct international grading scales (4.0, 5.0, 10.0, percentages) and language test waivers rather than making inaccurate conversions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
