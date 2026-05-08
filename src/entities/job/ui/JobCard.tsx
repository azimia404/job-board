import { Job } from "@/shared/types";
import { formatRelativeDate } from "@/shared/lib";

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  return (
    <div className="job-card">
      <div>
        <div className="job-card-company">{job.company}</div>
        <div className="job-card-title">{job.title}</div>
        <div className="job-card-tags">
          <span className="job-tag tag-type">{job.type}</span>
          {job.salary && <span className="job-tag tag-salary">{job.salary}</span>}
          {job.location && <span className="job-tag tag-location">📍 {job.location}</span>}
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