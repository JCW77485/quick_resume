<template>
  <div
    :style="{
      fontFamily,
      fontSize: `${fontPx}pt`,
      lineHeight: 1.5,
      color: '#334155',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '11in',
      padding: '0.8in 0.9in',
      background: 'white',
    }"
  >
    <!-- Ultra-Clean Header -->
    <header style="margin-bottom: 3em;">
      <h1 :style="{ margin: 0, fontSize: '2.4em', fontWeight: 300, color: '#0f172a', letterSpacing: '0.05em' }">
        <span style="font-weight: 700;">{{ firstName }}</span> {{ lastName }}
      </h1>
      <div
        v-if="personal.title"
        :style="{ marginTop: '0.2em', fontSize: '1.1em', color: accent, fontWeight: 500, letterSpacing: '0.02em' }"
      >
        {{ personal.title }}
      </div>
      <div style="margin-top: 1.2em; display: flex; flex-wrap: wrap; gap: 0.5em 1.5em; font-size: 0.85em; border-top: 1px solid #f1f5f9; padding-top: 0.8em;">
        <div
          v-for="(c, i) in contactParts"
          :key="i"
          style="color: #64748b;"
        >
          {{ c }}
        </div>
      </div>
    </header>

    <div style="display: flex; flex-direction: column; gap: 2.5em; flex: 1;">
      <template
        v-for="key in resume.sections"
        :key="key"
      >
        <section v-if="hasContent(resume, key)">
          <div style="display: grid; grid-template-columns: 1.5in 1fr; gap: 2em;">
            <h2
              :style="{
                fontSize: '0.85em',
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                margin: 0,
                marginTop: '0.4em'
              }"
            >
              {{ getSectionTitle(key) }}
            </h2>

            <div style="display: flex; flex-direction: column; gap: 1.2em;">
              <!-- Summary -->
              <template v-if="key === 'summary'">
                <p style="margin: 0; font-size: 1.05em; line-height: 1.6;">
                  {{ personal.summary }}
                </p>
              </template>

              <!-- Experience -->
              <template v-else-if="key === 'experience'">
                <div
                  v-for="e in resume.experience"
                  :key="e.id"
                >
                  <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <div style="font-weight: 700; color: #0f172a;">
                      {{ e.role }}
                    </div>
                    <div style="font-size: 0.85em; color: #94a3b8; font-weight: 600;">
                      {{ formatDateRange(e.startDate, e.endDate, e.current) }}
                    </div>
                  </div>
                  <div style="font-size: 0.95em; color: #64748b; margin-bottom: 0.5em;">
                    {{ e.company }}
                  </div>
                  <ul
                    v-if="e.bullets.filter(b => b.trim()).length > 0"
                    style="margin: 0; padding-left: 1.1em; list-style-type: square;"
                  >
                    <li
                      v-for="(b, i) in e.bullets.filter(b => b.trim())"
                      :key="i"
                      style="margin-bottom: 0.3em; font-size: 0.95em;"
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
                >
                  <div style="font-weight: 700; color: #0f172a;">
                    {{ e.school }}
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.95em;">
                    <div>{{ [e.degree, e.field].filter(Boolean).join(", ") }}</div>
                    <div style="color: #94a3b8;">
                      {{ formatDateRange(e.startDate, e.endDate, false) }}
                    </div>
                  </div>
                </div>
              </template>

              <!-- Skills -->
              <template v-else-if="key === 'skills'">
                <div style="display: flex; flex-direction: column; gap: 0.5em;">
                  <div
                    v-for="g in resume.skills"
                    :key="g.id"
                  >
                    <span style="font-weight: 600; color: #475569; font-size: 0.9em; margin-right: 0.8em;">{{ g.category }}</span>
                    <span style="font-size: 0.95em;">{{ g.items }}</span>
                  </div>
                </div>
              </template>

              <!-- Projects -->
              <template v-else-if="key === 'projects'">
                <div
                  v-for="p in resume.projects"
                  :key="p.id"
                >
                  <div style="font-weight: 700; color: #0f172a;">
                    {{ p.name }}
                  </div>
                  <div style="font-size: 0.95em; line-height: 1.5;">
                    {{ p.description }}
                  </div>
                </div>
              </template>

              <!-- Certifications -->
              <template v-else-if="key === 'certifications'">
                <div
                  v-for="c in resume.certifications"
                  :key="c.id"
                  style="font-size: 0.95em;"
                >
                  <span style="font-weight: 600; color: #0f172a;">{{ c.name }}</span> — {{ c.issuer }}
                </div>
              </template>
            </div>
          </div>
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
  name: 'MinimalistTemplate',
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
    firstName() {
      return (this.personal.fullName || "").split(' ')[0] || "Your";
    },
    lastName() {
      return (this.personal.fullName || "").split(' ').slice(1).join(' ') || "Name";
    }
  },
  methods: {
    hasContent,
    formatDateRange,
    getSectionTitle(key: SectionKey) {
      const titles: Record<SectionKey, string> = {
        summary: "Profile",
        experience: "History",
        education: "Education",
        projects: "Projects",
        skills: "Abilities",
        certifications: "Certs",
        languages: "Languages",
      };
      return titles[key] || key;
    }
  }
});
</script>
