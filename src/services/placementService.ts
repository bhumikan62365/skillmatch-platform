import { JobListing, StudentRecord } from '../types';
import { calculateEmployabilityScore } from './matchingEngine';

export const placementService = {
  exportStudentsCSV(students: StudentRecord[], jobs: JobListing[]): void {
    const headers = [
      'USN',
      'Name',
      'Department',
      'Graduation Year',
      'CGPA',
      'Verified Skills Count',
      'Employability Score (%)',
      'Placement Status',
      'Placed Company',
    ];

    const rows = students.map((s) => {
      const score = calculateEmployabilityScore(s, jobs);
      const verifiedCount = s.skills.filter(
        (sk) => sk.evidenceType !== 'resume_mentioned'
      ).length;

      return [
        s.usn,
        `"${s.name}"`,
        `"${s.department}"`,
        s.graduationYear,
        s.cgpa.toFixed(2),
        verifiedCount,
        score,
        `"${s.placementStatus}"`,
        `"${s.placedCompany || '-'}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `placement_cohort_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  exportSkillGapCSV(
    gapRows: { skill: string; category: string; missingCount: number; percentage: number }[]
  ): void {
    const headers = ['Skill', 'Category', 'Students Missing', 'Cohort Gap (%)'];
    const rows = gapRows.map((g) =>
      [`"${g.skill}"`, `"${g.category}"`, g.missingCount, `${g.percentage}%`].join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `skill_gap_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
