import { defineStore } from "pinia";
import axios from "axios";
import type { Resume, SectionKey } from "../types/resume";
import { emptyResume, sampleResume } from "../lib/defaults";
import { uid } from "../lib/uid";
import { useAuth } from "./auth";

interface ResumesState {
  resumes: Record<string, Resume>;
  order: string[];
}

function touch(r: Resume): Resume {
  return { ...r, updatedAt: Date.now() };
}

const STORAGE_KEY = "quickresume:v1";
const API_URL = '/api/index.php';

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
    async fetchResumes() {
      const auth = useAuth();
      if (!auth.user) return;
      try {
        const res = await axios.get(`${API_URL}/resumes?user_id=${auth.user.id}`);
        const remoteResumes = res.data;
        remoteResumes.forEach((r: {id:string, name:string, data:string, updated_at:string}) => {
           const resumeData = JSON.parse(r.data);
           this.resumes[r.id] = { ...resumeData, id: r.id, name: r.name, updatedAt: Number(r.updated_at) };
           if (!this.order.includes(r.id)) {
              this.order.push(r.id);
           }
        });
        this.persist();
      } catch (e) {
        console.error("Failed to fetch resumes", e);
      }
    },

    async persist(resumeId?: string) {
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

      const auth = useAuth();
      if (auth.user && resumeId) {
          const r = this.resumes[resumeId];
          if (r) {
              try {
                  await axios.post(`${API_URL}/resumes`, {
                      id: r.id,
                      user_id: auth.user.id,
                      name: r.name,
                      data: r,
                      created_at: r.createdAt,
                      updated_at: r.updatedAt
                  });
              } catch (e) {
                  console.error("Failed to sync resume to DB", e);
              }
          }
      }
    },

    createResume(name?: string, template?: Resume["design"]["template"]) {
      const r = emptyResume(name || `Resume ${this.order.length + 1}`);
      if (template) r.design.template = template;
      this.resumes[r.id] = r;
      this.order.unshift(r.id);
      this.persist(r.id);
      return r.id;
    },

    createSampleResume() {
      const r = sampleResume();
      r.name = `Sample Resume ${this.order.length + 1}`;
      this.resumes[r.id] = r;
      this.order.unshift(r.id);
      this.persist(r.id);
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
      this.persist(copy.id);
      return copy.id;
    },

    deleteResume(id: string) {
      delete this.resumes[id];
      this.order = this.order.filter((x) => x !== id);
      this.persist();
      // Add API delete call here if needed
    },

    renameResume(id: string, name: string) {
      const r = this.resumes[id];
      if (!r) return;
      this.resumes[id] = touch({ ...r, name });
      this.persist(id);
    },

    updateResume(id: string, updater: (r: Resume) => Resume) {
      const r = this.resumes[id];
      if (!r) return;
      this.resumes[id] = touch(updater(r));
      this.persist(id);
    },

    addSection(id: string, key: SectionKey) {
      const r = this.resumes[id];
      if (!r || r.sections.includes(key)) return;
      this.resumes[id] = touch({ ...r, sections: [...r.sections, key] });
      this.persist(id);
    },

    removeSection(id: string, key: SectionKey) {
      const r = this.resumes[id];
      if (!r) return;
      this.resumes[id] = touch({ ...r, sections: r.sections.filter((k) => k !== key) });
      this.persist(id);
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
