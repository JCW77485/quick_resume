<template>
  <div
    :style="{ overflowWrap: 'anywhere',
              fontFamily,
              fontSize: `${fontPx}pt`,
              lineHeight: 1.4,
              color: '#0f172a',
              display: 'grid',
              gridTemplateColumns: '2.8in 1fr',
              minHeight: '11in',
              background: 'white',
    }"
  >
    <!-- Dark Sidebar -->
    <aside
      :style="{ overflowWrap: 'anywhere',
                background: '#1e293b',
                color: 'white',
                padding: '0.5in 0.3in',
                display: 'flex',
                flexDirection: 'column',
                gap: '2em',
      }"
    >
      <div
        v-if="personal.avatar"
        style="text-align: center;"
      >
        <img
          :src="personal.avatar"
          style="width: 1.8in; height: 1.8in; border-radius: 20px; border: 3px solid; object-fit: cover;"
          :style="{ overflowWrap: 'anywhere', borderColor: accent }"
        >
      </div>

      <section>
        <h2 :style="{ overflowWrap: 'anywhere', color: accent, fontSize: '1em', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1em' }">
          Contact
        </h2>
        <div style="display: flex; flex-direction: column; gap: 0.8em; font-size: 0.9em; color: #cbd5e1;">
          <div
            v-for="(c, i) in contactParts"
            :key="i"
            style="word-break: break-word;"
          >
            {{ c }}
          </div>
        </div>
      </section>

      <template
        v-for="key in sidebarKeys"
        :key="key"
      >
        <section v-if="hasContent(resume, key)">
          <h2 :style="{ overflowWrap: 'anywhere', color: accent, fontSize: '1em', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1em' }">
            {{ getSectionTitle(key) }}
          </h2>

          <template v-if="key === 'skills'">
            <div style="display: flex; flex-wrap: wrap; gap: 0.5em;">
              <span
                v-for="s in skillItems"
                :key="s"
                :style="{ overflowWrap: 'anywhere', background: `${accent}30`, color: 'white', border: `1px solid ${accent}`, padding: '2px 8px', borderRadius: '4px', fontSize: '0.85em' }"
              >
                {{ s }}
              </span>
            </div>
          </template>

          <template v-else-if="key === 'languages'">
            <div
              v-for="l in resume.languages"
              :key="l.id"
              style="margin-bottom: 0.8em;"
            >
              <div style="font-weight: 600; font-size: 0.95em;">
                {{ l.name }}
              </div>
              <div :style="{ overflowWrap: 'anywhere', height: '4px', width: '100%', background: '#334155', marginTop: '4px', borderRadius: '2px' }">
                <div :style="{ overflowWrap: 'anywhere', height: '100%', width: getLevelWidth(l.level), background: accent, borderRadius: '2px' }" />
              </div>
            </div>
          </template>

          <template v-else-if="key === 'certifications'">
            <div
              v-for="c in resume.certifications"
              :key="c.id"
              style="margin-bottom: 0.8em; font-size: 0.9em; color: #cbd5e1;"
            >
              <div style="font-weight: 700; color: white;">
                {{ c.name }}
              </div>
              <div>{{ c.issuer }}</div>
            </div>
          </template>
        </section>
      </template>
    </aside>

    <!-- Main Content -->
    <main style="padding: 0.6in 0.5in; display: flex; flex-direction: column; gap: 2em;">
      <header>
        <h1 :style="{ overflowWrap: 'anywhere', margin: 0, fontSize: '3.2em', fontWeight: 900, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.03em' }">
          {{ personal.fullName || "Your Name" }}
        </h1>
        <div
          v-if="personal.title"
          :style="{ overflowWrap: 'anywhere', marginTop: '0.4em', fontSize: '1.4em', fontWeight: 600, color: accent }"
        >
          {{ personal.title }}
        </div>
      </header>

      <template
        v-for="key in mainKeys"
        :key="key"
      >
        <section v-if="hasContent(resume, key)">
          <h2 :style="{ overflowWrap: 'anywhere', fontSize: '1.4em', fontWeight: 800, color: '#0f172a', marginBottom: '0.8em', display: 'flex', alignItems: 'center', gap: '0.5em' }">
            <span :style="{ overflowWrap: 'anywhere', width: '12px', height: '12px', background: accent, borderRadius: '2px' }" />
            {{ getSectionTitle(key) }}
          </h2>

          <template v-if="key === 'summary'">
            <p style="margin: 0; font-size: 1.1em; color: #334155; line-height: 1.6;">
              {{ personal.summary }}
            </p>
          </template>

          <template v-else-if="key === 'experience'">
            <div
              v-for="e in resume.experience"
              :key="e.id"
              style="margin-bottom: 1.5em; border-left: 2px solid #e2e8f0; padding-left: 1.2em; position: relative;"
            >
              <div :style="{ overflowWrap: 'anywhere', position: 'absolute', left: '-6px', top: '8px', width: '10px', height: '10px', borderRadius: '50%', background: accent }" />
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <div style="font-weight: 800; font-size: 1.1em;">
                  {{ e.role }}
                </div>
                <div :style="{ overflowWrap: 'anywhere', color: accent, fontWeight: 700, fontSize: '0.85em' }">
                  {{ formatDateRange(e.startDate, e.endDate, e.current) }}
                </div>
              </div>
              <div style="font-weight: 600; color: #64748b; margin-bottom: 0.5em;">
                {{ e.company }}
              </div>
              <ul
                v-if="e.bullets.filter(b => b.trim()).length > 0"
                style="margin: 0; padding-left: 1.2em; list-style-type: circle;"
              >
                <li
                  v-for="(b, i) in e.bullets.filter(b => b.trim())"
                  :key="i"
                  style="margin-bottom: 0.3em; color: #334155;"
                >
                  {{ b }}
                </li>
              </ul>
            </div>
          </template>

          <template v-else-if="key === 'education'">
            <div
              v-for="e in resume.education"
              :key="e.id"
              style="margin-bottom: 1.2em;"
            >
              <div style="font-weight: 700; font-size: 1.1em;">
                {{ e.school }}
              </div>
              <div style="display: flex; justify-content: space-between; color: #475569;">
                <div>{{ [e.degree, e.field].filter(Boolean).join(", ") }}</div>
                <div style="font-weight: 600;">
                  {{ formatDateRange(e.startDate, e.endDate, false) }}
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="key === 'projects'">
            <div
              v-for="p in resume.projects"
              :key="p.id"
              style="margin-bottom: 1.2em; background: #f8fafc; padding: 1em; borderRadius: 8px; border-left: 4px solid"
              :style="{ overflowWrap: 'anywhere', borderLeftColor: accent }"
            >
              <div style="font-weight: 800; font-size: 1.05em;">
                {{ p.name }}
              </div>
              <div
                v-if="p.link"
                :style="{ overflowWrap: 'anywhere', color: accent, fontSize: '0.85em', margin: '2px 0 6px' }"
              >
                {{ p.link }}
              </div>
              <div style="color: #475569; font-size: 0.95em;">
                {{ p.description }}
              </div>
            </div>
          </template>
        </section>
      </template>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Resume, SectionKey } from '../types/resume';
