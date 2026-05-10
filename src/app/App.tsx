"use client";
import { useState } from "react";
import { JobBoard } from "../widgets/job-board";
import { ResumeBuilder } from "@/widgets/resume-builder";
import { AuthProvider, useAuth, AuthModal } from "@/features/auth";
import { ResumeProvider } from "@/features/build-resume";

function NavAuth() {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>{user.email}</span>
        <button className="btn btn-ghost btn-sm" onClick={logout}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <>
      <button className="btn btn-ghost btn-sm" onClick={() => setShowAuthModal(true)}>
        Sign in
      </button>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}

function AppInner() {
  const [tab, setTab] = useState("resume");

  return (
    <>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo">
            work<span>.</span>craft
          </div>
          <div className="nav-tabs">
            <button
              className={`nav-tab ${tab === "resume" ? "active" : ""}`}
              onClick={() => setTab("resume")}
            >
              Resume Builder
            </button>
            <button
              className={`nav-tab ${tab === "jobs" ? "active" : ""}`}
              onClick={() => setTab("jobs")}
            >
              Job Board
            </button>
          </div>
          <NavAuth />
        </nav>

        {tab === "resume" ? <ResumeBuilder /> : <JobBoard />}
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ResumeProvider>
        <AppInner />
      </ResumeProvider>
    </AuthProvider>
  );
}
