import React, { useState, useEffect } from 'react';
import { Scholarship } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  DollarSign,
  ShieldCheck,
  Award,
  Sparkles,
  Plane,
  Building
} from 'lucide-react';

interface FeaturedCarouselProps {
  scholarships: Scholarship[];
  onSelectScholarship: (scholarship: Scholarship) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  scholarships,
  onSelectScholarship,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const featured = scholarships.filter((s) => s.isFeatured);
  const total = featured.length;

  useEffect(() => {
    if (total === 0 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5500);
    return () => clearInterval(interval);
  }, [total, isPaused]);

  if (total === 0) return null;

  const current = featured[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  return (
    <section
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Featured Global Fellowships
            </h2>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Top International Scholarship Opportunities
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous scholarship"
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next scholarship"
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center transition-all shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl overflow-hidden border border-slate-700/60 transition-all duration-300">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 8 cols: Core info */}
            <div className="lg:col-span-8 space-y-4">
              {/* Country & Funding Tag */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-slate-200 border border-white/10 font-medium">
                  <span className="text-base">{current.flagEmoji}</span>
                  <span>{current.country}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  {current.fundingType}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                  {current.degreeLevels.join(' · ')}
                </span>
                <span className="text-slate-400 flex items-center gap-1 text-[11px] ml-auto">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Official
                </span>
              </div>

              {/* Title & Provider */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  {current.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 mt-1 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{current.provider}</span>
                </p>
              </div>

              {/* Overview snippet */}
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                {current.overview}
              </p>

              {/* Funding Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[11px] text-slate-400 uppercase font-medium">Tuition Coverage</p>
                  <p className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
                    {current.coverageDetails.tuition}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[11px] text-slate-400 uppercase font-medium">Monthly Living Stipend</p>
                  <p className="text-xs sm:text-sm font-bold text-emerald-300 mt-0.5 truncate">
                    {current.coverageDetails.monthlyStipend}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[11px] text-slate-400 uppercase font-medium">Travel & Flight</p>
                  <p className="text-xs sm:text-sm font-bold text-sky-300 mt-0.5 truncate">
                    {current.coverageDetails.airfare}
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectScholarship(current)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/30 hover:scale-[1.02]"
                >
                  View Full Scholarship Criteria
                </button>
                <a
                  href={current.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors border border-white/10 flex items-center gap-1.5"
                >
                  <span>Official Application Website</span>
                  <ExternalLink className="w-4 h-4 text-slate-300" />
                </a>
              </div>
            </div>

            {/* Right 4 cols: Deadline & Quick stats badge */}
            <div className="lg:col-span-4 bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Calendar className="w-5 h-5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 font-medium">Application Deadline</p>
                  <p className="text-sm font-bold text-white">{current.deadline}</p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Min Academic CGPA:</span>
                  <span className="font-semibold text-white">
                    {current.academicRequirements.minCGPA} / {current.academicRequirements.cgpaScale}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">English Language:</span>
                  <span className="font-semibold text-white">
                    {current.languageRequirements.ieltsRequired
                      ? `IELTS ${current.languageRequirements.minIeltsOverall}+`
                      : 'Waiver / University direct'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Health Insurance:</span>
                  <span className="font-semibold text-emerald-300">100% Fully Covered</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Eligible Regions:</span>
                  <span className="font-semibold text-white truncate max-w-[140px]">
                    Worldwide
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[11px] text-slate-400 italic">
                  * Official portal links directly to the accredited government secretariat.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="bg-slate-950/40 px-6 py-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Slide {currentIndex + 1} of {total}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline text-slate-400 truncate max-w-xs">{current.title}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === i ? 'w-6 bg-blue-500' : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
