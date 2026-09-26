export interface CoverageDetails {
  tuition: string;
  monthlyStipend: string;
  airfare: string;
  healthInsurance: string;
  accommodation: string;
  otherAllowances?: string;
}

export interface AcademicRequirements {
  minCGPA: number;
  cgpaScale: number;
  equivalentPercentage?: string;
  degreePrerequisite: string;
  additionalRequirements?: string;
}

export interface LanguageRequirements {
  ieltsRequired: boolean;
  minIeltsOverall?: number;
  minIeltsSubscores?: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };
  toeflAccepted?: boolean;
  minToefl?: number;
  waiverPossible?: boolean;
  waiverCondition?: string;
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  country: string;
  countryCode: string;
  flagEmoji: string;
  degreeLevels: ('Bachelors' | 'Masters' | 'PhD' | 'Postdoc')[];
  fundingType: 'Fully Funded' | 'Partially Funded' | 'Tuition Waiver';
  fieldsOfStudy: string[];
  coverageDetails: CoverageDetails;
  deadline: string;
  deadlineDate: string; // ISO date for calculations
  academicRequirements: AcademicRequirements;
  languageRequirements: LanguageRequirements;
  eligibleNationalities: string[];
  officialUrl: string;
  officialApplicationPortal: string;
  source: string;
  lastVerified: string;
  overview: string;
  requiredDocuments: string[];
  applicationProcess: string[];
  isVerified: boolean;
  isFeatured: boolean;
  matchScore?: number;
  matchStatus?: 'eligible' | 'potentially_eligible' | 'attention_required' | 'ineligible' | 'not_determined';
  matchReason?: string;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  nationality: string;
  countryOfResidence: string;
  city: string;
  phone?: string;
  
  // Education
  highestCompletedEducation: string;
  currentEducationLevel: string;
  previousDegree: string;
  degreeTitle: string;
  majorFieldOfStudy: string;
  institutionName: string;
  institutionCountry: string;
  graduationYear: number;
  currentEnrollmentStatus: string;
  
  // Academic Performance
  cgpa: number;
  cgpaScale: number;
  percentage?: number | null;
  academicHonors?: string;
  
  // Language Proficiency
  ieltsStatus: 'Completed' | 'Not taken yet' | 'Not applicable';
  ieltsOverall?: number | null;
  ieltsListening?: number | null;
  ieltsReading?: number | null;
  ieltsWriting?: number | null;
  ieltsSpeaking?: number | null;
  toeflScore?: number | null;
  otherLanguageTest?: string;
  languageTestDate?: string;
  
  // Preferences
  preferredCountries: string[];
  preferredDegreeLevel: string;
  preferredFields: string[];
  preferredUniversities?: string[];
  preferredFundingType: string;
  studyStartYear: number;
  studyMode: string;
  
  // Experience & Achievements
  workExperienceYears: number;
  workExperienceSummary?: string;
  researchExperience?: string;
  volunteerExperience?: string;
  extracurricular?: string;
  certifications?: string;
  awards?: string;
  researchInterests?: string;
  additionalInfo?: string;
  cvFileName?: string | null;
  
  onboardingCompleted: boolean;
  currentOnboardingStep: number;
  updatedAt: string;
}

export type ApplicationStatus =
  | 'Interested'
  | 'Preparing Documents'
  | 'Ready to Apply'
  | 'Applied'
  | 'Accepted'
  | 'Rejected';

export interface TrackedApplication {
  id: string;
  scholarshipId: string;
  scholarshipTitle: string;
  provider: string;
  country: string;
  status: ApplicationStatus;
  targetDegree: string;
  submissionDeadline: string;
  personalTargetDate: string;
  notes: string;
  officialUrl: string;
  documentsChecklist: { [key: string]: boolean };
  lastUpdated: string;
}

export interface SavedScholarship {
  scholarshipId: string;
  savedAt: string;
  notes?: string;
}

export interface EligibilityResult {
  status: 'eligible' | 'potentially_eligible' | 'attention_required' | 'ineligible';
  summary: string;
  score: number; // 0 - 100
  criteria: {
    nationality: { pass: boolean; details: string };
    degreeLevel: { pass: boolean; details: string };
    academicCGPA: { pass: boolean; details: string };
    language: { pass: boolean; details: string };
    fieldOfStudy: { pass: boolean; details: string };
  };
  recommendations: string[];
  disclaimer: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AISearchResponse {
  query: string;
  scholarships: Scholarship[];
  groundingSources: GroundingSource[];
  aiOverview: string;
  isLiveSearch: boolean;
}

export interface UserAuth {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  token?: string;
}
