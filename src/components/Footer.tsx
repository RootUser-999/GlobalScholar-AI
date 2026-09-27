import React from 'react';
import {
  GraduationCap,
  Globe2,
  Mail,
  Shield,
  FileText,
  ExternalLink,
  Linkedin,
  Twitter,
  Youtube,
  Github,
  MapPin,
  Heart,
  Phone,
  Headphones
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenPolicy?: (type: 'privacy' | 'terms') => void;
  onOpenAdmin?: () => void;
  onOpenSupport?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPolicy, onOpenAdmin, onOpenSupport }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">SEA</span>
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  The Sophie Education Academy
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              SEA The Sophie Education Academy empowers students worldwide to access higher education through verified international scholarships, personalized academic profile matching, and live eligibility reasoning.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Explore Scholarships
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-search')}
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  AI Scholarship Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('guidelines')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Application Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('onboarding')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Student Profile Setup
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Fully Funded Programs</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  European Master's (EMJM & DAAD)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  UK Chevening & Commonwealth
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  USA Fulbright & Fellowships
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Asia-Pacific (MEXT, SINGA, CSC)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Verification info */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Contact & Secretariat
            </h4>
            <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
              <p className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <a href="tel:+36302770528" className="hover:text-emerald-400 transition-colors font-medium text-slate-300">
                  +36302770528
                </a>
              </p>
              <p className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <a href="mailto:sophieedpro@gmail.com" className="hover:text-amber-400 transition-colors">
                  sophieedpro@gmail.com
                </a>
              </p>
              <p className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>All listings link directly to genuine government & university portals.</span>
              </p>
              <p className="flex items-start gap-2">
                <Globe2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Covers 160+ eligible nationalities across Europe, Americas, Asia, and Africa.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SEA The Sophie Education Academy. All rights reserved. Data verified against official government scholarship secretariats.</p>
          <div className="flex flex-wrap items-center gap-6">
            {onOpenSupport && (
              <button
                onClick={onOpenSupport}
                className="hover:text-blue-400 text-blue-500 font-medium transition-colors flex items-center gap-1"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Support (+36302770528)</span>
              </button>
            )}
            <button
              onClick={() => onOpenPolicy && onOpenPolicy('privacy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenPolicy && onOpenPolicy('terms')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-slate-300 transition-colors"
            >
              About Us
            </button>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-slate-400 hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors"
                title="System Administration Portal"
              >
                <span>Admin Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
