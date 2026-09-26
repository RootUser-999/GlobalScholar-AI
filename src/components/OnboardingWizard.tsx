import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentProfile } from '../types';
import { COUNTRIES_LIST, DEGREE_LEVELS, FIELDS_OF_STUDY } from '../data/scholarships';
import {
  User,
  GraduationCap,
  Award,
  Languages,
  Compass,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle2,
  UploadCloud,
  FileText,
  AlertCircle
} from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
  onCancel?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onCancel }) => {
  const { profile, saveOnboardingStep } = useAuth();
  const [step, setStep] = useState<number>(profile.currentOnboardingStep || 1);
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalSteps = 6;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFieldChange = (field: keyof StudentProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountryToggle = (country: string) => {
    const list = formData.preferredCountries || [];
    if (list.includes(country)) {
      handleFieldChange('preferredCountries', list.filter((c) => c !== country));
    } else {
      handleFieldChange('preferredCountries', [...list, country]);
    }
  };

  const handleFieldToggle = (field: string) => {
    const list = formData.preferredFields || [];
    if (list.includes(field)) {
      handleFieldChange('preferredFields', list.filter((f) => f !== field));
    } else {
      handleFieldChange('preferredFields', [...list, field]);
    }
  };

  const handleSaveProgress = async () => {
    await saveOnboardingStep(step, formData);
    showToast('Progress saved securely!');
  };

  const handleNext = async () => {
    await saveOnboardingStep(step, formData);
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Step 6 completed, proceed to review / finish
      setStep(7); // Review step
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = async () => {
    await saveOnboardingStep(6, { ...formData, onboardingCompleted: true });
    showToast('Profile completed successfully! Redirecting to Dashboard...');
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Step progress indicator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Student Profile Onboarding
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {step <= 6 ? `Step ${step} of ${totalSteps}` : 'Final Profile Review'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveProgress}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-slate-400" />
              <span>Save Progress</span>
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
              >
                Skip for now
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>
              {step === 1 && 'Personal Information'}
              {step === 2 && 'Educational Background'}
              {step === 3 && 'Academic Performance & CGPA'}
              {step === 4 && 'Language Proficiency (IELTS/TOEFL)'}
              {step === 5 && 'Scholarship & Destination Preferences'}
              {step === 6 && 'Experience & Achievements'}
              {step === 7 && 'Review & Final Submission'}
            </span>
            <span className="font-semibold text-blue-600">
              {Math.min(100, Math.round(((step - 1) / totalSteps) * 100))}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (step / totalSteps) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Body Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        {/* STEP 1: Personal Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Step 1: Personal Information</h2>
            </div>
            <p className="text-xs text-slate-500">
              Enter your basic identity and location details. This enables matching with country-specific scholarship quotas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName || ''}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  placeholder="e.g. Shahzab Aman"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm bg-slate-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nationality (Citizenship) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nationality || ''}
                  onChange={(e) => handleFieldChange('nationality', e.target.value)}
                  placeholder="e.g. Pakistan, India, Nigeria, Brazil"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Country of Current Residence <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.countryOfResidence || ''}
                  onChange={(e) => handleFieldChange('countryOfResidence', e.target.value)}
                  placeholder="e.g. Pakistan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City of Residence <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  placeholder="e.g. Lahore, Karachi, Islamabad"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date of Birth (Optional)
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender (Optional)
                </label>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => handleFieldChange('gender', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Educational Background */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Step 2: Educational Background</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Highest Completed Education Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.highestCompletedEducation || ''}
                  onChange={(e) => handleFieldChange('highestCompletedEducation', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm bg-white"
                >
                  <option value="">Select Level</option>
                  <option value="High School / Secondary Diploma">High School / Secondary Diploma</option>
                  <option value="Bachelor's Degree">Bachelor's Degree (4 Years)</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Doctorate / PhD">Doctorate / PhD</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Education / Enrollment Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.currentEnrollmentStatus || ''}
                  onChange={(e) => handleFieldChange('currentEnrollmentStatus', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm bg-white"
                >
                  <option value="">Select Status</option>
                  <option value="Graduated">Graduated / Degree Conferred</option>
                  <option value="Final Year Student">Final Year Student (Graduating Soon)</option>
                  <option value="Enrolled">Currently Enrolled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Degree Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.degreeTitle || ''}
                  onChange={(e) => handleFieldChange('degreeTitle', e.target.value)}
                  placeholder="e.g. BS in Computer Science, BBA, MBBS"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Major or Field of Study <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.majorFieldOfStudy || ''}
                  onChange={(e) => handleFieldChange('majorFieldOfStudy', e.target.value)}
                  placeholder="e.g. Computer Science, Public Policy, Mechanical Eng."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institution Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.institutionName || ''}
                  onChange={(e) => handleFieldChange('institutionName', e.target.value)}
                  placeholder="e.g. FAST NUCES, University of Delhi, Cairo University"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institution Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.institutionCountry || ''}
                  onChange={(e) => handleFieldChange('institutionCountry', e.target.value)}
                  placeholder="e.g. Pakistan, India, Egypt"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Graduation Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.graduationYear || 2024}
                  onChange={(e) => handleFieldChange('graduationYear', parseInt(e.target.value, 10))}
                  min={2000}
                  max={2030}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Academic Performance */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Award className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Step 3: Academic Performance & Grading Scale</h2>
            </div>
            <p className="text-xs text-slate-500">
              Different countries use different grading systems. We record your exact scale (4.0, 5.0, 10.0, or %) to preserve accurate evaluation without unsupported assumptions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current or Final CGPA / Grade <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cgpa || ''}
                  onChange={(e) => handleFieldChange('cgpa', parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 3.58"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CGPA Grading Scale <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.cgpaScale || 4.0}
                  onChange={(e) => handleFieldChange('cgpaScale', parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm bg-white font-medium"
                >
                  <option value={4.0}>4.0 Scale (Standard US / International)</option>
                  <option value={5.0}>5.0 Scale (e.g. Singapore, Nigeria)</option>
                  <option value={10.0}>10.0 Scale (e.g. India, Turkey)</option>
                  <option value={100}>100% Percentage Scale</option>
                  <option value={20.0}>20.0 Scale (French system)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Equivalent Percentage (Optional)
                </label>
                <input
                  type="number"
                  value={formData.percentage || ''}
                  onChange={(e) => handleFieldChange('percentage', parseFloat(e.target.value) || null)}
                  placeholder="e.g. 85%"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Honors, Medals, or Dean's Lists
                </label>
                <textarea
                  rows={2}
                  value={formData.academicHonors || ''}
                  onChange={(e) => handleFieldChange('academicHonors', e.target.value)}
                  placeholder="e.g. Dean's List of Honor for 3 semesters; Gold Medal in Mathematics; 1st position in graduating cohort"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Language Proficiency */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Languages className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Step 4: Language Proficiency</h2>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Note:</strong> If you haven't taken IELTS yet, select "Not taken yet." Many scholarships offer English waivers or allow language submission later. You will not be penalized.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  IELTS Status <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Completed', 'Not taken yet', 'Not applicable'].map((statusOption) => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => handleFieldChange('ieltsStatus', statusOption)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                        formData.ieltsStatus === statusOption
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {statusOption}
                    </button>
                  ))}
                </div>
              </div>

              {formData.ieltsStatus === 'Completed' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      IELTS Overall Score
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      max={9}
                      value={formData.ieltsOverall || ''}
                      onChange={(e) => handleFieldChange('ieltsOverall', parseFloat(e.target.value) || null)}
                      placeholder="e.g. 7.5"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Test Date
                    </label>
                    <input
                      type="date"
                      value={formData.languageTestDate || ''}
                      onChange={(e) => handleFieldChange('languageTestDate', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Listening Score
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      max={9}
                      value={formData.ieltsListening || ''}
                      onChange={(e) => handleFieldChange('ieltsListening', parseFloat(e.target.value) || null)}
                      placeholder="8.0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Reading Score
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      max={9}
                      value={formData.ieltsReading || ''}
                      onChange={(e) => handleFieldChange('ieltsReading', parseFloat(e.target.value) || null)}
                      placeholder="7.5"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Writing Score
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      max={9}
                      value={formData.ieltsWriting || ''}
                      onChange={(e) => handleFieldChange('ieltsWriting', parseFloat(e.target.value) || null)}
                      placeholder="7.0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Speaking Score
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      max={9}
                      value={formData.ieltsSpeaking || ''}
                      onChange={(e) => handleFieldChange('ieltsSpeaking', parseFloat(e.target.value) || null)}
                      placeholder="7.5"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  TOEFL iBT Score (If applicable)
                </label>
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={formData.toeflScore || ''}
                  onChange={(e) => handleFieldChange('toeflScore', parseInt(e.target.value, 10) || null)}
                  placeholder="e.g. 100"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Other Language Test (Duolingo / PTE / German / Japanese)
                </label>
                <input
                  type="text"
                  value={formData.otherLanguageTest || ''}
                  onChange={(e) => handleFieldChange('otherLanguageTest', e.target.value)}
                  placeholder="e.g. Duolingo 130 / Goethe B1 / JLPT N3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Scholarship Preferences */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Compass className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Step 5: Scholarship & Destination Preferences</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Target Degree Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DEGREE_LEVELS.map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => handleFieldChange('preferredDegreeLevel', deg)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        formData.preferredDegreeLevel === deg
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {deg}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Preferred Destination Countries (Select multiple)
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 border border-slate-200 rounded-xl bg-slate-50">
                  {COUNTRIES_LIST.map((country) => {
                    const isSelected = formData.preferredCountries?.includes(country);
                    return (
                      <button
                        key={country}
                        type="button"
                        onClick={() => handleCountryToggle(country)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {country}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Preferred Fields of Study (Select multiple)
                </label>
                <div className="flex flex-wrap gap-2 p-3 border border-slate-200 rounded-xl bg-slate-50">
                  {FIELDS_OF_STUDY.map((f) => {
                    const isSelected = formData.preferredFields?.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => handleFieldToggle(f)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && '✓ '}
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Scholarship Funding Type
                  </label>
                  <select
                    value={formData.preferredFundingType || 'Fully Funded'}
                    onChange={(e) => handleFieldChange('preferredFundingType', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm bg-white"
                  >
                    <option value="Fully Funded">Fully Funded (Tuition + Living + Airfare)</option>
                    <option value="Partially Funded">Partially Funded</option>
                    <option value="Tuition Waiver">Tuition Waiver Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Study Start Year
                  </label>
                  <input
                    type="number"
                    value={formData.studyStartYear || 2026}
                    onChange={(e) => handleFieldChange('studyStartYear', parseInt(e.target.value, 10))}
                    min={2025}
                    max={2030}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Additional Information & Experience */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Step 6: Experience & Research Achievements</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Work Experience (Years)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    value={formData.workExperienceYears || 0}
                    onChange={(e) => handleFieldChange('workExperienceYears', parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Professional Summary
                  </label>
                  <input
                    type="text"
                    value={formData.workExperienceSummary || ''}
                    onChange={(e) => handleFieldChange('workExperienceSummary', e.target.value)}
                    placeholder="e.g. Software Engineer at TechCorp focusing on cloud backends"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Research Experience & Publications
                </label>
                <textarea
                  rows={2}
                  value={formData.researchExperience || ''}
                  onChange={(e) => handleFieldChange('researchExperience', e.target.value)}
                  placeholder="e.g. Published 1 paper on biomedical segmentation in IEEE student conference; Undergraduate thesis on renewable solar cells."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Volunteer & Extracurricular Leadership
                </label>
                <textarea
                  rows={2}
                  value={formData.volunteerExperience || ''}
                  onChange={(e) => handleFieldChange('volunteerExperience', e.target.value)}
                  placeholder="e.g. Vice President of University Debating Club; Volunteered with Red Cross / youth coding bootcamps."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              {/* CV Attachment simulation */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Curriculum Vitae (PDF)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
                  <UploadCloud className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-xs text-slate-700 font-medium">
                    {formData.cvFileName ? (
                      <span className="text-emerald-700 font-semibold flex items-center justify-center gap-1">
                        <FileText className="w-4 h-4" /> Attached: {formData.cvFileName}
                      </span>
                    ) : (
                      'Click to attach academic CV (PDF format)'
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Maximum 5MB · Europass or Standard Academic CV</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFieldChange('cvFileName', e.target.files[0].name);
                      }
                    }}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="mt-2 inline-block px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100"
                  >
                    Select File
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: REVIEW & CONFIRM */}
        {step === 7 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Review & Confirm Profile</h2>
            </div>
            <p className="text-xs text-slate-600">
              Review your information below. Once submitted, your profile will be used to automatically evaluate eligibility across all international scholarships.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Identity</span>
                <p><strong>Name:</strong> {formData.fullName}</p>
                <p><strong>Nationality:</strong> {formData.nationality}</p>
                <p><strong>Location:</strong> {formData.city}, {formData.countryOfResidence}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Education</span>
                <p><strong>Highest:</strong> {formData.highestCompletedEducation}</p>
                <p><strong>Degree:</strong> {formData.degreeTitle} ({formData.majorFieldOfStudy})</p>
                <p><strong>Institution:</strong> {formData.institutionName} ({formData.institutionCountry})</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Academic & Language</span>
                <p><strong>CGPA:</strong> {formData.cgpa} / {formData.cgpaScale}</p>
                <p><strong>IELTS:</strong> {formData.ieltsStatus} {formData.ieltsOverall ? `(${formData.ieltsOverall})` : ''}</p>
                <p><strong>TOEFL:</strong> {formData.toeflScore || 'N/A'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Preferences</span>
                <p><strong>Target Degree:</strong> {formData.preferredDegreeLevel}</p>
                <p><strong>Countries:</strong> {formData.preferredCountries?.join(', ') || 'Any'}</p>
                <p><strong>Funding:</strong> {formData.preferredFundingType}</p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveProgress}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold hidden sm:flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-slate-400" />
              <span>Save Progress</span>
            </button>

            {step <= 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>{step === 6 ? 'Review Profile' : 'Next Step'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish & Go to Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
