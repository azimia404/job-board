import { useState } from "react";
import { ResumeInfo, EducationEntry, ExperienceEntry } from "@/shared/types";
import { useEducationList } from "./useEducationList";
import { useExperienceList } from "./useExperienceList";
import { usePersonalInfo } from "./usePersonalInfo";

export function useResumeBuilder() {
  const personalInfo = usePersonalInfo();
  const experienceList = useExperienceList();
  const educationList = useEducationList();

  const hasContent = personalInfo.info.name || personalInfo.skills.length ||
    educationList.education.length || experienceList.experience.length;

  return {
    ...personalInfo, ...experienceList, ...educationList, hasContent
  };
}
