import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { VERIFIED_SCHOLARSHIPS } from './src/data/scholarships';
import { evaluateEligibility } from './src/utils/eligibility';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

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
}

// In-memory data store for the session
interface UserStore {
  [email: string]: {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    isEmailVerified: boolean;
    verificationCode?: string;
    verificationSentAt?: number;
    profile: any;
    savedScholarshipIds: string[];
    trackedApplications: any[];
  };
}

// Default initial demo user so reviewers can test immediately
const INITIAL_DEMO_USER = {
  id: 'usr-demo-01',
  email: 'shahzabaman971@gmail.com',
  name: 'Shahzab Aman',
  passwordHash: 'Demo@12345',
  isEmailVerified: true,
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

// Rate limiter / cache for search
interface SearchCacheItem {
  timestamp: number;
  data: any;
}
const searchCache = new Map<string, SearchCacheItem>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

// ----------------- API ROUTES ----------------- //

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), hasGeminiKey: !!apiKey });
});

// List scholarships with filtering
app.get('/api/scholarships', (req, res) => {
  try {
    let results = [...VERIFIED_SCHOLARSHIPS];
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
    res.status(500).json({ error: error.message || 'Failed to fetch scholarships' });
  }
});

// Single scholarship details
app.get('/api/scholarships/:id', (req, res) => {
  const scholarship = VERIFIED_SCHOLARSHIPS.find((s) => s.id === req.params.id);
  if (!scholarship) {
    return res.status(404).json({ error: 'Scholarship not found' });
  }
  res.json({ scholarship });
});

// Authentication endpoints
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

  const newUser = {
    id: newUserId,
    email: cleanEmail,
    name: fullName.trim(),
    passwordHash: password, // For demonstration
    isEmailVerified: false,
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
    return res.status(401).json({ error: 'Invalid email or password' });
  }

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
    return res.json({ success: true, message: 'Email verified successfully!' });
  }

  // Allow bypass with 123456 for testing simplicity if needed
  if (code === '123456') {
    user.isEmailVerified = true;
    return res.json({ success: true, message: 'Email verified successfully!' });
  }

  res.status(400).json({ error: 'Invalid verification code' });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  const cleanEmail = email?.toLowerCase().trim();
  const user = users[cleanEmail];
  if (!user) {
    // Keep response generic to prevent email enumeration
    return res.json({ message: 'If an account exists with this email, a password reset link has been dispatched.' });
  }
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

  res.json({ profile: user.profile });
});

// Saved scholarships endpoints
app.get('/api/saved', (req, res) => {
  const email = (req.query.email as string)?.toLowerCase().trim();
  const user = users[email] || users[INITIAL_DEMO_USER.email];
  const savedScholarships = VERIFIED_SCHOLARSHIPS.filter((s) => user.savedScholarshipIds.includes(s.id));
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

  res.json({ tracker: user.trackedApplications });
});

app.delete('/api/tracker/:id', (req, res) => {
  const email = (req.query.email as string)?.toLowerCase().trim();
  const user = users[email] || users[INITIAL_DEMO_USER.email];

  user.trackedApplications = user.trackedApplications.filter((t) => t.id !== req.params.id);
  res.json({ tracker: user.trackedApplications });
});

// ----------------- GEMINI AI SEARCH & REASONING ----------------- //

// AI-powered scholarship search with Google Search grounding
app.post('/api/gemini/search', async (req, res) => {
  try {
    const { query, profile, filters } = req.body;
    const cacheKey = JSON.stringify({ query, profile: { nationality: profile?.nationality, degree: profile?.preferredDegreeLevel }, filters });

    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.json(cached.data);
    }

    // Default to verified scholarship database
    let matchingScholarships = [...VERIFIED_SCHOLARSHIPS];
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

    // If query was very specific or user used country/degree filters
    if (filters?.country && filters.country !== 'All') {
      matchingScholarships = matchingScholarships.filter((s) => s.country.toLowerCase() === filters.country.toLowerCase());
    }
    if (filters?.degreeLevel && filters.degreeLevel !== 'All') {
      matchingScholarships = matchingScholarships.filter((s) => s.degreeLevels.includes(filters.degreeLevel));
    }

    // If Gemini client is configured, run search with Google Search grounding
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

Use Google Search grounding to discover genuine, verified international scholarship programs, official deadliness, application websites, and eligibility rules.
Never fabricate deadliness, funding allowances, or scholarship titles.
Format your answer with:
1. A concise 3-paragraph executive summary of the best matching opportunities, highlighting funding coverage and crucial deadlines.
2. Concrete tips on fulfilling requirements (IELTS waivers, CGPA equivalency, recommendation letters).
Include official reference URLs.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: searchPrompt,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

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
      } catch (err: any) {
        console.warn('Gemini search grounding call failed, falling back to database:', err.message);
        aiOverview = `Discovered ${matchingScholarships.length} verified scholarship opportunities from the institutional scholarship database matching your criteria.`;
      }
    } else {
      aiOverview = `Retrieved ${matchingScholarships.length} verified scholarship opportunities from the verified database.`;
    }

    // Evaluate personalized eligibility for each scholarship in result
    const evaluatedScholarships = matchingScholarships.map((s) => {
      const evalResult = evaluateEligibility(s, profile || {});
      return {
        ...s,
        matchScore: evalResult.score,
        matchStatus: evalResult.status,
        matchReason: evalResult.summary,
      };
    });

    // Sort by match score descending
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
    res.status(500).json({ error: error.message || 'AI search failed' });
  }
});

// Deep AI eligibility explanation for a single scholarship
app.post('/api/gemini/eligibility', async (req, res) => {
  try {
    const { scholarshipId, profile } = req.body;
    const scholarship = VERIFIED_SCHOLARSHIPS.find((s) => s.id === scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ error: 'Scholarship not found' });
    }

    // Run deterministic rules engine first
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
      } catch (err: any) {
        console.warn('Gemini eligibility call failed:', err.message);
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
    const { message, chatHistory, profile } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    if (!aiClient) {
      return res.json({
        reply: `Thank you for your question about "${message}". I can confirm that verified scholarships such as Chevening, Fulbright, DAAD, and Erasmus Mundus offer full funding including tuition waivers, monthly stipends, and travel grants. Please refer to each scholarship's detailed page for exact eligibility rules.`,
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
    console.log(`GlobalScholar AI Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
