export type TemplateId = "classic" | "modern" | "compact" | "twocol";

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  avatar?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  details: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  link: string;
  description: string;
  bullets: string[];
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string;
}

export interface ResumeDesign {
  template: TemplateId;
  accentColor: string;
  fontFamily: "sans" | "serif";
  fontSize: "sm" | "md" | "lg";
  spacing: "compact" | "normal" | "relaxed";
}

export type SectionKey =
  | "summary"
  | "experience"
  | "education"
  | "projects"
  | "skills"
  | "certifications"
  | "languages";

export interface Resume {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  personal: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillGroup[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  sections: SectionKey[];
  design: ResumeDesign;
}
