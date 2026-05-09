import { defineStore } from "pinia";
import type { Resume, SectionKey } from "../types/resume";
import { emptyResume, sampleResume } from "../lib/defaults";
import { uid } from "../lib/uid";

interface ResumesState {
  resumes: Record<string, Resume>;
  order: string[];
}

function touch(r: Resume): Resume {
  return { ...r, updatedAt: Date.now() };
}

const STORAGE_KEY = "quickresume:v1";

export const useResumes = defineStore("resumes", {
  state: (): ResumesState => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          resumes: parsed.state.resumes || {},
          order: parsed.state.order || [],
        };
      } catch (e) {
        console.error("Failed to parse stored resumes", e);
      }
    }
    return {
      resumes: {},
      order: [],
    };
  },

  actions: {
    persist() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          state: {
            resumes: this.resumes,
            order: this.order,
          },
          version: 1,
        })
      );
    },

    createResume(name?: string, template?: Resume["design"]["template"]) {
      const r = emptyResume(name || `Resume ${this.order.length + 1}`);
      if (template) r.design.template = template;
      this.resumes[r.id] = r;
      this.order.unshift(r.id);
      this.persist();
      return r.id;
    },

    createSampleResume() {
      const r = sampleResume();
      r.name = `Sample Resume ${this.order.length + 1}`;
      this.resumes[r.id] = r;
      this.order.unshift(r.id);
      this.persist();
      return r.id;
    },

    duplicateResume(id: string) {
      const src = this.resumes[id];
      if (!src) return null;
      const copy: Resume = {
        ...structuredClone(src),
        id: uid("r_"),
        name: `${src.name} (copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      this.resumes[copy.id] = copy;
      this.order.unshift(copy.id);
      this.persist();
      return copy.id;
    },

    deleteResume(id: string) {
      delete this.resumes[id];
      this.order = this.order.filter((x) => x !== id);
      this.persist();
    },

    renameResume(id: string, name: string) {
      const r = this.resumes[id];
      if (!r) return;
      this.resumes[id] = touch({ ...r, name });
      this.persist();
    },

    updateResume(id: string, updater: (r: Resume) => Resume) {
      const r = this.resumes[id];
      if (!r) return;
      this.resumes[id] = touch(updater(r));
      this.persist();
    },

    addSection(id: string, key: SectionKey) {
      const r = this.resumes[id];
      if (!r || r.sections.includes(key)) return;
      this.resumes[id] = touch({ ...r, sections: [...r.sections, key] });
      this.persist();
    },

    removeSection(id: string, key: SectionKey) {
      const r = this.resumes[id];
      if (!r) return;
      this.resumes[id] = touch({ ...r, sections: r.sections.filter((k) => k !== key) });
      this.persist();
    },
  },
});

export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications",
  languages: "Languages",
};
