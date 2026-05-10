import { Job, CreateJobDto } from "@/shared/types";
const API = "http://localhost:5000";

export async function fetchJobs(): Promise<{ data: Job[]; error: string | null }> {
  try {
    const res = await fetch(`${API}/jobs`);
    const data = await res.json();
    return { data, error: null };
  } catch {
    return { data: [], error: "Failed to load jobs" };
  }
}

export async function insertJob(dto: CreateJobDto, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });
    return res.ok;
  } catch {
    return false;
  }
}
