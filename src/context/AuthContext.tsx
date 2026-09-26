import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile, TrackedApplication, UserAuth, Scholarship } from '../types';
import { VERIFIED_SCHOLARSHIPS } from '../data/scholarships';

interface AuthContextType {
  user: UserAuth | null;
  profile: StudentProfile;
  savedScholarshipIds: string[];
  trackedApplications: TrackedApplication[];
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (fullName: string, email: string, password?: string) => Promise<{ success: boolean; code?: string; error?: string }>;
  verifyEmail: (code: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<StudentProfile>) => Promise<void>;
  saveOnboardingStep: (step: number, data: Partial<StudentProfile>) => Promise<void>;
  toggleSaveScholarship: (scholarshipId: string) => Promise<boolean>;
  addTrackedApplication: (appData: Partial<TrackedApplication>) => Promise<void>;
  updateTrackedApplication: (id: string, updates: Partial<TrackedApplication>) => Promise<void>;
  deleteTrackedApplication: (id: string) => Promise<void>;
  loadDemoAccount: () => void;
}

const DEFAULT_DEMO_PROFILE: StudentProfile = {
  id: 'usr-demo-01',
  fullName: 'Shahzab Aman',
  email: 'shahzabaman971@gmail.com',
  dateOfBirth: '2001-05-14',
  gender: 'Male',
  nationality: 'Pakistan',
  countryOfResidence: 'Pakistan',
  city: 'Lahore',
  phone: '+92 300 1234567',
  highestCompletedEducation: "Bachelor's Degree",
  currentEducationLevel: "Graduated (Seeking Master's)",
  previousDegree: 'BS Computer Science',
  degreeTitle: 'Bachelor of Science in Computer Science',
  majorFieldOfStudy: 'Computer Science',
  institutionName: 'FAST NUCES',
  institutionCountry: 'Pakistan',
  graduationYear: 2024,
  currentEnrollmentStatus: 'Graduated',
  cgpa: 3.58,
  cgpaScale: 4.0,
  percentage: 86,
  academicHonors: "Dean's List of Honor for 3 semesters; Best Final Year Project Award",
  ieltsStatus: 'Completed',
  ieltsOverall: 7.5,
  ieltsListening: 8.0,
  ieltsReading: 7.5,
  ieltsWriting: 7.0,
  ieltsSpeaking: 7.5,
  toeflScore: null,
  otherLanguageTest: 'None',
  languageTestDate: '2024-11-10',
  preferredCountries: ['United Kingdom', 'Germany', 'Australia', 'Sweden', 'Switzerland'],
  preferredDegreeLevel: 'Masters',
  preferredFields: ['Computer Science & AI', 'Data Science & Mathematics', 'Engineering & Technology'],
  preferredUniversities: ['Oxford', 'Cambridge', 'Technical University of Munich', 'ETH Zurich'],
  preferredFundingType: 'Fully Funded',
  studyStartYear: 2026,
  studyMode: 'Full-time On Campus',
  workExperienceYears: 2,
  workExperienceSummary: 'Software Engineer focusing on distributed backend systems and AI applications.',
  researchExperience: 'Published 1 paper on automated biomedical image segmentation in IEEE student symposium.',
  volunteerExperience: 'Volunteer mentor for youth coding bootcamps in Lahore.',
  extracurricular: 'Competitive programming team lead, Debating Society vice-president.',
  certifications: 'AWS Certified Solutions Architect; DeepLearning.AI Specialization',
  awards: 'National ICT R&D Fund Merit Scholarship recipient during undergraduate studies.',
  researchInterests: 'Generative AI, Large Language Model optimization, and Intelligent Systems.',
  additionalInfo: 'Eager to pursue postgraduate research in Europe and return to expand AI research in South Asia.',
  cvFileName: 'Shahzab_Aman_Academic_CV.pdf',
  onboardingCompleted: true,
  currentOnboardingStep: 6,
  updatedAt: new Date().toISOString(),
};

