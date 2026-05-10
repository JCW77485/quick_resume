<template>
  <div
    :style="{ overflowWrap: 'anywhere',
              fontFamily,
              fontSize: `${fontPx}pt`,
              lineHeight: 1.35,
              color: '#0f172a',
              padding: '0.55in 0.65in',
    }"
  >
    <header
      style="display: flex; justify-content: space-between; align-items: flex-end; gap: 1em; border-bottom: 2px solid; padding-bottom: 0.35em"
      :style="{ overflowWrap: 'anywhere', borderBottomColor: accent }"
    >
      <div>
        <h1 style="margin: 0; font-size: 1.7em; font-weight: 700">
          {{ personal.fullName || "Your Name" }}
        </h1>
        <div
          v-if="personal.title"
          style="color: #475569"
        >
          {{ personal.title }}
        </div>
      </div>
      <div
        style="font-size: 0.85em; color: #475569; text-align: right; display: flex; flex-direction: column"
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
        <h2
          :style="{ overflowWrap: 'anywhere',
                    margin: '0.6em 0 0.2em',
                    fontSize: '1em',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: accent,
          }"
        >
          {{ getSectionTitle(key) }}
        </h2>

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
            style="margin-bottom: 0.45em"
          >
            <div style="display: flex; justify-content: space-between; gap: 0.75em">
              <div>
                <span style="font-weight: 700">{{ e.role }}</span>
                {{ e.company ? `, ${e.company}` : "" }}
                {{ e.location ? ` — ${e.location}` : "" }}
              </div>
              <div style="white-space: nowrap; color: #475569">
                {{ formatDateRange(e.startDate, e.endDate, e.current) }}
              </div>
            </div>
            <ul
              v-if="e.bullets.filter(b => b.trim()).length > 0"
              style="margin: 0.1em 0 0; padding-left: 1em"
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

        <!-- Education -->
        <template v-else-if="key === 'education'">
          <div
            v-for="e in resume.education"
            :key="e.id"
            style="display: flex; justify-content: space-between; gap: 0.75em"
          >
            <div>
              <span style="font-weight: 700">{{ e.school }}</span>
              — {{ [e.degree, e.field].filter(Boolean).join(", ") }}
              {{ e.location ? ` • ${e.location}` : "" }}
              {{ e.details ? `. ${e.details}` : "" }}
            </div>
            <div style="white-space: nowrap; color: #475569">
              {{ formatDateRange(e.startDate, e.endDate, false) }}
            </div>
          </div>
        </template>

        <!-- Projects -->
        <template v-else-if="key === 'projects'">
          <div
            v-for="p in resume.projects"
            :key="p.id"
          >
            <span style="font-weight: 700">{{ p.name }}</span>
            {{ p.link ? ` — ${p.link}` : "" }}
            {{ p.description ? `. ${p.description}` : "" }}
          </div>
        </template>

        <!-- Skills -->
        <template v-else-if="key === 'skills'">
          <div
            v-for="g in resume.skills"
            :key="g.id"
          >
            <span style="font-weight: 700">{{ g.category }}:</span> {{ g.items }}
          </div>
        </template>

        <!-- Certifications -->
        <template v-else-if="key === 'certifications'">
          <div
            v-for="c in resume.certifications"
            :key="c.id"
          >
            <span style="font-weight: 700">{{ c.name }}</span>
            {{ c.issuer ? `, ${c.issuer}` : "" }}
            {{ c.date ? ` (${c.date})` : "" }}
          </div>
        </template>

        <!-- Languages -->
        <template v-else-if="key === 'languages'">
          <div>
            {{ resume.languages.map(l => `${l.name}${l.level ? ` (${l.level})` : ""}`).join(", ") }}
          </div>
        </template>
      </section>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Resume, SectionKey } from '../types/resume';
import { FONT_SIZE_PX, formatDateRange, hasContent } from './shared';

export default defineComponent({
  name: 'CompactTemplate',
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
    }
  },
  methods: {
    hasContent,
    formatDateRange,
    getSectionTitle(key: SectionKey) {
      const titles: Record<SectionKey, string> = {
        summary: "Summary",
        experience: "Experience",
        education: "Education",
        projects: "Projects",
        skills: "Skills",
        certifications: "Certifications",
        languages: "Languages",
      };
      return titles[key];
    }
  }
});
</script>
