"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from "react";
import { usePersonalInfo } from "./model/usePersonalInfo";
import { useEducationList } from "./model/useEducationList";
import { useExperienceList } from "./model/useExperienceList";
import { fetchResume, saveResume } from "@/shared/api/resume";
import { useAuth } from "@/features/auth";
import type { ResumeInfo, EducationEntry, ExperienceEntry } from "@/shared/types";

type PersonalInfo = ReturnType<typeof usePersonalInfo>;
type EducationList = ReturnType<typeof useEducationList>;
type ExperienceList = ReturnType<typeof useExperienceList>;

interface ResumeContextValue extends PersonalInfo, EducationList, ExperienceList {
  hasContent: string | number | boolean;
  saving: boolean;
  save: () => Promise<void>;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const personalInfo = usePersonalInfo();
  const educationList = useEducationList();
  const experienceList = useExperienceList();
  const [saving, setSaving] = useState(false);

  // Refs so the save callback always reads the latest state without needing them as deps
  const infoRef = useRef(personalInfo.info);
  infoRef.current = personalInfo.info;
  const educationRef = useRef(educationList.education);
  educationRef.current = educationList.education;
  const experienceRef = useRef(experienceList.experience);
  experienceRef.current = experienceList.experience;

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetchResume(token).then(({ data }) => {
      if (cancelled || !data) return;
      personalInfo.loadInfo(data.info);
      educationList.setEducation(data.education);
      experienceList.setExperience(data.experience);
    });
    return () => { cancelled = true; };
  // loadInfo and the setState setters are all stable references — safe to omit from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const save = useCallback(async () => {
    if (!token) return;
    setSaving(true);
    await saveResume(token, {
      info: infoRef.current,
      education: educationRef.current,
      experience: experienceRef.current,
    });
    setSaving(false);
  }, [token]);

  const hasContent =
    personalInfo.info.name ||
    personalInfo.skills.length ||
    educationList.education.length ||
    experienceList.experience.length;

  return (
    <ResumeContext.Provider
      value={{ ...personalInfo, ...educationList, ...experienceList, hasContent, saving, save }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResumeContext() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResumeContext must be used inside ResumeProvider");
  return ctx;
}
