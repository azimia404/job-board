import { useState, useEffect, useCallback } from "react";
import { Job, CreateJobDto} from "@/shared/types";
import { fetchJobs, insertJob, subscribeToJobs } from "@/entities/job";

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
    const unsubscribe = subscribeToJobs(loadJobs);
    return unsubscribe;
  }, [loadJobs]);

  const createJob = useCallback(async (dto: CreateJobDto): Promise<boolean> => {
    return insertJob(dto);
  }, []);

  return { jobs, loading, error, createJob };
}
