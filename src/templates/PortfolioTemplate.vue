<template>
  <div
    :style="{ overflowWrap: 'anywhere',
              fontFamily,
              fontSize: `${fontPx}pt`,
              lineHeight: 1.5,
              color: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '11in',
              background: '#f8fafc',
    }"
  >
    <!-- Visual Impact Header -->
    <header :style="{ overflowWrap: 'anywhere', background: '#0f172a', color: 'white', padding: '0.6in 0.7in', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
      <div style="flex: 1;">
        <h1 :style="{ overflowWrap: 'anywhere', margin: 0, fontSize: '3em', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }">
          {{ personal.fullName || "Your Name" }}
        </h1>
        <div
          v-if="personal.title"
          :style="{ overflowWrap: 'anywhere', marginTop: '0.4em', fontSize: '1.4em', fontWeight: 600, color: accent }"
        >
          {{ personal.title }}
        </div>
        <div style="margin-top: 1.5em; display: flex; flex-wrap: wrap; gap: 1em 2em; font-size: 0.9em; opacity: 0.8;">
          <div
            v-for="(c, i) in contactParts"
            :key="i"
          >
            {{ c }}
          </div>
        </div>
      </div>
      <div
        v-if="personal.avatar"
        style="margin-left: 2em; flex-shrink: 0;"
      >
        <img
          :src="personal.avatar"
          style="width: 1.6in; height: 1.6in; border-radius: 50%; border: 6px solid #1e293b; object-fit: cover;"
        >
      </div>
    </header>

    <div style="padding: 0.5in 0.7in; display: grid; grid-template-columns: 1fr 2.5in; gap: 3em; flex: 1;">
      <!-- Main Content Column -->
      <div style="display: flex; flex-direction: column; gap: 2.5em;">
        <template
          v-for="key in mainKeys"
          :key="key"
        >
          <section v-if="hasContent(resume, key)">
            <h2 :style="{ overflowWrap: 'anywhere', fontSize: '1.4em', fontWeight: 800, color: '#0f172a', marginBottom: '1em', borderLeft: `6px solid ${accent}`, paddingLeft: '0.5em' }">
              {{ getSectionTitle(key) }}
            </h2>

            <template v-if="key === 'summary'">
              <p style="margin: 0; font-size: 1.1em; color: #334155; line-height: 1.7;">
                {{ personal.summary }}
              </p>
            </template>

            <template v-else-if="key === 'experience'">
              <div
                v-for="e in resume.experience"
                :key="e.id"
                style="margin-bottom: 2em;"
              >
                <div style="font-weight: 800; font-size: 1.15em; color: #0f172a;">
                  {{ e.role }}
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: 600; color: #64748b; margin: 0.2em 0 0.8em;">
                  <div>{{ e.company }}</div>
                  <div>{{ formatDateRange(e.startDate, e.endDate, e.current) }}</div>
                </div>
                <ul
                  v-if="e.bullets.filter(b => b.trim()).length > 0"
                  style="margin: 0; padding-left: 1.2em; list-style-type: disc;"
                >
                  <li
                    v-for="(b, i) in e.bullets.filter(b => b.trim())"
                    :key="i"
                    style="margin-bottom: 0.4em; color: #334155;"
                  >
                    {{ b }}
                  </li>
                </ul>
              </div>
            </template>

            <template v-else-if="key === 'projects'">
              <div style="display: grid; gap: 1.5em;">
                <div
                  v-for="p in resume.projects"
                  :key="p.id"
                  style="background: white; border: 1px solid #e2e8f0; padding: 1.2em; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);"
                >
                  <div style="font-weight: 800; color: #0f172a; font-size: 1.1em;">
                    {{ p.name }}
                  </div>
                  <div
                    v-if="p.link"
                    :style="{ overflowWrap: 'anywhere', color: accent, fontSize: '0.85em', margin: '4px 0 8px', fontWeight: 600 }"
                  >
                    {{ p.link }}
                  </div>
                  <div style="color: #475569; font-size: 0.95em;">
                    {{ p.description }}
                  </div>
                </div>
              </div>
            </template>
          </section>
        </template>
      </div>

      <!-- Sidebar Column -->
      <div style="display: flex; flex-direction: column; gap: 2.5em;">
        <template
          v-for="key in sidebarKeys"
          :key="key"
        >
          <section v-if="hasContent(resume, key)">
            <h2 :style="{ overflowWrap: 'anywhere', fontSize: '1.1em', fontWeight: 800, color: '#0f172a', marginBottom: '1em', textTransform: 'uppercase', letterSpacing: '0.05em' }">
              {{ getSectionTitle(key) }}
            </h2>

            <template v-if="key === 'skills'">
              <div style="display: flex; flex-direction: column; gap: 1em;">
                <div
                  v-for="g in resume.skills"
                  :key="g.id"
                >
                  <div :style="{ overflowWrap: 'anywhere', color: accent, fontWeight: 700, fontSize: '0.8em', textTransform: 'uppercase', marginBottom: '4px' }">
                    {{ g.category }}
                  </div>
                  <div style="font-weight: 600; color: #334155; font-size: 0.95em;">
                    {{ g.items }}
                  </div>
                </div>
              </div>
            </template>

            <template v-else-if="key === 'education'">
              <div
                v-for="e in resume.education"
                :key="e.id"
                style="margin-bottom: 1em;"
              >
                <div style="font-weight: 700; color: #0f172a; font-size: 0.95em;">
                  {{ e.school }}
                </div>
                <div style="font-size: 0.85em; color: #64748b; margin: 2px 0;">
                  {{ [e.degree, e.field].filter(Boolean).join(", ") }}
                </div>
                <div style="font-size: 0.85em; color: #94a3b8; font-weight: 600;">
                  {{ formatDateRange(e.startDate, e.endDate, false) }}
                </div>
              </div>
            </template>

            <template v-else-if="key === 'languages'">
              <div style="display: grid; gap: 8px;">
                <div
                  v-for="l in resume.languages"
                  :key="l.id"
                  style="display: flex; justify-content: space-between; font-size: 0.95em;"
                >
                  <span style="font-weight: 700;">{{ l.name }}</span>
                  <span style="color: #64748b;">{{ l.level }}</span>
                </div>
              </div>
            </template>
          </section>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Resume, SectionKey } from '../types/resume';
import { FONT_SIZE_PX, formatDateRange, hasContent } from './shared';

export default defineComponent({
  name: 'PortfolioTemplate',
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
    mainKeys(): SectionKey[] {
      return ["summary", "experience", "projects"];
    },
    sidebarKeys(): SectionKey[] {
      return ["skills", "education", "languages", "certifications"];
    }
  },
  methods: {
    hasContent,
    formatDateRange,
    getSectionTitle(key: SectionKey) {
      const titles: Record<SectionKey, string> = {
        summary: "Profile",
        experience: "Career Path",
        education: "Learning",
        projects: "Key Deliverables",
        skills: "Skillset",
        certifications: "Certs",
        languages: "Languages",
      };
      return titles[key] || key;
    }
  }
});
</script>
