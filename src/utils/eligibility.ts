import { Scholarship, StudentProfile, EligibilityResult } from '../types';

export function evaluateEligibility(
  scholarship: Scholarship,
  profile: Partial<StudentProfile>
): EligibilityResult {
  const criteria = {
    nationality: { pass: true, details: 'Open to your nationality.' },
    degreeLevel: { pass: true, details: 'Degree level matches your targets.' },
    academicCGPA: { pass: true, details: 'CGPA meets the published threshold.' },
    language: { pass: true, details: 'Language requirements are satisfied or waivable.' },
    fieldOfStudy: { pass: true, details: 'Field of study aligns with eligible programs.' },
  };

  const recommendations: string[] = [];
  let score = 80;

  // 1. Nationality Check
  if (profile.nationality) {
    const nat = profile.nationality.toLowerCase();
    const eligibleList = scholarship.eligibleNationalities.map(n => n.toLowerCase()).join(' ');
    
    if (eligibleList.includes('all countries') || eligibleList.includes('all international') || eligibleList.includes('open to international') || eligibleList.includes('outside the united kingdom') || eligibleList.includes('foreign nationality')) {
      criteria.nationality = {
        pass: true,
        details: `Your nationality (${profile.nationality}) is eligible under open international criteria.`
      };
      score += 5;
    } else if (eligibleList.includes(nat) || eligibleList.includes('developing') || eligibleList.includes('emerging') || eligibleList.includes('partner countries') || eligibleList.includes('dac list')) {
      criteria.nationality = {
        pass: true,
        details: `Your nationality (${profile.nationality}) qualifies under eligible/priority partner regions.`
      };
      score += 5;
    } else {
      criteria.nationality = {
        pass: true,
        details: `Verify specific country bilateral quota on the official embassy portal for ${profile.nationality}.`
      };
    }
  }

  // 2. Degree Level Check
  if (profile.preferredDegreeLevel) {
    const targetDeg = profile.preferredDegreeLevel as any;
    const matchesDegree = scholarship.degreeLevels.includes(targetDeg);
    if (matchesDegree) {
      criteria.degreeLevel = {
        pass: true,
        details: `Matches your target degree level: ${profile.preferredDegreeLevel}.`
      };
      score += 10;
    } else {
      criteria.degreeLevel = {
        pass: false,
        details: `Offers: ${scholarship.degreeLevels.join(', ')}. Your target is ${profile.preferredDegreeLevel}.`
      };
      score -= 30;
      recommendations.push(`This scholarship is for ${scholarship.degreeLevels.join(', ')}. Check if you can transition into this program.`);
    }
  }

  // 3. Academic CGPA Check
  if (profile.cgpa !== undefined && profile.cgpaScale) {
    const userNormalized = (profile.cgpa / profile.cgpaScale) * 4.0;
    const reqNormalized = (scholarship.academicRequirements.minCGPA / scholarship.academicRequirements.cgpaScale) * 4.0;

    if (userNormalized >= reqNormalized) {
      criteria.academicCGPA = {
        pass: true,
        details: `Your CGPA (${profile.cgpa}/${profile.cgpaScale}) satisfies the minimum threshold of ${scholarship.academicRequirements.minCGPA}/${scholarship.academicRequirements.cgpaScale}.`
      };
      score += 10;
    } else if (userNormalized >= reqNormalized - 0.25) {
      criteria.academicCGPA = {
        pass: true,
        details: `Your CGPA (${profile.cgpa}/${profile.cgpaScale}) is slightly below the preferred ${scholarship.academicRequirements.minCGPA}/${scholarship.academicRequirements.cgpaScale}, but high work/research experience can compensate.`
      };
      score -= 10;
      recommendations.push('Strengthen your application with outstanding research publications, recommendations, or professional impact.');
    } else {
      criteria.academicCGPA = {
        pass: false,
        details: `Your CGPA (${profile.cgpa}/${profile.cgpaScale}) is below the stated minimum ${scholarship.academicRequirements.minCGPA}/${scholarship.academicRequirements.cgpaScale}.`
      };
      score -= 25;
      recommendations.push('Review whether previous academic achievements or high standardized test scores can qualify for holistic review.');
    }
  }

  // 4. Language Requirements
  if (scholarship.languageRequirements.ieltsRequired) {
    const reqScore = scholarship.languageRequirements.minIeltsOverall || 6.5;
    if (profile.ieltsStatus === 'Completed' && profile.ieltsOverall) {
      if (profile.ieltsOverall >= reqScore) {
        criteria.language = {
          pass: true,
          details: `Your IELTS score of ${profile.ieltsOverall} satisfies the minimum requirement of ${reqScore}.`
        };
        score += 5;
      } else {
        criteria.language = {
          pass: false,
          details: `Your IELTS score (${profile.ieltsOverall}) is below the required ${reqScore}.`
        };
        score -= 20;
        recommendations.push(`Plan to retake IELTS to achieve at least ${reqScore} overall before submission.`);
      }
    } else if (profile.ieltsStatus === 'Not taken yet') {
      criteria.language = {
        pass: true,
        details: `IELTS is required (${reqScore} minimum). You have marked test as not taken yet.`
      };
      recommendations.push(`Schedule your IELTS/TOEFL test early to submit before the application deadline.`);
      score -= 5;
    } else if (scholarship.languageRequirements.waiverPossible) {
      criteria.language = {
        pass: true,
        details: scholarship.languageRequirements.waiverCondition || 'Language test waiver may be requested if prior education was in English.'
      };
      recommendations.push('Prepare an English Proficiency Certificate from your previous university registrar.');
    }
  } else {
    criteria.language = {
      pass: true,
      details: scholarship.languageRequirements.waiverCondition || 'No general IELTS required by the scholarship secretariat (individual university course may verify separately).'
    };
  }

  // Determine overall status
  let status: 'eligible' | 'potentially_eligible' | 'attention_required' | 'ineligible' = 'potentially_eligible';
  if (!criteria.degreeLevel.pass) {
    status = 'ineligible';
  } else if (!criteria.academicCGPA.pass) {
    status = 'attention_required';
  } else if (score >= 85) {
    status = 'eligible';
  } else if (score >= 60) {
    status = 'potentially_eligible';
  } else {
    status = 'attention_required';
  }

  let summary = '';
  if (status === 'eligible') {
    summary = `You appear to be a strong candidate based on your academic profile, nationality, and degree level.`;
  } else if (status === 'potentially_eligible') {
    summary = `You meet core eligibility criteria; ensure document prerequisites and language scores are prepared.`;
  } else if (status === 'attention_required') {
    summary = `One or more specific requirements (such as CGPA scale or language test) need close attention or official verification.`;
  } else {
    summary = `This scholarship does not align with your targeted degree level.`;
  }

  return {
    status,
    summary,
    score: Math.max(10, Math.min(100, score)),
    criteria,
    recommendations,
    disclaimer: 'This AI eligibility evaluation is provided for guidance only based on published criteria and does not guarantee admission or funding. Always verify the latest requirements on the official provider portal.'
  };
}
