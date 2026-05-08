import { useState } from "react";
import { ResumeInfo, EducationEntry, ExperienceEntry } from "@/shared/types";

export function useResumeBuilder() {
  const [info, setInfo] = useState<ResumeInfo>({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    skills: "",
  });
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [experience, setExperience] = useState<ExperienceEntry[]>([]);
  const [addingEdu, setAddingEdu] = useState(false);
  const [addingExp, setAddingExp] = useState(false);
  const [expForm, setExpForm] = useState<Omit<ExperienceEntry, "id">>({
    company: "",
    role: "",
    period: "",
    desc: "",
  });
  const [eduForm, setEduForm] = useState<Omit<EducationEntry, "id">>({
    school: "",
    degree: "",
    period: "",
  });

  const set =
    (k: keyof ResumeInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setInfo((p) => ({ ...p, [k]: e.target.value }));
  const skills = info.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const hasContent =
    info.name ||
    info.title ||
    info.summary ||
    experience.length ||
    education.length ||
    skills.length;

  const addEdu = () => {
    if (!eduForm.school) return;
    setEducation((p) => [...p, { ...eduForm, id: Date.now() }]);
    setEduForm({ school: "", degree: "", period: "" });
    setAddingEdu(false);
  };
  const addExp = () => {
    if (!expForm.company) return;
    setExperience((p) => [...p, { ...expForm, id: Date.now() }]);
    setExpForm({ company: "", role: "", period: "", desc: "" });
    setAddingExp(false);
  };

  return {
    info,
    set,
    skills,
    hasContent,
    education,
    eduForm,
    setEduForm,
    addingEdu,
    setAddingEdu,
    addEdu,
    experience,
    expForm,
    setExpForm,
    addingExp,
    setAddingExp,
    addExp,
    setEducation,
    setExperience,
  };
}
