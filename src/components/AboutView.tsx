import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Globe2,
  Users2,
  Sparkles,
  BookOpen,
  Mail,
  Building,
  Phone,
  Clock,
  Headphones,
  CheckCircle2
} from 'lucide-react';

interface AboutViewProps {
  onStartSearch: () => void;
  onExplore: () => void;
  onOpenSupport?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onStartSearch, onExplore, onOpenSupport }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
          SEA The Sophie Education Academy
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Democratizing Access to Global Higher Education
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          SEA The Sophie Education Academy was founded to eliminate the informational asymmetry faced by talented students in developing and emerging nations seeking international scholarships.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="font-bold text-slate-900 text-base">Zero Fabricated Information</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We adhere strictly to factual, verified databases. Deadlines, stipends, and language requirements are cross-referenced directly with official government ministries and university secretariats.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="font-bold text-slate-900 text-base">Direct Official Portals</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We do not act as gatekeepers or charge application fees. Every scholarship links directly to the accredited host application system (OASIS, Chevening, Fulbright IIE, DAAD Portal).
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="font-bold text-slate-900 text-base">Nuanced Scale-Aware AI</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Unlike crude keyword filters, our AI reasoning engine accounts for national grading systems, English Medium of Instruction (MOI) waivers, and holistic leadership profiles.
          </p>
        </div>
      </div>

      {/* Institutional Network */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white space-y-6">
        <div className="max-w-2xl space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            Supported Fellowship Secretariats
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            SEA The Sophie Education Academy maintains up-to-date tracking for all major global awards including:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-200">
          <div className="p-3 rounded-xl bg-white/10 border border-white/10">🇬🇧 Chevening & Commonwealth</div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/10">🇺🇸 Fulbright Foreign Student</div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/10">🇩🇪 DAAD Helmut-Schmidt</div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/10">🇪🇺 Erasmus Mundus Joint Masters</div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/10">🇦🇺 Australia Awards DFAT</div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/10">🇯🇵 Japanese MEXT</div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/10">🇨🇭 Swiss Government Excellence</div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/10">🇹🇷 Türkiye Bursları</div>
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={onStartSearch}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow"
          >
            Launch AI Search
          </button>
          <button
            onClick={onExplore}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15"
          >
            Explore Full Database
          </button>
        </div>
      </div>

      {/* Official Academy Contact & Support Section */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl space-y-6 border border-blue-800/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-800/60 pb-6">
          <div>
            <span className="text-xs font-bold tracking-wider text-blue-300 uppercase">Official Secretariat</span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              SEA The Sophie Education Academy
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              Academic Advisory & International Admissions Liaison
            </p>
          </div>
          {onOpenSupport && (
            <button
              onClick={onOpenSupport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow self-start sm:self-auto"
            >
              <Headphones className="w-4 h-4" />
              <span>Contact Support</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-blue-300 font-semibold text-xs">
              <Phone className="w-4 h-4" />
              <span>Direct Hotline</span>
            </div>
            <p className="text-xl font-bold tracking-wide">
              <a href="tel:+36302770528" className="hover:underline hover:text-blue-300 transition-colors">
                +36302770528
              </a>
            </p>
            <p className="text-[11px] text-blue-200">
              Monday – Friday • 09:00 - 18:00 CET
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs">
              <Mail className="w-4 h-4" />
              <span>Email Inquiries</span>
            </div>
            <p className="text-sm font-bold text-white">
              <a href="mailto:support@sea-academy.org" className="hover:underline hover:text-indigo-300 transition-colors">
                support@sea-academy.org
              </a>
            </p>
            <p className="text-[11px] text-indigo-200">
              Alternative: pocoloco7841@gmail.com
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Accreditation & Standards</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              Official verification for international scholarship applicants, visa requirements, and document translations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
