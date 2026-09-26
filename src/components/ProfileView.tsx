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
  Edit3,
  CheckCircle2,
  Save,
  X,
  FileText,
  Sparkles,
  Building,
  Mail,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';

interface ProfileViewProps {
  onNavigateToAiSearch?: () => void;
  onOpenWizard?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigateToAiSearch, onOpenWizard }) => {
  const { profile, updateProfile } = useAuth();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const calculateCompletion = () => {
    let score = 0;
    if (profile.fullName && profile.nationality) score += 20;
    if (profile.highestCompletedEducation && profile.majorFieldOfStudy) score += 20;
    if (profile.cgpa > 0) score += 20;
    if (profile.ieltsStatus) score += 15;
    if (profile.preferredCountries?.length > 0 && profile.preferredDegreeLevel) score += 15;
    if (profile.workExperienceYears !== undefined || profile.researchExperience) score += 10;
    return Math.min(100, score);
  };

  const completion = calculateCompletion();

  const handleEditClick = (section: string) => {
    setFormData(profile);
    setEditingSection(section);
  };

  const handleSaveSection = async () => {
    await updateProfile(formData);
    setEditingSection(null);
    setToastMessage('Section updated successfully! AI searches updated.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCountryToggle = (country: string) => {
    const list = formData.preferredCountries || [];
    if (list.includes(country)) {
      setFormData({ ...formData, preferredCountries: list.filter((c) => c !== country) });
    } else {
      setFormData({ ...formData, preferredCountries: [...list, country] });
    }
  };

  const handleFieldToggle = (field: string) => {
    const list = formData.preferredFields || [];
    if (list.includes(field)) {
      setFormData({ ...formData, preferredFields: list.filter((f) => f !== field) });
    } else {
      setFormData({ ...formData, preferredFields: [...list, field] });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile Header & Completion Meter */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-blue-500/20">
            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {profile.fullName || 'Student Profile'}
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Candidate
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>{profile.email}</span>
              <span>·</span>
              <span>{profile.nationality || 'Nationality not set'}</span>
              <span>·</span>
              <span>Target: {profile.preferredDegreeLevel || 'Masters'}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Progress dial */}
          <div className="text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-end gap-1.5 text-xs text-slate-500 mb-1">
              <span>Profile Strength</span>
              <span className="font-bold text-blue-600 text-sm">{completion}%</span>
            </div>
            <div className="w-40 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          {onNavigateToAiSearch && (
            <button
              onClick={onNavigateToAiSearch}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Search Matches</span>
            </button>
          )}
        </div>
      </div>

      {/* Organized Profile Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Personal Information */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Personal Information</h3>
              </div>
              <button
                onClick={() => handleEditClick('personal')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Full Name:</span>
                <span className="font-medium text-slate-800">{profile.fullName || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nationality:</span>
                <span className="font-medium text-slate-800">{profile.nationality || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Country of Residence:</span>
                <span className="font-medium text-slate-800">{profile.countryOfResidence || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">City:</span>
                <span className="font-medium text-slate-800">{profile.city || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="font-medium text-slate-800">{profile.phone || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gender:</span>
                <span className="font-medium text-slate-800">{profile.gender || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Educational Background */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Educational Background</h3>
              </div>
              <button
                onClick={() => handleEditClick('education')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Highest Education:</span>
                <span className="font-medium text-slate-800">{profile.highestCompletedEducation || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Degree Title:</span>
                <span className="font-medium text-slate-800">{profile.degreeTitle || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Major / Field:</span>
                <span className="font-medium text-slate-800">{profile.majorFieldOfStudy || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Institution:</span>
                <span className="font-medium text-slate-800">{profile.institutionName || '—'} ({profile.institutionCountry})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Graduation Year:</span>
                <span className="font-medium text-slate-800">{profile.graduationYear || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Enrollment Status:</span>
                <span className="font-medium text-slate-800">{profile.currentEnrollmentStatus || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Academic Performance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Academic Performance</h3>
              </div>
              <button
                onClick={() => handleEditClick('academic')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Current / Final CGPA:</span>
                <span className="font-extrabold text-blue-700 text-sm">
                  {profile.cgpa || 0} / {profile.cgpaScale || 4.0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Grading Scale:</span>
                <span className="font-medium text-slate-800">{profile.cgpaScale} Scale</span>
              </div>
              {profile.percentage && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Equivalent Percentage:</span>
                  <span className="font-medium text-slate-800">{profile.percentage}%</span>
                </div>
              )}
              <div className="pt-2">
                <span className="text-slate-400 block mb-1">Academic Honors & Achievements:</span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                  {profile.academicHonors || 'No honors recorded yet.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Language Proficiency */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Language Proficiency</h3>
              </div>
              <button
                onClick={() => handleEditClick('language')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">IELTS Status:</span>
                <span className="font-medium text-slate-800">{profile.ieltsStatus}</span>
              </div>
              {profile.ieltsStatus === 'Completed' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">IELTS Overall:</span>
                    <span className="font-bold text-slate-900">{profile.ieltsOverall}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Subscores:</span>
                    <span>
                      L: {profile.ieltsListening || '-'} · R: {profile.ieltsReading || '-'} · W: {profile.ieltsWriting || '-'} · S: {profile.ieltsSpeaking || '-'}
                    </span>
                  </div>
                </>
              )}
              {profile.toeflScore && (
                <div className="flex justify-between">
                  <span className="text-slate-400">TOEFL iBT Score:</span>
                  <span className="font-medium text-slate-800">{profile.toeflScore}</span>
                </div>
              )}
              {profile.otherLanguageTest && profile.otherLanguageTest !== 'None' && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Other Languages / Tests:</span>
                  <span className="font-medium text-slate-800">{profile.otherLanguageTest}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 5: Scholarship Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between md:col-span-2">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Scholarship & Study Preferences</h3>
              </div>
              <button
                onClick={() => handleEditClick('preferences')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block mb-1">Target Degree Level:</span>
                <span className="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                  {profile.preferredDegreeLevel}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Funding Preference:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {profile.preferredFundingType}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Target Start Year:</span>
                <span className="font-semibold text-slate-800">{profile.studyStartYear}</span>
              </div>

              <div className="sm:col-span-3 pt-2">
                <span className="text-slate-400 block mb-1.5">Target Destination Countries:</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.preferredCountries && profile.preferredCountries.length > 0 ? (
                    profile.preferredCountries.map((c, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded-md">
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">Open to all international destinations</span>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3 pt-2">
                <span className="text-slate-400 block mb-1.5">Target Disciplines:</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.preferredFields && profile.preferredFields.length > 0 ? (
                    profile.preferredFields.map((f, i) => (
                      <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-medium rounded-md">
                        {f}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No specific discipline filter</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Experience & Research */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between md:col-span-2">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Experience, Research & Leadership</h3>
              </div>
              <button
                onClick={() => handleEditClick('experience')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block mb-1">Work Experience:</span>
                <p className="text-slate-800 font-medium">
                  {profile.workExperienceYears || 0} years — {profile.workExperienceSummary || 'None recorded'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Curriculum Vitae:</span>
                <p className="text-slate-800 font-medium flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>{profile.cvFileName || 'Shahzab_Aman_Academic_CV.pdf (Attached)'}</span>
                </p>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-400 block mb-1">Research Publications & Projects:</span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {profile.researchExperience || 'No published research listed yet.'}
                </p>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-400 block mb-1">Leadership & Volunteer Service:</span>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {profile.volunteerExperience || 'No volunteer activities listed yet.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL DIALOG */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Edit {editingSection.toUpperCase()} Section
              </h3>
              <button
                onClick={() => setEditingSection(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editing forms based on section */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {editingSection === 'personal' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName || ''}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nationality</label>
                    <input
                      type="text"
                      value={formData.nationality || ''}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Country of Residence</label>
                    <input
                      type="text"
                      value={formData.countryOfResidence || ''}
                      onChange={(e) => setFormData({ ...formData, countryOfResidence: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>
                </>
              )}

              {editingSection === 'education' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Title</label>
                    <input
                      type="text"
                      value={formData.degreeTitle || ''}
                      onChange={(e) => setFormData({ ...formData, degreeTitle: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Major Field of Study</label>
                    <input
                      type="text"
                      value={formData.majorFieldOfStudy || ''}
                      onChange={(e) => setFormData({ ...formData, majorFieldOfStudy: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Name</label>
                    <input
                      type="text"
                      value={formData.institutionName || ''}
                      onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>
                </>
              )}

              {editingSection === 'academic' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.cgpa || ''}
                      onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Grading Scale</label>
                    <select
                      value={formData.cgpaScale || 4.0}
                      onChange={(e) => setFormData({ ...formData, cgpaScale: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    >
                      <option value={4.0}>4.0</option>
                      <option value={5.0}>5.0</option>
                      <option value={10.0}>10.0</option>
                      <option value={100}>100%</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Honors & Awards</label>
                    <textarea
                      rows={2}
                      value={formData.academicHonors || ''}
                      onChange={(e) => setFormData({ ...formData, academicHonors: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>
                </>
              )}

              {editingSection === 'language' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">IELTS Status</label>
                    <select
                      value={formData.ieltsStatus || 'Completed'}
                      onChange={(e) => setFormData({ ...formData, ieltsStatus: e.target.value as any })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    >
                      <option value="Completed">Completed</option>
                      <option value="Not taken yet">Not taken yet</option>
                      <option value="Not applicable">Not applicable</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Overall IELTS Score</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.ieltsOverall || ''}
                      onChange={(e) => setFormData({ ...formData, ieltsOverall: parseFloat(e.target.value) || null })}
                      className="w-full px-3 py-2 border rounded-xl text-sm font-bold"
                    />
                  </div>
                </>
              )}

              {editingSection === 'preferences' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Degree</label>
                    <select
                      value={formData.preferredDegreeLevel || 'Masters'}
                      onChange={(e) => setFormData({ ...formData, preferredDegreeLevel: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    >
                      {DEGREE_LEVELS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Funding Type</label>
                    <select
                      value={formData.preferredFundingType || 'Fully Funded'}
                      onChange={(e) => setFormData({ ...formData, preferredFundingType: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    >
                      <option value="Fully Funded">Fully Funded</option>
                      <option value="Partially Funded">Partially Funded</option>
                      <option value="Tuition Waiver">Tuition Waiver</option>
                    </select>
                  </div>
                </>
              )}

              {editingSection === 'experience' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Years of Experience</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.workExperienceYears || 0}
                      onChange={(e) => setFormData({ ...formData, workExperienceYears: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Research & Publications</label>
                    <textarea
                      rows={3}
                      value={formData.researchExperience || ''}
                      onChange={(e) => setFormData({ ...formData, researchExperience: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-sm"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingSection(null)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSection}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Section Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
