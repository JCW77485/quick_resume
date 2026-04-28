<template>
  <div
    :style="{
      fontFamily,
      fontSize: `${fontPx}pt`,
      lineHeight: 1.4,
      color: '#0f172a',
      padding: '0.55in 0.7in',
      display: 'flex',
      flexDirection: 'column',
      gap: `${gap}em`,
    }"
  >
    <header :style="{ borderLeft: `5px solid ${accent}`, paddingLeft: '0.75em' }">
      <h1
        style="margin: 0; font-size: 2.1em; font-weight: 800; letter-spacing: -0.01em"
      >
        {{ personal.fullName || "Your Name" }}
      </h1>
      <div
        v-if="personal.title"
        :style="{ color: accent, fontWeight: 600, marginTop: '0.1em' }"
      >
        {{ personal.title }}
      </div>
      <div
        v-if="contacts.length > 0"
        style="margin-top: 0.3em; color: #475569; font-size: 0.92em; display: flex; flex-wrap: wrap; gap: 0.6em 1em"
      >
        <span
          v-for="(c, i) in contacts"
          :key="i"
        >{{ c }}</span>
      </div>
    </header>

    <template
      v-for="key in resume.sections"
      :key="key"
    >
      <section v-if="hasContent(resume, key)">
        <!-- Section Heading -->
        <div style="display: flex; align-items: center; gap: 0.5em; margin-top: 0.9em; margin-bottom: 0.3em">
          <div :style="{ width: '6px', height: '1em', background: accent, borderRadius: '2px' }" />
          <h2 style="margin: 0; font-size: 1.05em; font-weight: 700; color: #0f172a">
            {{ getSectionTitle(key) }}
          </h2>
        </div>

        <!-- Summary -->
        <template v-if="key === 'summary'">
          <p style="margin: 0">
            {{ resume.personal.summary }}
          </p>
        </template>

        <!-- Experience -->
        <template v-else-if="key === 'experience'">
          <div
            v-for="e in resume.experience"
            :key="e.id"
            style="margin-bottom: 0.65em"
          >
            <div style="font-weight: 700; font-size: 1.02em">
              {{ e.role || "Role" }}
            </div>
            <div style="display: flex; justify-content: space-between; gap: 0.75em; color: #475569">
              <div>{{ e.company }}{{ e.location ? ` · ${e.location}` : "" }}</div>
              <div style="white-space: nowrap">
                {{ formatDateRange(e.startDate, e.endDate, e.current) }}
              </div>
            </div>
            <ul
              v-if="e.bullets.filter(b => b.trim()).length > 0"
              style="margin: 0.25em 0 0; padding-left: 1.15em"
            >
              <li
                v-for="(b, i) in e.bullets.filter(b => b.trim())"
                :key="i"
                style="margin-bottom: 0.1em"
              >
                {{ b }}
              </li>
            </ul>
          </div>
        </template>

        <!-- Education -->
        <template v-else-if="key === 'education'">
          <div
            v-for="e in resume.education"
            :key="e.id"
            style="margin-bottom: 0.45em"
          >
            <div style="font-weight: 700">
              {{ e.school || "School" }}
            </div>
            <div style="display: flex; justify-content: space-between; gap: 0.75em; color: #475569">
              <div>
                {{ [e.degree, e.field].filter(Boolean).join(", ") }}{{ e.location ? ` · ${e.location}` : "" }}
              </div>
              <div style="white-space: nowrap">
                {{ formatDateRange(e.startDate, e.endDate, false) }}
              </div>
            </div>
            <div
              v-if="e.details"
              style="color: #475569"
            >
              {{ e.details }}
            </div>
          </div>
        </template>

        <!-- Projects -->
        <template v-else-if="key === 'projects'">
          <div
            v-for="p in resume.projects"
            :key="p.id"
            style="margin-bottom: 0.45em"
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

        <!-- Skills -->
        <template v-else-if="key === 'skills'">
          <div style="display: grid; grid-template-columns: max-content 1fr; column-gap: 0.8em; row-gap: 0.2em">
            <template
              v-for="g in resume.skills"
              :key="g.id"
            >
              <div style="font-weight: 700; color: #334155">
                {{ g.category }}
              </div>
              <div>{{ g.items }}</div>
            </template>
          </div>
        </template>

        <!-- Certifications -->
        <template v-else-if="key === 'certifications'">
          <div
            v-for="c in resume.certifications"
            :key="c.id"
            style="display: flex; justify-content: space-between; gap: 0.75em"
          >
            <div><span style="font-weight: 700">{{ c.name }}</span>{{ c.issuer ? ` — ${c.issuer}` : "" }}</div>
            <div style="color: #475569">
              {{ c.date }}
            </div>
          </div>
        </template>

        <!-- Languages -->
        <template v-else-if="key === 'languages'">
          <div>{{ resume.languages.map(l => `${l.name}${l.level ? ` (${l.level})` : ""}`).join("  •  ") }}</div>
        </template>
      </section>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Resume, SectionKey } from '../types/resume';
import { FONT_SIZE_PX, SPACING_GAP_REM, formatDateRange, hasContent } from './shared';

export default defineComponent({
  name: 'ModernTemplate',
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
    gap() { return SPACING_GAP_REM[this.design.spacing]; },
    contacts() {
      const p = this.personal;
      return [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(
        (x) => x && x.trim(),
      );
    }
  },
  methods: {
    hasContent,
    formatDateRange,
    getSectionTitle(key: SectionKey) {
      const titles: Record<SectionKey, string> = {
        summary: "About",
        experience: "Experience",
        education: "Education",
        projects: "Projects",
        skills: "Skills",
        certifications: "Certifications",
        languages: "Languages",
      };
      return titles[key] || key;
    }
  }
});
</script>
