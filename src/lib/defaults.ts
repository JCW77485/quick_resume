import type { Resume, SectionKey } from "../types/resume";
import { uid } from "./uid";

export const DEFAULT_SECTIONS: SectionKey[] = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
];

export function emptyResume(name = "Untitled resume"): Resume {
  const now = Date.now();
  return {
    id: uid("r_"),
    name,
    createdAt: now,
    updatedAt: now,
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      summary: "",
      avatar: "",
    },
    experience: [],
    education: [],
    projects: [],
    skills: [],
    certifications: [],
    languages: [],
    sections: [...DEFAULT_SECTIONS],
    design: {
      template: "classic",
      accentColor: "#1e6cf5",
      fontFamily: "sans",
      fontSize: "md",
      spacing: "normal",
    },
  };
}

export function sampleResume(): Resume {
  const now = Date.now();
  return {
    id: uid("r_"),
    name: "Sample Resume",
    createdAt: now,
    updatedAt: now,
    personal: {
      fullName: "Alex Morgan",
      title: "Senior Full-Stack Engineer",
      email: "alex.morgan@example.com",
      phone: "+1 (415) 555-0143",
      location: "San Francisco, CA",
      website: "alexmorgan.dev",
      linkedin: "linkedin.com/in/alexmorgan",
      github: "github.com/alexmorgan",
      summary:
        "Full-stack engineer with 7+ years of experience shipping reliable, high-traffic web products. Skilled at leading small teams, owning features end to end, and turning ambiguous requirements into clean, maintainable code.",
      avatar: "",
    },
    experience: [
      {
        id: uid(),
        company: "Northwind Labs",
        role: "Senior Software Engineer",
        location: "Remote",
        startDate: "Mar 2022",
        endDate: "",
        current: true,
        bullets: [
          "Led rewrite of the billing platform, cutting p95 checkout latency by 48% and reducing production incidents by 60%.",
          "Designed and shipped a self-serve plan-management experience used by 40k+ businesses each month.",
          "Mentored four engineers through project ownership, code reviews, and weekly pairing sessions.",
        ],
      },
      {
        id: uid(),
        company: "Greenfield Commerce",
        role: "Software Engineer",
        location: "San Francisco, CA",
        startDate: "Jun 2019",
        endDate: "Feb 2022",
        current: false,
        bullets: [
          "Built a React design system adopted across six product teams, reducing new-feature ramp-up time by ~30%.",
          "Owned the migration from a monolithic Rails service to event-driven Node.js workers handling 12M jobs/day.",
          "Partnered with product and design on A/B experiments that lifted checkout conversion by 11%.",
        ],
      },
    ],
    education: [
      {
        id: uid(),
        school: "University of California, Berkeley",
        degree: "B.S.",
        field: "Computer Science",
        location: "Berkeley, CA",
        startDate: "2015",
        endDate: "2019",
        details: "Minor in Design. Dean's List 2017, 2018.",
      },
    ],
    projects: [
      {
        id: uid(),
        name: "Open Pricing Table",
        link: "github.com/alexmorgan/open-pricing-table",
        description:
          "MIT-licensed React component for SaaS pricing pages with 2.4k stars and 40+ contributors.",
        bullets: [],
      },
    ],
    skills: [
      {
        id: uid(),
        category: "Languages",
        items: "TypeScript, JavaScript, Python, Go, SQL",
      },
      {
        id: uid(),
        category: "Frameworks",
        items: "React, Next.js, Node.js, Express, FastAPI",
      },
      {
        id: uid(),
        category: "Infrastructure",
        items: "PostgreSQL, Redis, Docker, Kubernetes, AWS, Terraform",
      },
    ],
    certifications: [
      {
        id: uid(),
        name: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        date: "2023",
      },
    ],
    languages: [
      { id: uid(), name: "English", level: "Native" },
      { id: uid(), name: "Spanish", level: "Professional" },
    ],
    sections: ["summary", "experience", "education", "skills", "projects", "certifications", "languages"],
    design: {
      template: "classic",
      accentColor: "#1e6cf5",
      fontFamily: "sans",
      fontSize: "md",
      spacing: "normal",
    },
  };
}
