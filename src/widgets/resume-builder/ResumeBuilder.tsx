"use client";
import { useRef } from "react";
import generatePDF from "react-to-pdf";
import {
  useResumeBuilder,
  ResumePreview,
  ResumeForm,
} from "@/features/build-resume";
import { useAuth } from "@/features/auth";

export function ResumeBuilder() {
  const { user } = useAuth();
  const {
    info,
    set,
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
    save,
    saving,
  } = useResumeBuilder();
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    generatePDF(previewRef, {
      filename: `${info.name || "resume"}.pdf`,
      page: { margin: 0, format: "a4" },
      overrides: {
        pdf: { compress: true },
        canvas: {
          scale: 3,
          onclone: (_: Document, el: HTMLElement) => {
            el.style.border = "none";
            el.style.boxShadow = "none";
            el.style.borderRadius = "0";
            el.style.padding = "40px";
            el.style.width = "794px";
            el.style.height = "auto";
            el.style.overflow = "visible";
          },
        },
      },
    });
  };

  const content = hasContent as string | number;

  return (
    <div>
      <div className="page-title">
        Resume
        <br />
        <span style={{ color: "var(--accent)" }}>Builder.</span>
      </div>
      <p className="page-sub">
        Fill in your details, add experience — get a clean resume preview.
      </p>
      <div className="resume-layout">
        <ResumeForm
          info={info}
          set={set}
          eduForm={eduForm}
          setEduForm={setEduForm}
          addingEdu={addingEdu}
          setAddingEdu={setAddingEdu}
          experience={experience}
          setExperience={setExperience}
          education={education}
          setEducation={setEducation}
          addEdu={addEdu}
          expForm={expForm}
          setExpForm={setExpForm}
          addingExp={addingExp}
          setAddingExp={setAddingExp}
          addExp={addExp}
        />

        <div className="sticky top-10">
          <ResumePreview
            info={info}
            education={education}
            experience={experience}
            hasContent={content}
            previewRef={previewRef}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button
              className="btn btn-ghost"
              onClick={handleDownloadPDF}
              disabled={!hasContent}
            >
              Download PDF
            </button>
            {user && (
              <button
                className="btn btn-primary"
                onClick={save}
                disabled={saving || !hasContent}
              >
                {saving ? "Saving…" : "Save"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
