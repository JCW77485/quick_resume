import { Plus, Trash2 } from "lucide-react";
import type { LanguageItem, Resume } from "../../../types/resume";
import { Field, TextInput } from "../FormField";
import SectionCard from "../SectionCard";
import { uid } from "../../../lib/uid";

interface Props {
  resume: Resume;
  update: (updater: (r: Resume) => Resume) => void;
  onRemoveSection?: () => void;
}

export default function LanguagesSection({ resume, update, onRemoveSection }: Props) {
  const add = () => {
    const item: LanguageItem = { id: uid(), name: "", level: "" };
    update((r) => ({ ...r, languages: [...r.languages, item] }));
  };
  const setItem = (idx: number, patch: Partial<LanguageItem>) =>
    update((r) => ({
      ...r,
      languages: r.languages.map((l, i) => (i === idx ? { ...l, ...patch } : l)),
    }));
  const remove = (idx: number) =>
    update((r) => ({ ...r, languages: r.languages.filter((_, i) => i !== idx) }));

  const levels = ["Beginner", "Intermediate", "Advanced", "Fluent", "Native"];
  return (
    <SectionCard
      title="Languages"
      actions={
        onRemoveSection && (
          <button
            type="button"
            onClick={onRemoveSection}
            className="text-xs font-medium text-slate-400 hover:text-red-600"
          >
            Remove section
          </button>
        )
      }
    >
      <div className="space-y-2">
        {resume.languages.map((l, idx) => (
          <div
            key={l.id}
            className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto]"
          >
            <Field label="Language">
              <TextInput
                value={l.name}
                onChange={(ev) => setItem(idx, { name: ev.target.value })}
                placeholder="Spanish"
              />
            </Field>
            <Field label="Proficiency">
              <input
                type="range"
                min="0"
                max={levels.length - 1}
                step="1"
                value={levels.indexOf(l.level) >= 0 ? levels.indexOf(l.level) : 2}
                onChange={(e) =>
                  setItem(idx, { level: levels[Number(e.target.value)] })
                }
              />

              <div style={{ marginTop: 6 }}>
                {l.level || "Advanced"}
              </div>
            </Field>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="self-end rounded-md border border-slate-200 bg-white p-2 text-slate-400 hover:text-red-600"
              title="Remove"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-dashed border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-brand-400 hover:text-brand-700"
      >
        <Plus size={14} /> Add language
      </button>
    </SectionCard>
  );
}
