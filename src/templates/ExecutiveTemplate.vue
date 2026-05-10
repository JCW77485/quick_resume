<template>
  <div
    :style="{ overflowWrap: 'anywhere',
              fontFamily,
              fontSize: `${fontPx}pt`,
              lineHeight: 1.6,
              color: '#1e293b',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '11in',
              padding: '0.7in 0.8in',
              background: 'white',
    }"
  >
    <!-- Elegant Centered Header -->
    <header style="text-align: center; border-bottom: 2px solid #334155; padding-bottom: 1.5em; margin-bottom: 1.5em;">
      <h1 :style="{ overflowWrap: 'anywhere', margin: 0, fontSize: '2.5em', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }">
        {{ personal.fullName || "Your Name" }}
      </h1>
      <div
        v-if="personal.title"
        :style="{ overflowWrap: 'anywhere', marginTop: '0.2em', fontSize: '1.2em', fontWeight: 600, color: accent, textTransform: 'uppercase', letterSpacing: '0.05em' }"
      >
        {{ personal.title }}
      </div>
      <div style="margin-top: 0.8em; display: flex; justify-content: center; flex-wrap: wrap; gap: 1em; font-size: 0.9em; color: #475569;">
        <div
          v-for="(c, i) in contactParts"
          :key="i"
          style="display: flex; align-items: center; gap: 0.4em;"
        >
          <span v-if="i > 0">|</span> {{ c }}
        </div>
      </div>
    </header>

    <div style="display: flex; flex-direction: column; gap: 2em; flex: 1;">
      <template
        v-for="key in resume.sections"
        :key="key"
      >
        <section v-if="hasContent(resume, key)">
          <!-- Section Title with Serif Accent -->
          <h2
            :style="{ overflowWrap: 'anywhere',
                      fontSize: '1.3em',
                      fontWeight: 700,
                      color: '#0f172a',
                      borderLeft: `4px solid ${accent}`,
                      paddingLeft: '0.6em',
                      marginBottom: '0.8em',
                      fontFamily: 'var(--font-serif)'
            }"
          >
            {{ getSectionTitle(key) }}
          </h2>

          <!-- Summary -->
          <template v-if="key === 'summary'">
            <p style="margin: 0; font-size: 1.1em; color: #334155; font-style: italic;">
              {{ personal.summary }}
            </p>
          </template>

          <!-- Experience -->
          <template v-else-if="key === 'experience'">
            <div
              v-for="e in resume.experience"
              :key="e.id"
              style="margin-bottom: 1.2em;"
            >
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <div style="font-weight: 700; font-size: 1.15em; color: #0f172a;">
                  {{ e.role }}
                </div>
                <div style="font-weight: 600; color: #64748b;">
                  {{ formatDateRange(e.startDate, e.endDate, e.current) }}
                </div>
              </div>
              <div style="font-weight: 700; color: #475569; margin-bottom: 0.4em; text-transform: uppercase; font-size: 0.9em;">
                {{ e.company }}{{ e.location ? ` | ${e.location}` : "" }}
              </div>
              <ul
                v-if="e.bullets.filter(b => b.trim()).length > 0"
                style="margin: 0; padding-left: 1.2em; list-style-type: disc;"
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

          <!-- Education -->
          <template v-else-if="key === 'education'">
            <div
              v-for="e in resume.education"
              :key="e.id"
              style="margin-bottom: 1em;"
            >
              <div style="display: flex; justify-content: space-between;">
                <div style="font-weight: 700; color: #0f172a;">
                  {{ e.school }}
                </div>
                <div style="color: #64748b; font-weight: 600;">
                  {{ formatDateRange(e.startDate, e.endDate, false) }}
                </div>
              </div>
              <div style="color: #475569; font-weight: 500;">
                {{ [e.degree, e.field].filter(Boolean).join(", ") }}{{ e.location ? ` • ${e.location}` : "" }}
              </div>
            </div>
          </template>

          <!-- Skills -->
          <template v-else-if="key === 'skills'">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1em;">
              <div
                v-for="g in resume.skills"
                :key="g.id"
              >
                <span style="font-weight: 700; color: #0f172a; text-transform: uppercase; font-size: 0.85em;">{{ g.category }}:</span>
                <span style="color: #334155; margin-left: 0.5em;">{{ g.items }}</span>
              </div>
            </div>
          </template>

          <!-- Projects -->
          <template v-else-if="key === 'projects'">
            <div
              v-for="p in resume.projects"
              :key="p.id"
              style="margin-bottom: 1em;"
            >
              <div style="font-weight: 700; color: #0f172a; font-size: 1.1em;">
                {{ p.name }}
              </div>
              <div style="color: #334155;">
                {{ p.description }}
              </div>
            </div>
          </template>

          <!-- Languages -->
          <template v-else-if="key === 'languages'">
            <div style="display: flex; gap: 2em; flex-wrap: wrap;">
              <div
                v-for="l in resume.languages"
                :key="l.id"
              >
                <span style="font-weight: 700;">{{ l.name }}</span> — {{ l.level }}
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
  name: 'ExecutiveTemplate',
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
        summary: "Executive Summary",
        experience: "Professional Experience",
        education: "Education",
        projects: "Leadership Projects",
        skills: "Core Competencies",
        certifications: "Certifications",
        languages: "Languages",
      };
      return titles[key] || key;
    }
  }
});
</script>
