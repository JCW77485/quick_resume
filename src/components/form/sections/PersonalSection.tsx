import type { Resume } from "../../../types/resume";
import { Field, TextArea, TextInput } from "../FormField";
import SectionCard from "../SectionCard";

interface Props {
  resume: Resume;
  update: (updater: (r: Resume) => Resume) => void;
}

export default function PersonalSection({ resume, update }: Props) {
  const p = resume.personal;
  const set = <K extends keyof typeof p>(key: K, value: (typeof p)[K]) =>
    update((r) => ({ ...r, personal: { ...r.personal, [key]: value } }));

  return (
    <SectionCard
      title="Personal details"
      subtitle="Your name, title, and contact info"
      defaultOpen
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Full name">
          <TextInput
            value={p.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="Alex Morgan"
          />
        </Field>
        <Field label="Professional title">
          <TextInput
            value={p.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Senior Software Engineer"
          />
        </Field>
        <Field label="Email">
          <TextInput
            value={p.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Phone">
          <TextInput
            value={p.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </Field>
        <Field label="Location">
          <TextInput
            value={p.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="San Francisco, CA"
          />
        </Field>
        <Field label="Website">
          <TextInput
            value={p.website}
            onChange={(e) => set("website", e.target.value)}
            placeholder="yourname.dev"
          />
        </Field>
        <Field label="LinkedIn">
          <TextInput
            value={p.linkedin}
            onChange={(e) => set("linkedin", e.target.value)}
            placeholder="linkedin.com/in/you"
          />
        </Field>
        <Field label="GitHub">
          <TextInput
            value={p.github}
            onChange={(e) => set("github", e.target.value)}
            placeholder="github.com/you"
          />
        </Field>
      </div>
    </SectionCard>
  );
}
