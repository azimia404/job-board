"use client";
import { useState } from "react";
import JobBoard from "./JobBoard";
import ResumeBuilder from "./ResumeBuilder.jsx";
// ────────── APP ──────────
export default function App() {
  const [tab, setTab] = useState("resume");

  return (
    <>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo">work<span>.</span>craft</div>
          <div className="nav-tabs">
            <button className={`nav-tab ${tab === "resume" ? "active" : ""}`} onClick={() => setTab("resume")}>Resume Builder</button>
            <button className={`nav-tab ${tab === "jobs" ? "active" : ""}`} onClick={() => setTab("jobs")}>Job Board</button>
          </div>
        </nav>

        {tab === "resume" ? <ResumeBuilder /> : <JobBoard />}
      </div>
    </>
  );
}
