import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile, TrackedApplication, UserAuth, Scholarship, AdminUser } from '../types';
import { VERIFIED_SCHOLARSHIPS } from '../data/scholarships';

interface AuthContextType {
  user: UserAuth | null;
  adminUser: AdminUser | null;
  isAdmin: boolean;
  profile: StudentProfile;
  savedScholarshipIds: string[];
  trackedApplications: TrackedApplication[];
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, password?: string) => Promise<{ success: boolean; code?: string; error?: string }>;
  verifyEmail: (code: string) => Promise<boolean>;
  logout: () => void;
  loginAdmin: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  updateProfile: (data: Partial<StudentProfile>) => Promise<void>;
  saveOnboardingStep: (step: number, data: Partial<StudentProfile>) => Promise<void>;
  toggleSaveScholarship: (scholarshipId: string) => Promise<boolean>;
  addTrackedApplication: (appData: Partial<TrackedApplication>) => Promise<void>;
  updateTrackedApplication: (id: string, updates: Partial<TrackedApplication>) => Promise<void>;
  deleteTrackedApplication: (id: string) => Promise<void>;
  loadDemoAccount: () => void;
}

export const BLANK_PROFILE: StudentProfile = {
  id: '',
  fullName: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  nationality: '',
  countryOfResidence: '',
  city: '',
  phone: '',
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
  percentage: 0,
  academicHonors: '',
  ieltsStatus: 'Not taken yet',
  ieltsOverall: null,
  ieltsListening: null,
  ieltsReading: null,
  ieltsWriting: null,
  ieltsSpeaking: null,
  toeflScore: null,
  otherLanguageTest: 'None',
  languageTestDate: '',
  preferredCountries: [],
  preferredDegreeLevel: 'Masters',
  preferredFields: [],
  preferredUniversities: [],
  preferredFundingType: 'Fully Funded',
  studyStartYear: new Date().getFullYear() + 1,
  studyMode: 'Full-time On Campus',
  workExperienceYears: 0,
  workExperienceSummary: '',
  researchExperience: '',
  volunteerExperience: '',
  extracurricular: '',
  certifications: '',
  awards: '',
  researchInterests: '',
  additionalInfo: '',
  cvFileName: '',
  onboardingCompleted: false,
  currentOnboardingStep: 1,
  updatedAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAuth | null>(() => {
    const saved = localStorage.getItem('gs_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('gs_profile');
    return saved ? JSON.parse(saved) : BLANK_PROFILE;
  });

  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('gs_saved_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const [trackedApplications, setTrackedApplications] = useState<TrackedApplication[]>(() => {
    const saved = localStorage.getItem('gs_tracker');
    return saved ? JSON.parse(saved) : [];
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('gs_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAdmin = !!adminUser;

  const [isLoading, setIsLoading] = useState(false);

  // Sync admin user to local storage
  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('gs_admin_user', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('gs_admin_user');
    }
  }, [adminUser]);

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

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'Demo@12345' }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        if (data.profile) setProfile(data.profile);
        if (data.savedScholarshipIds) setSavedScholarshipIds(data.savedScholarshipIds);
        if (data.trackedApplications) setTrackedApplications(data.trackedApplications);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: data.error || 'Invalid credentials' };
    } catch {
      // Offline fallback
      const fallbackUser: UserAuth = {
        id: 'usr-' + Math.random().toString(36).substring(2, 8),
        email: email.toLowerCase().trim(),
        name: email.split('@')[0],
        isEmailVerified: true,
      };
      setUser(fallbackUser);
      setIsLoading(false);
      return { success: true };
    }
  };

  const loginAdmin = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminUser(data.admin);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: data.error || 'Invalid admin credentials' };
    } catch {
      // Offline check for qulli / qulli
      if ((username === 'qulli' || username === 'qulli@admin.com') && password === 'qulli') {
        const fallbackAdmin: AdminUser = {
          username: 'qulli',
          name: 'Qulli (System Administrator)',
          role: 'superadmin',
          token: 'adm-token-qulli-' + Date.now(),
        };
        setAdminUser(fallbackAdmin);
        setIsLoading(false);
        return { success: true };
      }
      setIsLoading(false);
      return { success: false, error: 'Invalid admin credentials' };
    }
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('gs_admin_user');
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
    setProfile(BLANK_PROFILE);
    setSavedScholarshipIds([]);
    setTrackedApplications([]);
    localStorage.removeItem('gs_user');
    localStorage.removeItem('gs_profile');
    localStorage.removeItem('gs_saved_ids');
    localStorage.removeItem('gs_tracker');
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
    const demoUser: UserAuth = {
      id: 'usr-student-01',
      email: 'student@scholarpulse.org',
      name: 'Alex Rivera',
      isEmailVerified: true,
    };
    const demoProfile: StudentProfile = {
      ...BLANK_PROFILE,
      id: 'usr-student-01',
      fullName: 'Alex Rivera',
      email: 'student@scholarpulse.org',
      nationality: 'International',
      countryOfResidence: 'Canada',
      city: 'Toronto',
      highestCompletedEducation: "Bachelor's Degree",
      currentEducationLevel: "Graduated (Seeking Master's)",
      majorFieldOfStudy: 'Computer Science & AI',
      cgpa: 3.75,
      cgpaScale: 4.0,
      ieltsStatus: 'Completed',
      ieltsOverall: 7.5,
      preferredCountries: ['United Kingdom', 'Germany', 'Australia'],
      preferredDegreeLevel: 'Masters',
      preferredFundingType: 'Fully Funded',
      onboardingCompleted: true,
      currentOnboardingStep: 6,
    };
    setUser(demoUser);
    setProfile(demoProfile);
    setSavedScholarshipIds(['chevening-uk', 'daad-helmut-schmidt-germany']);
    setTrackedApplications([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        isAdmin,
        profile,
        savedScholarshipIds,
        trackedApplications,
        isLoading,
        login,
        register,
        verifyEmail,
        logout,
        loginAdmin,
        logoutAdmin,
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
