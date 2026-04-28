import { Plus, Trash2 } from "lucide-react";
import type { Resume, SkillGroup } from "../../../types/resume";
import { Field, TextInput } from "../FormField";
import SectionCard from "../SectionCard";
import { uid } from "../../../lib/uid";

interface Props {
  resume: Resume;
  update: (updater: (r: Resume) => Resume) => void;
  onRemoveSection?: () => void;
}

export default function SkillsSection({ resume, update, onRemoveSection }: Props) {
  const add = () => {
    const item: SkillGroup = { id: uid(), category: "", items: "" };
    update((r) => ({ ...r, skills: [...r.skills, item] }));
  };
  const setItem = (idx: number, patch: Partial<SkillGroup>) =>
    update((r) => ({
      ...r,
      skills: r.skills.map((s, i) => (i === idx ? { ...s, ...patch } : s)),
    }));
  const remove = (idx: number) =>
    update((r) => ({ ...r, skills: r.skills.filter((_, i) => i !== idx) }));

  return (
    <SectionCard
      title="Skills"
      subtitle="Group related skills by category"
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
        {resume.skills.map((s, idx) => (
          <div
            key={s.id}
            className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[140px_1fr_auto]"
          >
            <Field label="Category">
              <TextInput
                value={s.category}
                onChange={(ev) => setItem(idx, { category: ev.target.value })}
                placeholder="Languages"
              />
            </Field>
            <Field label="Skills" hint="Comma-separated">
              <TextInput
                value={s.items}
                onChange={(ev) => setItem(idx, { items: ev.target.value })}
                placeholder="TypeScript, JavaScript, Python"
              />
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
        <Plus size={14} /> Add skill group
      </button>
    </SectionCard>
  );
}
