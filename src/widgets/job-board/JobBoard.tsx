"use client";

import { useState } from "react";
import { Job, CreateJobDto, CategoryFilter } from "@/shared/types";
import { useJobs } from "@/features/post-job";
import { useToast, Toast } from "@/shared/ui";
import { JobCard, INITIAL_FORM } from "@/entities/job/index";
import { CategoryFilterBar } from "@/features/apply-job";
import { PostJobModal } from "@/features/post-job/PostJobModal";
import { AuthModal, useAuth } from "@/features/auth";
import { ResumePreview, useResumeContext } from "@/features/build-resume";

export function JobBoard() {
  const { user, token } = useAuth();
  const { jobs, loading, error, createJob } = useJobs(token);
  const resume = useResumeContext();
  const { message: toastMessage, show: showToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
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

  const handlePublishClick = () => {
    if (!user) { setShowAuthModal(true); return; }
    setShowModal(true);
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

  const resumeHasContent = resume.hasContent as string | number;

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
          onClick={handlePublishClick}
        >
          + Publish Job
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>
        {/* Jobs column */}
        <div>
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
        </div>

        {/* Resume preview column */}
        <div>
          {user ? (
            <ResumePreview
              info={resume.info}
              education={resume.education}
              experience={resume.experience}
              hasContent={resumeHasContent}
              previewRef={null}
            />
          ) : (
            <div
              className="resume-preview"
              style={{ textAlign: "center", color: "var(--muted)" }}
            >
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: 16, marginBottom: 6 }}>
                Your Resume
              </div>
              <div style={{ fontSize: 13 }}>Sign in to see your resume here</div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <PostJobModal
          form={form}
          onChange={handleFormChange}
          onSubmit={handlePostJob}
          onClose={() => setShowModal(false)}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      <Toast message={toastMessage} />
    </div>
  );
}
