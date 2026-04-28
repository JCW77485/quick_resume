<template>
  <div
    :style="{
      fontFamily,
      fontSize: `${fontPx}pt`,
      lineHeight: 1.4,
      color: '#0f172a',
      display: 'grid',
      gridTemplateColumns: '3.1in 1fr',
      minHeight: '100%',
    }"
  >
    <!-- Left Sidebar -->
    <aside
      style="background: #0f172a; color: white; padding: 0.6in 0.4in; align-self: stretch"
    >
      <div style="margin-bottom: 0.6em">
        <h1 style="margin: 0; font-size: 1.5em; font-weight: 800; color: white">
          {{ personal.fullName || "Your Name" }}
        </h1>
        <div
          v-if="personal.title"
          :style="{ color: accent, fontWeight: 600 }"
        >
          {{ personal.title }}
        </div>
      </div>

      <section v-if="contacts.length > 0">
        <h2 style="margin: 0.9em 0 0.3em; font-size: 0.95em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #f8fafc">
          Contact
        </h2>
        <div
          v-for="(c, i) in contacts"
          :key="i"
          style="color: #cbd5e1; word-break: break-word"
        >
          {{ c }}
        </div>
      </section>

      <template
        v-for="key in leftOrdered"
        :key="key"
      >
        <section v-if="hasContent(resume, key)">
          <h2 style="margin: 0.9em 0 0.3em; font-size: 0.95em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #f8fafc">
            {{ getLeftSectionTitle(key) }}
          </h2>

          <template v-if="key === 'skills'">
            <div
              v-for="g in resume.skills"
              :key="g.id"
              style="margin-bottom: 0.35em"
            >
              <div style="font-weight: 700">
                {{ g.category }}
              </div>
              <div style="color: #cbd5e1">
                {{ g.items }}
              </div>
            </div>
          </template>

          <template v-else-if="key === 'education'">
            <div
              v-for="e in resume.education"
              :key="e.id"
              style="margin-bottom: 0.45em"
            >
              <div style="font-weight: 700">
                {{ e.school }}
              </div>
              <div style="color: #cbd5e1">
                {{ [e.degree, e.field].filter(Boolean).join(", ") }}{{ e.location ? ` • ${e.location}` : "" }}
              </div>
              <div style="color: #94a3b8; font-size: 0.85em">
                {{ formatDateRange(e.startDate, e.endDate, false) }}
              </div>
              <div
                v-if="e.details"
                style="color: #cbd5e1; font-size: 0.88em"
              >
                {{ e.details }}
              </div>
            </div>
          </template>

          <template v-else-if="key === 'certifications'">
            <div
              v-for="c in resume.certifications"
              :key="c.id"
              style="margin-bottom: 0.3em"
            >
              <div style="font-weight: 700">
                {{ c.name }}
              </div>
              <div style="color: #cbd5e1; font-size: 0.88em">
                {{ c.issuer }}{{ c.date ? ` · ${c.date}` : "" }}
              </div>
            </div>
          </template>

          <template v-else-if="key === 'languages'">
            <div
              v-for="l in resume.languages"
              :key="l.id"
              style="color: #cbd5e1"
            >
              <span style="font-weight: 700; color: white">{{ l.name }}</span>{{ l.level ? ` — ${l.level}` : "" }}
            </div>
          </template>
        </section>
      </template>
    </aside>

    <!-- Right Main Content -->
    <main style="padding: 0.55in 0.55in">
      <template
        v-for="key in rightOrdered"
        :key="key"
      >
        <section v-if="hasContent(resume, key)">
          <h2
            :style="{
              margin: '0.9em 0 0.3em',
              fontSize: '1.05em',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: accent,
              borderBottom: `1px solid ${accent}`,
              paddingBottom: '2px',
            }"
          >
            {{ getRightSectionTitle(key) }}
          </h2>

          <template v-if="key === 'summary'">
            <p style="margin: 0">
              {{ resume.personal.summary }}
            </p>
          </template>

          <template v-else-if="key === 'experience'">
            <div
              v-for="e in resume.experience"
              :key="e.id"
              style="margin-bottom: 0.65em"
            >
              <div style="font-weight: 700; font-size: 1.02em">
                {{ e.role }}
              </div>
              <div style="display: flex; justify-content: space-between; gap: 0.75em; color: #475569">
                <div>{{ e.company }}{{ e.location ? ` · ${e.location}` : "" }}</div>
                <div style="white-space: nowrap">
                  {{ formatDateRange(e.startDate, e.endDate, e.current) }}
                </div>
              </div>
              <ul
                v-if="e.bullets.filter(b => b.trim()).length > 0"
                style="margin: 0.2em 0 0; padding-left: 1.15em"
              >
                <li
                  v-for="(b, i) in e.bullets.filter(b => b.trim())"
                  :key="i"
                >
                  {{ b }}
                </li>
              </ul>
            </div>
          </template>

          <template v-else-if="key === 'projects'">
            <div
              v-for="p in resume.projects"
              :key="p.id"
              style="margin-bottom: 0.4em"
            >
              <div style="display: flex; justify-content: space-between; gap: 0.75em">
                <div style="font-weight: 700">
                  {{ p.name }}
                </div>
                <div
                  v-if="p.link"
                  :style="{ color: accent }"
                >
                  {{ p.link }}
                </div>
              </div>
              <div v-if="p.description">
                {{ p.description }}
              </div>
              <ul
                v-if="p.bullets.filter(b => b.trim()).length > 0"
                style="margin: 0.2em 0 0; padding-left: 1.15em"
              >
                <li
                  v-for="(b, i) in p.bullets.filter(b => b.trim())"
                  :key="i"
                >
                  {{ b }}
                </li>
              </ul>
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

const LEFT_KEYS: SectionKey[] = ["skills", "education", "certifications", "languages"];
const RIGHT_KEYS: SectionKey[] = ["summary", "experience", "projects"];

export default defineComponent({
  name: 'TwoColumnTemplate',
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
    contacts() {
      const p = this.personal;
      return [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(
        (x) => x && x.trim(),
      );
    },
    leftOrdered() { return this.resume.sections.filter((k) => LEFT_KEYS.includes(k)); },
    rightOrdered() { return this.resume.sections.filter((k) => RIGHT_KEYS.includes(k)); }
  },
  methods: {
    hasContent,
    formatDateRange,
    getLeftSectionTitle(key: SectionKey) {
      const titles: Record<string, string> = {
        skills: "Skills",
        education: "Education",
        certifications: "Certifications",
        languages: "Languages"
      };
      return titles[key] || key;
    },
    getRightSectionTitle(key: SectionKey) {
      const titles: Record<string, string> = {
        summary: "Profile",
        experience: "Experience",
        projects: "Projects"
      };
      return titles[key] || key;
    }
  }
});
</script>
