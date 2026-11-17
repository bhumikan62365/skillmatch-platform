import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  FileText,
  Plus,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { UploadZone } from '../../components/ui/UploadZone';
import { studentService } from '../../services/studentService';
import { ResumeExtractionResult, SkillCategory } from '../../types';

const CATEGORIES: SkillCategory[] = [
  'Programming Languages',
  'Web Development',
  'Database Technologies',
  'AI/ML',
  'Development Tools',
  'Core Computer Science',
];

export function ResumeAnalyzer() {
  const { activeStudent, applyResumeExtraction, addToast } = useApp();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [extraction, setExtraction] = useState<ResumeExtractionResult | null>(
    null
  );
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillCat, setCustomSkillCat] = useState<SkillCategory>(
    'Programming Languages'
  );

  const runAnalysis = async (fileName: string, textHint?: string) => {
    setIsProcessing(true);
    try {
      const result = await studentService.analyzeResumeFile(fileName, textHint);
      setExtraction(result);
      addToast({
        type: 'success',
        title: 'Resume parsed successfully',
        message: `Extracted ${result.extractedSkills.length} skills and ${result.extractedProjects.length} projects.`,
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Resume analysis failed',
        message: 'Please try uploading a valid PDF or DOCX document.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelected = async (file: File) => {
    let hint = file.name;
    if (file.name.endsWith('.txt')) {
      hint = await file.text();
    }
    await runAnalysis(file.name, hint);
  };

  const toggleSkill = (idx: number) => {
    if (!extraction) return;
    setExtraction({
      ...extraction,
      extractedSkills: extraction.extractedSkills.map((sk, i) =>
        i === idx ? { ...sk, selected: !sk.selected } : sk
      ),
    });
  };

  const toggleProject = (idx: number) => {
    if (!extraction) return;
    setExtraction({
      ...extraction,
      extractedProjects: extraction.extractedProjects.map((pr, i) =>
        i === idx ? { ...pr, selected: !pr.selected } : pr
      ),
    });
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extraction || !customSkillName.trim()) return;
    setExtraction({
      ...extraction,
      extractedSkills: [
        ...extraction.extractedSkills,
        {
          name: customSkillName.trim(),
          category: customSkillCat,
          confidence: 1.0,
          selected: true,
        },
      ],
    });
    setCustomSkillName('');
  };

  const handleConfirmSync = () => {
    if (!extraction) return;
    applyResumeExtraction(extraction);
    navigate('/student/skills');
  };

  return (
    <DashboardLayout
      title="Resume Analyzer"
      breadcrumb="Student Portal / Resume Analyzer"
    >
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-base font-semibold text-[#0F172A] font-display">
                AI Resume Skill & Evidence Extraction
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload your PDF or DOCX resume to extract academic history, technical skills, projects, and certifications.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                runAnalysis(
                  `${activeStudent.name.replace(/\s+/g, '_')}_Resume_2026.pdf`,
                  'Python TypeScript React PostgreSQL Docker PyTorch System Design'
                )
              }
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#2563EB] bg-blue-50 hover:bg-blue-100/70 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Analyze Sample CS Resume</span>
            </button>
          </div>

          <UploadZone
            onFileSelected={handleFileSelected}
            isProcessing={isProcessing}
            currentFileName={activeStudent.resumeFileName}
          />
        </div>

        {isProcessing && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
            <div className="h-4 w-56 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-4/5 bg-slate-100 rounded animate-pulse" />
          </div>
        )}

        {extraction && !isProcessing && (
          <div className="space-y-6">
            {/* Extracted Education */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="text-base font-semibold text-[#0F172A] font-display">
                    Extracted Education ({extraction.fileName})
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  Editable before confirmation
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={extraction.education.institution}
                    onChange={(e) =>
                      setExtraction({
                        ...extraction,
                        education: {
                          ...extraction.education,
                          institution: e.target.value,
                        },
                      })
                    }
                    className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={extraction.education.department}
                    onChange={(e) =>
                      setExtraction({
                        ...extraction,
                        education: {
                          ...extraction.education,
                          department: e.target.value,
                        },
                      })
                    }
                    className="w-full h-9 px-3 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={extraction.education.graduationYear}
                    onChange={(e) =>
                      setExtraction({
                        ...extraction,
                        education: {
                          ...extraction.education,
                          graduationYear: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full h-9 px-3 text-sm font-mono-tabular border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    CGPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={extraction.education.cgpa}
                    onChange={(e) =>
                      setExtraction({
                        ...extraction,
                        education: {
                          ...extraction.education,
                          cgpa: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full h-9 px-3 text-sm font-mono-tabular border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Extracted Technical Skills */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-semibold text-[#0F172A] font-display">
                    Extracted Technical Skills
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any skill to include or exclude before syncing. Unverified resume mentions can be backed by projects later.
                  </p>
                </div>
                <span className="text-xs font-mono-tabular text-slate-600">
                  {extraction.extractedSkills.filter((s) => s.selected).length} selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {extraction.extractedSkills.map((skill, idx) => (
                  <button
                    key={`${skill.name}-${idx}`}
                    type="button"
                    onClick={() => toggleSkill(idx)}
                    className={`flex items-center justify-between p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      skill.selected
                        ? 'border-[#2563EB] bg-blue-50/40'
                        : 'border-slate-200 bg-white opacity-60'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">
                        {skill.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {skill.category} · {Math.round(skill.confidence * 100)}% conf.
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center ${
                        skill.selected
                          ? 'bg-[#2563EB] text-white'
                          : 'border border-slate-300'
                      }`}
                    >
                      {skill.selected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                ))}
              </div>

              <form
                onSubmit={addCustomSkill}
                className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2"
              >
                <input
                  type="text"
                  value={customSkillName}
                  onChange={(e) => setCustomSkillName(e.target.value)}
                  placeholder="Add missed skill (e.g. Redis)"
                  className="flex-1 min-w-[180px] h-9 px-3 text-xs border border-slate-200 rounded-lg"
                />
                <select
                  value={customSkillCat}
                  onChange={(e) =>
                    setCustomSkillCat(e.target.value as SkillCategory)
                  }
                  className="h-9 px-3 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-3 h-9 bg-slate-100 hover:bg-slate-200 text-xs font-medium text-[#0F172A] rounded-lg cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Skill
                </button>
              </form>
            </div>

            {/* Extracted Projects & Certifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <h3 className="text-base font-semibold text-[#0F172A] font-display mb-3">
                  Extracted Projects
                </h3>
                <div className="space-y-3">
                  {extraction.extractedProjects.map((proj, idx) => (
                    <div
                      key={proj.title}
                      onClick={() => toggleProject(idx)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
                        proj.selected
                          ? 'border-[#2563EB] bg-blue-50/30'
                          : 'border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-[#0F172A]">
                          {proj.title}
                        </p>
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            proj.selected ? 'text-[#2563EB]' : 'text-slate-300'
                          }`}
                        />
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {proj.description}
                      </p>
                      <p className="text-[11px] font-mono-tabular text-slate-500 mt-2">
                        Stack: {proj.technologies.join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[#0F172A] font-display mb-3">
                    Extracted Certifications
                  </h3>
                  <div className="space-y-2.5">
                    {extraction.extractedCertifications.map((cert) => (
                      <div
                        key={cert.name}
                        className="p-3.5 rounded-lg border border-slate-200"
                      >
                        <p className="text-sm font-medium text-[#0F172A]">
                          {cert.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {cert.issuer} · {cert.issueDate}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setExtraction(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSync}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg cursor-pointer"
                  >
                    <span>Confirm & Sync to Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
