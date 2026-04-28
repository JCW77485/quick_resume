import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  LayoutTemplate,
  Paintbrush,
  Download,
  Sparkles,
  ShieldCheck,
  MousePointerClick,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { TEMPLATES } from "../templates";
import ResumePreview from "../components/ResumePreview";
import { sampleResume } from "../lib/defaults";
import type { TemplateId } from "../types/resume";
import { useMemo } from "react";

function TemplateThumb({ templateId }: { templateId: TemplateId }) {
  const resume = useMemo(() => {
    const r = sampleResume();
    r.design.template = templateId;
    return r;
  }, [templateId]);
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
      <div style={{ width: "100%", aspectRatio: "8.5 / 11", overflow: "hidden" }}>
        <div
          style={{
            transformOrigin: "top left",
            transform: "scale(0.33)",
            width: "8.5in",
          }}
        >
          <ResumePreview resume={resume} scale={1} interactive={false} />
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-white to-slate-50">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
            <div className="flex flex-col justify-center">
              <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                <Sparkles size={14} /> Free. No login required.
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Build a resume that gets you <span className="text-brand-600">hired</span>.
              </h1>
              <p className="mt-4 max-w-xl text-lg text-slate-600">
                Pick a template, fill in your details, and watch your resume come together in
                real time. Download a clean, ATS-friendly PDF in minutes.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/builder"
                  className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
                >
                  Create my resume <ArrowRight size={16} />
                </Link>
                <Link
                  to="/templates"
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Browse templates
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600" /> ATS-friendly layouts
                </div>
                <div className="flex items-center gap-2">
                  <MousePointerClick size={16} className="text-brand-600" /> Edit with a live
                  preview
                </div>
                <div className="flex items-center gap-2">
                  <Download size={16} className="text-slate-700" /> Export to PDF
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute -left-6 top-8 hidden md:block">
                <div className="w-56 rotate-[-6deg] rounded-lg border border-slate-200 bg-white shadow-lg">
                  <TemplateThumb templateId="modern" />
                </div>
              </div>
              <div className="pointer-events-none absolute -right-4 bottom-6 hidden md:block">
                <div className="w-56 rotate-[6deg] rounded-lg border border-slate-200 bg-white shadow-lg">
                  <TemplateThumb templateId="twocol" />
                </div>
              </div>
              <div className="mx-auto w-64 rounded-lg border border-slate-200 bg-white shadow-xl md:w-72">
                <TemplateThumb templateId="classic" />
              </div>
            </div>
          </div>
        </section>

        {/* Templates */}
        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Pick a template, make it yours
              </h2>
              <p className="mt-2 text-slate-600">
                Four professional layouts, all customizable — colors, fonts, and spacing.
              </p>
            </div>
            <Link
              to="/templates"
              className="hidden text-sm font-medium text-brand-700 hover:underline md:inline-flex"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.map((t) => (
              <Link
                key={t.id}
                to="/builder"
                className="group block rounded-xl border border-slate-200 bg-white p-3 transition hover:border-brand-300 hover:shadow-lg"
              >
                <TemplateThumb templateId={t.id} />
                <div className="mt-3">
                  <div className="font-semibold text-slate-900">{t.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{t.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              How it works
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600">
              A simple, focused flow — no sign-up, no distractions.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-4">
              {[
                {
                  icon: <LayoutTemplate />,
                  title: "Choose a template",
                  body: "Start from a clean, professional layout that suits your story.",
                },
                {
                  icon: <FileText />,
                  title: "Fill in your details",
                  body: "Add experience, education, projects, and skills with guided forms.",
                },
                {
                  icon: <Paintbrush />,
                  title: "Customize the design",
                  body: "Tweak color, font, and spacing — see every change instantly.",
                },
                {
                  icon: <Download />,
                  title: "Download your PDF",
                  body: "Export a print-ready PDF and start applying with confidence.",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-brand-100 text-brand-700">
                    {s.icon}
                  </div>
                  <div className="font-semibold text-slate-900">
                    {i + 1}. {s.title}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{s.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto my-16 max-w-5xl px-4">
          <div className="rounded-2xl bg-brand-600 p-8 text-center text-white md:p-12">
            <h3 className="text-2xl font-bold md:text-3xl">
              Ready to build your resume?
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-brand-100">
              It takes about ten minutes to go from a blank page to a polished, downloadable PDF.
            </p>
            <Link
              to="/builder"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 shadow-sm hover:bg-slate-100"
            >
              Start building <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
