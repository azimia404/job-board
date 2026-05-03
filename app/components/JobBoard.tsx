"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";

// ─── Types ───────────────────────────────────────────────────────────────────

type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";
type JobCategory = "Engineering" | "Design" | "Marketing" | "Product";
type CategoryFilter = "All" | JobCategory;

interface Job {
  id: number;
  company: string;
  title: string;
  type: JobType;
  location: string | null;
  salary: string | null;
  category: JobCategory;
  created_at: string;
}

type CreateJobDto = Omit<Job, "id" | "created_at">;

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: CategoryFilter[] = [
  "All",
  "Engineering",
  "Design",
  "Marketing",
  "Product",
];

const JOB_TYPES: JobType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

const INITIAL_FORM: CreateJobDto = {
  company: "",
  title: "",
  type: "Full-time",
  location: "",
  salary: "",
  category: "Engineering",
};

// ─── Utils ────────────────────────────────────────────────────────────────────

function formatRelativeDate(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 3600) return "Только что";
  if (diff < 86400) return `${Math.floor(diff / 3600)}ч назад`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}д назад`;
  return `${Math.floor(diff / 604800)} нед. назад`;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: sbError } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (sbError) {
      setError("Ошибка загрузки вакансий");
      console.error("[useJobs] fetch error:", sbError);
    } else {
      setJobs((data as Job[]) ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchJobs();

    const channel = supabase
      .channel("jobs-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "jobs" },
        fetchJobs,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchJobs]);

  const createJob = useCallback(async (dto: CreateJobDto): Promise<boolean> => {
    const { error: sbError } = await supabase.from("jobs").insert([dto]);

    if (sbError) {
      console.error("[useJobs] insert error:", sbError);
      return false;
    }

    return true;
  }, []);

  return { jobs, loading, error, createJob };
}

function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  const show = useCallback((msg: string, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), duration);
  }, []);

  return { message, show };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

function JobCard({ job, onApply }: JobCardProps) {
  return (
    <div className="job-card">
      <div>
        <div className="job-card-company">{job.company}</div>
        <div className="job-card-title">{job.title}</div>
        <div className="job-card-tags">
          <span className="job-tag tag-type">{job.type}</span>
          {job.salary && (
            <span className="job-tag tag-salary">{job.salary}</span>
          )}
          {job.location && (
            <span className="job-tag tag-location">📍 {job.location}</span>
          )}
        </div>
      </div>
      <div className="job-card-right">
        <div className="job-card-date">{formatRelativeDate(job.created_at)}</div>
        <button className="job-card-apply" onClick={() => onApply(job)}>
          Apply →
        </button>
      </div>
    </div>
  );
}

interface CategoryFilterBarProps {
  selected: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
}

function CategoryFilterBar({ selected, onChange }: CategoryFilterBarProps) {
  return (
    <div className="filters">
      {CATEGORIES.map((c) => (
        <button
          key={c}
          className={`filter-chip ${selected === c ? "active" : ""}`}
          onClick={() => onChange(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

interface PostJobModalProps {
  form: CreateJobDto;
  onChange: <K extends keyof CreateJobDto>(key: K, value: CreateJobDto[K]) => void;
  onSubmit: () => void;
  onClose: () => void;
}

function PostJobModal({ form, onChange, onSubmit, onClose }: PostJobModalProps) {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-title">Опубликовать вакансию</div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Компания</label>
            <input
              className="form-input"
              placeholder="Acme Inc."
              value={form.company}
              onChange={(e) => onChange("company", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Должность</label>
            <input
              className="form-input"
              placeholder="Senior Engineer"
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Тип</label>
            <select
              className="form-input"
              value={form.type}
              onChange={(e) => onChange("type", e.target.value as JobType)}
            >
              {JOB_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Категория</label>
            <select
              className="form-input"
              value={form.category}
              onChange={(e) => onChange("category", e.target.value as JobCategory)}
            >
              {CATEGORIES.filter((c) => c !== "All").map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Местоположение</label>
            <input
              className="form-input"
              placeholder="Remote / Город"
              value={form.location ?? ""}
              onChange={(e) => onChange("location", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Зарплата</label>
            <input
              className="form-input"
              placeholder="$100k–$130k"
              value={form.salary ?? ""}
              onChange={(e) => onChange("salary", e.target.value)}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Отмена
          </button>
          <button className="btn btn-primary" onClick={onSubmit}>
            Опубликовать
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function JobBoard() {
  const { jobs, loading, error, createJob } = useJobs();
  const { message: toastMessage, show: showToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [form, setForm] = useState<CreateJobDto>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const filteredJobs =
    categoryFilter === "All"
      ? jobs
      : jobs.filter((j) => j.category === categoryFilter);

  const handleFormChange = <K extends keyof CreateJobDto>(
    key: K,
    value: CreateJobDto[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePostJob = async () => {
    if (!form.title.trim() || !form.company.trim()) return;

    setSubmitting(true);
    const success = await createJob(form);
    setSubmitting(false);

    if (success) {
      setForm(INITIAL_FORM);
      setShowModal(false);
      showToast("Вакансия опубликована!");
    } else {
      showToast("Ошибка при публикации");
    }
  };

  const handleApply = (job: Job) => {
    showToast(`Отклик отправлен на ${job.title}!`);
  };

  return (
    <div>
      <div className="job-board-header">
        <div>
          <div className="page-title">
            Job
            <br />
            <span style={{ color: "var(--accent2)" }}>Board.</span>
          </div>
          <p className="page-sub">{jobs.length} открытых позиций</p>
        </div>
        <button
          className="btn btn-accent"
          style={{ alignSelf: "flex-end", marginBottom: 40 }}
          onClick={() => setShowModal(true)}
        >
          + Опубликовать вакансию
        </button>
      </div>

      <CategoryFilterBar selected={categoryFilter} onChange={setCategoryFilter} />

      {loading && (
        <div className="empty">
          <div className="empty-icon">⏳</div>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18 }}>
            Загрузка...
          </div>
        </div>
      )}

      {!loading && (error || filteredJobs.length === 0) && (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18 }}>
            {error ?? "Вакансий не найдено"}
          </div>
        </div>
      )}

      {!loading && !error && filteredJobs.length > 0 && (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={handleApply} />
          ))}
        </div>
      )}

      {showModal && (
        <PostJobModal
          form={form}
          onChange={handleFormChange}
          onSubmit={handlePostJob}
          onClose={() => setShowModal(false)}
        />
      )}

      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
}
