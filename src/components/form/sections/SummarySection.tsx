import type { Resume } from "../../../types/resume";
import { Field, TextArea } from "../FormField";
import SectionCard from "../SectionCard";

interface Props {
  resume: Resume;
  update: (updater: (r: Resume) => Resume) => void;
  onRemoveSection?: () => void;
}

export default function SummarySection({ resume, update, onRemoveSection }: Props) {
  return (
    <SectionCard
      title="Professional summary"
      subtitle="A short pitch at the top of your resume"
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
      <Field label="Summary" hint="2–4 sentences">
        <TextArea
          value={resume.personal.summary}
          onChange={(e) =>
            update((r) => ({
              ...r,
              personal: { ...r.personal, summary: e.target.value },
            }))
          }
          placeholder="Senior full-stack engineer with 7+ years of experience..."
          rows={4}
        />
      </Field>
    </SectionCard>
  );
}
