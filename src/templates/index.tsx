import type { Resume, TemplateId } from "../types/resume";
import ClassicTemplate from "./ClassicTemplate";
import ModernTemplate from "./ModernTemplate";
import CompactTemplate from "./CompactTemplate";
import TwoColumnTemplate from "./TwoColumnTemplate";

export const TEMPLATES: {
  id: TemplateId;
  name: string;
  description: string;
}[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Balanced, ATS-friendly single-column layout with a centered header.",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold accent bar, left-aligned header, and roomy section titles.",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Tight spacing and inline contact info — great for one-page CVs.",
  },
  {
    id: "twocol",
    name: "Two Column",
    description: "Dark sidebar with skills and contact, main column for experience.",
  },
];

export function renderTemplate(resume: Resume) {
  switch (resume.design.template) {
    case "modern":
      return <ModernTemplate resume={resume} />;
    case "compact":
      return <CompactTemplate resume={resume} />;
    case "twocol":
      return <TwoColumnTemplate resume={resume} />;
    case "classic":
    default:
      return <ClassicTemplate resume={resume} />;
  }
}
