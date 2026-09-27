import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  Clock,
  Building,
  CheckCircle2,
  Headphones,
  Send,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 sm:p-8 space-y-6 my-auto relative animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={handleReset}
          aria-label="Close Support Modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              Official Secretariat
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            SEA The Sophie Education Academy
          </h3>
          <p className="text-xs text-slate-500">
            Admissions support, scholarship inquiries, and institutional verification.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1">
            <div className="flex items-center gap-2 text-blue-800 text-xs font-bold">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>Official Contact</span>
            </div>
            <a
              href="tel:+36302770528"
              className="text-base font-extrabold text-blue-900 hover:text-blue-700 hover:underline transition-colors block"
            >
              +36302770528
            </a>
            <p className="text-[11px] text-blue-600/80">
              Direct International Line
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
            <div className="flex items-center gap-2 text-indigo-800 text-xs font-bold">
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>Official Email</span>
            </div>
            <a
              href="mailto:sophieedpro@gmail.com"
              className="text-xs font-bold text-indigo-900 hover:text-indigo-700 hover:underline block truncate"
            >
              sophieedpro@gmail.com
            </a>
            <p className="text-[11px] text-indigo-600/80 truncate">
              Alternate: support@sea-academy.org
            </p>
          </div>
        </div>

        {/* Operating Hours Note */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Support hours: Mon – Fri, 09:00 to 18:00 CET. Typical email response in &lt; 24h.</span>
        </div>

        {/* Direct Inquiry Form */}
        {isSubmitted ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-emerald-900 text-sm">Inquiry Dispatched</h4>
            <p className="text-xs text-emerald-700">
              Thank you for contacting SEA The Sophie Education Academy. An advisor will get back to you shortly.
            </p>
            <button
              onClick={handleReset}
              className="mt-2 px-4 py-2 text-xs font-bold text-emerald-800 bg-white border border-emerald-300 rounded-xl hover:bg-emerald-50 transition-colors"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message or Scholarship Query *
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can SEA admissions assist you with scholarship matching, requirements, or documentation?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message to SEA Secretariat'}</span>
              </button>
              <a
                href="tel:+36302770528"
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Call Hotline</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
