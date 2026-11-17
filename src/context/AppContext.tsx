import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityEvent,
  InstitutionRecord,
  JobListing,
  LearningResource,
  LearningStatus,
  PlacementStatus,
  PlatformSettings,
  ProjectItem,
  ResumeExtractionResult,
  SkillItem,
  SkillTaxonomyItem,
  StudentRecord,
  ToastMessage,
  UserAccount,
  UserRole,
} from '../types';
import {
  INITIAL_ACTIVITIES,
  INITIAL_INSTITUTIONS,
  INITIAL_JOBS,
  INITIAL_LEARNING_RESOURCES,
  INITIAL_SETTINGS,
  INITIAL_STUDENTS,
  INITIAL_TAXONOMY,
  INITIAL_USERS,
  STUDENT_AVATAR,
} from '../services/mockData';
import { authService, LoginPayload, RegisterStudentPayload } from '../services/authService';

interface AppContextValue {
  currentUser: UserAccount | null;
  activeStudent: StudentRecord;
  users: UserAccount[];
  students: StudentRecord[];
  jobs: JobListing[];
  learningResources: LearningResource[];
  activities: ActivityEvent[];
  institutions: InstitutionRecord[];
  taxonomy: SkillTaxonomyItem[];
  settings: PlatformSettings;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
  login: (payload: LoginPayload) => Promise<UserAccount>;
  registerStudent: (payload: RegisterStudentPayload) => Promise<UserAccount>;
  logout: () => void;
  updateStudentProfile: (updates: Partial<StudentRecord>) => void;
  addProject: (project: Omit<ProjectItem, 'id' | 'updatedAt'>) => void;
  updateProject: (project: ProjectItem) => void;
  deleteProject: (projectId: string) => void;
  addOrUpdateSkill: (skill: Omit<SkillItem, 'id'> & { id?: string }) => void;
  deleteSkill: (skillId: string) => void;
  applyResumeExtraction: (result: ResumeExtractionResult) => void;
  applyToJob: (jobId: string) => void;
  updateLearningStatus: (resourceId: string, status: LearningStatus) => void;
  addLearningResource: (resource: Omit<LearningResource, 'id'>) => void;
  addJob: (job: Omit<JobListing, 'id' | 'postedAt' | 'applicantsCount'>) => void;
  updateJob: (job: JobListing) => void;
  deleteJob: (jobId: string) => void;
  updateStudentPlacement: (
    studentId: string,
    status: PlacementStatus,
    placedCompany?: string
  ) => void;
  addUserAccount: (user: Omit<UserAccount, 'id' | 'lastActive'>) => void;
  updateUserRoleAndStatus: (
    userId: string,
    role: UserRole,
    status: UserAccount['status']
  ) => void;
  addInstitution: (inst: Omit<InstitutionRecord, 'id'>) => void;
  updateInstitutionStatus: (instId: string, status: InstitutionRecord['status']) => void;
  addTaxonomySkill: (item: Omit<SkillTaxonomyItem, 'id'>) => void;
  deleteTaxonomySkill: (id: string) => void;
  updateSettings: (settings: PlatformSettings) => void;
  resetDemoData: () => void;
}

const STORAGE_KEY = 's2j_platform_state_v1';

