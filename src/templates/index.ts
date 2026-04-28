export const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional layout with a centered header.",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean, professional, and slightly asymmetric.",
  },
  {
    id: "twocol",
    name: "Two-Column",
    description: "Compact sidebar for skills and secondary info.",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Maximum info in minimum space.",
  },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];
