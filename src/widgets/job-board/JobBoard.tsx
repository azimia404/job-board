"use client";

import { useState, useEffect, useCallback } from "react";
import { Job, CreateJobDto, JobType, JobCategory, CategoryFilter } from "@/shared/types";
import { useJobs } from "@/features/post-job";
import { formatRelativeDate } from "@/shared/lib";
import { useToast, Toast } from "@/shared/ui";
import { JobCard, CATEGORIES, JOB_TYPES, INITIAL_FORM } from "@/entities/job/index";
import { CategoryFilterBar } from "@/features/apply-job";
import { PostJobModal } from "@/features/post-job/PostJobModal";

export function JobBoard() {
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
      showToast("Job published!");
    } else {
      showToast("Error publishing job");
    }
  };

  const handleApply = (job: Job) => {
    showToast(`Application submitted for ${job.title}!`);
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
          <p className="page-sub">{jobs.length} open positions</p>
        </div>
        <button
          className="btn btn-accent"
          style={{ alignSelf: "flex-end", marginBottom: 40 }}
          onClick={() => setShowModal(true)}
        >
          + Publish Job
        </button>
      </div>

      <CategoryFilterBar selected={categoryFilter} onChange={setCategoryFilter} />

      {loading && (
        <div className="empty">
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18 }}>
            Loading...
          </div>
        </div>
      )}

      {!loading && (error || filteredJobs.length === 0) && (
        <div className="empty">
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18 }}>
            {error ?? "No jobs found"}
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

      <Toast message={toastMessage} />
    </div>
  );
}
