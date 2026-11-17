import {
  ResumeExtractionResult,
  SkillCategory,
} from '../types';
import { executeMockableRequest } from './apiClient';

const SKILL_CATALOG: { name: string; category: SkillCategory }[] = [
  { name: 'Python', category: 'Programming Languages' },
  { name: 'TypeScript', category: 'Programming Languages' },
  { name: 'Java', category: 'Programming Languages' },
  { name: 'C++', category: 'Programming Languages' },
  { name: 'React', category: 'Web Development' },
  { name: 'Next.js', category: 'Web Development' },
  { name: 'FastAPI', category: 'Web Development' },
  { name: 'REST APIs', category: 'Web Development' },
  { name: 'Tailwind CSS', category: 'Web Development' },
  { name: 'PostgreSQL', category: 'Database Technologies' },
  { name: 'SQL', category: 'Database Technologies' },
  { name: 'Redis', category: 'Database Technologies' },
  { name: 'PyTorch', category: 'AI/ML' },
  { name: 'Scikit-Learn', category: 'AI/ML' },
  { name: 'Docker', category: 'Development Tools' },
  { name: 'Kubernetes', category: 'Development Tools' },
  { name: 'Git', category: 'Development Tools' },
  { name: 'Data Structures & Algorithms', category: 'Core Computer Science' },
  { name: 'System Design', category: 'Core Computer Science' },
  { name: 'Operating Systems', category: 'Core Computer Science' },
];

export const studentService = {
  async analyzeResumeFile(
    fileName: string,
    rawTextHint?: string
  ): Promise<ResumeExtractionResult> {
    return executeMockableRequest(
      { endpoint: '/student/resume/analyze', method: 'POST', body: { fileName } },
      () => {
        const text = (rawTextHint || fileName).toLowerCase();
        const detectedSkills = SKILL_CATALOG.filter((item) =>
          text.includes(item.name.toLowerCase())
        ).map((item) => ({
          name: item.name,
          category: item.category,
          confidence: 0.94,
          selected: true,
        }));

        // Ensure realistic rich extraction even for binary PDF/DOCX uploads where browser text isn't extracted
        const fallbackSkills: ResumeExtractionResult['extractedSkills'] = [
          { name: 'Python', category: 'Programming Languages', confidence: 0.97, selected: true },
          { name: 'TypeScript', category: 'Programming Languages', confidence: 0.95, selected: true },
          { name: 'React', category: 'Web Development', confidence: 0.96, selected: true },
          { name: 'PostgreSQL', category: 'Database Technologies', confidence: 0.91, selected: true },
          { name: 'Docker', category: 'Development Tools', confidence: 0.89, selected: true },
          { name: 'System Design', category: 'Core Computer Science', confidence: 0.86, selected: true },
          { name: 'PyTorch', category: 'AI/ML', confidence: 0.88, selected: true },
        ];

        const skills =
          detectedSkills.length >= 3
            ? detectedSkills
            : fallbackSkills;

        return {
          fileName,
          parsedAt: new Date().toISOString().split('T')[0],
          education: {
            institution: 'RV College of Engineering',
            degree: 'B.E. in Computer Science & Engineering',
            department: 'Computer Science',
            graduationYear: 2026,
            cgpa: 8.92,
          },
          extractedSkills: skills,
          extractedProjects: [
            {
              title: 'Real-Time Code Evaluation Sandbox',
              description:
                'Containerized execution runner with isolated worker queues and REST APIs for automated technical screening.',
              technologies: ['Python', 'Docker', 'PostgreSQL', 'FastAPI'],
              contribution: 'Designed container sandboxing and queue retry mechanism.',
              selected: true,
            },
            {
              title: 'Academic Research Paper Recommender',
              description:
                'Semantic citation explorer indexing 12,000+ abstracts using vector embeddings and React filter views.',
              technologies: ['TypeScript', 'React', 'PyTorch', 'Tailwind CSS'],
              contribution: 'Built embedding pipeline and interactive citation graph UI.',
              selected: true,
            },
          ],
          extractedCertifications: [
            {
              name: 'Docker & Kubernetes Foundations',
              issuer: 'Cloud Native Computing Foundation',
              issueDate: '2026-09',
              selected: true,
            },
          ],
        };
      },
      750
    );
  },
};
