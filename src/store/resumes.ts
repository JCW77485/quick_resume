import { defineStore } from "pinia";
import axios from "axios";
import type { Resume, SectionKey } from "../types/resume";
import { emptyResume, sampleResume } from "../lib/defaults";
import { uid } from "../lib/uid";
import { useAuth } from "./auth";

/**
 * ResumesState interface for Pinia store.
 */
interface ResumesState {
  resumes: Record<string, Resume>;
  order: string[]; // List of resume IDs in display order
}

/**
 * Helper to update the updatedAt timestamp on a resume object.
 */
function touch(r: Resume): Resume {
  return { ...r, updatedAt: Date.now() };
}

const STORAGE_KEY = "quickresume:v1";
const API_URL = '/api/index.php';

/**
 * Resumes Store
 * Handles resume creation, updates, deletions, and synchronization with LocalStorage and PHP/MySQL.
 */
export const useResumes = defineStore("resumes", {
  state: (): ResumesState => {
    // Initial state: attempt to load from local storage
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
    /**
     * Fetches resumes from the database for the authenticated user.
     */
    async fetchResumes() {
      const auth = useAuth();
      if (!auth.user) return;
      try {
        const res = await axios.get(`${API_URL}/resumes`);
        const remoteResumes = res.data;

        // Error handling for unauthorized or empty response
        if (remoteResumes.error) return;

        // Merge remote resumes into local state
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

    /**
     * Persists current state to LocalStorage and optionally syncs a specific resume to the database.
     */
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
                  // Sync resume data to PHP backend
                  await axios.post(`${API_URL}/resumes`, {
                      id: r.id,
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

    /**
     * Creates a new empty resume.
     */
    createResume(name?: string, template?: Resume["design"]["template"]) {
      const r = emptyResume(name || `Resume ${this.order.length + 1}`);
      if (template) r.design.template = template;
      this.resumes[r.id] = r;
      this.order.unshift(r.id);
      this.persist(r.id);
      return r.id;
    },

    /**
     * Creates a resume pre-filled with sample data.
     */
    createSampleResume() {
      const r = sampleResume();
      r.name = `Sample Resume ${this.order.length + 1}`;
      this.resumes[r.id] = r;
      this.order.unshift(r.id);
      this.persist(r.id);
      return r.id;
    },

    /**
     * Creates a copy of an existing resume.
     */
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

    /**
     * Deletes a resume from local state and LocalStorage.
     */
    deleteResume(id: string) {
      delete this.resumes[id];
      this.order = this.order.filter((x) => x !== id);
      this.persist();
    },

    renameResume(id: string, name: string) {
      const r = this.resumes[id];
      if (!r) return;
      this.resumes[id] = touch({ ...r, name });
      this.persist(id);
    },

    /**
     * Universal update method for modifying resume content.
     */
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

/**
 * Display labels for different resume sections.
 */
export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications",
  languages: "Languages",
};
