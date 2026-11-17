import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { AnalyticsChart } from '../../components/ui/AnalyticsChart';
import {
  calculateEmployabilityScore,
  calculateJobMatch,
} from '../../services/matchingEngine';

export function SkillAnalytics() {
  const { students, jobs } = useApp();

  const mostCommonSkills = useMemo(() => {
    const counts = new Map<string, number>();
    students.forEach((s) => {
      s.skills.forEach((sk) => {
        counts.set(sk.name, (counts.get(sk.name) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .map(([skill, studentsCount]) => ({ skill, studentsCount }))
      .sort((a, b) => b.studentsCount - a.studentsCount)
      .slice(0, 8);
  }, [students]);

  const missingSkills = useMemo(() => {
    const counts = new Map<string, number>();
    students.forEach((stu) => {
      const missingSet = new Set<string>();
      jobs.forEach((job) => {
        calculateJobMatch(stu, job).missingRequiredSkills.forEach((m) =>
          missingSet.add(m.name)
        );
      });
      missingSet.forEach((name) => counts.set(name, (counts.get(name) || 0) + 1));
    });
    return Array.from(counts.entries())
      .map(([skill, missingCount]) => ({ skill, missingCount }))
      .sort((a, b) => b.missingCount - a.missingCount)
      .slice(0, 8);
  }, [students, jobs]);

  const competencyDistribution = useMemo(() => {
    const buckets = [
      { range: '80–100%', count: 0 },
      { range: '60–79%', count: 0 },
      { range: '40–59%', count: 0 },
      { range: '< 40%', count: 0 },
    ];
    students.forEach((s) => {
      const score = calculateEmployabilityScore(s, jobs);
      if (score >= 80) buckets[0].count += 1;
      else if (score >= 60) buckets[1].count += 1;
      else if (score >= 40) buckets[2].count += 1;
      else buckets[3].count += 1;
    });
    return buckets;
  }, [students, jobs]);

  const deptComparison = useMemo(() => {
    const map = new Map<string, { verified: number; resumeOnly: number; count: number }>();
    students.forEach((s) => {
      const verified = s.skills.filter(
        (sk) => sk.evidenceType !== 'resume_mentioned'
      ).length;
      const resumeOnly = s.skills.length - verified;
      const curr = map.get(s.department) || { verified: 0, resumeOnly: 0, count: 0 };
      map.set(s.department, {
        verified: curr.verified + verified,
        resumeOnly: curr.resumeOnly + resumeOnly,
        count: curr.count + 1,
      });
    });

    return Array.from(map.entries()).map(([department, val]) => ({
      department,
      Verified: Number((val.verified / val.count).toFixed(1)),
      ResumeOnly: Number((val.resumeOnly / val.count).toFixed(1)),
    }));
  }, [students]);

  return (
    <DashboardLayout
      title="Skill Analytics"
      breadcrumb="Placement Cell / Skill Analytics"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart
          title="Most Common Technical Skills Across Cohort"
          subtitle="Number of students possessing each competency"
          type="horizontal_bar"
          data={mostCommonSkills}
          dataKey="studentsCount"
          nameKey="skill"
          height={290}
        />

        <AnalyticsChart
          title="Frequently Missing Industry Skills"
          subtitle="Students missing skills required by active job descriptions"
          type="horizontal_bar"
          data={missingSkills}
          dataKey="missingCount"
          nameKey="skill"
          height={290}
        />

        <AnalyticsChart
          title="Department-wise Skill Verification Depth"
          subtitle="Blue: Avg practical verified skills · Dark Slate: Avg resume-only mentions"
          type="bar"
          data={deptComparison}
          dataKey="Verified"
          secondaryDataKey="ResumeOnly"
          nameKey="department"
          height={270}
        />

        <AnalyticsChart
          title="Student Competency Score Distribution"
          subtitle="Employability score brackets across registered cohort"
          type="bar"
          data={competencyDistribution}
          dataKey="count"
          nameKey="range"
          height={270}
        />
      </div>
    </DashboardLayout>
  );
}
