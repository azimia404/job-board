export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";
export type JobCategory = "Engineering" | "Design" | "Marketing" | "Product";
export type CategoryFilter = "All" | JobCategory;

export interface Job {
  id: number;
  company: string;
  title: string;
  type: JobType;
  location: string | null;
  salary: string | null;
  category: JobCategory;
  created_at: string;
}

export type CreateJobDto = Omit<Job, "id" | "created_at">;

export interface ResumeInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string;
}

export interface EducationEntry {
  id: number;
  school: string;
  degree: string;
  period: string;
}

export interface ExperienceEntry {
  id: number;
  company: string;
  role: string;
  period: string;
  desc: string;
}
