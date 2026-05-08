import { ResumeInfo, EducationEntry, ExperienceEntry } from "@/shared/types";

interface ResumePreviewProps {
  info: ResumeInfo;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  hasContent: string | number;
  previewRef: React.Ref<HTMLDivElement>;
}

export function ResumePreview({ info, education, experience, hasContent, previewRef }: ResumePreviewProps) {
  return (
    <div className="resume-preview" ref={previewRef}>
      {!hasContent ? (
        <div className="empty">
          <div
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: 18,
              marginBottom: 6,
            }}
          >
            Your resume preview
          </div>
          <div style={{ fontSize: 13 }}>
            Start filling in the form to see your resume here
          </div>
        </div>
      ) : (
        <>
          {info.name && <div className="preview-name">{info.name}</div>}
          {info.title && <div className="preview-title">{info.title}</div>}
          {(info.email || info.phone || info.location) && (
            <div className="preview-contact">
              {info.email && <span>{info.email}</span>}
              {info.phone && <span>{info.phone}</span>}
              {info.location && <span>{info.location}</span>}
            </div>
          )}

          {info.summary && (
            <div className="preview-section">
              <div className="preview-section-title">Summary</div>
              <p style={{ fontSize: 12, color: "#444" }}>{info.summary}</p>
            </div>
          )}

          {info.skills.length > 0 && (
            <div className="preview-section">
              <div className="preview-section-title">Skills</div>
              <div className="preview-skills">
                {info.skills.split(",").map((skill: string, i: number) => (
                  <div key={i} className="preview-skill">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {experience.length > 0 && (
            <div className="preview-section">
              <div className="preview-section-title">Experience</div>
              {experience.map((e, i) => (
                <div
                  key={e.id}
                  style={{
                    marginBottom: i < experience.length - 1 ? 12 : 0,
                  }}
                >
                  <div className="preview-entry-header">
                    <div className="preview-entry-title">{e.role}</div>
                    <div className="preview-entry-date">{e.period}</div>
                  </div>
                  <div className="preview-entry-company">{e.company}</div>
                  {e.desc && <div className="preview-entry-desc">{e.desc}</div>}
                </div>
              ))}
            </div>
          )}

          {education.length > 0 && (
            <div className="preview-section">
              <div className="preview-section-title">Education</div>
              {education.map((e, i) => (
                <div
                  key={e.id}
                  style={{
                    marginBottom: i < education.length - 1 ? 10 : 0,
                  }}
                >
                  <div className="preview-entry-header">
                    <div className="preview-entry-title">{e.degree}</div>
                    <div className="preview-entry-date">{e.period}</div>
                  </div>
                  <div className="preview-entry-company">{e.school}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
