import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Download,
  FileText,
  LayoutGrid,
  Paintbrush,
  Pencil,
  Plus,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { SECTION_LABELS, useResumes } from "../store/resumes";
import type { SectionKey } from "../types/resume";
import ResumePreview from "../components/ResumePreview";
import PersonalSection from "../components/form/sections/PersonalSection";
import SummarySection from "../components/form/sections/SummarySection";
import ExperienceSection from "../components/form/sections/ExperienceSection";
import EducationSection from "../components/form/sections/EducationSection";
import SkillsSection from "../components/form/sections/SkillsSection";
import ProjectsSection from "../components/form/sections/ProjectsSection";
import CertificationsSection from "../components/form/sections/CertificationsSection";
import LanguagesSection from "../components/form/sections/LanguagesSection";
import DesignPanel from "../components/form/DesignPanel";

type Tab = "content" | "design";

const SECTION_ORDER: SectionKey[] = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
];

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const resume = useResumes((s) => (id ? s.resumes[id] : undefined));
  const updateResume = useResumes((s) => s.updateResume);
  const renameResume = useResumes((s) => s.renameResume);
  const addSection = useResumes((s) => s.addSection);
  const removeSection = useResumes((s) => s.removeSection);
  const [tab, setTab] = useState<Tab>("content");
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [scale, setScale] = useState(0.72);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const previousUpdatedAt = useRef<number | null>(null);

  // Fit preview on first mount based on the available pane width.
  const previewContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;
    const fit = () => {
      const w = el.clientWidth - 48;
      const target = Math.max(0.35, Math.min(1.1, w / (8.5 * 96)));
      setScale(target);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!resume) return;
    if (previousUpdatedAt.current !== null && resume.updatedAt !== previousUpdatedAt.current) {
      setSavedAt(Date.now());
    }
    previousUpdatedAt.current = resume.updatedAt;
  }, [resume]);

  const update = useMemo(
    () =>
      id
        ? (updater: Parameters<typeof updateResume>[1]) => updateResume(id, updater)
        : () => {},
    [id, updateResume],
  );

  if (!id) return <Navigate to="/builder" replace />;
  if (!resume) {
    return (
      <div className="grid h-screen place-items-center bg-slate-50">
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
          <p className="text-slate-700">This resume couldn't be found.</p>
          <Link
            to="/builder"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
          >
            <ArrowLeft size={14} /> Back to my resumes
          </Link>
        </div>
      </div>
    );
  }

  const availableSections = SECTION_ORDER.filter((k) => !resume.sections.includes(k));

    const print = () => {
  const printTarget = document.querySelector('[data-print-target]') as HTMLElement;
  if (!printTarget) {
    console.error('Print target not found');
    return;
  }

  // Collect all stylesheets
  const styles = Array.from(document.styleSheets)
    .flatMap(sheet => {
      try {
        return Array.from(sheet.cssRules).map(rule => rule.cssText);
      } catch {
        return [`/* Failed: ${sheet.href} */`];
      }
    });

  console.log('Collected styles:', styles.length, 'rules');
  console.log('Print target innerHTML length:', printTarget.innerHTML.length);
  console.log('First 500 chars of innerHTML:', printTarget.innerHTML.substring(0, 500));

  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;border:none;';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument!;
  doc.open();

  // Build HTML with styles and preserve data-print-target for CSS selectors
  const html = `<!DOCTYPE html>
<html>
<head>
<style>
${styles.join('\n')}
@page { size: Letter; margin: 0; }
body { margin: 0; padding: 0; }
</style>
</head>
<body>${printTarget.innerHTML}</body>
</html>`;

  doc.write(html);
  doc.close();

  iframe.onload = () => {
    console.log('Iframe loaded');
    const iframeDoc = iframe.contentDocument!;
    console.log('Iframe body content:', iframeDoc.body.innerHTML.substring(0, 200));
    iframe.contentWindow!.focus();
    iframe.contentWindow!.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };
};

  const sectionRenderer: Record<SectionKey, React.ReactNode> = {
    summary: <SummarySection resume={resume} update={update} onRemoveSection={() => removeSection(id, "summary")} />,
    experience: <ExperienceSection resume={resume} update={update} onRemoveSection={() => removeSection(id, "experience")} />,
    education: <EducationSection resume={resume} update={update} onRemoveSection={() => removeSection(id, "education")} />,
    projects: <ProjectsSection resume={resume} update={update} onRemoveSection={() => removeSection(id, "projects")} />,
    skills: <SkillsSection resume={resume} update={update} onRemoveSection={() => removeSection(id, "skills")} />,
    certifications: (
      <CertificationsSection resume={resume} update={update} onRemoveSection={() => removeSection(id, "certifications")} />
    ),
    languages: <LanguagesSection resume={resume} update={update} onRemoveSection={() => removeSection(id, "languages")} />,
  };

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      {/* Top bar */}
      <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-2">
        <button
          type="button"
          onClick={() => navigate("/builder")}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft size={14} /> My resumes
        </button>
        <div className="h-5 w-px bg-slate-200" />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {editingName ? (
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={() => {
                renameResume(id, nameDraft || resume.name);
                setEditingName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  renameResume(id, nameDraft || resume.name);
                  setEditingName(false);
                }
                if (e.key === "Escape") setEditingName(false);
              }}
              className="w-64 rounded-md border border-slate-300 px-2 py-1 text-sm font-semibold text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setNameDraft(resume.name);
                setEditingName(true);
              }}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              <FileText size={14} className="text-slate-400" />
              <span className="truncate">{resume.name}</span>
              <Pencil size={12} className="text-slate-400" />
            </button>
          )}
          {savedAt !== null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              <Check size={12} /> Saved
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={print}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <Download size={14} /> Download PDF
        </button>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Left panel */}
        <aside className="flex w-full max-w-xl shrink-0 flex-col border-r border-slate-200 bg-slate-50 lg:w-[44%]">
          <div className="flex shrink-0 items-center gap-1 border-b border-slate-200 bg-white px-2 py-2">
            <button
              type="button"
              onClick={() => setTab("content")}
              className={
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium " +
                (tab === "content"
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100")
              }
            >
              <LayoutGrid size={14} /> Content
            </button>
            <button
              type="button"
              onClick={() => setTab("design")}
              className={
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium " +
                (tab === "design"
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100")
              }
            >
              <Paintbrush size={14} /> Design
            </button>
          </div>
          <div className="scroll-thin min-h-0 flex-1 overflow-y-auto p-4">
            {tab === "content" ? (
              <div className="space-y-3">
                <PersonalSection resume={resume} update={update} />
                {resume.sections.map((k) => (
                  <div key={k}>{sectionRenderer[k]}</div>
                ))}
                {availableSections.length > 0 && (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4">
                    <div className="mb-2 text-sm font-semibold text-slate-900">Add a section</div>
                    <div className="flex flex-wrap gap-2">
                      {availableSections.map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => addSection(id, k)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700"
                        >
                          <Plus size={12} /> {SECTION_LABELS[k]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <DesignPanel resume={resume} update={update} />
            )}
          </div>
        </aside>

        {/* Preview */}
        <section
          ref={previewContainerRef}
          className="scroll-thin relative min-w-0 flex-1 overflow-auto"
        >
          <div className="sticky top-0 z-10 flex items-center justify-end gap-2 border-b border-slate-200 bg-slate-50/90 px-4 py-2 backdrop-blur">
            {/* <button
              type="button"
              onClick={() => setScale((s) => Math.max(0.3, +(s - 0.1).toFixed(2)))}
              className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100"
              title="Zoom out"
            >
              <ZoomOut size={14} />
            </button> */}
            {/* <div className="w-12 text-center text-xs font-medium text-slate-600">
              {Math.round(scale * 100)}%
            </div> */}
            {/* <button
              type="button"
              onClick={() => setScale((s) => Math.min(1.5, +(s + 0.1).toFixed(2)))}
              className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100"
              title="Zoom in"
            >
              <ZoomIn size={14} />
            </button> */}
          </div>
          <div className="flex justify-center p-6">
             <ResumePreview resume={resume} scale={scale} printable />
          </div>
        </section>
      </div>
    </div>
  );
}
