<template>
  <div
    :style="{
      fontFamily,
      fontSize: `${fontPx}pt`,
      lineHeight: 1.5,
      color: '#1e293b',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '11in',
      background: 'white',
    }"
  >
    <!-- Header with Accent Background -->
    <header
      :style="{
        background: accent,
        color: 'white',
        padding: '0.6in 0.7in',
        display: 'flex',
        alignItems: 'center',
        gap: '2em',
      }"
    >
      <div
        v-if="personal.avatar"
        style="flex-shrink: 0;"
      >
        <img
          :src="personal.avatar"
          style="width: 1.5in; height: 1.5in; border-radius: 50%; border: 4px solid white; object-fit: cover; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"
        >
      </div>
      <div style="flex: 1;">
        <h1 style="margin: 0; font-size: 2.8em; font-weight: 800; letter-spacing: -0.02em; line-height: 1.1;">
          {{ personal.fullName || "Your Name" }}
        </h1>
        <div
          v-if="personal.title"
          style="margin-top: 0.2em; font-size: 1.3em; font-weight: 500; opacity: 0.9;"
        >
          {{ personal.title }}
        </div>
        <div style="margin-top: 1em; display: flex; flex-wrap: wrap; gap: 0.5em 1.2em; font-size: 0.9em; opacity: 0.85;">
          <div
            v-for="(c, i) in contactParts"
            :key="i"
            style="display: flex; align-items: center; gap: 0.4em;"
          >
            {{ c }}
          </div>
        </div>
      </div>
    </header>

    <div style="padding: 0.4in 0.7in; display: flex; flex-direction: column; gap: 1.5em; flex: 1;">
      <template
        v-for="key in resume.sections"
        :key="key"
      >
        <section v-if="hasContent(resume, key)">
          <!-- Section Title with Accent Underline -->
          <div style="margin-bottom: 0.6em; border-bottom: 2px solid #e2e8f0; display: flex; align-items: flex-end; justify-content: space-between;">
            <h2
              :style="{
                fontSize: '1.2em',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: 0,
                paddingBottom: '0.3em',
                color: accent,
                borderBottom: `2px solid ${accent}`,
                marginBottom: '-2px'
              }"
            >
              {{ getSectionTitle(key) }}
            </h2>
          </div>

          <!-- Summary -->
          <template v-if="key === 'summary'">
            <p style="margin: 0; font-size: 1.05em; color: #334155;">
              {{ personal.summary }}
            </p>
          </template>

          <!-- Experience -->
          <template v-else-if="key === 'experience'">
            <div
              v-for="e in resume.experience"
              :key="e.id"
              style="margin-bottom: 1em;"
            >
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <div style="font-weight: 700; font-size: 1.1em; color: #0f172a;">
                  {{ e.role }}
                </div>
                <div :style="{ color: accent, fontWeight: 600, fontSize: '0.9em' }">
                  {{ formatDateRange(e.startDate, e.endDate, e.current) }}
                </div>
              </div>
              <div style="font-weight: 600; color: #475569; margin-bottom: 0.3em;">
                {{ e.company }}{{ e.location ? ` • ${e.location}` : "" }}
              </div>
              <ul
                v-if="e.bullets.filter(b => b.trim()).length > 0"
                style="margin: 0; padding-left: 1.2em; list-style-type: square;"
              >
                <li
                  v-for="(b, i) in e.bullets.filter(b => b.trim())"
                  :key="i"
                  style="margin-bottom: 0.2em;"
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
              style="margin-bottom: 0.8em;"
            >
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <div style="font-weight: 700; color: #0f172a;">
                  {{ e.school }}
                </div>
                <div style="color: #64748b; font-size: 0.9em;">
                  {{ formatDateRange(e.startDate, e.endDate, false) }}
                </div>
              </div>
              <div style="color: #475569;">
                {{ [e.degree, e.field].filter(Boolean).join(", ") }}{{ e.location ? ` • ${e.location}` : "" }}
              </div>
              <div
                v-if="e.details"
                style="font-style: italic; font-size: 0.95em; color: #64748b;"
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
              style="margin-bottom: 0.8em;"
            >
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <div style="font-weight: 700; color: #0f172a;">
                  {{ p.name }}
                </div>
                <div
                  v-if="p.link"
                  :style="{ color: accent, fontSize: '0.85em', fontWeight: 600 }"
                >
                  {{ p.link }}
                </div>
              </div>
              <div style="margin-top: 0.1em; color: #334155;">
                {{ p.description }}
              </div>
              <ul
                v-if="p.bullets.filter(b => b.trim()).length > 0"
                style="margin: 0.2em 0 0; padding-left: 1.2em;"
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
            <div style="display: flex; flex-wrap: wrap; gap: 0.8em 1.5em;">
              <div
                v-for="g in resume.skills"
                :key="g.id"
                style="min-width: 200px; flex: 1;"
              >
                <div :style="{ color: accent, fontWeight: 700, fontSize: '0.85em', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2em' }">
                  {{ g.category }}
                </div>
                <div style="color: #334155; font-weight: 500;">
                  {{ g.items }}
                </div>
              </div>
            </div>
          </template>

          <!-- Certifications -->
          <template v-else-if="key === 'certifications'">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5em 1.5em;">
              <div
                v-for="c in resume.certifications"
                :key="c.id"
                style="display: flex; justify-content: space-between; gap: 1em;"
              >
                <div style="font-weight: 600; color: #334155;">
                  {{ c.name }}
                </div>
                <div style="color: #64748b; font-size: 0.85em; white-space: nowrap;">
                  {{ c.date }}
                </div>
              </div>
            </div>
          </template>

          <!-- Languages -->
          <template v-else-if="key === 'languages'">
            <div style="display: flex; flex-wrap: wrap; gap: 1em 2em;">
              <div
                v-for="l in resume.languages"
                :key="l.id"
                style="display: flex; align-items: center; gap: 0.6em;"
              >
                <span style="font-weight: 700; color: #0f172a;">{{ l.name }}</span>
                <span :style="{ background: `${accent}20`, color: accent, padding: '1px 8px', borderRadius: '12px', fontSize: '0.75em', fontWeight: 700, textTransform: 'uppercase' }">
                  {{ l.level }}
                </span>
              </div>
            </div>
          </template>
        </section>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Resume, SectionKey } from '../types/resume';
import { FONT_SIZE_PX, formatDateRange, hasContent } from './shared';

export default defineComponent({
  name: 'PremiumTemplate',
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
    }
  },
  methods: {
    hasContent,
    formatDateRange,
    getSectionTitle(key: SectionKey) {
      const titles: Record<SectionKey, string> = {
        summary: "Profile",
        experience: "Professional Experience",
        education: "Education",
        projects: "Key Projects",
        skills: "Expertise",
        certifications: "Certifications",
        languages: "Languages",
      };
      return titles[key] || key;
    }
  }
});
</script>
