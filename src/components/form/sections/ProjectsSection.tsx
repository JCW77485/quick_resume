import { Plus } from "lucide-react";
import type { ProjectItem, Resume } from "../../../types/resume";
import { Field, TextArea, TextInput } from "../FormField";
import SectionCard from "../SectionCard";
import ItemCard from "../ItemCard";
import { uid } from "../../../lib/uid";

interface Props {
  resume: Resume;
  update: (updater: (r: Resume) => Resume) => void;
  onRemoveSection?: () => void;
}

export default function ProjectsSection({ resume, update, onRemoveSection }: Props) {
  const add = () => {
    const item: ProjectItem = {
      id: uid(),
      name: "",
      link: "",
      description: "",
      bullets: [],
    };
    update((r) => ({ ...r, projects: [...r.projects, item] }));
  };
  const setItem = (idx: number, patch: Partial<ProjectItem>) =>
    update((r) => ({
      ...r,
      projects: r.projects.map((p, i) => (i === idx ? { ...p, ...patch } : p)),
    }));
  const remove = (idx: number) =>
    update((r) => ({ ...r, projects: r.projects.filter((_, i) => i !== idx) }));

  return (
    <SectionCard
      title="Projects"
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
        {resume.projects.map((p, idx) => (
          <ItemCard
            key={p.id}
            title={p.name || "New project"}
            subtitle={p.link}
            defaultOpen={!p.name}
            onDelete={() => remove(idx)}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name">
                <TextInput
                  value={p.name}
                  onChange={(ev) => setItem(idx, { name: ev.target.value })}
                  placeholder="Open Pricing Table"
                />
              </Field>
              <Field label="Link">
                <TextInput
                  value={p.link}
                  onChange={(ev) => setItem(idx, { link: ev.target.value })}
                  placeholder="github.com/you/project"
                />
              </Field>
            </div>
            <Field label="Description">
              <TextArea
                value={p.description}
                onChange={(ev) => setItem(idx, { description: ev.target.value })}
                placeholder="What it does and why it matters."
                rows={2}
              />
            </Field>
            <div>
              <div className="mb-1 text-xs font-medium text-slate-600">Highlights</div>
              <div className="space-y-2">
                {p.bullets.map((b, bi) => (
                  <div key={bi} className="flex gap-2">
                    <TextArea
                      value={b}
                      onChange={(ev) => {
                        const next = [...p.bullets];
                        next[bi] = ev.target.value;
                        setItem(idx, { bullets: next });
                      }}
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setItem(idx, { bullets: p.bullets.filter((_, i) => i !== bi) })
                      }
                      className="self-start rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setItem(idx, { bullets: [...p.bullets, ""] })}
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
        <Plus size={14} /> Add project
      </button>
    </SectionCard>
  );
}
