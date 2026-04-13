import { useState } from "react";
// ────────── RESUME BUILDER ──────────
export default function ResumeBuilder() {
  const [info, setInfo] = useState({ name: "", title: "", email: "", phone: "", location: "", summary: "", skills: "" });
  const set = (k) => (e) => setInfo(p => ({ ...p, [k]: e.target.value }));
  return (
    <div>
      <div className="page-title">
        Resume
        <br />
        <span style={{ color: "var(--accent)" }}>Builder.</span>
      </div>
      <p className="page-sub">
        Fill in your details, add experience — get a clean resume preview.
      </p>
      <div className="resume-layout">
        {/* FORM */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Personal Info */}
          <div className="form-card">
            <div className="form-section-title">Personal Info</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  placeholder="Jane Smith"
                  value={info.name}
                  onChange={set("name")}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input
                  className="form-input"
                  placeholder="Product Designer"
                  value={info.title}
                  onChange={set("title")}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  placeholder="jane@email.com"
                  value={info.email}
                  onChange={set("email")}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  className="form-input"
                  placeholder="+1 234 567 8900"
                  value={info.phone}
                  onChange={set("phone")}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                className="form-input"
                placeholder="San Francisco, CA"
                value={info.location}
                onChange={set("location")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Summary</label>
              <textarea
                className="form-textarea"
                placeholder="Brief professional summary..."
                value={info.summary}
                onChange={set("summary")}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Skills (comma-separated)</label>
              <input
                className="form-input"
                placeholder="React, TypeScript, Figma"
                value={info.skills}
                onChange={set("skills")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
