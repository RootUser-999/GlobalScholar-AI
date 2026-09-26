import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { VERIFIED_SCHOLARSHIPS } from './src/data/scholarships';
import { evaluateEligibility } from './src/utils/eligibility';
import { Scholarship, ServerLogEntry, AdminAnalytics, AdminStudent, ApplicationStatus } from './src/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const serverStartTime = Date.now();

app.use(express.json({ limit: '10mb' }));

// ----------------- SERVER EXECUTION LOGS SYSTEM ----------------- //
const serverLogs: ServerLogEntry[] = [];

export function addLog(
  level: 'INFO' | 'WARN' | 'ERROR' | 'AI_SEARCH',
  message: string,
  category: string = 'SYSTEM',
  details?: any
) {
  const entry: ServerLogEntry = {
    id: 'log-' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    level,
    message,
    category,
    details: details ? (typeof details === 'object' ? details : { raw: details }) : undefined,
  };
  serverLogs.unshift(entry);
  if (serverLogs.length > 500) {
    serverLogs.pop();
  }
  console.log(`[${entry.timestamp}] [${level}] [${category}] ${message}`);
}

// Initial boot log
addLog('INFO', 'GlobalScholar AI Full-Stack Server initialized', 'BOOT', {
  port: PORT,
  nodeEnv: process.env.NODE_ENV || 'development',
});

// Request logger middleware
app.use((req, res, next) => {
  if (req.path.startsWith('/api') && req.path !== '/api/admin/logs' && req.path !== '/api/health') {
    addLog('INFO', `${req.method} ${req.path}`, 'HTTP', {
      ip: req.ip || req.socket.remoteAddress,
      query: Object.keys(req.query).length ? req.query : undefined,
    });
  }
  next();
});

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  addLog('INFO', 'Gemini AI Client initialized with Google Search Grounding enabled', 'AI_ENGINE', {
    model: 'gemini-3.8-flash',
  });
} else {
  addLog('WARN', 'GEMINI_API_KEY is not defined. AI searches will use institutional database matching.', 'AI_ENGINE');
}

// ----------------- MUTABLE SCHOLARSHIPS DATABASE ----------------- //
// Seeded from verified institutional scholarships catalog, allowing admin CRUD operations
let scholarshipsDB: Scholarship[] = JSON.parse(JSON.stringify(VERIFIED_SCHOLARSHIPS));
addLog('INFO', `Scholarship Database loaded with ${scholarshipsDB.length} verified opportunities`, 'DATABASE');

// ----------------- USER & PROFILE STORE ----------------- //
interface UserStoreRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  verificationCode?: string;
  verificationSentAt?: number;
  profile: any;
  savedScholarshipIds: string[];
  trackedApplications: any[];
}

interface UserStore {
  [email: string]: UserStoreRecord;
}

const INITIAL_DEMO_USER: UserStoreRecord = {
  id: 'usr-demo-01',
  email: 'shahzabaman971@gmail.com',
  name: 'Shahzab Aman',
  passwordHash: 'Demo@12345',
  isEmailVerified: true,
  isActive: true,
  createdAt: '2026-09-01T10:00:00Z',
  profile: {
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
    preferredUniversities: ['Oxford', 'Cambridge', 'Technical University of Munich', 'ETH Zurich', 'University of Melbourne'],
    preferredFundingType: 'Fully Funded',
    studyStartYear: 2026,
    studyMode: 'Full-time On Campus',
    workExperienceYears: 2,
    workExperienceSummary: 'Software Engineer focusing on distributed backend systems and machine learning APIs.',
    researchExperience: 'Published 1 paper on automated biomedical image segmentation in IEEE student conference.',
    volunteerExperience: 'Volunteer mentor for youth coding bootcamps in Lahore.',
    extracurricular: 'Competitive programming team lead, University Debating Society vice-president.',
    certifications: 'AWS Certified Solutions Architect Associate; DeepLearning.AI Specialization',
    awards: 'National ICT R&D Fund Merit Scholarship recipient during undergraduate studies.',
    researchInterests: 'Generative AI, Large Language Model optimization, and Intelligent Robotics.',
    additionalInfo: 'Eager to pursue advanced postgraduate research and return to advance AI research initiatives in emerging economies.',
    cvFileName: 'Shahzab_Aman_Academic_CV.pdf',
    onboardingCompleted: true,
    currentOnboardingStep: 6,
    updatedAt: new Date().toISOString(),
  },
  savedScholarshipIds: ['chevening-uk', 'daad-helmut-schmidt-germany', 'erasmus-mundus-emjm'],
  trackedApplications: [
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
      notes: 'Finalizing draft for leadership and networking essays. Contacted Dr. Tariq for first academic reference letter.',
      officialUrl: 'https://www.chevening.org/scholarships/',
      documentsChecklist: {
        'Passport Copy': true,
        'Academic Transcripts': true,
        'Degree Certificate': true,
        'Chevening Essays (4x)': false,
        'Recommendation Letters (2x)': true,
        'University Application Submission': false,
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
      notes: 'Reviewing partner university curricula at Willy Brandt School Erfurt and Hertie School Berlin.',
      officialUrl: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
      documentsChecklist: {
        'Europass CV': true,
        'Letter of Motivation': false,
        'Degree Certificate': true,
        'IELTS Certificate': true,
      },
      lastUpdated: new Date().toISOString(),
    },
  ],
};

