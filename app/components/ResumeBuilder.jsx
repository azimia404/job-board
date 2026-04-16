import { useState } from "react";
// ────────── RESUME BUILDER ──────────
export default function ResumeBuilder() {
  const [info, setInfo] = useState({ name: "", title: "", email: "", phone: "", location: "", summary: "", skills: "" });
  const set = (k) => (e) => setInfo(p => ({ ...p, [k]: e.target.value }));
  const [education, setEducation] = useState([]);
  const [addingEdu, setAddingEdu] = useState(false);
  const [eduForm, setEduForm] = useState({ school: "", degree: "", period: "" });
  
  const addEdu = () => {
    if (!eduForm.school) return;
    setEducation(p => [...p, { ...eduForm, id: Date.now() }]);
    setEduForm({ school: "", degree: "", period: "" });
    setAddingEdu(false);
  };
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
        
          <div className="form-card">
            <div className="section-actions">
              <div className="form-section-title" style={{ marginBottom: 0, paddingBottom: 0, border: "none" }}>Education</div>
              {!addingEdu && <button className="btn btn-ghost btn-sm" onClick={() => setAddingEdu(true)}>+ Add</button>}
            </div>

            {addingEdu && (
              <div style={{ marginTop: 14, background: "var(--paper)", borderRadius: 8, padding: 14, border: "1.5px solid var(--border)" }}>
                <div className="form-row" style={{ marginBottom: 10 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">School</label>
                    <input className="form-input" placeholder="MIT" value={eduForm.school} onChange={e => setEduForm(p => ({ ...p, school: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Degree</label>
                    <input className="form-input" placeholder="B.S. Computer Science" value={eduForm.degree} onChange={e => setEduForm(p => ({ ...p, degree: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Period</label>
                  <input className="form-input" placeholder="2018 – 2022" value={eduForm.period} onChange={e => setEduForm(p => ({ ...p, period: e.target.value }))} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-primary btn-sm" onClick={addEdu}>Save</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setAddingEdu(false)}>Cancel</button>
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div className="entries-list" style={{ marginTop: 12 }}>
                {education.map(e => (
                  <div key={e.id} className="entry-item">
                    <div className="entry-item-header">
                      <div>
                        <div className="entry-item-title">{e.degree}</div>
                        <div className="entry-item-sub">{e.school} · {e.period}</div>
                      </div>
                      <button className="remove-btn" onClick={() => setEducation(p => p.filter(x => x.id !== e.id))}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