interface PersistedState {
  currentUser: UserAccount | null;
  users: UserAccount[];
  students: StudentRecord[];
  jobs: JobListing[];
  learningResources: LearningResource[];
  activities: ActivityEvent[];
  institutions: InstitutionRecord[];
  taxonomy: SkillTaxonomyItem[];
  settings: PlatformSettings;
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as PersistedState;
    }
  } catch {
    // Fallback to initial dataset
  }
  return {
    currentUser: null,
    users: INITIAL_USERS,
    students: INITIAL_STUDENTS,
    jobs: INITIAL_JOBS,
    learningResources: INITIAL_LEARNING_RESOURCES,
    activities: INITIAL_ACTIVITIES,
    institutions: INITIAL_INSTITUTIONS,
    taxonomy: INITIAL_TAXONOMY,
    settings: INITIAL_SETTINGS,
  };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadInitialState);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const pushActivity = (
    title: string,
    detail: string,
    actorRole: UserRole
  ): ActivityEvent => ({
    id: `act-${Date.now()}`,
    title,
    detail,
    timestamp: 'Just now',
    actorRole,
  });

  const activeStudent = useMemo(() => {
    if (state.currentUser?.role === 'student') {
      const found = state.students.find(
        (s) => s.userId === state.currentUser?.id || s.email === state.currentUser?.email
      );
      if (found) return found;
    }
    return state.students[0];
  }, [state.currentUser, state.students]);

  const login = async (payload: LoginPayload) => {
    const { user } = await authService.login(payload, state.users);
    setState((prev) => ({
      ...prev,
      currentUser: user,
    }));
    addToast({
      type: 'success',
      title: `Signed in as ${user.name}`,
      message: `Workspace ready for ${user.role.replace('_', ' ')}`,
    });
    return user;
  };

  const registerStudent = async (payload: RegisterStudentPayload) => {
    const { user } = await authService.registerStudent(payload);
    const newStudent: StudentRecord = {
      id: `stu-${Date.now()}`,
      userId: user.id,
      name: payload.name.trim(),
      usn: payload.usn.trim().toUpperCase(),
      email: user.email,
      phone: '',
      avatarUrl: STUDENT_AVATAR,
      institution: payload.institution,
      department: payload.department,
      graduationYear: payload.graduationYear,
      cgpa: 8.2,
      githubUrl: '',
      linkedinUrl: '',
      headline: `${payload.department} undergraduate (${payload.graduationYear} cohort)`,
      certifications: [],
      skills: [],
      projects: [],
      placementStatus: 'Requires Training',
      appliedJobIds: [],
    };

    setState((prev) => ({
      ...prev,
      currentUser: user,
      users: [user, ...prev.users],
      students: [newStudent, ...prev.students],
      activities: [
        pushActivity(
          'Student account created',
          `${newStudent.name} (${newStudent.usn}) joined ${newStudent.institution}`,
          'student'
        ),
        ...prev.activities,
      ],
    }));

    addToast({
      type: 'success',
      title: 'Registration complete',
      message: 'Complete your profile or upload a resume to extract your skills.',
    });
    return user;
  };

  const logout = () => {
    setState((prev) => ({ ...prev, currentUser: null }));
    addToast({ type: 'info', title: 'Signed out successfully' });
  };

  const updateStudentProfile = (updates: Partial<StudentRecord>) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === activeStudent.id ? { ...s, ...updates } : s
      ),
      activities: [
        pushActivity('Profile updated', 'Academic & career profile saved', 'student'),
        ...prev.activities,
      ],
    }));
    addToast({ type: 'success', title: 'Profile updated' });
  };

  const addProject = (project: Omit<ProjectItem, 'id' | 'updatedAt'>) => {
    const newProj: ProjectItem = {
      ...project,
      id: `proj-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setState((prev) => {
      const updatedStudents = prev.students.map((s) => {
        if (s.id !== activeStudent.id) return s;

        // Upgrade matching resume-only skills to project_verified
        const techSet = new Set(project.technologies.map((t) => t.toLowerCase()));
        const updatedSkills = s.skills.map((sk) =>
          techSet.has(sk.name.toLowerCase())
            ? {
                ...sk,
                evidenceType: 'project_verified' as const,
                evidenceSource: `Project: ${project.title}`,
                verified: true,
              }
            : sk
        );

        return {
          ...s,
          projects: [newProj, ...s.projects],
          skills: updatedSkills,
        };
      });

      return {
        ...prev,
        students: updatedStudents,
        activities: [
          pushActivity(
            `Added project: ${project.title}`,
            `Linked ${project.technologies.join(', ')} as practical evidence`,
            'student'
          ),
          ...prev.activities,
        ],
      };
    });

    addToast({
      type: 'success',
      title: 'Project added',
      message: 'Matching technologies upgraded to Practical Evidence.',
    });
  };

  const updateProject = (project: ProjectItem) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === activeStudent.id
          ? {
              ...s,
              projects: s.projects.map((p) => (p.id === project.id ? project : p)),
            }
          : s
      ),
    }));
    addToast({ type: 'success', title: 'Project updated' });
  };

  const deleteProject = (projectId: string) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === activeStudent.id
          ? { ...s, projects: s.projects.filter((p) => p.id !== projectId) }
          : s
      ),
    }));
    addToast({ type: 'info', title: 'Project removed' });
  };

  const addOrUpdateSkill = (skill: Omit<SkillItem, 'id'> & { id?: string }) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) => {
        if (s.id !== activeStudent.id) return s;
        if (skill.id) {
          return {
            ...s,
            skills: s.skills.map((sk) =>
              sk.id === skill.id ? { ...skill, id: skill.id } : sk
            ),
          };
        }
        const exists = s.skills.some(
          (sk) => sk.name.toLowerCase() === skill.name.toLowerCase()
        );
        if (exists) {
          return {
            ...s,
            skills: s.skills.map((sk) =>
              sk.name.toLowerCase() === skill.name.toLowerCase()
                ? { ...sk, ...skill, id: sk.id }
                : sk
            ),
          };
        }
        return {
          ...s,
          skills: [{ ...skill, id: `sk-${Date.now()}` }, ...s.skills],
        };
      }),
    }));
    addToast({ type: 'success', title: `Skill saved: ${skill.name}` });
  };

  const deleteSkill = (skillId: string) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === activeStudent.id
          ? { ...s, skills: s.skills.filter((sk) => sk.id !== skillId) }
          : s
      ),
    }));
    addToast({ type: 'info', title: 'Skill removed' });
  };

  const applyResumeExtraction = (result: ResumeExtractionResult) => {
    setState((prev) => {
      const updatedStudents = prev.students.map((s) => {
        if (s.id !== activeStudent.id) return s;

        const existingMap = new Map(s.skills.map((sk) => [sk.name.toLowerCase(), sk]));
        result.extractedSkills
          .filter((item) => item.selected)
          .forEach((item) => {
            const key = item.name.toLowerCase();
            if (!existingMap.has(key)) {
              existingMap.set(key, {
                id: `sk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                name: item.name,
                category: item.category,
                proficiency: 'Intermediate',
                evidenceType: 'resume_mentioned',
                evidenceSource: `Resume: ${result.fileName}`,
                verified: false,
              });
            }
          });

        const existingProjTitles = new Set(s.projects.map((p) => p.title.toLowerCase()));
        const newProjects: ProjectItem[] = result.extractedProjects
          .filter((p) => p.selected && !existingProjTitles.has(p.title.toLowerCase()))
          .map((p, idx) => ({
            id: `proj-${Date.now()}-${idx}`,
            title: p.title,
            description: p.description,
            technologies: p.technologies,
            githubUrl: s.githubUrl || 'https://github.com',
            contribution: p.contribution,
            updatedAt: result.parsedAt,
          }));

        const existingCertNames = new Set(
          s.certifications.map((c) => c.name.toLowerCase())
        );
        const newCerts = result.extractedCertifications
          .filter((c) => c.selected && !existingCertNames.has(c.name.toLowerCase()))
          .map((c, idx) => ({
            id: `cert-${Date.now()}-${idx}`,
            name: c.name,
            issuer: c.issuer,
            issueDate: c.issueDate,
          }));

        // Upgrade skills backed by newly added projects
        const newProjTechs = new Set(
          newProjects.flatMap((p) => p.technologies.map((t) => t.toLowerCase()))
        );
        const mergedSkills = Array.from(existingMap.values()).map((sk) =>
          newProjTechs.has(sk.name.toLowerCase()) && sk.evidenceType === 'resume_mentioned'
            ? {
                ...sk,
                evidenceType: 'project_verified' as const,
                evidenceSource: 'Verified via extracted resume project',
                verified: true,
              }
            : sk
        );

        return {
          ...s,
          institution: result.education.institution || s.institution,
          department: result.education.department || s.department,
          graduationYear: result.education.graduationYear || s.graduationYear,
          cgpa: result.education.cgpa || s.cgpa,
          resumeFileName: result.fileName,
          resumeLastAnalyzed: result.parsedAt,
          skills: mergedSkills,
          projects: [...newProjects, ...s.projects],
          certifications: [...newCerts, ...s.certifications],
        };
      });

      const selectedCount = result.extractedSkills.filter((x) => x.selected).length;
      return {
        ...prev,
        students: updatedStudents,
        activities: [
          pushActivity(
            `Confirmed resume extraction (${result.fileName})`,
            `Synced ${selectedCount} skills and updated profile baseline`,
            'student'
          ),
          ...prev.activities,
        ],
      };
    });

    addToast({
      type: 'success',
      title: 'Resume insights synced to profile',
      message: 'Compatibility scores and skill gaps have been recalculated.',
    });
  };

  const applyToJob = (jobId: string) => {
    const job = state.jobs.find((j) => j.id === jobId);
    if (!job) return;
    if (activeStudent.appliedJobIds.includes(jobId)) {
      addToast({ type: 'info', title: `Already applied to ${job.company}` });
      return;
    }

    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === activeStudent.id
          ? { ...s, appliedJobIds: [...s.appliedJobIds, jobId] }
          : s
      ),
      jobs: prev.jobs.map((j) =>
        j.id === jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j
      ),
      activities: [
        pushActivity(
          `Applied to ${job.title} at ${job.company}`,
          `Application submitted via Skill-to-Job portal`,
          'student'
        ),
        ...prev.activities,
      ],
    }));
    addToast({
      type: 'success',
      title: `Applied to ${job.company}`,
      message: `${job.title} application recorded.`,
    });
  };

  const updateLearningStatus = (resourceId: string, status: LearningStatus) => {
    const res = state.learningResources.find((r) => r.id === resourceId);
    setState((prev) => ({
      ...prev,
      learningResources: prev.learningResources.map((r) =>
        r.id === resourceId ? { ...r, status } : r
      ),
      activities: res
        ? [
            pushActivity(
              `Learning status updated: ${res.skillName}`,
              `Marked "${res.topic}" as ${status.replace('_', ' ')}`,
              'student'
            ),
            ...prev.activities,
          ]
        : prev.activities,
    }));
    addToast({
      type: 'success',
      title: 'Learning progress updated',
    });
  };

  const addLearningResource = (resource: Omit<LearningResource, 'id'>) => {
    setState((prev) => ({
      ...prev,
      learningResources: [
        { ...resource, id: `lr-${Date.now()}` },
        ...prev.learningResources,
      ],
    }));
    addToast({ type: 'success', title: `Added ${resource.skillName} to roadmap` });
  };

  const addJob = (job: Omit<JobListing, 'id' | 'postedAt' | 'applicantsCount'>) => {
    const newJob: JobListing = {
      ...job,
      id: `job-${Date.now()}`,
      postedAt: new Date().toISOString().split('T')[0],
      applicantsCount: 0,
    };
    setState((prev) => ({
      ...prev,
      jobs: [newJob, ...prev.jobs],
      activities: [
        pushActivity(
          `Published job: ${job.title} (${job.company})`,
          `${job.requiredSkills.length} weighted required skills configured`,
          prev.currentUser?.role || 'placement_officer'
        ),
        ...prev.activities,
      ],
    }));
    addToast({ type: 'success', title: `Job published: ${job.company}` });
  };

  const updateJob = (job: JobListing) => {
    setState((prev) => ({
      ...prev,
      jobs: prev.jobs.map((j) => (j.id === job.id ? job : j)),
    }));
    addToast({ type: 'success', title: `Updated ${job.title}` });
  };

  const deleteJob = (jobId: string) => {
    setState((prev) => ({
      ...prev,
      jobs: prev.jobs.filter((j) => j.id !== jobId),
    }));
    addToast({ type: 'info', title: 'Job listing deleted' });
  };

  const updateStudentPlacement = (
    studentId: string,
    status: PlacementStatus,
    placedCompany?: string
  ) => {
    const stu = state.students.find((s) => s.id === studentId);
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId
          ? {
              ...s,
              placementStatus: status,
              placedCompany: status === 'Selected' ? placedCompany : undefined,
            }
          : s
      ),
      activities: stu
        ? [
            pushActivity(
              `Placement status updated: ${stu.name}`,
              `Status set to ${status}${placedCompany ? ` (${placedCompany})` : ''}`,
              'placement_officer'
            ),
            ...prev.activities,
          ]
        : prev.activities,
    }));
    addToast({ type: 'success', title: 'Placement status updated' });
  };

  const addUserAccount = (user: Omit<UserAccount, 'id' | 'lastActive'>) => {
    setState((prev) => ({
      ...prev,
      users: [
        { ...user, id: `usr-${Date.now()}`, lastActive: 'Just added' },
        ...prev.users,
      ],
      activities: [
        pushActivity(
          `Provisioned user: ${user.name}`,
          `Role assigned: ${user.role.replace('_', ' ')}`,
          'admin'
        ),
        ...prev.activities,
      ],
    }));
    addToast({ type: 'success', title: `User ${user.name} created` });
  };

  const updateUserRoleAndStatus = (
    userId: string,
    role: UserRole,
    status: UserAccount['status']
  ) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === userId ? { ...u, role, status } : u
      ),
    }));
    addToast({ type: 'success', title: 'User permissions updated' });
  };

  const addInstitution = (inst: Omit<InstitutionRecord, 'id'>) => {
    setState((prev) => ({
      ...prev,
      institutions: [{ ...inst, id: `inst-${Date.now()}` }, ...prev.institutions],
    }));
    addToast({ type: 'success', title: `Added institution: ${inst.name}` });
  };

  const updateInstitutionStatus = (
    instId: string,
    status: InstitutionRecord['status']
  ) => {
    setState((prev) => ({
      ...prev,
      institutions: prev.institutions.map((i) =>
        i.id === instId ? { ...i, status } : i
      ),
    }));
    addToast({ type: 'success', title: 'Institution status updated' });
  };

  const addTaxonomySkill = (item: Omit<SkillTaxonomyItem, 'id'>) => {
    setState((prev) => ({
      ...prev,
      taxonomy: [{ ...item, id: `tax-${Date.now()}` }, ...prev.taxonomy],
    }));
    addToast({ type: 'success', title: `Added ${item.name} to taxonomy` });
  };

  const deleteTaxonomySkill = (id: string) => {
    setState((prev) => ({
      ...prev,
      taxonomy: prev.taxonomy.filter((t) => t.id !== id),
    }));
    addToast({ type: 'info', title: 'Skill removed from taxonomy' });
  };

  const updateSettings = (settings: PlatformSettings) => {
    setState((prev) => ({
      ...prev,
      settings,
      activities: [
        pushActivity(
          'Platform configuration updated',
          `Readiness threshold set to ${settings.readyThresholdScore}%`,
          'admin'
        ),
        ...prev.activities,
      ],
    }));
    addToast({ type: 'success', title: 'Platform settings saved' });
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      currentUser: state.currentUser,
      users: INITIAL_USERS,
      students: INITIAL_STUDENTS,
      jobs: INITIAL_JOBS,
      learningResources: INITIAL_LEARNING_RESOURCES,
      activities: INITIAL_ACTIVITIES,
      institutions: INITIAL_INSTITUTIONS,
      taxonomy: INITIAL_TAXONOMY,
      settings: INITIAL_SETTINGS,
    });
    addToast({ type: 'info', title: 'Demo workspace reset to defaults' });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser: state.currentUser,
        activeStudent,
        users: state.users,
        students: state.students,
        jobs: state.jobs,
        learningResources: state.learningResources,
        activities: state.activities,
        institutions: state.institutions,
        taxonomy: state.taxonomy,
        settings: state.settings,
        toasts,
        addToast,
        dismissToast,
        login,
        registerStudent,
        logout,
        updateStudentProfile,
        addProject,
        updateProject,
        deleteProject,
        addOrUpdateSkill,
        deleteSkill,
        applyResumeExtraction,
        applyToJob,
        updateLearningStatus,
        addLearningResource,
        addJob,
        updateJob,
        deleteJob,
        updateStudentPlacement,
        addUserAccount,
        updateUserRoleAndStatus,
        addInstitution,
        updateInstitutionStatus,
        addTaxonomySkill,
        deleteTaxonomySkill,
        updateSettings,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
