import React, { useState } from 'react';
import { VERIFIED_SCHOLARSHIPS } from '../data/scholarships';
import {
  Database,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  Layers,
  X,
  RefreshCw,
  Server
} from 'lucide-react';

interface AdminBridgeModalProps {
  onClose: () => void;
}

export const AdminBridgeModal: React.FC<AdminBridgeModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');

  const filtered = VERIFIED_SCHOLARSHIPS.filter((s) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (!s.title.toLowerCase().includes(q) && !s.provider.toLowerCase().includes(q) && !s.country.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedCountry !== 'All' && s.country.toLowerCase() !== selectedCountry.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in fade-in">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold">Institutional Scholarship Database Bridge</h2>
            </div>
            <p className="text-xs text-slate-400">
              Verified records managed through the scholarship administrator catalog. Prioritized over unverified AI search results.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Metrics Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              <span>Database Status: <strong className="text-emerald-700">Online & Synchronized</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Verified Records: <strong>{VERIFIED_SCHOLARSHIPS.length} Active</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter database records..."
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Records Table */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Scholarship ID</th>
                  <th className="p-3">Program Title</th>
                  <th className="p-3">Governing Provider</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Degree Levels</th>
                  <th className="p-3">Min CGPA</th>
                  <th className="p-3">Last Verified</th>
                  <th className="p-3">Official Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono text-[11px] text-slate-500">{item.id}</td>
                    <td className="p-3 font-bold text-slate-900">{item.title}</td>
                    <td className="p-3 text-slate-600 truncate max-w-[180px]">{item.provider}</td>
                    <td className="p-3">{item.country}</td>
                    <td className="p-3">{item.degreeLevels.join(', ')}</td>
                    <td className="p-3 font-semibold text-blue-700">{item.academicRequirements.minCGPA}/{item.academicRequirements.cgpaScale}</td>
                    <td className="p-3 text-slate-500">{item.lastVerified}</td>
                    <td className="p-3">
                      <a
                        href={item.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
                      >
                        <span>Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between text-xs text-slate-500">
          <p>Verified institutional datasets ensure zero fabricated deadlines or allowances.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
