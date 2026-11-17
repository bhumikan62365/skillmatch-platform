import {
  GapPriority,
  JobListing,
  JobMatchBreakdown,
  MatchedSkillDetail,
  MissingSkillDetail,
  SkillItem,
  StudentRecord,
} from '../types';

function normalizeSkill(name: string): string {
  return name.trim().toLowerCase();
}

function derivePriorityFromWeight(weight: number): GapPriority {
  if (weight >= 8) return 'high';
  if (weight >= 5) return 'medium';
  return 'low';
}

/**
 * Computes explainable job compatibility score using the exact formula:
 * Match Score = (Matched Required Skill Weight / Total Required Skill Weight) * 100
 * Also tracks practical evidence vs resume-only mentions.
 */
export function calculateJobMatch(
  student: StudentRecord,
  job: JobListing
): JobMatchBreakdown {
  const skillMap = new Map<string, SkillItem>();
  student.skills.forEach((s) => {
    skillMap.set(normalizeSkill(s.name), s);
  });

  // Also index project technologies as practical evidence if a skill is linked
  const projectTechMap = new Map<string, string>();
  student.projects.forEach((proj) => {
    proj.technologies.forEach((tech) => {
      const key = normalizeSkill(tech);
      if (!projectTechMap.has(key)) {
        projectTechMap.set(key, proj.title);
      }
    });
  });

  const matchedRequiredSkills: MatchedSkillDetail[] = [];
  const missingRequiredSkills: MissingSkillDetail[] = [];

  let matchedWeight = 0;
  let totalRequiredWeight = 0;
  let practicalEvidenceCount = 0;
  let resumeOnlyCount = 0;

  job.requiredSkills.forEach((reqSkill) => {
    totalRequiredWeight += reqSkill.weight;
    const key = normalizeSkill(reqSkill.name);
    const studentSkill = skillMap.get(key);
    const projectTitle = projectTechMap.get(key);

    if (studentSkill || projectTitle) {
      matchedWeight += reqSkill.weight;

      let evidenceType = studentSkill?.evidenceType ?? 'project_verified';
      let evidenceSource = studentSkill?.evidenceSource ?? `Project: ${projectTitle}`;

      // Upgrade evidence if also backed by a concrete project
      if (projectTitle && evidenceType === 'resume_mentioned') {
        evidenceType = 'project_verified';
        evidenceSource = `Project: ${projectTitle}`;
      }

      if (evidenceType === 'resume_mentioned') {
        resumeOnlyCount += 1;
      } else {
        practicalEvidenceCount += 1;
      }

      matchedRequiredSkills.push({
        name: reqSkill.name,
        weight: reqSkill.weight,
        category: reqSkill.category,
        evidenceType,
        evidenceSource,
      });
    } else {
      missingRequiredSkills.push({
        name: reqSkill.name,
        weight: reqSkill.weight,
        category: reqSkill.category,
        priority: derivePriorityFromWeight(reqSkill.weight),
      });
    }
  });

  const matchedPreferredSkills: string[] = [];
  const missingPreferredSkills: string[] = [];

  job.preferredSkills.forEach((pref) => {
    const key = normalizeSkill(pref);
    if (skillMap.has(key) || projectTechMap.has(key)) {
      matchedPreferredSkills.push(pref);
    } else {
      missingPreferredSkills.push(pref);
    }
  });

  const rawScore =
    totalRequiredWeight > 0 ? (matchedWeight / totalRequiredWeight) * 100 : 0;
  const matchScore = Math.round(rawScore);

  const cgpaEligible = student.cgpa >= job.minCgpa;
  const departmentEligible =
    job.eligibleDepartments.includes('All') ||
    job.eligibleDepartments.some(
      (d) => d.toLowerCase() === student.department.toLowerCase()
    );

  return {
    job,
    matchScore,
    matchedWeight,
    totalRequiredWeight,
    matchedRequiredSkills,
    missingRequiredSkills,
    matchedPreferredSkills,
    missingPreferredSkills,
    practicalEvidenceCount,
    resumeOnlyCount,
    cgpaEligible,
    departmentEligible,
    isEligible: cgpaEligible && departmentEligible,
  };
}

export function calculateProfileCompletion(student: StudentRecord): number {
  let score = 0;
  if (student.name && student.email && student.phone) score += 15;
  if (student.institution && student.department && student.cgpa > 0) score += 15;
  if (student.githubUrl || student.linkedinUrl) score += 10;
  if (student.resumeFileName) score += 20;
  if (student.skills.length >= 5) score += 15;
  else if (student.skills.length > 0) score += 8;
  if (student.projects.length >= 2) score += 15;
  else if (student.projects.length === 1) score += 8;
  if (student.certifications.length >= 1) score += 10;
  return Math.min(100, score);
}

export function calculateEmployabilityScore(
  student: StudentRecord,
  jobs: JobListing[]
): number {
  if (jobs.length === 0) return 0;
  const matches = jobs.map((job) => calculateJobMatch(student, job));
  const sorted = [...matches].sort((a, b) => b.matchScore - a.matchScore);
  const topThree = sorted.slice(0, 3);
  const avgTopMatch =
    topThree.reduce((acc, m) => acc + m.matchScore, 0) / topThree.length;

  const verifiedRatio =
    student.skills.length > 0
      ? student.skills.filter((s) => s.evidenceType !== 'resume_mentioned').length /
        student.skills.length
      : 0;

  const cgpaFactor = Math.min(1, student.cgpa / 10);
  const composite = avgTopMatch * 0.72 + verifiedRatio * 18 + cgpaFactor * 10;
  return Math.min(99, Math.round(composite));
}
