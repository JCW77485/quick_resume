import type { Resume, TemplateId } from "../../types/resume";
import { TEMPLATES } from "../../templates";
import ResumePreview from "../ResumePreview";
import SectionCard from "./SectionCard";

interface Props {
  resume: Resume;
  update: (updater: (r: Resume) => Resume) => void;
}

const PRESET_COLORS = [
  "#1e6cf5", // brand blue
  "#0f766e", // teal
  "#4f46e5", // indigo
  "#9333ea", // purple
  "#db2777", // pink
  "#dc2626", // red
  "#ea580c", // orange
  "#0f172a", // slate
];

export default function DesignPanel({ resume, update }: Props) {
  const d = resume.design;
  const setDesign = <K extends keyof typeof d>(key: K, value: (typeof d)[K]) =>
    update((r) => ({ ...r, design: { ...r.design, [key]: value } }));

  return (
    <div className="space-y-3">
      <SectionCard title="Template" subtitle="Switch between layouts anytime">
        <div className="grid gap-3 sm:grid-cols-2">
          {TEMPLATES.map((t) => {
            const selected = d.template === (t.id as TemplateId);
            const preview = { ...resume, design: { ...resume.design, template: t.id } };
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setDesign("template", t.id)}
                className={
                  "overflow-hidden rounded-lg border text-left transition " +
                  (selected
                    ? "border-brand-500 ring-2 ring-brand-200"
                    : "border-slate-200 hover:border-slate-300")
                }
              >
                <div className="bg-slate-100 p-2">
                  <div style={{ width: "100%", aspectRatio: "8.5 / 11", overflow: "hidden" }}>
                    <div
                      style={{
                        transformOrigin: "top left",
                        transform: "scale(0.28)",
                        width: "8.5in",
                      }}
                    >
                      <ResumePreview resume={preview} scale={1} interactive={false} />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Accent color">
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setDesign("accentColor", c)}
              className={
                "h-8 w-8 rounded-full border-2 transition " +
                (d.accentColor === c ? "border-slate-900" : "border-white shadow-sm")
              }
              style={{ background: c }}
              title={c}
            />
          ))}
          <label className="flex items-center gap-2 text-xs text-slate-500">
            Custom
            <input
              type="color"
              value={d.accentColor}
              onChange={(e) => setDesign("accentColor", e.target.value)}
              className="h-7 w-9 cursor-pointer rounded border border-slate-300 bg-white p-0"
            />
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Typography">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600">Font family</span>
            <select
              value={d.fontFamily}
              onChange={(e) => setDesign("fontFamily", e.target.value as typeof d.fontFamily)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
            >
              <option value="sans">Sans-serif</option>
              <option value="serif">Serif</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600">Font size</span>
            <select
              value={d.fontSize}
              onChange={(e) => setDesign("fontSize", e.target.value as typeof d.fontSize)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600">Spacing</span>
            <select
              value={d.spacing}
              onChange={(e) => setDesign("spacing", e.target.value as typeof d.spacing)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
            >
              <option value="compact">Compact</option>
              <option value="normal">Normal</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </label>
        </div>
      </SectionCard>
    </div>
  );
}
