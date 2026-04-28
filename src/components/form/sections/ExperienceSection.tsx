import { Plus } from "lucide-react";
import type { ExperienceItem, Resume } from "../../../types/resume";
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

export default function ExperienceSection({ resume, update, onRemoveSection }: Props) {
  const add = () => {
    const item: ExperienceItem = {
      id: uid(),
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""],
    };
    update((r) => ({ ...r, experience: [...r.experience, item] }));
  };

  const setItem = (idx: number, patch: Partial<ExperienceItem>) =>
    update((r) => ({
      ...r,
      experience: r.experience.map((e, i) => (i === idx ? { ...e, ...patch } : e)),
    }));

  const remove = (idx: number) =>
    update((r) => ({ ...r, experience: r.experience.filter((_, i) => i !== idx) }));

  const move = (idx: number, delta: number) =>
    update((r) => ({ ...r, experience: moveItem(r.experience, idx, idx + delta) }));

  return (
    <SectionCard
      title="Work experience"
      subtitle="Roles, companies, and achievements"
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
        {resume.experience.map((e, idx) => (
          <ItemCard
            key={e.id}
            title={e.role || "New role"}
            subtitle={e.company}
            defaultOpen={!e.role && !e.company}
            onMoveUp={idx > 0 ? () => move(idx, -1) : undefined}
            onMoveDown={idx < resume.experience.length - 1 ? () => move(idx, 1) : undefined}
            onDelete={() => remove(idx)}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Role">
                <TextInput
                  value={e.role}
                  onChange={(ev) => setItem(idx, { role: ev.target.value })}
                  placeholder="Senior Software Engineer"
                />
              </Field>
              <Field label="Company">
                <TextInput
                  value={e.company}
                  onChange={(ev) => setItem(idx, { company: ev.target.value })}
                  placeholder="Northwind Labs"
                />
              </Field>
              <Field label="Location">
                <TextInput
                  value={e.location}
                  onChange={(ev) => setItem(idx, { location: ev.target.value })}
                  placeholder="Remote"
                />
              </Field>
              <div className="flex items-end gap-2">
                <Field label="Start" className="flex-1">
                  <TextInput
                    value={e.startDate}
                    onChange={(ev) => setItem(idx, { startDate: ev.target.value })}
                    placeholder="Mar 2022"
                  />
                </Field>
                <Field label="End" className="flex-1">
                  <TextInput
                    value={e.endDate}
                    onChange={(ev) => setItem(idx, { endDate: ev.target.value })}
                    placeholder="Present"
                    disabled={e.current}
                  />
                </Field>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={e.current}
                onChange={(ev) =>
                  setItem(idx, { current: ev.target.checked, endDate: ev.target.checked ? "" : e.endDate })
                }
              />
              I currently work here
            </label>
            <div>
              <div className="mb-1 text-xs font-medium text-slate-600">Highlights</div>
              <div className="space-y-2">
                {e.bullets.map((b, bi) => (
                  <div key={bi} className="flex gap-2">
                    <TextArea
                      value={b}
                      onChange={(ev) => {
                        const next = [...e.bullets];
                        next[bi] = ev.target.value;
                        setItem(idx, { bullets: next });
                      }}
                      placeholder="Started with an action verb..."
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setItem(idx, { bullets: e.bullets.filter((_, i) => i !== bi) })
                      }
                      className="self-start rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setItem(idx, { bullets: [...e.bullets, ""] })}
                  className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline"
                >
                  <Plus size={12} /> Add bullet
                </button>
              </div>
            </div>
          </ItemCard>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-dashed border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:border-brand-400 hover:text-brand-700"
      >
        <Plus size={14} /> Add experience
      </button>
    </SectionCard>
  );
}
