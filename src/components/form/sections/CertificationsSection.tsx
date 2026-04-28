import { Plus, Trash2 } from "lucide-react";
import type { CertificationItem, Resume } from "../../../types/resume";
import { Field, TextInput } from "../FormField";
import SectionCard from "../SectionCard";
import { uid } from "../../../lib/uid";

interface Props {
  resume: Resume;
  update: (updater: (r: Resume) => Resume) => void;
  onRemoveSection?: () => void;
}

export default function CertificationsSection({
  resume,
  update,
  onRemoveSection,
}: Props) {
  const add = () => {
    const item: CertificationItem = { id: uid(), name: "", issuer: "", date: "" };
    update((r) => ({ ...r, certifications: [...r.certifications, item] }));
  };
  const setItem = (idx: number, patch: Partial<CertificationItem>) =>
    update((r) => ({
      ...r,
      certifications: r.certifications.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
    }));
  const remove = (idx: number) =>
    update((r) => ({ ...r, certifications: r.certifications.filter((_, i) => i !== idx) }));

  return (
    <SectionCard
      title="Certifications"
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
        {resume.certifications.map((c, idx) => (
          <div
            key={c.id}
            className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_120px_auto]"
          >
            <Field label="Name">
              <TextInput
                value={c.name}
                onChange={(ev) => setItem(idx, { name: ev.target.value })}
                placeholder="AWS Solutions Architect"
              />
            </Field>
            <Field label="Issuer">
              <TextInput
                value={c.issuer}
                onChange={(ev) => setItem(idx, { issuer: ev.target.value })}
                placeholder="Amazon Web Services"
              />
            </Field>
            <Field label="Date">
              <TextInput
                value={c.date}
                onChange={(ev) => setItem(idx, { date: ev.target.value })}
                placeholder="2023"
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
        <Plus size={14} /> Add certification
      </button>
    </SectionCard>
  );
}
