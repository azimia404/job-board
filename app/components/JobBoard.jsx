import { useState } from "react";


// ────────── INITIAL DATA ──────────
const SAMPLE_JOBS = [
  { id: 1, company: "Stripe", title: "Senior Frontend Engineer", type: "Full-time", location: "Remote", salary: "$150k–$190k", date: "2 days ago", category: "Engineering" },
  { id: 2, company: "Notion", title: "Product Designer", type: "Full-time", location: "San Francisco", salary: "$130k–$160k", date: "4 days ago", category: "Design" },
  { id: 3, company: "Linear", title: "Backend Engineer", type: "Full-time", location: "Remote", salary: "$140k–$175k", date: "1 week ago", category: "Engineering" },
  { id: 4, company: "Figma", title: "UX Researcher", type: "Contract", location: "New York", salary: "$90–$120/hr", date: "1 week ago", category: "Design" },
  { id: 5, company: "Vercel", title: "DevRel Engineer", type: "Full-time", location: "Remote", salary: "$120k–$150k", date: "2 weeks ago", category: "Engineering" },
];

const CATEGORIES = ["All", "Engineering", "Design", "Marketing", "Product"];

// ────────── JOB BOARD ──────────
export default function JobBoard() {
  const [jobs, setJobs] = useState(SAMPLE_JOBS);
  const [category, setCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ company: "", title: "", type: "Full-time", location: "", salary: "", category: "Engineering" });

  const filtered = category === "All" ? jobs : jobs.filter(j => j.category === category);

  const setF = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const postJob = () => {
    if (!form.title || !form.company) return;
    const newJob = { ...form, id: Date.now(), date: "Just now" };
    setJobs(p => [newJob, ...p]);
    setForm({ company: "", title: "", type: "Full-time", location: "", salary: "", category: "Engineering" });
    setShowModal(false);
    showToast("Job posted successfully!");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div>
      <div className="job-board-header">
        <div>
          <div className="page-title">Job<br /><span style={{ color: "var(--accent2)" }}>Board.</span></div>
          <p className="page-sub">{jobs.length} open positions</p>
        </div>
        <button className="btn btn-accent" style={{ alignSelf: "flex-end", marginBottom: 40 }} onClick={() => setShowModal(true)}>
          + Post a Job
        </button>
      </div>

      <div className="filters">
        {CATEGORIES.map(c => (
          <button key={c} className={`filter-chip ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18 }}>No jobs in this category</div>
        </div>
      ) : (
        <div className="jobs-grid">
          {filtered.map(job => (
            <div key={job.id} className="job-card">
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
                <div className="job-card-date">{job.date}</div>
                <button className="job-card-apply" onClick={() => showToast(`Applied to ${job.title}!`)}>Apply →</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">Post a Job</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Company</label>
                <input className="form-input" placeholder="Acme Inc." value={form.company} onChange={setF("company")} />
              </div>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input className="form-input" placeholder="Senior Engineer" value={form.title} onChange={setF("title")} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-input" value={form.type} onChange={setF("type")}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category} onChange={setF("category")}>
                  {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" placeholder="Remote / City" value={form.location} onChange={setF("location")} />
              </div>
              <div className="form-group">
                <label className="form-label">Salary Range</label>
                <input className="form-input" placeholder="$100k–$130k" value={form.salary} onChange={setF("salary")} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={postJob}>Post Job</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}