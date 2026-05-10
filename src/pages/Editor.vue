<template>
  <div
    v-if="!resume"
    class="grid h-screen place-items-center bg-slate-50"
  >
    <div class="rounded-lg border border-slate-200 bg-white p-6 text-center">
      <p class="text-slate-700">
        This resume couldn't be found.
      </p>
      <router-link
        to="/builder"
        class="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
      >
        <ArrowLeft :size="14" /> Back to my resumes
      </router-link>
    </div>
  </div>

  <div
    v-else
    class="flex h-screen flex-col bg-slate-100"
  >
    <!-- Top bar -->
    <header class="no-print flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-2">
      <button
        type="button"
        class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        @click="$router.push('/builder')"
      >
        <ArrowLeft :size="14" /> My resumes
      </button>
      <div class="h-5 w-px bg-slate-200" />
      <div class="flex min-w-0 flex-1 items-center gap-2">
        <template v-if="editingName">
          <input
            v-model="nameDraft"
            autofocus
            class="w-64 rounded-md border border-slate-300 px-2 py-1 text-sm font-semibold text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            @blur="saveName"
            @keydown.enter="saveName"
            @keydown.esc="editingName = false"
          >
        </template>
        <template v-else>
          <button
            type="button"
            class="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            @click="startEditingName"
          >
            <FileText
              :size="14"
              class="text-slate-400"
            />
            <span class="truncate">{{ resume.name }}</span>
            <Pencil
              :size="12"
              class="text-slate-400"
            />
          </button>
        </template>
        <span
          v-if="savedAt !== null"
          class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
        >
          <Check :size="12" /> Saved
        </span>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
        @click="print"
      >
        <Download :size="14" /> Download PDF
      </button>
    </header>

    <!-- Body -->
    <div class="flex min-h-0 flex-1">
      <!-- Left panel -->
      <aside class="no-print flex w-full max-w-xl shrink-0 flex-col border-r border-slate-200 bg-slate-50 lg:w-[44%]">
        <div class="flex shrink-0 items-center gap-1 border-b border-slate-200 bg-white px-2 py-2">
          <button
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium',
              tab === 'content' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
            ]"
            @click="tab = 'content'"
          >
            <LayoutGrid :size="14" /> Content
          </button>
          <button
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium',
              tab === 'design' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
            ]"
            @click="tab = 'design'"
          >
            <Paintbrush :size="14" /> Design
          </button>
        </div>
        <div class="scroll-thin min-h-0 flex-1 overflow-y-auto p-4">
          <div
            v-if="tab === 'content'"
            class="space-y-3"
          >
            <PersonalSection
              :resume="resume"
              @update="update"
            />
            <div
              v-for="k in resume.sections"
              :key="k"
            >
              <component
                :is="getSectionComponent(k)"
                :resume="resume"
                :has-remove="true"
                @update="update"
                @remove-section="removeSection(k)"
              />
            </div>
            <div
              v-if="availableSections.length > 0"
              class="rounded-lg border border-dashed border-slate-300 bg-white p-4"
            >
              <div class="mb-2 text-sm font-semibold text-slate-900">
                Add a section
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="k in availableSections"
                  :key="k"
                  type="button"
                  class="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700"
                  @click="addSection(k)"
                >
                  <Plus :size="12" /> {{ SECTION_LABELS[k] }}
                </button>
              </div>
            </div>
          </div>
          <DesignPanel
            v-else
            :resume="resume"
            @update="update"
          />
        </div>
      </aside>

      <!-- Preview -->
      <section
        ref="previewContainer"
        class="scroll-thin relative min-w-0 flex-1 overflow-auto"
      >
        <div class="no-print sticky top-0 z-10 flex items-center justify-end gap-2 border-b border-slate-200 bg-slate-50/90 px-4 py-2 backdrop-blur">
          <!-- Zoom controls could go here -->
        </div>
        <div class="flex justify-center p-6">
          <ResumePreview
            id="main-resume-preview"
            class="no-print"
            :resume="resume"
            :scale="scale"
          />
          <!-- Hidden printable version -->
          <div class="print:block hidden">
            <ResumePreview
              :resume="resume"
              :printable="true"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- Upgrade Modal -->
    <div
      v-if="showUpgradeModal"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div class="relative bg-brand-600 p-8 text-center text-white">
          <button
            type="button"
            class="absolute top-4 right-4 text-white/80 hover:text-white"
            @click="showUpgradeModal = false"
          >
            <X :size="20" />
          </button>
          <div class="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white/20">
            <Crown :size="32" />
          </div>
          <h3 class="text-2xl font-bold">
            {{ !auth.user ? 'Sign in to Download' : 'Unlock PDF Downloads' }}
          </h3>
          <p class="mt-2 text-brand-100">
            {{ !auth.user ? 'Create an account to save and download your resume.' : 'Upgrade to Pro to download and print your professional resumes.' }}
          </p>
        </div>
        <div class="p-6">
          <ul class="space-y-3">
            <li class="flex items-center gap-3 text-sm text-slate-600">
              <Check
                class="text-emerald-500"
                :size="16"
              /> Unlimited high-quality PDF exports
            </li>
            <li class="flex items-center gap-3 text-sm text-slate-600">
              <Check
                class="text-emerald-500"
                :size="16"
              /> Access to all 10 premium templates
            </li>
            <li class="flex items-center gap-3 text-sm text-slate-600">
              <Check
                class="text-emerald-500"
                :size="16"
              /> Lifetime access to your resumes
            </li>
          </ul>
          <div class="mt-8 flex flex-col gap-3">
            <button
              v-if="!auth.user"
              type="button"
              class="w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700 active:scale-[0.98]"
              @click="$router.push('/login')"
            >
              Sign up free
            </button>
            <button
              v-else
              type="button"
              class="w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700 active:scale-[0.98]"
              @click="$router.push('/pricing')"
            >
              Upgrade for $10
            </button>
            <button
              type="button"
              class="w-full py-2 text-sm font-medium text-slate-500 hover:text-slate-700"
              @click="showUpgradeModal = false"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  ArrowLeft,
  Crown,
  X,
  Check,
  Download,
  FileText,
  LayoutGrid,
  Paintbrush,
  Pencil,
  Plus,
} from 'lucide-vue-next';
import { SECTION_LABELS, useResumes } from '../store/resumes';
import { useAuth } from '../store/auth';
import type { Resume, SectionKey } from '../types/resume';
import ResumePreview from '../components/ResumePreview.vue';
import PersonalSection from '../components/form/sections/PersonalSection.vue';
import SummarySection from '../components/form/sections/SummarySection.vue';
import ExperienceSection from '../components/form/sections/ExperienceSection.vue';
import EducationSection from '../components/form/sections/EducationSection.vue';
import SkillsSection from '../components/form/sections/SkillsSection.vue';
import ProjectsSection from '../components/form/sections/ProjectsSection.vue';
import CertificationsSection from '../components/form/sections/CertificationsSection.vue';
import LanguagesSection from '../components/form/sections/LanguagesSection.vue';
import DesignPanel from '../components/form/DesignPanel.vue';

