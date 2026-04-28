import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Resume, SectionKey } from "../types/resume";
import { emptyResume, sampleResume } from "../lib/defaults";
import { uid } from "../lib/uid";

interface ResumesState {
  resumes: Record<string, Resume>;
  order: string[];
  createResume: (name?: string, template?: Resume["design"]["template"]) => string;
  createSampleResume: () => string;
  duplicateResume: (id: string) => string | null;
  deleteResume: (id: string) => void;
  renameResume: (id: string, name: string) => void;
  updateResume: (id: string, updater: (r: Resume) => Resume) => void;
  addSection: (id: string, key: SectionKey) => void;
  removeSection: (id: string, key: SectionKey) => void;
}

function touch(r: Resume): Resume {
  return { ...r, updatedAt: Date.now() };
}

export const useResumes = create<ResumesState>()(
  persist(
    (set, get) => ({
      resumes: {},
      order: [],
      createResume: (name, template) => {
        const r = emptyResume(name || `Resume ${get().order.length + 1}`);
        if (template) r.design.template = template;
        set((s) => ({
          resumes: { ...s.resumes, [r.id]: r },
          order: [r.id, ...s.order],
        }));
        return r.id;
      },
      createSampleResume: () => {
        const r = sampleResume();
        r.name = `Sample Resume ${get().order.length + 1}`;
        set((s) => ({
          resumes: { ...s.resumes, [r.id]: r },
          order: [r.id, ...s.order],
        }));
        return r.id;
      },
      duplicateResume: (id) => {
        const src = get().resumes[id];
        if (!src) return null;
        const copy: Resume = {
          ...structuredClone(src),
          id: uid("r_"),
          name: `${src.name} (copy)`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((s) => ({
          resumes: { ...s.resumes, [copy.id]: copy },
          order: [copy.id, ...s.order],
        }));
        return copy.id;
      },
      deleteResume: (id) =>
        set((s) => {
          const next = { ...s.resumes };
          delete next[id];
          return { resumes: next, order: s.order.filter((x) => x !== id) };
        }),
      renameResume: (id, name) =>
        set((s) => {
          const r = s.resumes[id];
          if (!r) return s;
          return { resumes: { ...s.resumes, [id]: touch({ ...r, name }) } };
        }),
      updateResume: (id, updater) =>
        set((s) => {
          const r = s.resumes[id];
          if (!r) return s;
          return { resumes: { ...s.resumes, [id]: touch(updater(r)) } };
        }),
      addSection: (id, key) =>
        set((s) => {
          const r = s.resumes[id];
          if (!r || r.sections.includes(key)) return s;
          return {
            resumes: {
              ...s.resumes,
              [id]: touch({ ...r, sections: [...r.sections, key] }),
            },
          };
        }),
      removeSection: (id, key) =>
        set((s) => {
          const r = s.resumes[id];
          if (!r) return s;
          return {
            resumes: {
              ...s.resumes,
              [id]: touch({ ...r, sections: r.sections.filter((k) => k !== key) }),
            },
          };
        }),
    }),
    { name: "quickresume:v1" },
  ),
);

export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications",
  languages: "Languages",
};