import { FONT_SIZE_PX, formatDateRange, hasContent } from './shared';

export default defineComponent({
  name: 'CreativeTemplate',
  props: {
    resume: { type: Object as () => Resume, required: true }
  },
  computed: {
    personal() { return this.resume.personal; },
    design() { return this.resume.design; },
    accent() { return this.design.accentColor; },
    fontPx() { return FONT_SIZE_PX[this.design.fontSize]; },
    fontFamily() {
      return this.design.fontFamily === "serif" ? "var(--font-serif)" : "var(--font-sans)";
    },
    contactParts() {
      const p = this.personal;
      return [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(
        (x) => x && x.trim(),
      );
    },
    sidebarKeys(): SectionKey[] {
      return ["skills", "languages", "certifications"];
    },
    mainKeys(): SectionKey[] {
      return ["summary", "experience", "education", "projects"];
    },
    skillItems() {
      return this.resume.skills.flatMap(s => s.items.split(',').map(i => i.trim())).filter(Boolean);
    }
  },
  methods: {
    hasContent,
    formatDateRange,
    getSectionTitle(key: SectionKey) {
      const titles: Record<SectionKey, string> = {
        summary: "My Story",
        experience: "Experience",
        education: "Education",
        projects: "Projects",
        skills: "Superpowers",
        certifications: "Awards",
        languages: "Languages",
      };
      return titles[key] || key;
    },
    getLevelWidth(level: string) {
      const map: Record<string, string> = {
        Beginner: '25%',
        Intermediate: '50%',
        Advanced: '75%',
        Fluent: '90%',
        Native: '100%',
      };
      return map[level] || '50%';
    }
  }
});
</script>
