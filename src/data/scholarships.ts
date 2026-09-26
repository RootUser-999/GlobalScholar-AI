import { Scholarship } from '../types';

export const VERIFIED_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'chevening-uk',
    title: 'Chevening Scholarships',
    provider: 'UK Foreign, Commonwealth & Development Office (FCDO)',
    country: 'United Kingdom',
    countryCode: 'GB',
    flagEmoji: '🇬🇧',
    degreeLevels: ['Masters'],
    fundingType: 'Fully Funded',
    fieldsOfStudy: ['All Fields', 'Public Policy', 'International Relations', 'Economics', 'STEM', 'Law', 'Sustainability'],
    coverageDetails: {
      tuition: 'Full university tuition fees (no cap for most courses, £22,000 cap for MBA)',
      monthlyStipend: '£1,300 to £1,500/month living allowance depending on location (London vs non-London)',
      airfare: 'Economy class return airfare to the UK from home country',
      healthInsurance: 'UK Immigration Health Surcharge (IHS) fully paid',
      accommodation: 'Covered via monthly stipend; dedicated arrival and departure allowances included',
      otherAllowances: 'Visa application fee reimbursement, travel grants for mandatory Chevening events'
    },
    deadline: 'Early November annually (Application opens August)',
    deadlineDate: '2026-11-05T12:00:00Z',
    academicRequirements: {
      minCGPA: 3.0,
      cgpaScale: 4.0,
      equivalentPercentage: 'Upper Second-Class Honours (2:1) equivalent (typically 65%+)',
      degreePrerequisite: 'Undergraduate degree that enables entry to a postgraduate course at a UK university',
      additionalRequirements: 'Minimum of two years (2,800 hours) of demonstrable work/internship experience'
    },
    languageRequirements: {
      ieltsRequired: false,
      minIeltsOverall: 6.5,
      waiverPossible: true,
      waiverCondition: 'Chevening removed general English requirement in 2020, but chosen UK universities still require proof (e.g. IELTS 6.5-7.0 or university waiver)'
    },
    eligibleNationalities: ['Over 160 Chevening-eligible countries (Pakistan, India, Nigeria, Kenya, Brazil, Egypt, Indonesia, etc.)'],
    officialUrl: 'https://www.chevening.org/scholarships/',
    officialApplicationPortal: 'https://www.chevening.org/apply/',
    source: 'Official Chevening Secretariat, UK Government',
    lastVerified: '2026-09-01',
    overview: 'Chevening is the UK government’s flagship global scholarship programme, funded by the Foreign, Commonwealth and Development Office (FCDO) and partner organisations. It offers future leaders, influencers, and decision-makers from all over the world the unique opportunity to pursue a one-year Master’s degree in any subject at any accredited UK university.',
    requiredDocuments: [
      'Valid international passport',
      'Official academic transcripts and degree certificate',
      'Two professional or academic recommendation letters (LOR)',
      'Four required 500-word Chevening leadership and networking essays',
      'Unconditional offer letter from at least one eligible UK university by July deadline'
    ],
    applicationProcess: [
      'Submit online application via the Chevening portal between August and November',
      'Applications sifted against eligibility criteria by reading committees',
      'Shortlisted applicants invited to in-person/online interview at British Embassy/High Commission (Feb-April)',
      'Conditional selection announced in June, submit unconditional university offer and references',
      'Final confirmation and pre-departure briefings in July-August'
    ],
    isVerified: true,
    isFeatured: true
  },
  {
    id: 'fulbright-us',
    title: 'Fulbright Foreign Student Program',
    provider: 'U.S. Department of State / Foreign Fulbright Board',
    country: 'United States',
    countryCode: 'US',
    flagEmoji: '🇺🇸',
    degreeLevels: ['Masters', 'PhD'],
    fundingType: 'Fully Funded',
    fieldsOfStudy: ['All Fields', 'Engineering', 'Social Sciences', 'Humanities', 'Data Science', 'Public Health', 'Business (excluding clinical medical)'],
    coverageDetails: {
      tuition: 'Full university tuition and mandatory academic fees covered',
      monthlyStipend: '$1,600 to $2,600/month living stipend calibrated to local cost of living',
      airfare: 'Round-trip international economy airfare covered under Fly America Act',
      healthInsurance: 'Accident and sickness coverage through ASPE (Accident and Sickness Program for Exchanges)',
      accommodation: 'Covered via monthly stipend plus settling-in allowance upon initial arrival',
      otherAllowances: 'Book allowance, computer transit allowance, enrichment seminar attendance funding'
    },
    deadline: 'April - October (Varies by country commission/embassy, e.g. USEFP Pakistan is mid-May)',
    deadlineDate: '2026-10-15T23:59:59Z',
    academicRequirements: {
      minCGPA: 3.2,
      cgpaScale: 4.0,
      equivalentPercentage: 'Minimum 16 years of education for Master’s, 18 years for PhD',
      degreePrerequisite: 'Recognized 4-year Bachelor’s degree or Master’s degree from an accredited institution',
      additionalRequirements: 'GRE General Test score required by some national commissions; strong leadership and commitment to returning home'
    },
    languageRequirements: {
      ieltsRequired: true,
      minIeltsOverall: 7.0,
      toeflAccepted: true,
      minToefl: 95,
      waiverPossible: false,
      waiverCondition: 'TOEFL iBT or IELTS is mandatory for U.S. university placement'
    },
    eligibleNationalities: ['Citizens of 160+ participating Fulbright countries worldwide'],
    officialUrl: 'https://foreign.fulbrightonline.org/',
    officialApplicationPortal: 'https://apply.iie.org/',
    source: 'Institute of International Education (IIE) & U.S. State Department',
    lastVerified: '2026-08-25',
    overview: 'The Fulbright Foreign Student Program enables graduate students, young professionals and artists from abroad to study and conduct research in the United States. Fulbright awards operate in more than 160 countries, fostering mutual understanding and global academic collaboration.',
    requiredDocuments: [
      'Completed online application with Personal Statement and Study Objective essays',
      'Official academic transcripts from all post-secondary institutions',
      'Three letters of recommendation from academic or professional referees',
      'Standardized test scores (GRE if required by country commission, TOEFL/IELTS)',
      'Updated Curriculum Vitae (CV) emphasizing community impact'
    ],
    applicationProcess: [
      'Apply to the Fulbright Commission (or Public Affairs Section of the U.S. Embassy) in your home country',
      'National review panel reviews applications and conducts interviews',
      'Nominated finalists placed at U.S. host universities through IIE matching process',
      'Pre-departure orientation and J-1 visa processing'
    ],
    isVerified: true,
    isFeatured: true
  },
  {
    id: 'daad-helmut-schmidt-germany',
    title: 'DAAD Helmut-Schmidt-Programme (Public Policy & Good Governance)',
    provider: 'German Academic Exchange Service (DAAD)',
    country: 'Germany',
    countryCode: 'DE',
    flagEmoji: '🇩🇪',
    degreeLevels: ['Masters'],
    fundingType: 'Fully Funded',
    fieldsOfStudy: ['Public Policy', 'Governance', 'Development Studies', 'Economics', 'Political Science', 'Social Sciences'],
    coverageDetails: {
      tuition: 'Tuition fees completely waived at participating German partner universities',
      monthlyStipend: '€934 per month for the entire duration of the master’s programme',
      airfare: 'Flat-rate travel subsidy to and from Germany',
      healthInsurance: 'Comprehensive health, accident, and personal liability insurance coverage in Germany',
      accommodation: 'Monthly rent subsidy allowance plus monthly subsidy for accompanying family members if eligible',
      otherAllowances: 'Study and research allowance of €460/year, mandatory intensive German language course (up to 6 months) fully funded prior to study'
    },
    deadline: 'July 31 annually',
    deadlineDate: '2026-07-31T23:59:59Z',
    academicRequirements: {
      minCGPA: 3.2,
      cgpaScale: 4.0,
      equivalentPercentage: 'Above-average first university degree (at least upper 30% of graduating cohort)',
      degreePrerequisite: 'First higher education degree obtained no more than six years before the application date',
      additionalRequirements: 'Demonstrated political, social, or community involvement'
    },
    languageRequirements: {
      ieltsRequired: true,
      minIeltsOverall: 6.5,
      toeflAccepted: true,
      minToefl: 85,
      waiverPossible: true,
      waiverCondition: 'Graduates whose primary language of instruction during entire undergraduate degree was English'
    },
    eligibleNationalities: ['Graduates from developing and emerging countries (DAC List of ODA recipients)'],
    officialUrl: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
    officialApplicationPortal: 'https://www.daad.de/en/information-services-for-higher-education-institutions/programme-priority-areas/helmut-schmidt-programme/',
    source: 'DAAD Federal Ministry for Economic Cooperation and Development (BMZ)',
    lastVerified: '2026-09-05',
    overview: 'The DAAD Helmut-Schmidt-Programme supports future leaders from developing countries who wish to promote democracy and social justice in their home countries. Selected scholars study at renowned German universities such as Hertie School, University of Passau, Willy Brandt School Erfurt, and University of Duisburg-Essen.',
    requiredDocuments: [
      'DAAD application form signed and dated',
      'Hand-signed Europass CV with detailed academic and work history',
      'Letter of motivation (max 2 pages) addressing choice of courses',
      'Official university degree certificates and certified English/German translations',
      'Recent letter of recommendation from current employer or university professor',
      'Proof of English language proficiency'
    ],
    applicationProcess: [
      'Apply directly to the designated Master’s programmes at the German partner universities',
      'Indicate priority ranking (1st and 2nd choice master programs)',
      'Joint selection committee of university professors and DAAD reviews candidate files',
      'Award letters distributed from November to December for study commencing the following autumn'
    ],
    isVerified: true,
    isFeatured: true
  },
  {
    id: 'erasmus-mundus-emjm',
    title: 'Erasmus Mundus Joint Masters Scholarships (EMJM)',
    provider: 'European Commission (European Union)',
    country: 'European Union (France, Germany, Italy, Spain, Netherlands, etc.)',
    countryCode: 'EU',
    flagEmoji: '🇪🇺',
    degreeLevels: ['Masters'],
    fundingType: 'Fully Funded',
    fieldsOfStudy: ['All Fields', 'Artificial Intelligence', 'Data Science', 'Biotechnology', 'Environmental Sciences', 'Cybersecurity', 'Humanities'],
    coverageDetails: {
      tuition: '100% participation costs covered including all university fees and library/lab charges',
      monthlyStipend: '€1,400 per month subsistence allowance for up to 24 months',
      airfare: 'Integrated within the generous monthly subsistence grant and mobility installation packages',
      healthInsurance: 'Full worldwide health and travel insurance compliant with Erasmus+ guidelines',
      accommodation: 'Funded through monthly stipend; university residences reserved for cohort',
      otherAllowances: 'Installation contribution and travel allowance up to €3,000/year depending on distance from country of origin'
    },
    deadline: 'December to February (Varies by specific consortium, typically Jan 15)',
    deadlineDate: '2026-01-15T23:59:59Z',
    academicRequirements: {
      minCGPA: 3.3,
      cgpaScale: 4.0,
      equivalentPercentage: 'High academic standing (First Class or high 2:1 equivalent)',
      degreePrerequisite: 'Completed Bachelor’s degree (180 or 240 ECTS credits) in relevant subject area',
      additionalRequirements: 'Strong academic motivation; mobility readiness across at least 2 European countries'
    },
    languageRequirements: {
      ieltsRequired: true,
      minIeltsOverall: 6.5,
      minIeltsSubscores: { listening: 6.0, reading: 6.0, writing: 6.0, speaking: 6.0 },
      toeflAccepted: true,
      minToefl: 90,
      waiverPossible: true,
      waiverCondition: 'Native speakers or students with previous degrees completely taught in English in English-speaking nations'
    },
    eligibleNationalities: ['Open to students from all countries worldwide (Programme & Partner countries)'],
    officialUrl: 'https://eacea.ec.europa.eu/erasmus-plus/emjmd-catalogue_en',
    officialApplicationPortal: 'https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters',
    source: 'European Education and Culture Executive Agency (EACEA)',
    lastVerified: '2026-09-10',
    overview: 'Erasmus Mundus Joint Masters are prestigious international Master’s degree programmes jointly designed and delivered by a consortium of higher education institutions across multiple European nations. Scholars study in at least two European countries and graduate with joint or multiple degrees.',
    requiredDocuments: [
      'Certified Bachelor degree certificate and diploma supplement',
      'Official academic transcripts with grading scale description',
      'Two academic letters of recommendation',
      'Curriculum Vitae in Europass format',
      'Statement of Purpose tailored to the specific consortium curriculum',
      'Valid passport copy'
    ],
    applicationProcess: [
      'Consult the EMJM catalogue and select up to 3 candidate programmes',
      'Submit direct application on the chosen programme consortium website with scholarship checkbox selected',
      'Consortium evaluates applications and ranks candidates by academic merit',
      'Official selection results communicated between March and May'
    ],
    isVerified: true,
    isFeatured: true
  },
  {
    id: 'australia-awards-dfat',
    title: 'Australia Awards Scholarships',
    provider: 'Australian Department of Foreign Affairs and Trade (DFAT)',
    country: 'Australia',
    countryCode: 'AU',
    flagEmoji: '🇦🇺',
    degreeLevels: ['Masters', 'PhD', 'Bachelors'],
    fundingType: 'Fully Funded',
    fieldsOfStudy: ['Agriculture', 'Climate Change', 'Public Policy', 'Health', 'Infrastructure', 'Education', 'Economic Growth'],
    coverageDetails: {
      tuition: 'Full tuition fees paid directly to the Australian university',
      monthlyStipend: 'Contribution to Living Expenses (CLE) of AUD 3,000/month',
      airfare: 'Return economy class air travel to and from Australia via the most direct route',
      healthInsurance: 'Overseas Student Health Cover (OSHC) for the scholar and dependent family members',
      accommodation: 'Establishment allowance of AUD 5,000 paid as a once-only contribution towards accommodation and text books',
      otherAllowances: 'Introductory Academic Program (IAP) prior to formal studies, supplementary academic support funding'
    },
    deadline: 'April 30 annually (Applications open February 1)',
    deadlineDate: '2026-04-30T23:59:59Z',
    academicRequirements: {
      minCGPA: 3.0,
      cgpaScale: 4.0,
      equivalentPercentage: 'Minimum second class upper division or equivalent',
      degreePrerequisite: 'Relevant tertiary qualification matching the chosen priority development field',
      additionalRequirements: 'Minimum 2 years of relevant professional work experience in applicant home country'
    },
    languageRequirements: {
      ieltsRequired: true,
      minIeltsOverall: 6.5,
      minIeltsSubscores: { listening: 6.0, reading: 6.0, writing: 6.0, speaking: 6.0 },
      toeflAccepted: true,
      minToefl: 84,
      waiverPossible: false,
      waiverCondition: 'Language test certificate must be valid at the time of submission'
    },
    eligibleNationalities: ['Citizens of participating countries in Indo-Pacific, South Asia, Africa, and Middle East'],
    officialUrl: 'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships',
    officialApplicationPortal: 'https://oasis.dfat.gov.au/',
    source: 'Australian Government DFAT OASIS Portal',
    lastVerified: '2026-08-30',
    overview: 'Australia Awards Scholarships are prestigious international awards offered by the Australian Government to provide opportunities for people from developing countries to undertake full-time undergraduate or postgraduate study at participating Australian universities and TAFE institutions.',
    requiredDocuments: [
      'Certified copy of original university degree certificates and transcripts',
      'Proof of citizenship (valid passport or national identity card)',
      'Curriculum vitae detailing at least two years professional experience',
      'Two academic/referee reports',
      'IELTS/TOEFL score certificate',
      'Development impact statement detailing contribution to home country upon return'
    ],
    applicationProcess: [
      'Check country-specific eligibility criteria and priority areas on DFAT portal',
      'Register on the Online Australia Awards Scholarships Information System (OASIS)',
      'Complete and upload all supporting documents before April 30',
      'Shortlisted applicants attend structured panel interviews in home capital',
      'Successful awardees receive placement notification in August-September'
    ],
    isVerified: true,
    isFeatured: true
  },
  {
    id: 'mext-japan-government',
    title: 'MEXT Japanese Government Scholarship (Research/Graduate Students)',
    provider: 'Ministry of Education, Culture, Sports, Science and Technology (MEXT)',
    country: 'Japan',
    countryCode: 'JP',
    flagEmoji: '🇯🇵',
    degreeLevels: ['Masters', 'PhD'],
    fundingType: 'Fully Funded',
    fieldsOfStudy: ['Engineering', 'Information Technology', 'Robotics', 'Natural Sciences', 'Japanese Studies', 'Economics', 'Social Sciences'],
    coverageDetails: {
      tuition: 'Exemption from entrance examination, matriculation fee, and full tuition at Japanese national universities',
      monthlyStipend: '¥143,000 to ¥145,000 per month (Master’s/PhD) with supplementary regional allowance in Tokyo/major cities',
      airfare: 'Round-trip international flight ticket between homeland and designated Japanese international airport',
      healthInsurance: 'National Health Insurance in Japan (70% covered by state, remainder covered by stipend/university funds)',
      accommodation: 'Assistance in university international student dormitories or low-cost student housing',
      otherAllowances: '6-month intensive preparatory Japanese language study included prior to graduate studies'
    },
    deadline: 'May - June (Embassy track) or October - January (University track)',
    deadlineDate: '2026-05-30T17:00:00Z',
    academicRequirements: {
      minCGPA: 3.2,
      cgpaScale: 4.0,
      equivalentPercentage: 'Minimum 75% or equivalent grade point average across university coursework',
      degreePrerequisite: '16 years of schooling completed for Master’s, 18 years for Doctoral studies',
      additionalRequirements: 'Under 35 years of age at the time of arrival in Japan; high willingness to learn Japanese'
    },
    languageRequirements: {
      ieltsRequired: false,
      minIeltsOverall: 6.0,
      waiverPossible: true,
      waiverCondition: 'Japanese language proficiency (JLPT N2/N1) OR English proficiency (IELTS 6.0+ / TOEFL 80+) accepted depending on faculty'
    },
    eligibleNationalities: ['Citizens of countries having diplomatic relations with Japan'],
    officialUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarship/mext-scholarship/',
    officialApplicationPortal: 'https://www.mext.go.jp/a_menu/koutou/ryugaku/boshu/1417531.htm',
    source: 'MEXT & Japanese Diplomatic Missions Worldwide',
    lastVerified: '2026-09-08',
    overview: 'The MEXT Scholarship is one of the most generous and well-regarded government scholarships in Asia. Grantees have the opportunity to study at leading institutions like the University of Tokyo, Kyoto University, Osaka University, and Tokyo Institute of Technology.',
    requiredDocuments: [
      'Application Form and Placement Preference Form',
      'Field of Study and Research Plan (carefully structured research proposal)',
      'Official academic transcripts from all attended higher education institutions',
      'Graduation certificate or degree diploma',
      'Recommendation letter from the president, dean, or academic adviser of current/previous university',
      'Medical certificate certified by an authorized physician'
    ],
    applicationProcess: [
      'Submit dossier to the Embassy of Japan in your home country',
      'Undergo written examination (English and Japanese) and Embassy oral interview',
      'Passed candidates contact Japanese universities to obtain a Letter of Provisional Acceptance',
      'MEXT conducts final screening and announces official awardees in January-February'
    ],
    isVerified: true,
    isFeatured: true
  },
  {
    id: 'swedish-institute-sisgp',
    title: 'Swedish Institute Scholarships for Global Professionals (SISGP)',
    provider: 'Swedish Institute (Government of Sweden)',
    country: 'Sweden',
    countryCode: 'SE',
    flagEmoji: '🇸🇪',
    degreeLevels: ['Masters'],
    fundingType: 'Fully Funded',
    fieldsOfStudy: ['Sustainability', 'Computer Science', 'Public Health', 'Engineering', 'Innovation Management', 'Human Rights', 'Renewable Energy'],
    coverageDetails: {
      tuition: 'Full tuition fees paid directly to Swedish university by the Swedish Institute',
      monthlyStipend: 'SEK 12,000 per month to cover living expenses throughout the master’s programme',
      airfare: 'Travel grant of SEK 10,000 or 15,000 for the entire study period (one-off payment)',
      healthInsurance: 'Comprehensive health and accident insurance covered by Kammarkollegiet',
      accommodation: 'Funded via monthly stipend; priority access to student accommodation portals in Sweden',
      otherAllowances: 'Membership in the SI Network for Future Global Leaders (NFGL) and SI Alumni Network'
    },
    deadline: 'Mid-February annually (University Admissions Sweden closes mid-January)',
    deadlineDate: '2026-02-15T23:59:59Z',
    academicRequirements: {
      minCGPA: 3.1,
      cgpaScale: 4.0,
      equivalentPercentage: 'Bachelors degree meeting entry criteria of Swedish university',
      degreePrerequisite: 'Admitted to an eligible Master’s programme via UniversityAdmissions.se',
      additionalRequirements: 'Minimum 3,000 hours of documented work experience (full-time or part-time) and demonstrated leadership capacity'
    },
    languageRequirements: {
      ieltsRequired: true,
      minIeltsOverall: 6.5,
      minIeltsSubscores: { listening: 5.5, reading: 5.5, writing: 5.5, speaking: 5.5 },
      toeflAccepted: true,
      minToefl: 90,
      waiverPossible: true,
      waiverCondition: 'Degrees from countries where higher education is officially conducted in English'
    },
    eligibleNationalities: ['Citizens of 41 eligible countries (including Kenya, Nigeria, South Africa, Bangladesh, Philippines, Colombia, etc.)'],
    officialUrl: 'https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/',
    officialApplicationPortal: 'https://si.se/en/apply/scholarships/',
    source: 'Swedish Institute Official Portal',
    lastVerified: '2026-09-02',
    overview: 'The Swedish Institute (SI) Scholarships for Global Professionals is a fully-funded master’s scholarship aimed at developing global leaders who will contribute to the United Nations 2030 Agenda for Sustainable Development. Study at Karolinska Institute, Lund University, Uppsala, KTH, or Chalmers.',
    requiredDocuments: [
      'SI Curriculum Vitae on official Swedish Institute template',
      'Proof of work and leadership experience on official SI template with employer signatures',
      'Two letters of reference on official SI template',
      'Copy of valid passport and University Admissions application number'
    ],
    applicationProcess: [
      'Apply first for master programmes on UniversityAdmissions.se by mid-January',
      'Apply for the SI Scholarship in February using your 8-digit application number',
      'University admissions results announced late March',
      'SI releases scholarship recipient names in April'
    ],
    isVerified: true,
    isFeatured: false
  },
  {
    id: 'swiss-excellence-scholarships',
    title: 'Swiss Government Excellence Scholarships',
    provider: 'Federal Commission for Scholarships for Foreign Students (FCS)',
    country: 'Switzerland',
    countryCode: 'CH',
    flagEmoji: '🇨🇭',
    degreeLevels: ['PhD', 'Postdoc'],
    fundingType: 'Fully Funded',
    fieldsOfStudy: ['All Fields', 'Biomedical Sciences', 'Physics', 'Robotics', 'Quantum Computing', 'Environmental Engineering', 'Life Sciences'],
    coverageDetails: {
      tuition: 'No tuition fees charged by Swiss Cantonal universities or Federal Institutes of Technology (ETH/EPFL)',
      monthlyStipend: 'CHF 1,920/month for PhD candidates; CHF 3,500/month for Postdoctoral researchers',
      airfare: 'Return airfare reimbursement for grantees from non-European countries upon completion',
      healthInsurance: 'Mandatory Swiss health insurance policy fully paid by FCS',
      accommodation: 'One-off housing allowance of CHF 300 paid upon arrival to assist with setup',
      otherAllowances: 'Half-fare public transport pass (Swiss Half-Fare Card) provided for one year'
    },
    deadline: 'September to December (Varies by Swiss embassy in student home country)',
    deadlineDate: '2026-11-15T23:59:59Z',
    academicRequirements: {
      minCGPA: 3.5,
      cgpaScale: 4.0,
      equivalentPercentage: 'Excellent academic achievements with top quintile standing',
      degreePrerequisite: 'Master’s degree or equivalent achieved before July 31 of application cycle',
      additionalRequirements: 'Mandatory letter from an academic supervisor (professor) in Switzerland confirming willingness to supervise research'
    },
    languageRequirements: {
      ieltsRequired: true,
      minIeltsOverall: 7.0,
      toeflAccepted: true,
      minToefl: 100,
      waiverPossible: true,
      waiverCondition: 'Proficiency in university research language (English, German, French, or Italian) verified by host supervisor'
    },
    eligibleNationalities: ['Postgraduate researchers from over 180 countries worldwide'],
    officialUrl: 'https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html',
    officialApplicationPortal: 'https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships/countries.html',
    source: 'State Secretariat for Education, Research and Innovation (SERI)',
    lastVerified: '2026-08-20',
    overview: 'The Swiss Government Excellence Scholarships are aimed at young researchers from abroad who have completed a master’s degree or PhD. Available at all Swiss cantonal universities, universities of applied sciences and the two federal institutes of technology (ETH Zurich and EPFL).',
    requiredDocuments: [
      'Official FCS application form with photograph',
      'Complete CV with list of academic publications',
      'Letter of motivation and research proposal (max 5 pages) with timetable',
      'Confidential Letter of Acceptance from a professor at host Swiss institution',
      'Two confidential letters of recommendation from former professors',
      'Health certificate and passport copy'
    ],
    applicationProcess: [
      'Obtain application package from Swiss Embassy or scholarship authority in home country',
      'Secure formal written commitment from a Swiss university professor to supervise research',
      'Submit complete application dossier to Swiss Embassy by national deadline',
      'Final selection made by the Federal Commission for Scholarships (FCS) in May'
    ],
    isVerified: true,
    isFeatured: false
  },
  {
    id: 'turkiye-burslari',
    title: 'Türkiye Bursları (Turkey Government Scholarships)',
    provider: 'Presidency for Turks Abroad and Related Communities (YTB)',
    country: 'Turkey',
    countryCode: 'TR',
    flagEmoji: '🇹🇷',
    degreeLevels: ['Bachelors', 'Masters', 'PhD'],
    fundingType: 'Fully Funded',
    fieldsOfStudy: ['All Fields', 'Medicine', 'Engineering', 'Architecture', 'Islamic Studies', 'International Relations', 'Computer Science'],
    coverageDetails: {
      tuition: 'Full university tuition fee coverage at designated Turkish public/foundation universities',
      monthlyStipend: '3,500 TRY/month for Undergraduate; 5,000 TRY/month for Master’s; 6,500 TRY/month for PhD',
      airfare: 'One-time flight ticket upon initial arrival and another upon graduation',
      healthInsurance: 'Comprehensive public health insurance coverage via Turkish Social Security',
      accommodation: 'Free accommodation in state student dormitories (KYK); rental allowance if permitted to stay in private flats',
      otherAllowances: '1-year free Turkish Language Course (TÖMER) for all awardees regardless of study language'
    },
    deadline: 'February 20 annually (Application open January 10 to February 20)',
    deadlineDate: '2026-02-20T23:59:59Z',
    academicRequirements: {
      minCGPA: 2.8,
      cgpaScale: 4.0,
      equivalentPercentage: 'Minimum 70% for Bachelor’s, 75% for Master’s & PhD, 90% for Health Sciences (Medicine/Dentistry/Pharmacy)',
      degreePrerequisite: 'Secondary school diploma for Undergraduate; Bachelor’s for Master’s; Master’s for PhD',
      additionalRequirements: 'Age criteria: Under 21 for Undergraduate, under 30 for Master’s, under 35 for PhD'
    },
    languageRequirements: {
      ieltsRequired: false,
      waiverPossible: true,
      waiverCondition: 'Required only if chosen programme is taught in English (e.g., TOEFL/IELTS required by METU, Boğaziçi, Bilkent). Most Turkish-medium programmes require no English test.'
    },
    eligibleNationalities: ['Citizens of all countries worldwide except citizens of the Republic of Turkey'],
    officialUrl: 'https://www.turkiyeburslari.gov.tr/',
    officialApplicationPortal: 'https://tbbs.turkiyeburslari.gov.tr/',
    source: 'YTB Republic of Turkey Ministry of Culture and Tourism',
    lastVerified: '2026-09-01',
    overview: 'Türkiye Scholarships is a government-funded, competitive scholarship program awarded to outstanding students to pursue full-time or short-term programs at top universities in Turkey. Placement is managed jointly with the scholarship award, meaning students do not need separate university applications.',
    requiredDocuments: [
      'Valid national identity card or passport',
      'Recent passport photograph',
      'National exam scores (if any) and secondary school/university transcripts',
      'Diploma or temporary graduation certificate',
      'Academic and career Letter of Intent / Statement of Purpose',
      'Reference letters from school teachers or university professors'
    ],
    applicationProcess: [
      'Create an account on the Türkiye Scholarships Application System (TBBS)',
      'Fill profile data, select up to 12 universities and degree programs',
      'Submit online application before February 20',
      'Shortlisted applicants invited to in-person interviews at Turkish embassies and cultural centres (April-June)',
      'Results announced in July-August'
    ],
    isVerified: true,
    isFeatured: true
  },
  {
    id: 'gates-cambridge-uk',
    title: 'Gates Cambridge Scholarship',
    provider: 'Bill & Melinda Gates Foundation & University of Cambridge',
    country: 'United Kingdom',
    countryCode: 'GB',
    flagEmoji: '🇬🇧',
    degreeLevels: ['Masters', 'PhD'],
    fundingType: 'Fully Funded',
    fieldsOfStudy: ['All Fields', 'Biomedicine', 'Machine Learning', 'Public Health', 'Sociology', 'Mathematics', 'Engineering'],
    coverageDetails: {
      tuition: 'Full Cambridge University Composition Fee at the appropriate overseas rate',
      monthlyStipend: 'Maintenance allowance of £20,000 per annum (pro-rata for courses under 12 months)',
      airfare: 'One economy single airfare at both the beginning and end of the course',
      healthInsurance: 'Inbound visa costs & the cost of the UK Immigration Health Surcharge (IHS)',
      accommodation: 'Covered via annual maintenance allowance; family allowance available for scholars with children',
      otherAllowances: 'Academic development funding up to £2,000 for conferences and courses, maternity/paternity funding'
    },
    deadline: 'October (US citizens) / Early January (All other international applicants)',
    deadlineDate: '2026-01-08T23:59:59Z',
    academicRequirements: {
      minCGPA: 3.8,
      cgpaScale: 4.0,
      equivalentPercentage: 'First-class honours degree or equivalent (GPA 3.8 to 4.0 / top 5% of class)',
      degreePrerequisite: 'Undergraduate degree with stellar academic trajectory',
      additionalRequirements: 'Exceptional intellectual ability, strong reasons for choice of course, commitment to improving the lives of others, and leadership capacity'
    },
    languageRequirements: {
      ieltsRequired: true,
      minIeltsOverall: 7.5,
      minIeltsSubscores: { listening: 7.0, reading: 7.0, writing: 7.0, speaking: 7.0 },
      toeflAccepted: true,
      minToefl: 107,
      waiverPossible: true,
      waiverCondition: 'Graduates who studied for at least three years in an English-speaking country'
    },
    eligibleNationalities: ['Citizens of any country outside the United Kingdom'],
    officialUrl: 'https://www.gatescambridge.org/',
    officialApplicationPortal: 'https://www.postgraduate.study.cam.ac.uk/apply',
    source: 'Gates Cambridge Trust',
    lastVerified: '2026-09-04',
    overview: 'Established through a US$210m donation from the Bill and Melinda Gates Foundation in 2000, Gates Cambridge Scholarships are one of the most prestigious awards in the world. Approximately 80 full-cost scholarships are awarded each year to outstanding applicants outside the UK to pursue a postgraduate degree in any subject at Cambridge.',
    requiredDocuments: [
      'Standard Cambridge University postgraduate application form',
      'Gates Cambridge statement (approx. 500 words on fit with Gates criteria)',
      'Research proposal (for PhD and research Master’s)',
      'Two academic references and one Gates Cambridge specific reference on leadership and social commitment',
      'Official academic transcripts from all attended institutions'
    ],
    applicationProcess: [
      'Apply for course admission and a College place via the Cambridge Graduate Applicant Portal',
      'Complete the supplementary Gates Cambridge section on the application portal',
      'Departmental shortlisting of top applicants to the Gates Cambridge Trust',
      'Trust review panels select candidates for interview (conducted in January for US, March for international)',
      'Final awards confirmed shortly after interview'
    ],
    isVerified: true,
    isFeatured: true
  },
  {
    id: 'singa-singapore',
    title: 'Singapore International Graduate Award (SINGA)',
    provider: 'Agency for Science, Technology and Research (A*STAR), NTU, NUS, SUTD',
    country: 'Singapore',
    countryCode: 'SG',
    flagEmoji: '🇸🇬',
    degreeLevels: ['PhD'],
    fundingType: 'Fully Funded',
    fieldsOfStudy: ['Biomedical Sciences', 'Computing & Information Sciences', 'Physical Sciences', 'Engineering', 'AI & Machine Learning'],
    coverageDetails: {
      tuition: '100% full tuition fees covered for 4 years of PhD studies',
      monthlyStipend: 'SGD 2,700 per month, increased to SGD 3,200 per month after passing Qualifying Examination',
      airfare: 'One-time airfare grant of up to SGD 1,500',
      healthInsurance: 'Comprehensive medical and hospitalization insurance covered by university/A*STAR',
      accommodation: 'Assisted university housing support or off-campus rental options',
      otherAllowances: 'One-time settling-in allowance of SGD 1,000 upon arrival in Singapore'
    },
    deadline: 'June 1 (January intake) / December 1 (August intake)',
    deadlineDate: '2026-12-01T23:59:59Z',
    academicRequirements: {
      minCGPA: 3.4,
      cgpaScale: 4.0,
      equivalentPercentage: 'Minimum Second Class Upper Honours or 80% equivalent',
      degreePrerequisite: 'Graduates with a passion for research and excellent academic results in relevant bachelor’s/master’s disciplines',
      additionalRequirements: 'Strong enthusiasm for lab research in Singapore’s leading scientific institutions'
    },
    languageRequirements: {
      ieltsRequired: false,
      minIeltsOverall: 6.5,
      waiverPossible: true,
      waiverCondition: 'Good spoken and written English skills required; applicants with English-taught degrees can have formal test waived by supervisor'
    },
    eligibleNationalities: ['All international graduates with strong passion for scientific research'],
    officialUrl: 'https://www.a-star.edu.sg/Scholarships/for-graduate-studies/singapore-international-graduate-award-singa',
    officialApplicationPortal: 'https://sms-portal.a-star.edu.sg/',
    source: 'A*STAR Singapore Government Agency',
    lastVerified: '2026-08-15',
    overview: 'SINGA is an award given to international students with excellent academic results to pursue PhD studies in Science and Engineering at Singapore’s top institutions: A*STAR Research Institutes, Nanyang Technological University (NTU), National University of Singapore (NUS), or Singapore University of Technology and Design (SUTD).',
    requiredDocuments: [
      'Valid international passport copy',
      'Recent passport-sized photo',
      'All academic transcripts (Bachelor and Master degrees if applicable)',
      'Two academic recommendation reports submitted online by referees',
      'Curriculum Vitae highlighting research publications or projects'
    ],
    applicationProcess: [
      'Explore research projects and supervisors on A*STAR or NTU/NUS/SUTD websites',
      'Submit application through the SINGA online application portal',
      'Referees submit recommendation reports directly via email links',
      'Shortlisted candidates undergo interview with the joint admissions panel'
    ],
    isVerified: true,
    isFeatured: false
  },
  {
    id: 'vanier-canada',
    title: 'Vanier Canada Graduate Scholarships',
    provider: 'Government of Canada (CIHR, NSERC, SSHRC)',
    country: 'Canada',
    countryCode: 'CA',
    flagEmoji: '🇨🇦',
    degreeLevels: ['PhD'],
    fundingType: 'Fully Funded',
    fieldsOfStudy: ['Health Research', 'Natural Sciences & Engineering', 'Social Sciences & Humanities'],
    coverageDetails: {
      tuition: 'Covered in combination with host Canadian institution award package',
      monthlyStipend: '$50,000 per year for three years during doctoral studies',
      airfare: 'Covered via institutional top-up and personal research budget',
      healthInsurance: 'Provincial and university health plan coverage (UHIP/RAMQ/BC MSP)',
      accommodation: 'Funded via high-value $50,000/yr research stipend',
      otherAllowances: 'Substantial research conference travel allocation through Canadian university'
    },
    deadline: 'Early November annually (Institution internal deadlines are in September/October)',
    deadlineDate: '2026-11-01T20:00:00Z',
    academicRequirements: {
      minCGPA: 3.7,
      cgpaScale: 4.0,
      equivalentPercentage: 'First-class academic average in each of the last two years of full-time study',
      degreePrerequisite: 'Nominated by only one Canadian university which received a Vanier quota',
      additionalRequirements: 'Proven leadership skills, potential for scholarly impact, and research excellence'
    },
    languageRequirements: {
      ieltsRequired: true,
      minIeltsOverall: 7.0,
      waiverPossible: true,
      waiverCondition: 'Subject to the admissions requirements of the nominating Canadian university'
    },
    eligibleNationalities: ['Canadian citizens, permanent residents of Canada, and foreign citizens worldwide'],
    officialUrl: 'https://vanier.gc.ca/en/home-accueil.html',
    officialApplicationPortal: 'https://www.researchnet-recherchenet.ca/',
    source: 'Vanier CGS Secretariat, Government of Canada',
    lastVerified: '2026-09-02',
    overview: 'The Vanier Canada Graduate Scholarships (Vanier CGS) program helps Canadian institutions attract highly qualified doctoral students. Valued at $50,000 per year for three years, it is Canada’s most prestigious postgraduate award for scholars showing world-class leadership and research potential.',
    requiredDocuments: [
      'ResearchNet application form',
      'Official transcripts from all post-secondary education',
      'Vanier Project Description (maximum 2 pages)',
      'Leadership Statement (maximum 2 pages describing life and academic leadership)',
      'Two leadership reference letters and two academic referee assessments'
    ],
    applicationProcess: [
      'Contact desired department at a Canadian university with a Vanier quota',
      'Submit application through ResearchNet designating the nominating university',
      'University conducts internal selection and forwards approved nominees to the Secretariat by November 1',
      'Tri-agency selection committee reviews nominations and announces results in April'
    ],
    isVerified: true,
    isFeatured: true
  },
  {
    id: 'ireland-postgraduate-gov',
    title: 'Government of Ireland Postgraduate Scholarship',
    provider: 'Research Ireland (formerly Irish Research Council)',
    country: 'Ireland',
    countryCode: 'IE',
    flagEmoji: '🇮🇪',
    degreeLevels: ['Masters', 'PhD'],
    fundingType: 'Fully Funded',
    fieldsOfStudy: ['All Fields', 'Pharmaceuticals', 'Computer Science', 'Data Analytics', 'Literature', 'History', 'Biochemistry'],
    coverageDetails: {
      tuition: 'Contribution to university tuition fees up to €5,750 per annum',
      monthlyStipend: 'A stipend of €22,000 per annum (tax-free living allowance)',
      airfare: 'Eligible direct research expense subsidy',
      healthInsurance: 'Covered via university institutional registration and stipend',
      accommodation: 'Covered via €22,000/year living stipend',
      otherAllowances: 'Eligible direct research expenses allocation of €3,250 per annum for books, software, and field trips'
    },
    deadline: 'Mid-October annually',
    deadlineDate: '2026-10-12T16:00:00Z',
    academicRequirements: {
      minCGPA: 3.3,
      cgpaScale: 4.0,
      equivalentPercentage: 'First class or upper second-class honours (2:1) bachelor degree',
      degreePrerequisite: 'Master’s by research or doctoral registration at an eligible Irish higher education institution',
      additionalRequirements: 'Rigorous original research proposal supported by an academic mentor at an Irish university'
    },
    languageRequirements: {
      ieltsRequired: true,
      minIeltsOverall: 6.5,
      waiverPossible: true,
      waiverCondition: 'Dependent on host Irish university (Trinity College Dublin, UCD, University of Galway, UCC)'
    },
    eligibleNationalities: ['Open to international applicants of all nationalities without geographic restriction'],
    officialUrl: 'https://researchireland.ie/funding/government-of-ireland-postgraduate-scholarship/',
    officialApplicationPortal: 'https://irishresearch.smartsimple.ie/',
    source: 'Research Ireland Government Portal',
    lastVerified: '2026-08-18',
    overview: 'The Government of Ireland Postgraduate Scholarship Programme is an established national initiative, funded by the Department of Further and Higher Education, Research, Innovation and Science. It funds bottom-up research proposals across STEM, humanities, and social sciences at Irish universities.',
    requiredDocuments: [
      'Comprehensive research proposal with methodology and Gantt chart',
      'Academic track record and transcripts',
      'Academic supervisor endorsement form submitted directly in SmartSimple',
      'Two academic referee forms'
    ],
    applicationProcess: [
      'Find an eligible academic supervisor at an accredited Irish university (e.g. TCD, UCD, UCC, DCU)',
      'Prepare and submit proposal through the online application portal (SmartSimple)',
      'Supervisor and referees submit their references before the deadline',
      'Independent international expert reviewers assess applications; results in March'
    ],
    isVerified: true,
    isFeatured: false
  },
  {
    id: 'csc-china-silkroad',
    title: 'Chinese Government Scholarship (CSC - High Level & Silk Road Program)',
    provider: 'China Scholarship Council (Ministry of Education of China)',
    country: 'China',
    countryCode: 'CN',
    flagEmoji: '🇨🇳',
    degreeLevels: ['Masters', 'PhD', 'Bachelors'],
    fundingType: 'Fully Funded',
    fieldsOfStudy: ['Engineering', 'Telecommunications', 'Renewable Energy', 'Civil Engineering', 'Chinese Language', 'Economics', 'Medicine'],
    coverageDetails: {
      tuition: '100% waiver of tuition fees at designated top Chinese Double First-Class universities',
      monthlyStipend: 'CNY 2,500/month for Bachelors, CNY 3,000/month for Master’s, CNY 3,500/month for PhD',
      airfare: 'Varies by bilateral agreement (Type A covers flight in some bilateral agreements, Type B is self-funded airfare)',
      healthInsurance: 'Comprehensive Medical Insurance and Protection Scheme for Foreigners in China (800 CNY/year paid)',
      accommodation: 'Free university international student dormitory (single room for PhD, twin room for Master’s) or monthly housing subsidy',
      otherAllowances: '1-2 years of intensive Chinese language training covered if degree is instructed in Chinese'
    },
    deadline: 'January 1 to March 31 annually',
    deadlineDate: '2026-03-31T23:59:59Z',
    academicRequirements: {
      minCGPA: 3.0,
      cgpaScale: 4.0,
      equivalentPercentage: 'Minimum 75% or equivalent across academic qualifications',
      degreePrerequisite: 'High school graduation for Bachelors, Bachelor’s for Master’s, Master’s for PhD',
      additionalRequirements: 'Foreigner Physical Examination Form certified by official hospital'
    },
    languageRequirements: {
      ieltsRequired: false,
      minIeltsOverall: 6.0,
      waiverPossible: true,
      waiverCondition: 'HSK level 4/5 required for Chinese-medium courses. English proficiency certificate from prior university accepted for most English-taught STEM majors.'
    },
    eligibleNationalities: ['Citizens of countries other than the People’s Republic of China'],
    officialUrl: 'https://www.campuschina.org/',
    officialApplicationPortal: 'https://studyinchina.csc.edu.cn/',
    source: 'China Scholarship Council Official Portal',
    lastVerified: '2026-09-03',
    overview: 'The Chinese Government Scholarship (CSC) is provided by the Ministry of Education of China to promote mutual understanding and educational exchanges between China and the world. Top institutions include Tsinghua, Peking University, Zhejiang University, Shanghai Jiao Tong, and Fudan University.',
    requiredDocuments: [
      'CSC Application Form (Type B through university agency code)',
      'Notarized highest diploma and academic transcripts',
      'A Study Plan or Research Proposal in Chinese or English (minimum 800 words)',
      'Two letters of recommendation from professors or associate professors',
      'Foreigner Physical Examination Form with laboratory blood test reports',
      'Pre-admission letter from target Chinese university (strongly recommended)'
    ],
    applicationProcess: [
      'Apply to Chinese university international student admissions portal and receive Pre-Admission Letter or supervisor contact',
      'Register on the CSC portal (studyinchina.csc.edu.cn) and input the university Agency Number',
      'Upload notarized transcripts, physical exam, and study plan',
      'University nominates top applicants to the CSC National Committee in Beijing for final approval in July'
    ],
    isVerified: true,
    isFeatured: true
  },
  {
    id: 'eth-zurich-esop',
    title: 'ETH Zurich Excellence Scholarship & Opportunity Programme (ESOP)',
    provider: 'ETH Zurich (Swiss Federal Institute of Technology)',
    country: 'Switzerland',
    countryCode: 'CH',
    flagEmoji: '🇨🇭',
    degreeLevels: ['Masters'],
    fundingType: 'Fully Funded',
    fieldsOfStudy: ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Robotics & Control', 'Data Science', 'Mathematics', 'Architecture'],
    coverageDetails: {
      tuition: 'Full tuition fee waiver for the entire standard duration of the Master’s degree (CHF 730/semester)',
      monthlyStipend: 'Contribution to living and study costs of CHF 12,000 per semester (CHF 24,000 per year)',
      airfare: 'Covered via the high living allowance allocation',
      healthInsurance: 'Students must purchase Swiss health insurance, fully financed via semester grant',
      accommodation: 'Reserved rooms in student housing cooperatives in Zurich',
      otherAllowances: 'Dedicated mentoring program by senior ETH faculty members'
    },
    deadline: 'December 15 annually (Application opens November 1)',
    deadlineDate: '2026-12-15T23:59:59Z',
    academicRequirements: {
      minCGPA: 3.8,
      cgpaScale: 4.0,
      equivalentPercentage: 'Grade A or equivalent (top 10% of Bachelor’s degree cohort)',
      degreePrerequisite: 'Very good result in Bachelor’s degree program from an internationally recognized institution',
      additionalRequirements: 'A concise pre-proposal for the Master’s thesis according to ETH official guidelines'
    },
    languageRequirements: {
      ieltsRequired: true,
      minIeltsOverall: 7.0,
      toeflAccepted: true,
      minToefl: 100,
      waiverPossible: true,
      waiverCondition: 'Graduates whose primary native language is English or holding a degree from UK, US, Canada, Australia, NZ'
    },
    eligibleNationalities: ['Open to international and national students holding an outstanding undergraduate degree'],
    officialUrl: 'https://ethz.ch/students/en/studies/financial/scholarships/excellencescholarship.html',
    officialApplicationPortal: 'https://www.lehrbetrieb.ethz.ch/eApply/',
    source: 'ETH Zurich Rectorate',
    lastVerified: '2026-08-28',
    overview: 'ETH Zurich supports excellent students wishing to pursue a Master’s degree with two scholarship programmes: the Excellence Scholarship & Opportunity Programme (ESOP) and the ETH-D Scholarship. ESOP covers the full study and living costs throughout the Master’s degree at one of the top 10 universities globally.',
    requiredDocuments: [
      'ETH eApply online application form',
      'Pre-proposal for Master’s thesis (3-4 pages formatted per ESOP instructions)',
      'Two letters of recommendation from professors',
      'Certified transcripts of records and ranking certificate',
      'Curriculum Vitae and letter of motivation'
    ],
    applicationProcess: [
      'Apply online via ETH eApply for your chosen Master’s degree program',
      'Select the checkbox for the Excellence Scholarship (ESOP)',
      'Upload thesis pre-proposal and supporting academic dossier before December 15',
      'The departments rank candidates and the Rector makes final decisions in March'
    ],
    isVerified: true,
    isFeatured: true
  },
  {
    id: 'kaist-scholarship-korea',
    title: 'KAIST International Graduate Student Scholarship',
    provider: 'Korea Advanced Institute of Science and Technology (KAIST)',
    country: 'South Korea',
    countryCode: 'KR',
    flagEmoji: '🇰🇷',
    degreeLevels: ['Masters', 'PhD'],
    fundingType: 'Fully Funded',
    fieldsOfStudy: ['Computer Science', 'Semiconductor Technology', 'Mechanical Engineering', 'Bio & Brain Engineering', 'Physics', 'Management Engineering'],
    coverageDetails: {
      tuition: 'Full tuition exemption for 4 semesters (Master’s) or 8 semesters (PhD)',
      monthlyStipend: 'KRW 350,000/month for Master’s, KRW 400,000/month for PhD from university + lab research stipends typically KRW 600,000 - 1,200,000/mo extra',
      airfare: 'Self-funded initially; some research laboratories provide arrival travel grants',
      healthInsurance: 'National Health Insurance (NHI) support provided by KAIST',
      accommodation: 'On-campus dormitories at low student rates (approx. KRW 150,000 - 250,000/month)',
      otherAllowances: 'Korean language training courses subsidized'
    },
    deadline: 'Late September (Spring intake) / Late March (Fall intake)',
    deadlineDate: '2026-09-28T17:00:00Z',
    academicRequirements: {
      minCGPA: 3.3,
      cgpaScale: 4.0,
      equivalentPercentage: 'Minimum 80% or equivalent in prior university degree',
      degreePrerequisite: 'Completed Bachelor’s degree (for Master’s) or Master’s degree (for PhD)',
      additionalRequirements: 'Strong technical background in mathematics and laboratory science'
    },
    languageRequirements: {
      ieltsRequired: true,
      minIeltsOverall: 6.5,
      toeflAccepted: true,
      minToefl: 83,
      waiverPossible: true,
      waiverCondition: 'Applicants with English as primary native language or possessing a degree from an institution in an English-speaking country'
    },
    eligibleNationalities: ['Applicants of foreign nationality whose parents are not citizens of Korea'],
    officialUrl: 'https://admission.kaist.ac.kr/intl-graduate/',
    officialApplicationPortal: 'https://apply.kaist.ac.kr/intergrad/',
    source: 'KAIST International Graduate Admissions',
    lastVerified: '2026-09-07',
    overview: 'KAIST is South Korea’s foremost research university, located in Daedeok Innopolis in Daejeon. Almost 100% of all accepted international graduate students receive the KAIST Scholarship covering full tuition and monthly allowances, working on cutting-edge research alongside global tech leaders.',
    requiredDocuments: [
      'Online application printout',
      'Statement of Financial Resources (select KAIST Scholarship)',
      'Two recommendation letters from academic referees',
      'Official degrees and transcripts with apostille or Korean embassy notarization',
      'English proficiency test score report (IELTS/TOEFL)',
      'Copy of applicant and parents’ passports'
    ],
    applicationProcess: [
      'Complete online application and pay application fee (KRW 80,000)',
      'Send certified hard copies of transcripts and diplomas to KAIST admissions office',
      'Referees submit recommendation letters online',
      'Department reviews and conducts video interviews if necessary; final decisions published on website'
    ],
    isVerified: true,
    isFeatured: false
  }
];

export const COUNTRIES_LIST = [
  'United Kingdom',
  'United States',
  'Germany',
  'European Union',
  'Australia',
  'Japan',
  'Sweden',
  'Switzerland',
  'Turkey',
  'Singapore',
  'Canada',
  'Ireland',
  'China',
  'South Korea',
  'Netherlands',
  'France',
  'New Zealand',
  'Saudi Arabia',
  'Finland',
  'Norway'
];

export const DEGREE_LEVELS = ['Bachelors', 'Masters', 'PhD', 'Postdoc'];

export const FIELDS_OF_STUDY = [
  'Computer Science & AI',
  'Engineering & Technology',
  'Data Science & Mathematics',
  'Public Policy & Governance',
  'Public Health & Medicine',
  'Economics & Business',
  'Natural Sciences & Physics',
  'Environmental & Climate Sciences',
  'International Relations & Law',
  'Humanities & Social Sciences'
];