const users: UserStore = {
  [INITIAL_DEMO_USER.email]: INITIAL_DEMO_USER,
};

let searchQueriesCount = 12; // Initial seed counter

// Rate limiter / cache for search
interface SearchCacheItem {
  timestamp: number;
  data: any;
}
const searchCache = new Map<string, SearchCacheItem>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

// ----------------- ADMIN AUTHENTICATION ----------------- //
// Hardcoded Admin Credentials:
// Username: qulli
// Password: qulli
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const cleanUser = username.trim().toLowerCase();
  if ((cleanUser === 'qulli' || cleanUser === 'qulli@admin.com') && password === 'qulli') {
    addLog('INFO', 'Administrator "qulli" authenticated successfully', 'ADMIN_AUTH');
    return res.json({
      success: true,
      admin: {
        username: 'qulli',
        name: 'Qulli (System Administrator)',
        role: 'superadmin',
        token: 'adm-token-qulli-' + Date.now(),
      },
    });
  }

  addLog('WARN', `Failed admin login attempt with username "${username}"`, 'ADMIN_AUTH');
  return res.status(401).json({ error: 'Invalid admin credentials. Please check your username and password.' });
});

// ----------------- ADMIN ANALYTICS ----------------- //
app.get('/api/admin/analytics', (req, res) => {
  try {
    const userList = Object.values(users);
    const totalStudents = userList.length;
    const totalScholarships = scholarshipsDB.length;
    const featuredScholarships = scholarshipsDB.filter((s) => s.isFeatured).length;

    let totalTrackedApplications = 0;
    const statusCounts: Record<ApplicationStatus, number> = {
      Interested: 0,
      'Preparing Documents': 0,
      'Ready to Apply': 0,
      Applied: 0,
      Accepted: 0,
      Rejected: 0,
    };

    userList.forEach((u) => {
      if (u.trackedApplications && Array.isArray(u.trackedApplications)) {
        totalTrackedApplications += u.trackedApplications.length;
        u.trackedApplications.forEach((app: any) => {
          if (app.status && statusCounts[app.status as ApplicationStatus] !== undefined) {
            statusCounts[app.status as ApplicationStatus]++;
          }
        });
      }
    });

    const analytics: AdminAnalytics = {
      totalStudents,
      totalScholarships,
      featuredScholarships,
      totalTrackedApplications,
      statusCounts,
      activeSearchQueriesCount: searchQueriesCount,
      serverUptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
      geminiStatus: {
        connected: !!apiKey,
        model: 'gemini-3.8-flash',
        searchGrounding: !!apiKey,
      },
    };

    res.json(analytics);
  } catch (err: any) {
    addLog('ERROR', `Failed to compute analytics: ${err.message}`, 'ADMIN');
    res.status(500).json({ error: 'Failed to retrieve analytics' });
  }
});

// ----------------- ADMIN STUDENT MANAGEMENT ----------------- //
app.get('/api/admin/students', (req, res) => {
  try {
    const studentList: AdminStudent[] = Object.values(users).map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      isEmailVerified: u.isEmailVerified,
      isActive: u.isActive !== false,
      createdAt: u.createdAt || new Date().toISOString(),
      profile: u.profile,
      trackedCount: u.trackedApplications ? u.trackedApplications.length : 0,
      savedCount: u.savedScholarshipIds ? u.savedScholarshipIds.length : 0,
    }));

    res.json({ students: studentList });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch student directory' });
  }
});

