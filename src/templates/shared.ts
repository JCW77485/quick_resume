import type { Resume } from "../types/resume";

export interface TemplateProps {
  resume: Resume;
}

export const FONT_SIZE_PX: Record<Resume["design"]["fontSize"], number> = {
  sm: 10,
  md: 11,
  lg: 12,
};

export const SPACING_GAP_REM: Record<Resume["design"]["spacing"], number> = {
  compact: 0.5,
  normal: 0.85,
  relaxed: 1.2,
};

export function hasContent(r: Resume, key: Resume["sections"][number]): boolean {
  switch (key) {
    case "summary":
      return !!r.personal.summary.trim();
    case "experience":
      return r.experience.length > 0;
    case "education":
      return r.education.length > 0;
    case "projects":
      return r.projects.length > 0;
    case "skills":
      return r.skills.length > 0;
    case "certifications":
      return r.certifications.length > 0;
    case "languages":
      return r.languages.length > 0;
  }
}

export function formatDateRange(
  start: string,
  end: string,
  current: boolean,
): string {
  if (!start && !end && !current) return "";
  const endText = current ? "Present" : end || "";
  if (!start) return endText;
  if (!endText) return start;
  return `${start} — ${endText}`;
}
