import { ResumeInfo, EducationEntry, ExperienceEntry } from "@/shared/types";

const API = "http://localhost:5000";

export interface ResumeData {
  info: ResumeInfo;
  education: EducationEntry[];
  experience: ExperienceEntry[];
}

export async function fetchResume(token: string): Promise<{ data: ResumeData | null; error: string | null }> {
  try {
    const res = await fetch(`${API}/resume`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { data: null, error: "Failed to load resume" };
    const data = await res.json();
    return { data, error: null };
  } catch {
    return { data: null, error: "Network error" };
  }
}

export async function saveResume(token: string, data: ResumeData): Promise<boolean> {
  try {
    const res = await fetch(`${API}/resume`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}
