import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Scholarship, AISearchResponse, GroundingSource } from '../types';
import { VERIFIED_SCHOLARSHIPS } from '../data/scholarships';
import { ScholarshipCard } from './ScholarshipCard';
import {
  Sparkles,
  Search,
  Globe2,
  ExternalLink,
  MessageSquare,
  Send,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  Filter,
  RefreshCw,
  Compass,
  Building
} from 'lucide-react';

interface AISearchViewProps {
  onSelectScholarship: (scholarship: Scholarship) => void;
  onAddToTracker: (scholarship: Scholarship) => void;
}

export const AISearchView: React.FC<AISearchViewProps> = ({
  onSelectScholarship,
  onAddToTracker,
}) => {
  const { profile, savedScholarshipIds, toggleSaveScholarship } = useAuth();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResponse, setSearchResponse] = useState<AISearchResponse | null>(null);

  // Chat assistant state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'ai'; text: string; sources?: GroundingSource[] }[]
  >([
    {
      sender: 'ai',
      text: `Hello ${profile.fullName ? profile.fullName.split(' ')[0] : 'there'}! I am your GlobalScholar AI Advisor. I have calibrated my responses with your academic profile (${profile.nationality || 'International'}, ${profile.preferredDegreeLevel || 'Masters'}, CGPA ${profile.cgpa || 3.5}/4.0). Ask me anything about international scholarships, IELTS waivers, or application tactics!`,
    },
  ]);

  // Preset search templates
  const presets = [
    `Fully funded Master's in Germany for ${profile.nationality || 'international'} students`,
    `UK scholarships with full living stipend and tuition waiver`,
    `Top scholarships in Europe that do not strictly require IELTS`,
    `PhD fellowships in Switzerland, Singapore, or USA with high stipend`,
    `Australia Awards and Commonwealth postgraduate opportunities`,
  ];

  const handleRunSearch = async (searchQuery?: string) => {
    const q = searchQuery !== undefined ? searchQuery : query;
    setIsSearching(true);
    try {
      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          profile,
          filters: {
            country: 'All',
            degreeLevel: profile.preferredDegreeLevel || 'All',
          },
        }),
      });
      const data: AISearchResponse = await res.json();
      setSearchResponse(data);
    } catch (err) {
      console.warn('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, profile }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: data.reply || 'No response returned.', sources: data.sources },
      ]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Apologies, I encountered a temporary connection issue. Please try again.' },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Default initial search if none conducted
  const displayScholarships = searchResponse ? searchResponse.scholarships : VERIFIED_SCHOLARSHIPS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Gemini Search Grounding Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            AI-Powered International Scholarship Discovery
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
            Search across genuine government grants and university programs worldwide using your academic profile context and live Google Search grounding.
          </p>

          {/* User profile parameters pill */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex flex-wrap items-center gap-2">
            <span className="text-amber-400 font-semibold">Active Profile Profile:</span>
            <span>{profile.nationality || 'International'} citizen</span>
            <span>·</span>
            <span>Target: {profile.preferredDegreeLevel || 'Masters'}</span>
            <span>·</span>
            <span>CGPA: {profile.cgpa}/{profile.cgpaScale}</span>
            <span>·</span>
            <span>IELTS: {profile.ieltsStatus === 'Completed' ? profile.ieltsOverall : profile.ieltsStatus}</span>
            <span>·</span>
            <span>Major: {profile.majorFieldOfStudy || 'STEM'}</span>
          </div>

          {/* Search Input Bar */}
          <div className="pt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRunSearch();
              }}
              className="flex flex-col sm:flex-row items-center gap-2 bg-white rounded-2xl p-2 shadow-2xl"
            >
              <div className="flex items-center gap-2 px-3 flex-1 w-full">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Find fully funded Master's scholarships in Germany for Pakistani students in Computer Science"
                  className="w-full py-2 text-slate-900 text-sm focus:outline-none placeholder:text-slate-400 font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Searching Web & Database...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Search</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Preset queries */}
          <div className="pt-2">
            <p className="text-[11px] text-indigo-300 mb-1.5 font-medium">Quick Query Templates:</p>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(preset);
                    handleRunSearch(preset);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium border border-white/10 transition-colors text-left truncate max-w-xs"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Search Executive Overview (if returned) */}
      {searchResponse?.aiOverview && (
        <div className="p-6 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-indigo-950">AI Admissions Executive Summary</h3>
            </div>
            {searchResponse.isLiveSearch && (
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5" />
                Live Google Search Grounded
              </span>
            )}
          </div>
          <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
            {searchResponse.aiOverview}
          </div>

          {/* Grounding sources links */}
          {searchResponse.groundingSources && searchResponse.groundingSources.length > 0 && (
            <div className="pt-3 border-t border-indigo-200/60">
              <p className="text-[11px] font-bold text-indigo-900 mb-1.5 uppercase tracking-wider">
                Official Sources Discovered via Grounding:
              </p>
              <div className="flex flex-wrap gap-2">
                {searchResponse.groundingSources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-indigo-200 text-[11px] text-blue-700 hover:text-blue-900 font-medium hover:bg-indigo-50/50 transition-colors"
                  >
                    <span className="truncate max-w-[200px]">{source.title || source.uri}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Matching Scholarship Opportunities ({displayScholarships.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked with eligibility match status based on your registered credentials.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayScholarships.map((s) => (
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

      {/* FLOATING AI ASSISTANT CHAT DRAWER */}
      <div className="fixed bottom-6 right-6 z-40">
        {!chatOpen ? (
          <button
            onClick={() => setChatOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xl transition-all hover:scale-105 border border-indigo-400"
          >
            <Bot className="w-5 h-5 text-amber-300" />
            <span>Ask Scholarship AI</span>
          </button>
        ) : (
          <div className="w-96 max-w-[90vw] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-amber-300" />
                <div>
                  <h4 className="text-xs font-bold">GlobalScholar Advisor</h4>
                  <p className="text-[10px] text-indigo-200">Grounded AI Consultation</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-slate-300 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  </div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1 max-w-[85%]">
                      {msg.sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                        >
                          <span>{src.title || 'Official Source'}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isChatLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span>Researching scholarship guidelines...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex items-center gap-2 bg-slate-50">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about IELTS, stipends, visas..."
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
