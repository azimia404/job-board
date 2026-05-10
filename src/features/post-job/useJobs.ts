import { useState, useEffect, useCallback } from "react";
import { Job, CreateJobDto } from "@/shared/types";
import { fetchJobs, insertJob } from "@/entities/job";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await fetchJobs();
    if (error) setError(error);
    else setJobs(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const createJob = useCallback(async (dto: CreateJobDto): Promise<boolean> => {
    const ok = await insertJob(dto);
    if (ok) loadJobs();
    return ok;
  }, [loadJobs]);

  return { jobs, loading, error, createJob };
}