const INITIAL_DEMO_TRACKER: TrackedApplication[] = [
  {
    id: 'track-01',
    scholarshipId: 'chevening-uk',
    scholarshipTitle: 'Chevening Scholarships',
    provider: 'UK Foreign, Commonwealth & Development Office (FCDO)',
    country: 'United Kingdom',
    status: 'Preparing Documents',
    targetDegree: "Master's in Advanced Computer Science",
    submissionDeadline: '2026-11-05T12:00:00Z',
    personalTargetDate: '2026-10-20',
    notes: 'Drafting leadership and networking essays. Requested reference letter from Prof. David.',
    officialUrl: 'https://www.chevening.org/scholarships/',
    documentsChecklist: {
      'Passport Copy': true,
      'Academic Transcripts': true,
      'Degree Certificate': true,
      'Chevening Essays (4x)': false,
      'Recommendation Letters (2x)': true,
      'University Application Offer': false,
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'track-02',
    scholarshipId: 'daad-helmut-schmidt-germany',
    scholarshipTitle: 'DAAD Helmut-Schmidt-Programme',
    provider: 'German Academic Exchange Service (DAAD)',
    country: 'Germany',
    status: 'Interested',
    targetDegree: 'Master of Public Policy / Tech Governance',
    submissionDeadline: '2026-07-31T23:59:59Z',
    personalTargetDate: '2026-07-15',
    notes: 'Exploring partner university courses at Hertie School and University of Passau.',
    officialUrl: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
    documentsChecklist: {
      'Europass CV': true,
      'Letter of Motivation': false,
      'Degree Certificate': true,
      'IELTS Certificate': true,
    },
    lastUpdated: new Date().toISOString(),
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAuth | null>(() => {
    const saved = localStorage.getItem('gs_user');
    return saved
      ? JSON.parse(saved)
      : {
          id: 'usr-demo-01',
          email: 'shahzabaman971@gmail.com',
          name: 'Shahzab Aman',
          isEmailVerified: true,
        };
  });

  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('gs_profile');
    return saved ? JSON.parse(saved) : DEFAULT_DEMO_PROFILE;
  });

  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('gs_saved_ids');
    return saved ? JSON.parse(saved) : ['chevening-uk', 'daad-helmut-schmidt-germany', 'erasmus-mundus-emjm'];
  });

  const [trackedApplications, setTrackedApplications] = useState<TrackedApplication[]>(() => {
    const saved = localStorage.getItem('gs_tracker');
    return saved ? JSON.parse(saved) : INITIAL_DEMO_TRACKER;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('gs_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gs_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('gs_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('gs_saved_ids', JSON.stringify(savedScholarshipIds));
  }, [savedScholarshipIds]);

  useEffect(() => {
    localStorage.setItem('gs_tracker', JSON.stringify(trackedApplications));
  }, [trackedApplications]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'Demo@12345' }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.profile) setProfile(data.profile);
        if (data.savedScholarshipIds) setSavedScholarshipIds(data.savedScholarshipIds);
        if (data.trackedApplications) setTrackedApplications(data.trackedApplications);
        setIsLoading(false);
        return true;
      }
      // Fallback for offline/custom email
      const fallbackUser: UserAuth = {
        id: 'usr-' + Math.random().toString(36).substring(2, 8),
        email: email.toLowerCase().trim(),
        name: email.split('@')[0],
        isEmailVerified: true,
      };
      setUser(fallbackUser);
      setIsLoading(false);
      return true;
    } catch {
      const fallbackUser: UserAuth = {
        id: 'usr-' + Math.random().toString(36).substring(2, 8),
        email: email.toLowerCase().trim(),
        name: email.split('@')[0],
        isEmailVerified: true,
      };
      setUser(fallbackUser);
      setIsLoading(false);
      return true;
    }
  };

  const register = async (fullName: string, email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password: password || 'SecurePassword123' }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        const blankProfile: StudentProfile = {
          id: data.user.id,
          fullName: fullName.trim(),
          email: email.toLowerCase().trim(),
          nationality: '',
          countryOfResidence: '',
          city: '',
          highestCompletedEducation: '',
          currentEducationLevel: '',
          previousDegree: '',
          degreeTitle: '',
          majorFieldOfStudy: '',
          institutionName: '',
          institutionCountry: '',
          graduationYear: new Date().getFullYear(),
          currentEnrollmentStatus: '',
          cgpa: 0,
          cgpaScale: 4.0,
          ieltsStatus: 'Not taken yet',
          preferredCountries: [],
          preferredDegreeLevel: 'Masters',
          preferredFields: [],
          preferredFundingType: 'Fully Funded',
          studyStartYear: new Date().getFullYear() + 1,
          studyMode: 'Full-time On Campus',
          workExperienceYears: 0,
          onboardingCompleted: false,
          currentOnboardingStep: 1,
          updatedAt: new Date().toISOString(),
        };
        setProfile(blankProfile);
        setIsLoading(false);
        return { success: true, code: data.simulatedCode };
      }
      setIsLoading(false);
      return { success: false, error: data.error || 'Registration failed' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const verifyEmail = async (code: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, code }),
      });
      if (res.ok) {
        setUser({ ...user, isEmailVerified: true });
        return true;
      }
      // If code is 123456 allow verified
      if (code === '123456') {
        setUser({ ...user, isEmailVerified: true });
        return true;
      }
      return false;
    } catch {
      setUser({ ...user, isEmailVerified: true });
      return true;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gs_user');
  };

  const updateProfile = async (data: Partial<StudentProfile>) => {
    const updated = { ...profile, ...data, updatedAt: new Date().toISOString() };
    setProfile(updated);
    if (user?.email) {
      try {
        await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, profileData: updated }),
        });
      } catch (err) {
        console.warn('Could not sync profile to backend:', err);
      }
    }
  };

  const saveOnboardingStep = async (step: number, data: Partial<StudentProfile>) => {
    const updated = {
      ...profile,
      ...data,
      currentOnboardingStep: step,
      onboardingCompleted: step >= 6,
      updatedAt: new Date().toISOString(),
    };
    setProfile(updated);
    if (user?.email) {
      try {
        await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, profileData: updated }),
        });
      } catch (err) {
        console.warn('Could not sync step to backend:', err);
      }
    }
  };

  const toggleSaveScholarship = async (scholarshipId: string): Promise<boolean> => {
    const exists = savedScholarshipIds.includes(scholarshipId);
    let next: string[];
    let isNowSaved = false;
    if (exists) {
      next = savedScholarshipIds.filter((id) => id !== scholarshipId);
      isNowSaved = false;
    } else {
      next = [...savedScholarshipIds, scholarshipId];
      isNowSaved = true;
    }
    setSavedScholarshipIds(next);

    if (user?.email) {
      try {
        await fetch('/api/saved/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, scholarshipId }),
        });
      } catch (err) {
        console.warn('Could not sync saved to backend:', err);
      }
    }
    return isNowSaved;
  };

  const addTrackedApplication = async (appData: Partial<TrackedApplication>) => {
    const scholarship = VERIFIED_SCHOLARSHIPS.find((s) => s.id === appData.scholarshipId);
    const newTrack: TrackedApplication = {
      id: 'track-' + Math.random().toString(36).substring(2, 9),
      scholarshipId: appData.scholarshipId || 'general',
      scholarshipTitle: appData.scholarshipTitle || scholarship?.title || 'Target Scholarship',
      provider: appData.provider || scholarship?.provider || 'Funding Provider',
      country: appData.country || scholarship?.country || 'International',
      status: appData.status || 'Interested',
      targetDegree: appData.targetDegree || profile.preferredDegreeLevel || 'Masters',
      submissionDeadline: appData.submissionDeadline || scholarship?.deadlineDate || '',
      personalTargetDate: appData.personalTargetDate || '',
      notes: appData.notes || '',
      officialUrl: appData.officialUrl || scholarship?.officialUrl || '',
      documentsChecklist: appData.documentsChecklist || {
        'Academic Transcripts': false,
        'Curriculum Vitae (CV)': false,
        'Statement of Purpose (SOP)': false,
        'Recommendation Letters (2x)': false,
        'Language Proficiency Test': false,
      },
      lastUpdated: new Date().toISOString(),
    };

    const next = [newTrack, ...trackedApplications];
    setTrackedApplications(next);

    if (user?.email) {
      try {
        await fetch('/api/tracker', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, application: newTrack }),
        });
      } catch (err) {
        console.warn('Could not sync tracker to backend:', err);
      }
    }
  };

  const updateTrackedApplication = async (id: string, updates: Partial<TrackedApplication>) => {
    const next = trackedApplications.map((t) => (t.id === id ? { ...t, ...updates, lastUpdated: new Date().toISOString() } : t));
    setTrackedApplications(next);

    if (user?.email) {
      try {
        await fetch(`/api/tracker/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, updates }),
        });
      } catch (err) {
        console.warn('Could not sync tracker update to backend:', err);
      }
    }
  };

  const deleteTrackedApplication = async (id: string) => {
    const next = trackedApplications.filter((t) => t.id !== id);
    setTrackedApplications(next);

    if (user?.email) {
      try {
        await fetch(`/api/tracker/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email }),
        });
      } catch (err) {
        console.warn('Could not delete tracker item on backend:', err);
      }
    }
  };

  const loadDemoAccount = () => {
    setUser({
      id: 'usr-demo-01',
      email: 'shahzabaman971@gmail.com',
      name: 'Shahzab Aman',
      isEmailVerified: true,
    });
    setProfile(DEFAULT_DEMO_PROFILE);
    setSavedScholarshipIds(['chevening-uk', 'daad-helmut-schmidt-germany', 'erasmus-mundus-emjm']);
    setTrackedApplications(INITIAL_DEMO_TRACKER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        savedScholarshipIds,
        trackedApplications,
        isLoading,
        login,
        register,
        verifyEmail,
        logout,
        updateProfile,
        saveOnboardingStep,
        toggleSaveScholarship,
        addTrackedApplication,
        updateTrackedApplication,
        deleteTrackedApplication,
        loadDemoAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
