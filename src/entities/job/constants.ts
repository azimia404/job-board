import { Job, CategoryFilter, JobType, CreateJobDto } from "@/shared/types";

export const CATEGORIES: CategoryFilter[] = [
  "All",
  "Engineering",
  "Design",
  "Marketing",
  "Product",
];

export const JOB_TYPES: JobType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

export const INITIAL_FORM: CreateJobDto = {
  company: "",
  title: "",
  type: "Full-time",
  location: "",
  salary: "",
  category: "Engineering",
};
