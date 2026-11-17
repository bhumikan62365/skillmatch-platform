import React, { useState } from 'react';
import { Plus, Edit3, Trash2, ExternalLink, FolderGit2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardLayout } from '../../components/ui/DashboardLayout';
import { Modal } from '../../components/ui/Modal';
import { ProjectItem } from '../../types';

export function MyProjects() {
  const { activeStudent, addProject, updateProject, deleteProject } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<ProjectItem | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [contribution, setContribution] = useState('');

  const openCreate = () => {
    setEditingProj(null);
    setTitle('');
    setDescription('');
    setTechInput('');
    setGithubUrl('https://github.com/');
    setContribution('');
    setModalOpen(true);
  };

  const openEdit = (proj: ProjectItem) => {
    setEditingProj(proj);
    setTitle(proj.title);
    setDescription(proj.description);
    setTechInput(proj.technologies.join(', '));
    setGithubUrl(proj.githubUrl);
    setContribution(proj.contribution);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    const technologies = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProj) {
      updateProject({
        ...editingProj,
        title: title.trim(),
        description: description.trim(),
        technologies,
        githubUrl: githubUrl.trim(),
        contribution: contribution.trim(),
        updatedAt: new Date().toISOString().split('T')[0],
      });
    } else {
      addProject({
        title: title.trim(),
        description: description.trim(),
        technologies,
        githubUrl: githubUrl.trim(),
        contribution: contribution.trim(),
      });
    }
    setModalOpen(false);
  };

  return (
    <DashboardLayout title="My Projects" breadcrumb="Student Portal / My Projects">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A] font-display">
            Engineering Projects & Practical Evidence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Technologies used in documented projects automatically verify matching skills in job compatibility scoring.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {activeStudent.projects.length === 0 ? (
        <div className="mt-6 bg-white border border-slate-200 rounded-xl p-12 text-center">
          <FolderGit2 className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="mt-3 text-sm font-medium text-[#0F172A]">
            No projects documented yet
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Add your academic or personal repositories to verify your technical stack.
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-4 px-4 py-2 text-xs font-medium text-white bg-[#2563EB] rounded-lg cursor-pointer"
          >
            Add First Project
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeStudent.projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#0F172A] font-display">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono-tabular mt-0.5">
                      Updated {proj.updatedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(proj)}
                      aria-label={`Edit ${proj.title}`}
                      className="p-1.5 text-slate-400 hover:text-[#2563EB] rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProject(proj.id)}
                      aria-label={`Delete ${proj.title}`}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {proj.description}
                </p>

                {proj.contribution && (
                  <p className="mt-3 text-xs text-slate-600">
                    <span className="font-semibold text-[#0F172A]">
                      Contribution:{' '}
                    </span>
                    {proj.contribution}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {proj.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {proj.githubUrl && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2563EB] hover:underline"
                  >
                    <span>GitHub Repository</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProj ? 'Edit Project' : 'Add New Project'}
        subtitle="Document your role and technical stack for skill verification."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Task Queue Engine"
              className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem solved, architecture, and scale..."
              className="w-full p-3 text-sm border border-slate-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Technologies Used (comma-separated)
            </label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="TypeScript, React, PostgreSQL, Docker"
              className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              GitHub Repository URL
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Your Specific Contribution
            </label>
            <input
              type="text"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              placeholder="e.g. Built FastAPI endpoints, schema migrations, and CI workflow"
              className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg cursor-pointer"
            >
              {editingProj ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
