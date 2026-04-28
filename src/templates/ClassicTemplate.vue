<template>
  <div
    :style="{
      fontFamily,
      fontSize: `${fontPx}pt`,
      lineHeight: 1.4,
      color: '#111827',
      padding: '0.6in 0.7in',
      display: 'flex',
      flexDirection: 'column',
      gap: `${gap}em`,
    }"
  >
    <header style="text-align: center">
      <h1
        :style="{
          margin: 0,
          fontSize: '2em',
          fontWeight: 700,
          letterSpacing: '0.01em',
          color: accent,
        }"
      >
        {{ personal.fullName || "Your Name" }}
      </h1>
      <div
        v-if="personal.title"
        style="margin-top: 0.15em; color: #374151; fontSize: 1.05em"
      >
        {{ personal.title }}
      </div>
      <div style="margin-top: 0.35em">
        <div
          v-if="contactParts.length"
          class="text-center"
          style="font-size: 0.9em; color: #374151"
        >
          {{ contactParts.join("  •  ") }}
        </div>
      </div>
    </header>

    <template
      v-for="key in resume.sections"
      :key="key"
    >
      <section v-if="hasContent(resume, key)">
        <!-- Section Title -->
        <div style="margin-top: 1em; margin-bottom: 0.35em">
          <h2
            :style="{
              fontSize: '1.05em',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: 0,
              paddingBottom: '2px',
              borderBottom: `1.5px solid ${accent}`,
              color: accent,
            }"
          >
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
            style="margin-bottom: 0.7em"
          >
            <div class="flex justify-between gap-3">
              <div style="font-weight: 700">
                {{ e.role || "Role" }}{{ e.company ? ` — ${e.company}` : "" }}
              </div>
              <div style="color: #4b5563; white-space: nowrap">
                {{ formatDateRange(e.startDate, e.endDate, e.current) }}
              </div>
            </div>
            <div
              v-if="e.location"
              style="color: #4b5563; font-style: italic"
            >
              {{ e.location }}
            </div>
            <ul
              v-if="e.bullets.filter(b => b.trim()).length > 0"
              style="margin: 0.2em 0 0; padding-left: 1.15em"
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
            style="margin-bottom: 0.5em"
          >
            <div class="flex justify-between gap-3">
              <div style="font-weight: 700">
                {{ e.school || "School" }}
              </div>
              <div style="color: #4b5563; white-space: nowrap">
                {{ formatDateRange(e.startDate, e.endDate, false) }}
              </div>
            </div>
            <div style="color: #374151">
              {{ [e.degree, e.field].filter(Boolean).join(", ") }}{{ e.location ? ` • ${e.location}` : "" }}
            </div>
            <div
              v-if="e.details"
              style="color: #4b5563"
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
            style="margin-bottom: 0.5em"
          >
            <div class="flex justify-between gap-3">
              <div style="font-weight: 700">
                {{ p.name || "Project" }}
              </div>
              <div
                v-if="p.link"
                style="color: #4b5563"
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
            class="flex justify-between gap-3"
          >
            <div>
              <span style="font-weight: 700">{{ c.name }}</span>{{ c.issuer ? ` — ${c.issuer}` : "" }}
            </div>
            <div style="color: #4b5563">
              {{ c.date }}
            </div>
          </div>
        </template>

        <!-- Languages -->
        <template v-else-if="key === 'languages'">
          <div style="display: flex; flex-direction: column; gap: 8px">
            <div
              v-for="(l, i) in resume.languages"
              :key="i"
              style="display: flex; align-items: center; gap: 10px"
            >
              <div style="min-width: 100px">
                {{ l.name }}
              </div>
              <div
                style="width: 120px; height: 6px; background: #e5e7eb; border-radius: 4px"
              >
                <div
                  :style="{
                    width: `${levelMap[l.level] || 0}%`,
                    height: '100%',
                    background: accent || '#4caf50',
                    borderRadius: '4px',
                  }"
                />
              </div>
              <div style="font-size: 12px; color: #666">
                {{ l.level }}
              </div>
            </div>
          </div>
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
  name: 'ClassicTemplate',
  props: {
    resume: { type: Object as () => Resume, required: true }
  },
  data() {
    return {
      levelMap: {
        Beginner: 20,
        Intermediate: 40,
        Advanced: 60,
        Fluent: 80,
        Native: 100,
      } as Record<string, number>
    };
  },
  computed: {
    personal() { return this.resume.personal; },
    design() { return this.resume.design; },
    accent() { return this.design.accentColor; },
    fontPx() { return FONT_SIZE_PX[this.design.fontSize]; },
    fontFamily() {
      return this.design.fontFamily === "serif"
        ? "var(--font-serif)"
        : "var(--font-sans)";
    },
    gap() { return SPACING_GAP_REM[this.design.spacing]; },
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
