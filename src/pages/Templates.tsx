import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { TEMPLATES } from "../templates";
import ResumePreview from "../components/ResumePreview";
import { sampleResume } from "../lib/defaults";
import type { TemplateId } from "../types/resume";
import { useMemo } from "react";
import { useResumes } from "../store/resumes";

function TemplateCard({ id, name, description }: { id: TemplateId; name: string; description: string }) {
  const navigate = useNavigate();
  const createResume = useResumes((s) => s.createResume);
  const resume = useMemo(() => {
    const r = sampleResume();
    r.design.template = id;
    return r;
  }, [id]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="bg-slate-100 p-4">
        <div style={{ width: "100%", aspectRatio: "8.5 / 11", overflow: "hidden" }}>
          <div
            style={{
              transformOrigin: "top left",
              transform: "scale(0.42)",
              width: "8.5in",
            }}
          >
            <ResumePreview resume={resume} scale={1} interactive={false} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-slate-200 p-4">
        <div>
          <div className="font-semibold text-slate-900">{name}</div>
          <div className="mt-0.5 text-sm text-slate-500">{description}</div>
        </div>
        <button
          type="button"
          onClick={() => {
            const newId = createResume(`Resume — ${name}`, id);
            navigate(`/builder/${newId}`);
          }}
          className="shrink-0 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Use this
        </button>
      </div>
    </div>
  );
}

export default function Templates() {
  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Resume Templates</h1>
          <p className="mt-2 text-slate-600">
            Four carefully designed layouts, all ATS-friendly. Click “Use this” to start editing.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {TEMPLATES.map((t) => (
            <TemplateCard key={t.id} {...t} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/builder" className="text-sm font-medium text-brand-700 hover:underline">
            Go to my resumes →
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
