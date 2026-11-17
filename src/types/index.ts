export type UserRole = 'student' | 'placement_officer' | 'admin';

export type SkillCategory =
  | 'Programming Languages'
  | 'Web Development'
  | 'Database Technologies'
  | 'AI/ML'
  | 'Development Tools'
  | 'Core Computer Science';

export type SkillEvidenceType =
  | 'project_verified'
  | 'certification_verified'
  | 'resume_mentioned';

export type PlacementStatus =
  | 'Placement Ready'
  | 'Selected'
  | 'Requires Training'
  | 'In Process';

export type JobType = 'Full-Time' | 'Internship' | 'Graduate Trainee';

export type GapPriority = 'high' | 'medium' | 'low';

export type LearningStatus = 'completed' | 'in_progress' | 'pending';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  institution: string;
  status: 'Active' | 'Pending' | 'Suspended';
  lastActive: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
  evidenceType: SkillEvidenceType;
  evidenceSource: string;
  verified: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  contribution: string;
  updatedAt: string;
}

export interface StudentRecord {
  id: string;
  userId: string;
  name: string;
  usn: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  institution: string;
  department: string;
  graduationYear: number;
  cgpa: number;
  githubUrl: string;
  linkedinUrl: string;
  headline: string;
  resumeFileName?: string;
  resumeLastAnalyzed?: string;
  certifications: Certification[];
  skills: SkillItem[];
  projects: ProjectItem[];
  placementStatus: PlacementStatus;
  placedCompany?: string;
  appliedJobIds: string[];
}

export interface WeightedSkill {
  name: string;
  weight: number; // 1-10 importance weight
  category: SkillCategory;
}

export interface JobListing {
  id: string;
  company: string;
  title: string;
  location: string;
  jobType: JobType;
  salaryRange: string;
  description: string;
  requiredSkills: WeightedSkill[];
  preferredSkills: string[];
  minCgpa: number;
  eligibleDepartments: string[];
  applicationUrl: string;
  expiryDate: string;
  postedAt: string;
  applicantsCount: number;
}

export interface MatchedSkillDetail {
  name: string;
  weight: number;
  category: SkillCategory;
  evidenceType: SkillEvidenceType;
  evidenceSource: string;
}

export interface MissingSkillDetail {
  name: string;
  weight: number;
  category: SkillCategory;
  priority: GapPriority;
}

export interface JobMatchBreakdown {
  job: JobListing;
  matchScore: number; // (Matched Required Skill Weight / Total Required Skill Weight) * 100
  matchedWeight: number;
  totalRequiredWeight: number;
  matchedRequiredSkills: MatchedSkillDetail[];
  missingRequiredSkills: MissingSkillDetail[];
  matchedPreferredSkills: string[];
  missingPreferredSkills: string[];
  practicalEvidenceCount: number;
  resumeOnlyCount: number;
  cgpaEligible: boolean;
  departmentEligible: boolean;
  isEligible: boolean;
}

export interface LearningResource {
  id: string;
  skillName: string;
  category: SkillCategory;
  topic: string;
  provider: string;
  resourceUrl: string;
  priority: GapPriority;
  estimatedHours: number;
  status: LearningStatus;
  reason: string;
}

export interface ActivityEvent {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  actorRole: UserRole;
}

export interface ResumeExtractionResult {
  fileName: string;
  parsedAt: string;
  education: {
    institution: string;
    degree: string;
    department: string;
    graduationYear: number;
    cgpa: number;
  };
  extractedSkills: {
    name: string;
    category: SkillCategory;
    confidence: number;
    selected: boolean;
  }[];
  extractedProjects: {
    title: string;
    description: string;
    technologies: string[];
    contribution: string;
    selected: boolean;
  }[];
  extractedCertifications: {
    name: string;
    issuer: string;
    issueDate: string;
    selected: boolean;
  }[];
}

export interface InstitutionRecord {
  id: string;
  name: string;
  code: string;
  city: string;
  studentCount: number;
  officerCount: number;
  activeDrives: number;
  status: 'Active' | 'Onboarding';
}

export interface SkillTaxonomyItem {
  id: string;
  name: string;
  category: SkillCategory;
  standardWeight: number;
  aliases: string[];
  demandLevel: 'High' | 'Medium' | 'Low';
}

export interface PlatformSettings {
  readyThresholdScore: number;
  requirePracticalEvidenceBonus: boolean;
  defaultAcademicYear: string;
  autoResumeExtraction: boolean;
  allowStudentSelfRegistration: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}
