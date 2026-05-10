<template>
  <div
    :style="{ overflowWrap: 'anywhere',
              fontFamily,
              fontSize: `${fontPx}pt`,
              lineHeight: 1.4,
              color: '#1e293b',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '11in',
              padding: '0.6in 0.7in',
              background: 'white',
    }"
  >
    <!-- Technical Header -->
    <header style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0f172a; padding-bottom: 1em; margin-bottom: 1.5em;">
      <div>
        <h1 :style="{ overflowWrap: 'anywhere', margin: 0, fontSize: '2.4em', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }">
          {{ personal.fullName || "Your Name" }}
        </h1>
        <div
          v-if="personal.title"
          :style="{ overflowWrap: 'anywhere', marginTop: '0.1em', fontSize: '1.2em', fontWeight: 600, color: accent }"
        >
          {{ personal.title }}
        </div>
      </div>
      <div style="text-align: right; font-size: 0.85em; color: #475569; display: flex; flex-direction: column; gap: 2px;">
        <div
          v-for="(c, i) in contactParts"
          :key="i"
        >
          {{ c }}
        </div>
      </div>
    </header>

    <div style="display: flex; flex-direction: column; gap: 1.5em; flex: 1;">
      <!-- Special Technical Skills Section -->
      <section v-if="hasContent(resume, 'skills')">
        <h2 :style="{ overflowWrap: 'anywhere', fontSize: '1.1em', fontWeight: 800, color: 'white', background: '#0f172a', padding: '4px 12px', display: 'inline-block', marginBottom: '0.8em', borderRadius: '2px' }">
          TECHNICAL SKILLS
        </h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.8em 2em;">
          <div
            v-for="g in resume.skills"
            :key="g.id"
            style="font-size: 0.95em;"
          >
            <span style="font-weight: 700; color: #334155;">{{ g.category }}:</span> {{ g.items }}
          </div>
        </div>
      </section>

      <template
        v-for="key in otherKeys"
        :key="key"
      >
        <section v-if="hasContent(resume, key)">
          <h2 :style="{ overflowWrap: 'anywhere', fontSize: '1.15em', fontWeight: 800, color: '#0f172a', borderBottom: `2px solid #e2e8f0`, paddingBottom: '2px', marginBottom: '0.8em', textTransform: 'uppercase' }">
            {{ getSectionTitle(key) }}
          </h2>

          <template v-if="key === 'summary'">
            <p style="margin: 0; line-height: 1.5;">
              {{ personal.summary }}
            </p>
          </template>

          <template v-else-if="key === 'experience'">
            <div
              v-for="e in resume.experience"
              :key="e.id"
              style="margin-bottom: 1.2em;"
            >
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <div style="font-weight: 700; font-size: 1.1em;">
                  {{ e.company }}
                </div>
                <div style="font-weight: 600; color: #64748b;">
                  {{ formatDateRange(e.startDate, e.endDate, e.current) }}
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; font-style: italic; margin-bottom: 0.4em;">
                <div style="font-weight: 600; color: #475569;">
                  {{ e.role }}
                </div>
                <div style="color: #64748b; font-size: 0.9em;">
                  {{ e.location }}
                </div>
              </div>
              <ul
                v-if="e.bullets.filter(b => b.trim()).length > 0"
                style="margin: 0; padding-left: 1.1em; list-style-type: disc;"
              >
                <li
                  v-for="(b, i) in e.bullets.filter(b => b.trim())"
                  :key="i"
                  style="margin-bottom: 0.2em; font-size: 0.95em;"
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
              style="margin-bottom: 1em;"
            >
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <div style="font-weight: 700; font-size: 1.05em;">
                  {{ p.name }}
                </div>
                <div
                  v-if="p.link"
                  :style="{ overflowWrap: 'anywhere', color: accent, fontSize: '0.85em', fontWeight: 600 }"
                >
                  {{ p.link }}
                </div>
              </div>
              <div style="margin-top: 0.1em; font-size: 0.95em;">
                {{ p.description }}
              </div>
              <ul
                v-if="p.bullets.filter(b => b.trim()).length > 0"
                style="margin: 4px 0 0; padding-left: 1.1em;"
              >
                <li
                  v-for="(b, i) in p.bullets.filter(b => b.trim())"
                  :key="i"
                  style="font-size: 0.95em;"
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
              style="margin-bottom: 0.8em;"
            >
              <div style="display: flex; justify-content: space-between; font-weight: 700;">
                <div>{{ e.school }}</div>
                <div style="color: #64748b;">
                  {{ formatDateRange(e.startDate, e.endDate, false) }}
                </div>
              </div>
              <div>{{ [e.degree, e.field].filter(Boolean).join(", ") }}</div>
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
  name: 'TechnicalTemplate',
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
    otherKeys(): SectionKey[] {
      return this.resume.sections.filter(k => k !== 'skills');
    }
  },
  methods: {
    hasContent,
    formatDateRange,
    getSectionTitle(key: SectionKey) {
      const titles: Record<SectionKey, string> = {
        summary: "Summary",
        experience: "Professional Experience",
        education: "Education",
        projects: "Projects",
        certifications: "Certifications",
        languages: "Languages",
      };
      return titles[key] || key;
    }
  }
});
</script>
