import { supabase } from "@/shared/api/supabase";
import { Job, CreateJobDto } from "@/shared/types";
const API = "http://localhost:5000";

export async function fetchJobs(): Promise<{ data: Job[]; error: string | null }> {
  try {
    const res = await fetch(`${API}/jobs`);
    const data = await res.json();
    return { data, error: null };
  } catch {
    return { data: [], error: "Ошибка загрузки вакансий" };
  }
}

export async function insertJob(dto: CreateJobDto): Promise<boolean> {
  try {
    const res = await fetch(`${API}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
    });
    return res.ok;
  } catch {
    return false;
  }
}
