import { useState } from "react";
import { ResumeInfo } from "@/shared/types";
export function usePersonalInfo() {
  const [info, setInfo] = useState<ResumeInfo>({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    skills: "",
  });
  const set =
    (k: keyof ResumeInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setInfo((p) => ({ ...p, [k]: e.target.value }));
  const skills = info.skills.split(",").map(s => s.trim()).filter(Boolean);
  return { info, set, skills };
}