// Toggle student active/suspended state
app.put('/api/admin/students/:id/status', (req, res) => {
  const { isActive } = req.body;
  const targetUser = Object.values(users).find((u) => u.id === req.params.id);

  if (!targetUser) {
    return res.status(404).json({ error: 'Student record not found' });
  }

  targetUser.isActive = isActive;
  addLog(
    'WARN',
    `Administrator modified student status for ${targetUser.email} to: ${isActive ? 'ACTIVE' : 'SUSPENDED'}`,
    'ADMIN_USER_MOD'
  );

  res.json({ success: true, studentId: targetUser.id, isActive: targetUser.isActive });
});

// Reset student password
app.post('/api/admin/students/:id/reset-password', (req, res) => {
  const { newPassword } = req.body;
  const targetUser = Object.values(users).find((u) => u.id === req.params.id);

  if (!targetUser) {
    return res.status(404).json({ error: 'Student record not found' });
  }

  const passwordToSet = newPassword || 'Reset@2026!';
  targetUser.passwordHash = passwordToSet;
  addLog('INFO', `Administrator reset password for student ${targetUser.email}`, 'ADMIN_USER_MOD');

  res.json({ success: true, message: `Password reset to: ${passwordToSet}` });
});

// ----------------- ADMIN SCHOLARSHIP MANAGEMENT (CRUD) ----------------- //
// Create / Add scholarship
app.post('/api/admin/scholarships', (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.provider || !data.country) {
      return res.status(400).json({ error: 'Title, Provider, and Country are mandatory.' });
    }

    const newId =
      data.id ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
        '-' +
        Math.random().toString(36).substring(2, 6);

    const newScholarship: Scholarship = {
      id: newId,
      title: data.title,
      provider: data.provider,
      country: data.country,
      countryCode: data.countryCode || 'INT',
      flagEmoji: data.flagEmoji || '🌐',
      degreeLevels: data.degreeLevels || ['Masters'],
      fundingType: data.fundingType || 'Fully Funded',
      fieldsOfStudy: data.fieldsOfStudy || ['All Fields'],
      coverageDetails: data.coverageDetails || {
        tuition: data.tuition || '100% Tuition Waiver',
        monthlyStipend: data.monthlyStipend || 'Comprehensive Monthly Living Stipend',
        airfare: data.airfare || 'Economy Return Flight Ticket',
        healthInsurance: data.healthInsurance || 'Full Health Insurance',
        accommodation: data.accommodation || 'Housing support provided',
      },
      deadline: data.deadline || 'Consult official schedule',
      deadlineDate: data.deadlineDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 120).toISOString(),
      academicRequirements: data.academicRequirements || {
        minCGPA: parseFloat(data.minCGPA) || 3.0,
        cgpaScale: 4.0,
        degreePrerequisite: 'Relevant undergraduate qualification',
      },
      languageRequirements: data.languageRequirements || {
        ieltsRequired: data.ieltsRequired !== undefined ? data.ieltsRequired : true,
        minIeltsOverall: parseFloat(data.minIeltsOverall) || 6.5,
        waiverPossible: data.waiverPossible || false,
      },
      eligibleNationalities: data.eligibleNationalities || ['All International Applicants'],
      officialUrl: data.officialUrl || 'https://www.chevening.org/',
      officialApplicationPortal: data.officialApplicationPortal || data.officialUrl || 'https://www.chevening.org/',
      source: data.source || 'Admin Direct Entry',
      lastVerified: new Date().toISOString().split('T')[0],
      overview: data.overview || 'Comprehensive international higher education fellowship opportunity.',
      requiredDocuments: data.requiredDocuments || ['Academic Transcripts', 'CV', 'Statement of Purpose', 'LORs'],
      applicationProcess: data.applicationProcess || [
        'Prepare certified academic records',
        'Submit official application on provider website',
      ],
      isVerified: true,
      isFeatured: !!data.isFeatured,
    };

    scholarshipsDB.unshift(newScholarship);
    searchCache.clear(); // invalidate search cache
    addLog('INFO', `Admin created new scholarship: "${newScholarship.title}" [${newScholarship.id}]`, 'SCHOLARSHIP_CRUD');

    res.status(201).json({ success: true, scholarship: newScholarship });
  } catch (err: any) {
    addLog('ERROR', `Error creating scholarship: ${err.message}`, 'SCHOLARSHIP_CRUD');
    res.status(500).json({ error: err.message || 'Failed to create scholarship' });
  }
});

