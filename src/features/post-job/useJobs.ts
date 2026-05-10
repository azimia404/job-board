import { useState, useEffect, useCallback } from "react";
import { Job, CreateJobDto } from "@/shared/types";
import { fetchJobs, insertJob } from "@/entities/job";

export function useJobs(token: string | null) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchJobs().then(({ data, error: err }) => {
      if (cancelled) return;
      if (err) setError(err);
      else { setError(null); setJobs(data); }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const createJob = useCallback(async (dto: CreateJobDto): Promise<boolean> => {
    if (!token) return false;
    const ok = await insertJob(dto, token);
    if (ok) setRefreshKey((k) => k + 1);
    return ok;
  }, [token]);

  return { jobs, loading, error, createJob };
}