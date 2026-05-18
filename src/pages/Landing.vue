<template>
  <div class="flex min-h-full flex-col bg-slate-50">
    <Navbar />
    <main class="flex-1">
      <!-- Hero -->
      <section class="relative overflow-hidden bg-white py-16 md:py-24 lg:py-32">
        <div class="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div class="flex flex-col justify-center text-center md:text-left">
            <div class="mx-auto mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-bold text-brand-700 md:mx-0">
              <Sparkles :size="14" /> 100% Free for life. No login required.
            </div>
            <h1 class="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Build a resume that gets you <span class="text-brand-600">noticed</span>.
            </h1>
            <p class="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">
              QuickResume helps you create a professional, ATS-friendly resume in minutes. Choose a template, add your details, and download a polished PDF instantly.
            </p>
            <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row md:justify-start">
              <router-link
                to="/builder"
                class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-brand-200 transition hover:bg-brand-700 active:scale-[0.98] sm:w-auto"
              >
                Create My Resume <ArrowRight :size="20" />
              </router-link>
              <router-link
                to="/templates"
                class="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] sm:w-auto"
              >
                Browse Templates
              </router-link>
            </div>

            <div class="mt-12 flex flex-wrap justify-center gap-6 md:justify-start">
              <div
                v-for="benefit in benefits"
                :key="benefit"
                class="flex items-center gap-2 text-sm font-semibold text-slate-500"
              >
                <CheckCircle
                  :size="18"
                  class="text-emerald-500"
                /> {{ benefit }}
              </div>
            </div>
          </div>

          <!-- Hero Image/Thumbnails -->
          <div class="relative hidden md:block">
            <div class="absolute -left-12 top-10 w-64 rotate-[-6deg] rounded-xl border border-slate-200 bg-white p-2 shadow-2xl transition hover:rotate-0 hover:scale-105">
              <TemplateThumb template-id="modern" />
            </div>
            <div class="absolute -right-8 bottom-12 w-64 rotate-[8deg] rounded-xl border border-slate-200 bg-white p-2 shadow-2xl transition hover:rotate-0 hover:scale-105">
              <TemplateThumb template-id="twocol" />
            </div>
            <div class="mx-auto w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl lg:w-80">
              <TemplateThumb template-id="classic" />
            </div>
          </div>
        </div>
      </section>

      <!-- Templates Showcase -->
      <section class="bg-slate-50 py-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mb-12 flex flex-col items-end justify-between gap-4 md:flex-row">
            <div class="text-center md:text-left">
              <h2 class="text-3xl font-extrabold text-slate-900 md:text-4xl">
                Ready-to-use professional layouts
              </h2>
              <p class="mt-3 text-lg text-slate-600">
                Ten designs for every industry — modern, creative, or executive.
              </p>
            </div>
            <router-link
              to="/templates"
              class="font-bold text-brand-700 transition hover:text-brand-800 hover:underline"
            >
              View all 10 layouts →
            </router-link>
          </div>
          <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <router-link
              v-for="t in TEMPLATES.slice(0, 4)"
              :key="t.id"
              to="/builder"
              class="group block rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-brand-300 hover:shadow-xl"
            >
              <div class="overflow-hidden rounded-xl bg-slate-50">
                <TemplateThumb :template-id="t.id" />
              </div>
              <div class="mt-5 px-1">
                <div class="font-bold text-slate-900 group-hover:text-brand-700">
                  {{ t.name }}
                </div>
                <div class="mt-1 text-sm text-slate-500">
                  {{ t.description }}
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </section>

      <!-- Features / How it works -->
      <section class="bg-white py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-3xl font-extrabold text-slate-900 md:text-4xl">
            Building your career shouldn't be hard.
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            A simple, intuitive workflow designed to get you from blank page to PDF in minutes.
          </p>

          <div class="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="(s, i) in steps"
              :key="i"
              class="flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 p-8 transition hover:bg-white hover:shadow-lg"
            >
              <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-100">
                <component
                  :is="s.icon"
                  :size="28"
                />
              </div>
              <h3 class="text-xl font-bold text-slate-900">
                {{ i + 1 }}. {{ s.title }}
              </h3>
              <p class="mt-3 text-sm leading-relaxed text-slate-600">
                {{ s.body }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA -->
      <section class="mx-auto my-20 max-w-6xl px-4">
        <div class="relative overflow-hidden rounded-3xl bg-brand-600 px-8 py-16 text-center text-white md:px-20 md:py-24">
          <!-- Background decoration -->
          <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-900/20 blur-3xl" />

          <h3 class="relative text-3xl font-extrabold md:text-5xl">
            Get your dream job today.
          </h3>
          <p class="relative mx-auto mt-6 max-w-xl text-lg text-brand-100 md:text-xl">
            Join thousands of professionals who have used QuickResume to build their careers. Free forever.
          </p>
          <router-link
            to="/builder"
            class="relative mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 text-lg font-bold text-brand-700 shadow-2xl transition hover:bg-slate-50 active:scale-[0.98]"
          >
            Start Building Now <ArrowRight :size="20" />
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
  CheckCircle,
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
    CheckCircle
  },
  data() {
    return {
      TEMPLATES,
      benefits: ["ATS-Friendly", "Live Preview", "PDF Export"],
      steps: [
        {
          icon: markRaw(LayoutTemplate),
          title: "Pick a layout",
          body: "Select a professional design that highlights your unique strengths and experience.",
        },
        {
          icon: markRaw(FileText),
          title: "Input details",
          body: "Fill in your experience, education, and skills. We handle all the formatting for you.",
        },
        {
          icon: markRaw(Paintbrush),
          title: "Make it yours",
          body: "Adjust colors, fonts, and spacing in real-time to match your personal brand.",
        },
        {
          icon: markRaw(Download),
          title: "Export to PDF",
          body: "Download a high-quality, print-ready PDF and start applying for your dream role.",
        },
      ]
    };
  }
});
</script>