// Update scholarship
app.put('/api/admin/scholarships/:id', (req, res) => {
  const index = scholarshipsDB.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Scholarship not found' });
  }

  const updated: Scholarship = {
    ...scholarshipsDB[index],
    ...req.body,
    id: scholarshipsDB[index].id, // keep immutable id
    lastVerified: new Date().toISOString().split('T')[0],
  };

  scholarshipsDB[index] = updated;
  searchCache.clear();
  addLog('INFO', `Admin updated scholarship: "${updated.title}" [${updated.id}]`, 'SCHOLARSHIP_CRUD');

  res.json({ success: true, scholarship: updated });
});

// Delete scholarship
app.delete('/api/admin/scholarships/:id', (req, res) => {
  const index = scholarshipsDB.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Scholarship not found' });
  }

  const removed = scholarshipsDB.splice(index, 1)[0];
  searchCache.clear();
  addLog('WARN', `Admin deleted scholarship: "${removed.title}" [${removed.id}]`, 'SCHOLARSHIP_CRUD');

  res.json({ success: true, message: `Scholarship "${removed.title}" deleted.` });
});

// Toggle Featured Status
app.post('/api/admin/scholarships/:id/toggle-featured', (req, res) => {
  const scholarship = scholarshipsDB.find((s) => s.id === req.params.id);
  if (!scholarship) {
    return res.status(404).json({ error: 'Scholarship not found' });
  }

  scholarship.isFeatured = !scholarship.isFeatured;
  searchCache.clear();
  addLog(
    'INFO',
    `Admin toggled featured status for "${scholarship.title}" to: ${scholarship.isFeatured ? 'FEATURED' : 'STANDARD'}`,
    'SCHOLARSHIP_CRUD'
  );

  res.json({ success: true, isFeatured: scholarship.isFeatured, scholarship });
});

// ----------------- ADMIN EXECUTION LOGS ----------------- //
app.get('/api/admin/logs', (req, res) => {
  const { level, search } = req.query;
  let filtered = [...serverLogs];

  if (level && typeof level === 'string' && level !== 'ALL') {
    filtered = filtered.filter((l) => l.level === level);
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter((l) => l.message.toLowerCase().includes(q) || l.category?.toLowerCase().includes(q));
  }

  res.json({ logs: filtered.slice(0, 100), totalCount: serverLogs.length });
});

app.delete('/api/admin/logs', (req, res) => {
  serverLogs.length = 0;
  addLog('INFO', 'Server execution logs cleared by administrator "qulli"', 'ADMIN');
  res.json({ success: true, message: 'Logs cleared successfully' });
});

// ----------------- PUBLIC & STUDENT SCHOLARSHIP API ----------------- //

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasGeminiKey: !!apiKey,
    totalScholarships: scholarshipsDB.length,
    uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
  });
});

// List scholarships with filtering (served from dynamic scholarshipsDB)
app.get('/api/scholarships', (req, res) => {
  try {
    let results = [...scholarshipsDB];
    const { query, country, degreeLevel, fundingType, field, featuredOnly } = req.query;

    if (query && typeof query === 'string' && query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          s.overview.toLowerCase().includes(q) ||
          s.fieldsOfStudy.some((f) => f.toLowerCase().includes(q))
      );
    }

    if (country && typeof country === 'string' && country !== 'All') {
      results = results.filter((s) => s.country.toLowerCase() === country.toLowerCase());
    }

    if (degreeLevel && typeof degreeLevel === 'string' && degreeLevel !== 'All') {
      results = results.filter((s) => s.degreeLevels.includes(degreeLevel as any));
    }

    if (fundingType && typeof fundingType === 'string' && fundingType !== 'All') {
      results = results.filter((s) => s.fundingType === fundingType);
    }

    if (field && typeof field === 'string' && field !== 'All') {
      results = results.filter(
        (s) =>
          s.fieldsOfStudy.includes('All Fields') ||
          s.fieldsOfStudy.some((f) => f.toLowerCase().includes(field.toLowerCase()))
      );
    }

    if (featuredOnly === 'true') {
      results = results.filter((s) => s.isFeatured);
    }

    res.json({ count: results.length, scholarships: results });
  } catch (error: any) {
    addLog('ERROR', `Failed to fetch scholarships: ${error.message}`, 'HTTP');
    res.status(500).json({ error: error.message || 'Failed to fetch scholarships' });
  }
});

// Single scholarship details
app.get('/api/scholarships/:id', (req, res) => {
  const scholarship = scholarshipsDB.find((s) => s.id === req.params.id);
  if (!scholarship) {
    return res.status(404).json({ error: 'Scholarship not found' });
  }
  res.json({ scholarship });
});

