import { supabase } from "@/shared/api/supabase";
import { Job, CreateJobDto } from "@/shared/types";

export async function fetchJobs(): Promise<{ data: Job[]; error: string | null }> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: "Ошибка загрузки вакансий" };
  return { data: (data as Job[]) ?? [], error: null };
}

export async function insertJob(dto: CreateJobDto): Promise<boolean> {
  const { error } = await supabase.from("jobs").insert([dto]);
  return !error;
}

export function subscribeToJobs(onUpdate: () => void) {
  const channel = supabase
    .channel("jobs-realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, onUpdate)
    .subscribe();

  return () => supabase.removeChannel(channel);
}
