import React, { useState } from 'react';
import {
  Compass,
  FileCheck2,
  GraduationCap,
  Languages,
  FileText,
  Users2,
  Send,
  LineChart,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface GuidelinesSectionProps {
  onStartMatching?: () => void;
}

export const GuidelinesSection: React.FC<GuidelinesSectionProps> = ({ onStartMatching }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      step: 1,
      title: 'Research Scholarships Matching Your Profile',
      icon: <Compass className="w-6 h-6 text-blue-600" />,
      color: 'blue',
      summary: 'Target opportunities aligned with your exact degree level, CGPA, and country interests.',
      details: [
        'Filter by degree level (Bachelors, Masters, PhD, Postdoc) and bilateral quotas.',
        'Prioritize government-funded grants (Chevening, DAAD, Fulbright, MEXT, Erasmus Mundus) that cover 100% tuition and living allowances.',
        'Use our AI Match tool to instantly cross-reference your CGPA and nationality with verified databases.'
      ],
      tip: 'Do not limit yourself to one country. Applying to 3-5 high-probability scholarships increases success rate significantly.'
    },
    {
      step: 2,
      title: 'Understand Eligibility Requirements In Depth',
      icon: <FileCheck2 className="w-6 h-6 text-emerald-600" />,
      color: 'emerald',
      summary: 'Thoroughly examine academic minimums, age limits, and eligible nationality lists.',
      details: [
        'Check CGPA conversion scales (e.g. 3.0/4.0 or UK 2:1 equivalent) to avoid automated rejection.',
        'Verify prerequisite degree requirements (e.g., minimum 16 years of education for Masters).',
        'Review return-home criteria or work commitments if applying for bilateral government development awards.'
      ],
      tip: 'If your CGPA is slightly below the cutoff, highlight research publications, internships, or high GRE/GMAT scores.'
    },
    {
      step: 3,
      title: 'Prepare Academic Transcripts & Certificates',
      icon: <GraduationCap className="w-6 h-6 text-indigo-600" />,
      color: 'indigo',
      summary: 'Collect attested transcripts, degree certificates, and grading system scale documents.',
      details: [
        'Request certified English translations if original university records are in another language.',
        'Obtain an official Grading System Explanation document from your university registrar.',
        'Prepare electronic PDF scans under 2MB each with crisp resolution.'
      ],
      tip: 'Many embassies require Higher Education Commission (HEC) or Ministry of Foreign Affairs (MOFA) attestation prior to visa issuance.'
    },
    {
      step: 4,
      title: 'Meet Language Proficiency Requirements',
      icon: <Languages className="w-6 h-6 text-violet-600" />,
      color: 'violet',
      summary: 'Confirm whether IELTS/TOEFL is mandatory or if an English Medium of Instruction (MOI) waiver applies.',
      details: [
        'Take IELTS Academic (aim for 6.5 - 7.5 overall with no band below 6.0) or TOEFL iBT (90 - 100+).',
        'Some programs (e.g., Chevening, select DAAD universities) do not mandate IELTS at the scholarship stage, but your chosen university may.',
        'If eligible, request an official English Proficiency Letter (MOI) from your prior university.'
      ],
      tip: 'Book your IELTS or TOEFL at least 3 months ahead so scores arrive comfortably before scholarship application deadlines.'
    },
    {
      step: 5,
      title: 'Craft a Standout CV & Motivation Letter',
      icon: <FileText className="w-6 h-6 text-amber-600" />,
      color: 'amber',
      summary: 'Articulate your academic vision, leadership record, and future contribution to your homeland.',
      details: [
        'Use the Europass format for European institutions, or standard academic CV for US and Commonwealth awards.',
        'Structure your Statement of Purpose: Why this course? Why this country? How will you solve problems back home?',
        'Avoid generic clichés; demonstrate concrete metrics, project outcomes, and specific professors you wish to study with.'
      ],
      tip: 'Tailor every single essay to the exact scholarship values (e.g., Chevening emphasizes networking; Fulbright stresses cultural diplomacy).'
    },
    {
      step: 6,
      title: 'Secure Strong Recommendation Letters (LORs)',
      icon: <Users2 className="w-6 h-6 text-sky-600" />,
      color: 'sky',
      summary: 'Choose referees who know your analytical abilities and work ethic personally.',
      details: [
        'Approach 2 academic professors and 1 professional supervisor at least 4-6 weeks prior to deadlines.',
        'Provide referees with your CV, draft SOP, and bullet points of projects you completed under their mentorship.',
        'Ensure recommendation letters are printed on official university/company letterhead with institutional email addresses.'
      ],
      tip: 'A detailed, personalized letter from an assistant professor always beats a generic one-paragraph letter from a busy Dean.'
    },
    {
      step: 7,
      title: 'Submit Application Well Before the Deadline',
      icon: <Send className="w-6 h-6 text-teal-600" />,
      color: 'teal',
      summary: 'Avoid last-minute server crashes by submitting at least 48 to 72 hours early.',
      details: [
        'Double-check all PDF uploads, document orientations, and mandatory form fields.',
        'Verify that referee submission links have been completed before the official cutoff.',
        'Download and archive a timestamped copy of your submitted application dossier.'
      ],
      tip: 'International portals frequently experience downtime in the final 6 hours due to traffic spikes from multiple time zones.'
    },
    {
      step: 8,
      title: 'Track Applications & Monitor Announcements',
      icon: <LineChart className="w-6 h-6 text-rose-600" />,
      color: 'rose',
      summary: 'Maintain status records, prepare for embassy interviews, and organize visa paperwork.',
      details: [
        'Log key interview dates, shortlisting windows, and university conditional offer deadlines in your Tracker.',
        'Practice mock interview questions with peers (focusing on your study objective and leadership vision).',
        'Upon receiving a conditional award, immediately finalize passport validity and medical clearances.'
      ],
      tip: 'Use our Application Tracker to manage document checklists, notes, and milestones in one central place.'
    }
  ];

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3 border border-blue-200/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Proven Application Roadmap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How to Achieve Your Dream Scholarship
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Follow our 8-step methodology used by thousands of international scholars to secure fully funded placements at Oxford, Cambridge, Harvard, Munich, Tokyo, and beyond.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const isOpen = activeStep === item.step;
            return (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Step header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                      {item.icon}
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      Step {item.step}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {item.summary}
                  </p>

                  {/* Expandable details */}
                  {isOpen && (
                    <div className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-600 animate-in fade-in duration-200">
                      <ul className="space-y-1.5">
                        {item.details.map((d, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 font-medium">
                        💡 <strong>Pro Tip:</strong> {item.tip}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4">
                  <button
                    onClick={() => setActiveStep(isOpen ? null : item.step)}
                    className="w-full text-left text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-between"
                  >
                    <span>{isOpen ? 'Show less' : 'View checklist & tips'}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA banner below guidelines */}
        {onStartMatching && (
          <div className="mt-12 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-bold">Ready to see which scholarships match your CGPA & target country?</h3>
              <p className="text-sm text-blue-100">
                Complete your personalized academic profile in 3 minutes to discover verified funding opportunities.
              </p>
            </div>
            <button
              onClick={onStartMatching}
              className="px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow hover:bg-blue-50 transition-all flex items-center gap-2 shrink-0"
            >
              <span>Build Profile & Find Matches</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