const SECTION_ORDER: SectionKey[] = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
];

export default defineComponent({
  name: 'Editor',
  components: {
    ResumePreview,
    PersonalSection,
    SummarySection,
    ExperienceSection,
    EducationSection,
    SkillsSection,
    ProjectsSection,
    CertificationsSection,
    LanguagesSection,
    DesignPanel,
    ArrowLeft,
    Crown,
    X,
    Check,
    Download,
    FileText,
    LayoutGrid,
    Paintbrush,
    Pencil,
    Plus
  },
  data() {
    return {
      tab: 'content' as 'content' | 'design',
      editingName: false,
      nameDraft: '',
      scale: 0.72,
      savedAt: null as number | null,
      resizeObserver: null as ResizeObserver | null,
      showUpgradeModal: false,
      SECTION_LABELS
    };
  },
  computed: {
    id() { return this.$route.params.id as string; },
    resume(): Resume | undefined {
      return useResumes().resumes[this.id];
    },
    auth() { return useAuth(); },
    availableSections(): SectionKey[] {
      if (!this.resume) return [];
      return SECTION_ORDER.filter((k) => !this.resume!.sections.includes(k));
    }
  },
  watch: {
    'resume.updatedAt'(newVal, oldVal) {
      if (oldVal !== undefined && newVal !== oldVal) {
        this.savedAt = Date.now();
      }
    }
  },
  mounted() {
    const el = this.$refs.previewContainer as HTMLElement;
    if (el) {
      const fit = () => {
        const w = el.clientWidth - 48;
        const target = Math.max(0.35, Math.min(1.1, w / (8.5 * 96)));
        this.scale = target;
      };
      fit();
      this.resizeObserver = new ResizeObserver(fit);
      this.resizeObserver.observe(el);
    }
  },
  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },
  methods: {
    update(updater: (r: Resume) => Resume) {
      useResumes().updateResume(this.id, updater);
    },
    startEditingName() {
      if (this.resume) {
        this.nameDraft = this.resume.name;
        this.editingName = true;
      }
    },
    saveName() {
      if (this.resume) {
        useResumes().renameResume(this.id, this.nameDraft || this.resume.name);
        this.editingName = false;
      }
    },
    addSection(key: SectionKey) {
      useResumes().addSection(this.id, key);
    },
    removeSection(key: SectionKey) {
      useResumes().removeSection(this.id, key);
    },
    getSectionComponent(key: SectionKey) {
      const map: Record<SectionKey, string> = {
        summary: 'SummarySection',
        experience: 'ExperienceSection',
        education: 'EducationSection',
        projects: 'ProjectsSection',
        skills: 'SkillsSection',
        certifications: 'CertificationsSection',
        languages: 'LanguagesSection',
      };
      return map[key];
    },
    print() {
      if (!this.auth.user || !this.auth.isPro) {
        this.showUpgradeModal = true;
        return;
      }
      window.print();
    }
  }
});
</script>
