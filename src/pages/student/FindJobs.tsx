import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { SearchBar } from '../../components/ui/SearchBar';
import { FilterDropdown } from '../../components/ui/FilterDropdown';
import { JobCard } from '../../components/ui/JobCard';
import { calculateJobMatch } from '../../services/matchingEngine';

export function FindJobs() {
  const { activeStudent, jobs, applyToJob } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'match' | 'deadline'>('match');

  const locations = useMemo(() => {
    const unique = Array.from(new Set(jobs.map((j) => j.location)));
    return [
      { label: 'All Locations', value: 'All' },
      ...unique.map((l) => ({ label: l, value: l })),
    ];
  }, [jobs]);

  const skillOptions = useMemo(() => {
    const unique = Array.from(
      new Set(jobs.flatMap((j) => j.requiredSkills.map((s) => s.name)))
    ).sort();
    return [
      { label: 'All Required Skills', value: 'All' },
      ...unique.map((s) => ({ label: s, value: s })),
    ];
  }, [jobs]);

  const jobTypeOptions = [
    { label: 'All Job Types', value: 'All' },
    { label: 'Full-Time', value: 'Full-Time' },
    { label: 'Internship', value: 'Internship' },
    { label: 'Graduate Trainee', value: 'Graduate Trainee' },
  ];

  const filteredMatches = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs
      .filter((job) => {
        const matchesSearch =
          !q ||
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.requiredSkills.some((s) => s.name.toLowerCase().includes(q));
        const matchesLoc =
          locationFilter === 'All' || job.location === locationFilter;
        const matchesSkill =
          skillFilter === 'All' ||
          job.requiredSkills.some((s) => s.name === skillFilter);
        const matchesType =
          jobTypeFilter === 'All' || job.jobType === jobTypeFilter;

        return matchesSearch && matchesLoc && matchesSkill && matchesType;
      })
      .map((job) => calculateJobMatch(activeStudent, job))
      .sort((a, b) => {
        if (sortBy === 'match') return b.matchScore - a.matchScore;
        return a.job.expiryDate.localeCompare(b.job.expiryDate);
      });
  }, [
    jobs,
    activeStudent,
    search,
    locationFilter,
    skillFilter,
    jobTypeFilter,
    sortBy,
  ]);

  return (
    <DashboardLayout title="Find Jobs" breadcrumb="Student Portal / Find Jobs">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A] font-display">
              Matched Opportunities
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
              Showing {filteredMatches.length} of {jobs.length} active roles ranked by weighted skill compatibility
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Sort by:</span>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setSortBy('match')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                  sortBy === 'match'
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Highest Match %
              </button>
              <button
                type="button"
                onClick={() => setSortBy('deadline')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                  sortBy === 'deadline'
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Closing Soon
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search role, company, or skill..."
          />
          <FilterDropdown
            label="Location"
            value={locationFilter}
            options={locations}
            onChange={setLocationFilter}
          />
          <FilterDropdown
            label="Skill"
            value={skillFilter}
            options={skillOptions}
            onChange={setSkillFilter}
          />
          <FilterDropdown
            label="Job Type"
            value={jobTypeFilter}
            options={jobTypeOptions}
            onChange={setJobTypeFilter}
          />
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="mt-6 bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-sm font-medium text-[#0F172A]">
            No jobs match your active filters
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Reset filters to view all available industry roles.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setLocationFilter('All');
              setSkillFilter('All');
              setJobTypeFilter('All');
            }}
            className="mt-4 px-4 py-2 text-xs font-medium text-white bg-[#2563EB] rounded-lg cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredMatches.map((breakdown) => (
            <JobCard
              key={breakdown.job.id}
              breakdown={breakdown}
              hasApplied={activeStudent.appliedJobIds.includes(breakdown.job.id)}
              onViewDetails={(id) => navigate(`/student/jobs/${id}`)}
              onApply={applyToJob}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
