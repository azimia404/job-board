import { useState } from "react";
import { ExperienceEntry } from "@/shared/types";

export function useExperienceList() {
  const [experience, setExperience] = useState<ExperienceEntry[]>([]);
  const [addingExp, setAddingExp] = useState(false);
  const [expForm, setExpForm] = useState<Omit<ExperienceEntry, "id">>({
    company: "",
    role: "",
    period: "",
    desc: "",
  });

  const addExp = () => {
    if (!expForm.company) return;
    setExperience((p) => [...p, { ...expForm, id: Date.now() }]);
    setExpForm({ company: "", role: "", period: "", desc: "" });
    setAddingExp(false);
  };
  
  return { experience, setExperience, expForm, setExpForm, addingExp, setAddingExp, addExp };
}