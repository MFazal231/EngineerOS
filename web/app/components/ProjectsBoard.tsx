"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

type ProjectStatus = "planning" | "active" | "completed";

type ProjectTask = { id: number; title: string; done: boolean };

type Project = {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  tech: string[];
  nextStep: string;
  tasks: ProjectTask[];
};

const STATUS_META: Record<ProjectStatus, { text: string }> = {
  planning: { text: "Planning" },
  active: { text: "Active" },
  completed: { text: "Completed" },
};

const EMPTY_FORM = { name: "", description: "", status: "active" as ProjectStatus, tech: "", nextStep: "" };

export function ProjectsBoard({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [taskDrafts, setTaskDrafts] = useState<Record<number, string>>({});

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEditModal(project: Project) {
    setEditingId(project.id);
    setForm({
      name: project.name,
      description: project.description,
      status: project.status,
      tech: project.tech.join(", "),
      nextStep: project.nextStep,
    });
    setModalOpen(true);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      tech: form.tech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      nextStep: form.nextStep.trim(),
    };

    const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
    const method = editingId ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return;
    }

    const project: Project = await response.json();

    setProjects((prev) =>
      editingId ? prev.map((p) => (p.id === editingId ? project : p)) : [...prev, project],
    );
    setModalOpen(false);
  }

  async function handleDelete(id: number) {
    const project = projects.find((p) => p.id === id);
    if (!project || !confirm(`Delete "${project.name}"?\n\nThis cannot be undone.`)) {
      return;
    }

    const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (response.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  }

  async function toggleTask(projectId: number, task: ProjectTask) {
    const response = await fetch(`/api/projects/${projectId}/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !task.done }),
    });

    if (!response.ok) {
      return;
    }

    const updated: ProjectTask = await response.json();
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, tasks: p.tasks.map((t) => (t.id === task.id ? updated : t)) } : p,
      ),
    );
  }

  async function deleteTask(projectId: number, taskId: number) {
    const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, { method: "DELETE" });
    if (response.ok) {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) } : p)),
      );
    }
  }

  async function addTask(projectId: number) {
    const title = (taskDrafts[projectId] ?? "").trim();
    if (!title) {
      return;
    }

    const response = await fetch(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      return;
    }

    const task: ProjectTask = await response.json();
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p)),
    );
    setTaskDrafts((prev) => ({ ...prev, [projectId]: "" }));
  }

  return (
    <>
      <section className="projects-hero">
        <div className="container">
          <div className="projects-header">
            <div>
              <p className="section-label">BUILD</p>
              <h2>Projects</h2>
              <p>Turn what you learn into things you can actually ship.</p>
            </div>
            <button className="new-project-btn" onClick={openCreateModal}>
              <Plus size={15} /> New Project
            </button>
          </div>
        </div>
      </section>

      <section className="projects-section">
        <div className="container">
          <div className="projects-grid">
            {projects.map((project) => {
              const total = project.tasks.length;
              const done = project.tasks.filter((t) => t.done).length;
              const percent = total === 0 ? 0 : Math.round((done / total) * 100);
              const meta = STATUS_META[project.status];

              return (
                <article className="project-card" key={project.id}>
                  <div className="project-card-header">
                    <span className={`project-status ${project.status}`}>{meta.text}</span>
                  </div>

                  <h3>{project.name}</h3>
                  <p>{project.description}</p>

                  <div className="project-tech">
                    {project.tech.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>

                  <div className="dsa-topic-progress">
                    <div className="dsa-topic-progress-header">
                      <strong>Progress</strong>
                      <span>
                        {done}/{total} tasks · {percent}%
                      </span>
                    </div>
                    <div className="dsa-topic-progress-bar">
                      <div className="dsa-topic-progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  <div className="project-tasks">
                    <div className="project-tasks-header">
                      <strong>Tasks</strong>
                    </div>
                    <ul className="project-task-list">
                      {project.tasks.length === 0 ? (
                        <li className="project-task-empty">No tasks yet — add one below.</li>
                      ) : (
                        project.tasks.map((task) => (
                          <li className={`project-task${task.done ? " done" : ""}`} key={task.id}>
                            <label>
                              <input
                                type="checkbox"
                                checked={task.done}
                                onChange={() => toggleTask(project.id, task)}
                              />
                              <span>{task.title}</span>
                            </label>
                            <button
                              type="button"
                              className="project-task-delete"
                              onClick={() => deleteTask(project.id, task.id)}
                            >
                              <X size={14} />
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                    <form
                      className="project-task-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        addTask(project.id);
                      }}
                    >
                      <input
                        type="text"
                        className="project-task-input"
                        placeholder="Add a task..."
                        value={taskDrafts[project.id] ?? ""}
                        onChange={(e) =>
                          setTaskDrafts((prev) => ({ ...prev, [project.id]: e.target.value }))
                        }
                      />
                      <button type="submit">+</button>
                    </form>
                  </div>

                  <div className="project-next">
                    <strong>Next Step</strong>
                    <span>{project.nextStep}</span>
                  </div>

                  <div className="project-actions">
                    <button className="project-edit-btn" onClick={() => openEditModal(project)}>
                      <Pencil size={13} /> Edit
                    </button>
                    <button className="project-delete-btn" onClick={() => handleDelete(project.id)}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <div className={`project-modal${modalOpen ? " show" : ""}`}>
        <div className="project-modal-content">
          <div className="project-modal-header">
            <div>
              <p className="section-label">BUILD</p>
              <h3>{editingId ? "Edit Project" : "New Project"}</h3>
            </div>
            <button className="modal-close" onClick={() => setModalOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="projectName">Project Name</label>
              <input
                id="projectName"
                type="text"
                placeholder="e.g. EngineerOS"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectDescription">Description</label>
              <textarea
                id="projectDescription"
                placeholder="What are you building?"
                required
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectStatus">Status</label>
              <select
                id="projectStatus"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ProjectStatus }))}
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="projectTech">Tech Stack</label>
              <input
                id="projectTech"
                type="text"
                placeholder="e.g. HTML, CSS, JavaScript"
                value={form.tech}
                onChange={(e) => setForm((f) => ({ ...f, tech: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectNext">Next Step</label>
              <input
                id="projectNext"
                type="text"
                placeholder="What should you build next?"
                value={form.nextStep}
                onChange={(e) => setForm((f) => ({ ...f, nextStep: e.target.value }))}
              />
            </div>

            <div className="project-modal-actions">
              <button type="button" className="secondary-btn" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="primary-btn">
                {editingId ? "Save Changes" : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
