import React from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface LegalModalsProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden my-auto animate-in fade-in">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {type === 'privacy' ? <Shield className="w-5 h-5 text-emerald-400" /> : <FileText className="w-5 h-5 text-blue-400" />}
            <h2 className="text-lg font-bold">
              {type === 'privacy' ? 'Privacy Policy & Student Data Protection' : 'Terms and Conditions of Use'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-700 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <h3 className="text-sm font-bold text-slate-900">1. Information We Collect</h3>
              <p>
                GlobalScholar AI collects student profile credentials including academic performance (CGPA, grading scales), degree titles, nationality, language proficiency scores, and scholarship destination preferences solely for the purpose of matching opportunities and calculating eligibility.
              </p>
              <h3 className="text-sm font-bold text-slate-900">2. Data Privacy & Zero Third-Party Sharing</h3>
              <p>
                Student personal data is never sold or rented to external marketing vendors. Profile data is transmitted securely to the server to construct evaluation prompts and match against institutional scholarship requirements.
              </p>
              <h3 className="text-sm font-bold text-slate-900">3. AI Grounding & External Queries</h3>
              <p>
                When conducting AI scholarship searches, only non-personally identifiable search parameters (such as degree level, field of study, and destination country) are used with Google Search grounding. Sensitive personal documents and passwords are never transmitted.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-sm font-bold text-slate-900">1. Advisory Purpose & No Guarantee of Admission</h3>
              <p>
                GlobalScholar AI is an informational discovery and guidance platform. AI eligibility evaluations and match percentages are advisory estimates derived from publicly published requirements. Admission and scholarship awards are decided solely by the respective university admissions committees, national governments, and scholarship secretariats.
              </p>
              <h3 className="text-sm font-bold text-slate-900">2. Official Application Submission</h3>
              <p>
                This platform does not directly submit university applications or issue visas. Students must navigate to each program's official application portal to submit verified documentation before official deadlines.
              </p>
              <h3 className="text-sm font-bold text-slate-900">3. Accurate Data Reporting</h3>
              <p>
                Users are responsible for ensuring that CGPA and language scores inputted into their academic profile reflect true records to receive meaningful eligibility analysis.
              </p>
            </>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
