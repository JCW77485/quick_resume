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
  {
    id: "premium",
    name: "Premium",
    description: "Modern layout with profile picture support.",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Elegant and sophisticated for senior roles.",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold design with a standout sidebar profile.",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Ultra-clean layout focusing on essential details.",
  },
  {
    id: "technical",
    name: "Technical",
    description: "Optimized for engineering and data roles.",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Visual-heavy layout for creators and developers.",
  },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];