// Student Authentication endpoints
app.post('/api/auth/register', (req, res) => {
  const { fullName, email, password } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Full name, email, and password are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  if (users[cleanEmail]) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUserId = 'usr-' + Math.random().toString(36).substring(2, 9);
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const newUser: UserStoreRecord = {
    id: newUserId,
    email: cleanEmail,
    name: fullName.trim(),
    passwordHash: password,
    isEmailVerified: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    verificationCode,
    verificationSentAt: Date.now(),
    profile: {
      id: newUserId,
      fullName: fullName.trim(),
      email: cleanEmail,
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
    },
    savedScholarshipIds: [],
    trackedApplications: [],
  };

  users[cleanEmail] = newUser;
  addLog('INFO', `New student registered: ${newUser.name} (${newUser.email})`, 'AUTH');

  res.json({
    message: 'Registration successful! Verification code sent to email.',
    user: { id: newUser.id, email: newUser.email, name: newUser.name, isEmailVerified: false },
    simulatedCode: verificationCode,
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const user = users[cleanEmail];

  if (!user || user.passwordHash !== password) {
    addLog('WARN', `Failed student login attempt for ${cleanEmail}`, 'AUTH');
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (user.isActive === false) {
    addLog('WARN', `Suspended student attempted login: ${cleanEmail}`, 'AUTH');
    return res.status(403).json({ error: 'Your student account has been suspended by an administrator. Please contact support.' });
  }

  addLog('INFO', `Student signed in: ${user.email}`, 'AUTH');

  res.json({
    user: { id: user.id, email: user.email, name: user.name, isEmailVerified: user.isEmailVerified },
    profile: user.profile,
    savedScholarshipIds: user.savedScholarshipIds,
    trackedApplications: user.trackedApplications,
  });
});

app.post('/api/auth/verify-email', (req, res) => {
  const { email, code } = req.body;
  const cleanEmail = email?.toLowerCase().trim();
  const user = users[cleanEmail];
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.verificationCode && user.verificationCode === code) {
    user.isEmailVerified = true;
    addLog('INFO', `Email verified for student: ${user.email}`, 'AUTH');
    return res.json({ success: true, message: 'Email verified successfully!' });
  }

  // Allow test code 123456
  if (code === '123456') {
    user.isEmailVerified = true;
    addLog('INFO', `Email verified (demo code) for student: ${user.email}`, 'AUTH');
    return res.json({ success: true, message: 'Email verified successfully!' });
  }

  res.status(400).json({ error: 'Invalid verification code' });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  const cleanEmail = email?.toLowerCase().trim();
  const user = users[cleanEmail];
  if (!user) {
    return res.json({ message: 'If an account exists with this email, a password reset link has been dispatched.' });
  }
  addLog('INFO', `Password reset dispatched for ${user.email}`, 'AUTH');
  res.json({
    message: 'If an account exists with this email, a password reset link has been dispatched.',
    simulatedLink: `https://app.globalscholar.org/reset-password?token=simulated-${user.id}`,
  });
});

// Profile endpoints
app.get('/api/profile', (req, res) => {
  const email = (req.query.email as string)?.toLowerCase().trim();
  const user = users[email] || users[INITIAL_DEMO_USER.email];
  res.json({ profile: user.profile });
});

app.put('/api/profile', (req, res) => {
  const { email, profileData } = req.body;
  const cleanEmail = email?.toLowerCase().trim();
  const user = users[cleanEmail] || users[INITIAL_DEMO_USER.email];

  user.profile = {
    ...user.profile,
    ...profileData,
    updatedAt: new Date().toISOString(),
  };

  addLog('INFO', `Student updated profile: ${user.email}`, 'PROFILE', {
    cgpa: user.profile.cgpa,
    targetDegree: user.profile.preferredDegreeLevel,
  });

  res.json({ profile: user.profile });
});

// Saved scholarships endpoints
app.get('/api/saved', (req, res) => {
  const email = (req.query.email as string)?.toLowerCase().trim();
  const user = users[email] || users[INITIAL_DEMO_USER.email];
  const savedScholarships = scholarshipsDB.filter((s) => user.savedScholarshipIds.includes(s.id));
  res.json({ savedIds: user.savedScholarshipIds, scholarships: savedScholarships });
});

app.post('/api/saved/toggle', (req, res) => {
  const { email, scholarshipId } = req.body;
  const cleanEmail = email?.toLowerCase().trim();
  const user = users[cleanEmail] || users[INITIAL_DEMO_USER.email];

  const index = user.savedScholarshipIds.indexOf(scholarshipId);
  let isSaved = false;
  if (index > -1) {
    user.savedScholarshipIds.splice(index, 1);
    isSaved = false;
  } else {
    user.savedScholarshipIds.push(scholarshipId);
    isSaved = true;
  }

  addLog('INFO', `Student ${user.email} ${isSaved ? 'saved' : 'unsaved'} scholarship ${scholarshipId}`, 'SAVED');
  res.json({ isSaved, savedIds: user.savedScholarshipIds });
});

// Application tracker endpoints
app.get('/api/tracker', (req, res) => {
  const email = (req.query.email as string)?.toLowerCase().trim();
  const user = users[email] || users[INITIAL_DEMO_USER.email];
  res.json({ tracker: user.trackedApplications });
});

app.post('/api/tracker', (req, res) => {
  const { email, application } = req.body;
  const cleanEmail = email?.toLowerCase().trim();
  const user = users[cleanEmail] || users[INITIAL_DEMO_USER.email];

  const newApp = {
    id: 'track-' + Math.random().toString(36).substring(2, 9),
    scholarshipId: application.scholarshipId,
    scholarshipTitle: application.scholarshipTitle,
    provider: application.provider,
    country: application.country,
    status: application.status || 'Interested',
    targetDegree: application.targetDegree || 'Masters',
    submissionDeadline: application.submissionDeadline || '',
    personalTargetDate: application.personalTargetDate || '',
    notes: application.notes || '',
    officialUrl: application.officialUrl || '',
    documentsChecklist: application.documentsChecklist || {
      'Official Transcripts': false,
      'Statement of Purpose': false,
      'Recommendation Letters': false,
      'Language Test Certificate': false,
    },
    lastUpdated: new Date().toISOString(),
  };

  user.trackedApplications.push(newApp);
  addLog('INFO', `Student ${user.email} added application to tracker: "${newApp.scholarshipTitle}"`, 'TRACKER');
  res.json({ tracker: user.trackedApplications, application: newApp });
});

app.put('/api/tracker/:id', (req, res) => {
  const { email, updates } = req.body;
  const cleanEmail = email?.toLowerCase().trim();
  const user = users[cleanEmail] || users[INITIAL_DEMO_USER.email];

  const itemIndex = user.trackedApplications.findIndex((t) => t.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Tracked item not found' });
  }

  user.trackedApplications[itemIndex] = {
    ...user.trackedApplications[itemIndex],
    ...updates,
    lastUpdated: new Date().toISOString(),
  };

  addLog(
    'INFO',
    `Student ${user.email} updated tracker item "${user.trackedApplications[itemIndex].scholarshipTitle}" to status: ${user.trackedApplications[itemIndex].status}`,
    'TRACKER'
  );

  res.json({ tracker: user.trackedApplications });
});

app.delete('/api/tracker/:id', (req, res) => {
  const email = (req.query.email as string)?.toLowerCase().trim();
  const user = users[email] || users[INITIAL_DEMO_USER.email];

  user.trackedApplications = user.trackedApplications.filter((t) => t.id !== req.params.id);
  addLog('INFO', `Student ${user.email} removed tracked application: ${req.params.id}`, 'TRACKER');
  res.json({ tracker: user.trackedApplications });
});

// ----------------- GEMINI AI SEARCH & REASONING ----------------- //

// AI-powered scholarship search with Google Search grounding
app.post('/api/gemini/search', async (req, res) => {
  searchQueriesCount++;
  try {
    const { query, profile, filters } = req.body;
    const cacheKey = JSON.stringify({ query, profile: { nationality: profile?.nationality, degree: profile?.preferredDegreeLevel }, filters });

    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      addLog('INFO', `Serving cached AI search result for query: "${query || 'default'}"`, 'AI_SEARCH');
      return res.json(cached.data);
    }

    addLog('AI_SEARCH', `Starting AI Search with Google Search Grounding for: "${query || 'General Search'}"`, 'AI_SEARCH', {
      userNationality: profile?.nationality,
      targetDegree: profile?.preferredDegreeLevel,
    });

    let matchingScholarships = [...scholarshipsDB];
    let groundingSources: { uri: string; title: string }[] = [];
    let aiOverview = '';
    let isLiveSearch = false;

    // Filter database based on query & preferences
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      matchingScholarships = matchingScholarships.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.degreeLevels.some((d) => d.toLowerCase().includes(q)) ||
          s.fieldsOfStudy.some((f) => f.toLowerCase().includes(q)) ||
          s.overview.toLowerCase().includes(q)
      );
    }

    if (filters?.country && filters.country !== 'All') {
      matchingScholarships = matchingScholarships.filter((s) => s.country.toLowerCase() === filters.country.toLowerCase());
    }
    if (filters?.degreeLevel && filters.degreeLevel !== 'All') {
      matchingScholarships = matchingScholarships.filter((s) => s.degreeLevels.includes(filters.degreeLevel));
    }

    // Call Gemini with Google Search grounding
    if (aiClient) {
      try {
        const studentContext = profile
          ? `Student Details:
- Nationality: ${profile.nationality || 'International'}
- Target Degree: ${profile.preferredDegreeLevel || 'Masters'}
- Major / Background: ${profile.majorFieldOfStudy || 'Science / Engineering'}
- CGPA: ${profile.cgpa ? `${profile.cgpa}/${profile.cgpaScale || 4.0}` : '3.5/4.0'}
- IELTS: ${profile.ieltsStatus === 'Completed' ? profile.ieltsOverall : profile.ieltsStatus}
- Target Countries: ${profile.preferredCountries?.join(', ') || 'Any'}`
          : 'International graduate student seeking fully funded opportunities.';

        const searchPrompt = `You are the lead international scholarship discovery officer for GlobalScholar AI.
A student is searching for international scholarships.
Query: "${query || 'Top verified international scholarships for international students'}"
${studentContext}

Use Google Search grounding to discover genuine, verified international scholarship programs, official deadlines, application websites, and eligibility rules.
Never fabricate deadlines, funding allowances, or scholarship titles.
Format your answer with:
1. A concise 3-paragraph executive summary of the best matching opportunities, highlighting funding coverage and crucial deadlines.
2. Concrete tips on fulfilling requirements (IELTS waivers, CGPA equivalency, recommendation letters).
Include official reference URLs.`;

        const startCall = Date.now();
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: searchPrompt,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        const duration = Date.now() - startCall;
        aiOverview = response.text || '';
        isLiveSearch = true;

        // Extract grounding chunks
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks && Array.isArray(chunks)) {
          chunks.forEach((chunk: any) => {
            if (chunk.web?.uri) {
              groundingSources.push({
                uri: chunk.web.uri,
                title: chunk.web.title || chunk.web.uri,
              });
            }
          });
        }

        addLog(
          'AI_SEARCH',
          `Gemini search grounding completed in ${duration}ms with ${groundingSources.length} official web citations`,
          'AI_SEARCH'
        );
      } catch (err: any) {
        addLog('WARN', `Gemini search grounding fallback triggered: ${err.message}`, 'AI_SEARCH');
        aiOverview = `Discovered ${matchingScholarships.length} verified scholarship opportunities from the institutional scholarship database matching your criteria.`;
      }
    } else {
      aiOverview = `Retrieved ${matchingScholarships.length} verified scholarship opportunities from the verified database.`;
    }

    // Evaluate personalized eligibility
    const evaluatedScholarships = matchingScholarships.map((s) => {
      const evalResult = evaluateEligibility(s, profile || {});
      return {
        ...s,
        matchScore: evalResult.score,
        matchStatus: evalResult.status,
        matchReason: evalResult.summary,
      };
    });

    evaluatedScholarships.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    const responsePayload = {
      query: query || '',
      scholarships: evaluatedScholarships,
      groundingSources: groundingSources.slice(0, 8),
      aiOverview,
      isLiveSearch,
    };

    searchCache.set(cacheKey, { timestamp: Date.now(), data: responsePayload });
    res.json(responsePayload);
  } catch (error: any) {
    addLog('ERROR', `AI search failed: ${error.message}`, 'AI_SEARCH');
    res.status(500).json({ error: error.message || 'AI search failed' });
  }
});

