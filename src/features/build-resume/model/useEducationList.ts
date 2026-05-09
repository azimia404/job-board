import { useState } from "react";
import { EducationEntry } from "@/shared/types";
export function useEducationList() {
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [eduForm, setEduForm] = useState({ school: "", degree: "", period: "" });
  const [addingEdu, setAddingEdu] = useState(false);

  const addEdu = () => {
    if (!eduForm.school) return;
    setEducation((p) => [...p, { ...eduForm, id: Date.now() }]);
    setEduForm({ school: "", degree: "", period: "" });
    setAddingEdu(false);
  };
  
  return { education, setEducation, eduForm, setEduForm, addingEdu, setAddingEdu, addEdu };
}