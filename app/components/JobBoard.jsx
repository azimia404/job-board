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

  const setF = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

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
    </div>
  );
}