// Deep AI eligibility explanation for a single scholarship
app.post('/api/gemini/eligibility', async (req, res) => {
  try {
    const { scholarshipId, profile } = req.body;
    const scholarship = scholarshipsDB.find((s) => s.id === scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }

    const basicEval = evaluateEligibility(scholarship, profile || {});
    let aiDetailedAnalysis = '';

    if (aiClient) {
      try {
        const prompt = `You are an expert scholarship admissions advisor.
Evaluate the following student's profile against the official published criteria of "${scholarship.title}" (${scholarship.provider}, ${scholarship.country}).

Student Profile:
- Nationality: ${profile.nationality || 'Unspecified'}
- Current Education / Major: ${profile.highestCompletedEducation || 'Bachelors'} in ${profile.majorFieldOfStudy || 'Not specified'}
- Degree Target: ${profile.preferredDegreeLevel || 'Masters'}
- CGPA: ${profile.cgpa}/${profile.cgpaScale} (Percentage: ${profile.percentage || 'N/A'}%)
- Academic Honors: ${profile.academicHonors || 'None'}
- IELTS: Status ${profile.ieltsStatus}, Overall ${profile.ieltsOverall || 'N/A'} (L:${profile.ieltsListening || 'N/A'}, R:${profile.ieltsReading || 'N/A'}, W:${profile.ieltsWriting || 'N/A'}, S:${profile.ieltsSpeaking || 'N/A'})
- Work Experience: ${profile.workExperienceYears || 0} years (${profile.workExperienceSummary || 'None'})
- Research / Publications: ${profile.researchExperience || 'None'}

Scholarship Requirements:
- Degree Levels: ${scholarship.degreeLevels.join(', ')}
- Min CGPA: ${scholarship.academicRequirements.minCGPA}/${scholarship.academicRequirements.cgpaScale}
- Eligible Nationalities: ${scholarship.eligibleNationalities.join(', ')}
- Language Requirement: IELTS required: ${scholarship.languageRequirements.ieltsRequired}, Min Overall: ${scholarship.languageRequirements.minIeltsOverall || 'N/A'}
- Additional: ${scholarship.academicRequirements.additionalRequirements || 'None'}

Provide an objective assessment:
1. Category-by-category breakdown (Nationality, Degree Target, CGPA equivalency, Language proficiency, Work/Research experience).
2. Honest verdict: Appears eligible, Potentially eligible with caveats, or Specific requirement not yet met.
3. 3 concrete action items for the student to maximize selection probability.
Disclaimer: State clearly that this is an advisory analysis and does not guarantee admission or funding.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        aiDetailedAnalysis = response.text || '';
        addLog('INFO', `Generated deep AI eligibility strategy for scholarship "${scholarship.title}"`, 'AI_ELIGIBILITY');
      } catch (err: any) {
        addLog('WARN', `Gemini eligibility call failed: ${err.message}`, 'AI_ELIGIBILITY');
      }
    }

    res.json({
      evaluation: basicEval,
      aiDetailedAnalysis,
      scholarshipTitle: scholarship.title,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Eligibility check failed' });
  }
});

// Interactive AI Scholarship Advisor Chat
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, profile } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    addLog('AI_SEARCH', `Scholarship advisor chat query: "${message.substring(0, 80)}"`, 'AI_CHAT');

    if (!aiClient) {
      return res.json({
        reply: `Thank you for your question about "${message}". Verified scholarships such as Chevening, Fulbright, DAAD, and Erasmus Mundus offer full funding including tuition waivers, monthly stipends, and travel grants. Please refer to each scholarship's detailed page for exact eligibility rules.`,
      });
    }

    const studentContext = profile
      ? `Student Info: Nationality: ${profile.nationality || 'International'}, Target Degree: ${profile.preferredDegreeLevel || 'Masters'}, Field: ${profile.majorFieldOfStudy || 'STEM/Social Sciences'}, CGPA: ${profile.cgpa || 3.5}/${profile.cgpaScale || 4.0}, IELTS: ${profile.ieltsOverall || 'Not taken'}.`
      : 'International student.';

    const systemInstruction = `You are GlobalScholar AI Assistant, an empathetic, highly knowledgeable international education and scholarship consultant.
${studentContext}
Rules:
1. Always give accurate, grounded information about international scholarships (Chevening, Fulbright, DAAD, Erasmus Mundus, Australia Awards, MEXT, Gates Cambridge, Turkiye Burslari, etc.).
2. If a student asks whether they are eligible, provide clear criteria breakdowns without guaranteeing admission.
3. If they ask about IELTS waivers, explain which countries and universities allow English Medium of Instruction (MOI) certificates.
4. If an answer cannot be verified with certainty, advise them to check the official provider portal.
5. Keep responses concise, well-structured, and helpful with bullet points.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const reply = response.text || 'I could not generate an answer at this time. Please try again.';
    const sources: { uri: string; title: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sources.push({ uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri });
        }
      });
    }

    res.json({ reply, sources: sources.slice(0, 5) });
  } catch (error: any) {
    addLog('ERROR', `Chat service error: ${error.message}`, 'AI_CHAT');
    res.status(500).json({ error: error.message || 'Chat service error' });
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    addLog('INFO', `Server is listening on http://0.0.0.0:${PORT}`, 'BOOT');
  });
}

startServer();
