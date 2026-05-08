"use client";
import { useRef } from "react";
import generatePDF from "react-to-pdf";
import { useResumeBuilder, ResumePreview, ResumeForm} from "@/features/build-resume";

export function ResumeBuilder() {
  const {
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
  } = useResumeBuilder();
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    generatePDF(previewRef, {
      filename: `${info.name || "resume"}.pdf`,
      page: { margin: 10, format: "a4" },
      overrides: {
        canvas: {
          onclone: (_: Document, el: HTMLElement) => {
            el.style.border = "none";
            el.style.boxShadow = "none";
            el.style.borderRadius = "0";
            el.style.padding = "32px";
            el.style.width = "100%";
          },
        },
      },
    });
  };

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
        {/* FORM */}
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
        ></ResumeForm>

        <div className="sticky top-10">
          <ResumePreview
            info={info}
            education={education}
            experience={experience}
            hasContent={hasContent}
            previewRef={previewRef}
          />
          <button
            className="btn btn-ghost"
            style={{ marginTop: 16 }}
            onClick={handleDownloadPDF}
            disabled={!hasContent}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
