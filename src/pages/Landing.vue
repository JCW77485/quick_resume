<template>
  <div class="flex min-h-full flex-col bg-slate-50">
    <Navbar />
    <main class="flex-1">
      <!-- Hero -->
      <section class="bg-gradient-to-b from-white to-slate-50">
        <div class="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div class="flex flex-col justify-center">
            <div class="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              <Sparkles :size="14" /> Free. No login required.
            </div>
            <h1 class="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Build a resume that gets you <span class="text-brand-600">hired</span>.
            </h1>
            <p class="mt-4 max-w-xl text-lg text-slate-600">
              Pick a template, fill in your details, and watch your resume come together in
              real time. Download a clean, ATS-friendly PDF in minutes.
            </p>
            <div class="mt-6 flex flex-wrap items-center gap-3">
              <router-link
                to="/builder"
                class="inline-flex items-center gap-2 rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
              >
                Create my resume <ArrowRight :size="16" />
              </router-link>
              <router-link
                to="/templates"
                class="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Browse templates
              </router-link>
            </div>
            <div class="mt-6 flex flex-wrap gap-6 text-sm text-slate-500">
              <div class="flex items-center gap-2">
                <ShieldCheck
                  :size="16"
                  class="text-emerald-600"
                /> ATS-friendly layouts
              </div>
              <div class="flex items-center gap-2">
                <MousePointerClick
                  :size="16"
                  class="text-brand-600"
                /> Edit with a live
                preview
              </div>
              <div class="flex items-center gap-2">
                <Download
                  :size="16"
                  class="text-slate-700"
                /> Export to PDF
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="pointer-events-none absolute -left-6 top-8 hidden md:block">
              <div class="w-56 rotate-[-6deg] rounded-lg border border-slate-200 bg-white shadow-lg">
                <TemplateThumb template-id="modern" />
              </div>
            </div>
            <div class="pointer-events-none absolute -right-4 bottom-6 hidden md:block">
              <div class="w-56 rotate-[6deg] rounded-lg border border-slate-200 bg-white shadow-lg">
                <TemplateThumb template-id="twocol" />
              </div>
            </div>
            <div class="mx-auto w-64 rounded-lg border border-slate-200 bg-white shadow-xl md:w-72">
              <TemplateThumb template-id="classic" />
            </div>
          </div>
        </div>
      </section>

      <!-- Templates -->
      <section class="mx-auto max-w-6xl px-4 py-14">
        <div class="mb-8 flex items-end justify-between">
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Pick a template, make it yours
            </h2>
            <p class="mt-2 text-slate-600">
              Four professional layouts, all customizable — colors, fonts, and spacing.
            </p>
          </div>
          <router-link
            to="/templates"
            class="hidden text-sm font-medium text-brand-700 hover:underline md:inline-flex"
          >
            View all →
          </router-link>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <router-link
            v-for="t in TEMPLATES"
            :key="t.id"
            to="/builder"
            class="group block rounded-xl border border-slate-200 bg-white p-3 transition hover:border-brand-300 hover:shadow-lg"
          >
            <TemplateThumb :template-id="t.id" />
            <div class="mt-3">
              <div class="font-semibold text-slate-900">
                {{ t.name }}
              </div>
              <div class="mt-1 text-sm text-slate-500">
                {{ t.description }}
              </div>
            </div>
          </router-link>
        </div>
      </section>

      <!-- How it works -->
      <section class="bg-white py-14">
        <div class="mx-auto max-w-6xl px-4">
          <h2 class="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            How it works
          </h2>
          <p class="mx-auto mt-2 max-w-2xl text-center text-slate-600">
            A simple, focused flow — no sign-up, no distractions.
          </p>
          <div class="mt-10 grid gap-6 md:grid-cols-4">
            <div
              v-for="(s, i) in steps"
              :key="i"
              class="rounded-xl border border-slate-200 bg-slate-50 p-5"
            >
              <div class="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-brand-100 text-brand-700">
                <component :is="s.icon" />
              </div>
              <div class="font-semibold text-slate-900">
                {{ i + 1 }}. {{ s.title }}
              </div>
              <div class="mt-1 text-sm text-slate-600">
                {{ s.body }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="mx-auto my-16 max-w-5xl px-4">
        <div class="rounded-2xl bg-brand-600 p-8 text-center text-white md:p-12">
          <h3 class="text-2xl font-bold md:text-3xl">
            Ready to build your resume?
          </h3>
          <p class="mx-auto mt-2 max-w-xl text-brand-100">
            It takes about ten minutes to go from a blank page to a polished, downloadable PDF.
          </p>
          <router-link
            to="/builder"
            class="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 shadow-sm hover:bg-slate-100"
          >
            Start building <ArrowRight :size="16" />
          </router-link>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue';
import {
  ArrowRight,
  FileText,
  LayoutTemplate,
  Paintbrush,
  Download,
  Sparkles,
  ShieldCheck,
  MousePointerClick,
} from 'lucide-vue-next';
import Navbar from '../components/Navbar.vue';
import AppFooter from '../components/AppFooter.vue';
import TemplateThumb from '../components/TemplateThumb.vue';
import { TEMPLATES } from '../templates';

export default defineComponent({
  name: 'Landing',
  components: {
    Navbar,
    AppFooter,
    TemplateThumb,
    Sparkles,
    ArrowRight,
    ShieldCheck,
    MousePointerClick,
    Download
  },
  data() {
    return {
      TEMPLATES,
      steps: [
        {
          icon: markRaw(LayoutTemplate),
          title: "Choose a template",
          body: "Start from a clean, professional layout that suits your story.",
        },
        {
          icon: markRaw(FileText),
          title: "Fill in your details",
          body: "Add experience, education, projects, and skills with guided forms.",
        },
        {
          icon: markRaw(Paintbrush),
          title: "Customize the design",
          body: "Tweak color, font, and spacing — see every change instantly.",
        },
        {
          icon: markRaw(Download),
          title: "Download your PDF",
          body: "Export a print-ready PDF and start applying with confidence.",
        },
      ]
    };
  }
});
</script>
