import { CreateJobDto, JobType, JobCategory, CategoryFilter } from "@/shared/types";
import { CATEGORIES, JOB_TYPES, INITIAL_FORM } from "@/entities/job/constants";

interface PostJobModalProps {
  form: CreateJobDto;
  onChange: <K extends keyof CreateJobDto>(key: K, value: CreateJobDto[K]) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function PostJobModal({ form, onChange, onSubmit, onClose }: PostJobModalProps) {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-title">Publish</div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Company</label>
            <input
              className="form-input"
              placeholder="Acme Inc."
              value={form.company}
              onChange={(e) => onChange("company", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Position</label>
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
            <label className="form-label">Type</label>
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
            <label className="form-label">Category</label>
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
            <label className="form-label">Location</label>
            <input
              className="form-input"
              placeholder="Remote / City"
              value={form.location ?? ""}
              onChange={(e) => onChange("location", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Salary</label>
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
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onSubmit}>
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}