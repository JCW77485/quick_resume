import { Plus } from "lucide-react";
import type { EducationItem, Resume } from "../../../types/resume";
import { Field, TextArea, TextInput } from "../FormField";
import SectionCard from "../SectionCard";
import ItemCard from "../ItemCard";
import { uid } from "../../../lib/uid";

interface Props {
  resume: Resume;
  update: (updater: (r: Resume) => Resume) => void;
  onRemoveSection?: () => void;
}

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function EducationSection({ resume, update, onRemoveSection }: Props) {
  const add = () => {
    const item: EducationItem = {
      id: uid(),
      school: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      details: "",
    };
    update((r) => ({ ...r, education: [...r.education, item] }));
  };

  const setItem = (idx: number, patch: Partial<EducationItem>) =>
    update((r) => ({
      ...r,
      education: r.education.map((e, i) => (i === idx ? { ...e, ...patch } : e)),
    }));

  return (
    <SectionCard
      title="Education"
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
        {resume.education.map((e, idx) => (
          <ItemCard
            key={e.id}
            title={e.school || "New school"}
            subtitle={[e.degree, e.field].filter(Boolean).join(", ")}
            defaultOpen={!e.school}
            onMoveUp={
              idx > 0
                ? () =>
                    update((r) => ({
                      ...r,
                      education: moveItem(r.education, idx, idx - 1),
                    }))
                : undefined
            }
            onMoveDown={
              idx < resume.education.length - 1
                ? () =>
                    update((r) => ({
                      ...r,
                      education: moveItem(r.education, idx, idx + 1),
                    }))
                : undefined
            }
            onDelete={() =>
              update((r) => ({
                ...r,
                education: r.education.filter((_, i) => i !== idx),
              }))
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="School">
                <TextInput
                  value={e.school}
                  onChange={(ev) => setItem(idx, { school: ev.target.value })}
                  placeholder="University of California, Berkeley"
                />
              </Field>
              <Field label="Degree">
                <TextInput
                  value={e.degree}
                  onChange={(ev) => setItem(idx, { degree: ev.target.value })}
                  placeholder="B.S."
                />
              </Field>
              <Field label="Field of study">
                <TextInput
                  value={e.field}
                  onChange={(ev) => setItem(idx, { field: ev.target.value })}
                  placeholder="Computer Science"
                />
              </Field>
              <Field label="Location">
                <TextInput
                  value={e.location}
                  onChange={(ev) => setItem(idx, { location: ev.target.value })}
                  placeholder="Berkeley, CA"
                />
              </Field>
              <Field label="Start year">
                <TextInput
                  value={e.startDate}
                  onChange={(ev) => setItem(idx, { startDate: ev.target.value })}
                  placeholder="2015"
                />
              </Field>
              <Field label="End year">
                <TextInput
                  value={e.endDate}
                  onChange={(ev) => setItem(idx, { endDate: ev.target.value })}
                  placeholder="2019"
                />
              </Field>
            </div>
            <Field label="Details" hint="GPA, honors, relevant coursework, etc.">
              <TextArea
                value={e.details}
                onChange={(ev) => setItem(idx, { details: ev.target.value })}
                placeholder="Minor in Design. Dean's List."
                rows={2}
              />
            </Field>
          </ItemCard>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-dashed border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-brand-400 hover:text-brand-700"
      >
        <Plus size={14} /> Add education
      </button>
    </SectionCard>
  );
}
