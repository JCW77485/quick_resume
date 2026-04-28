import type { Resume, SectionKey } from "../types/resume";
import {
  FONT_SIZE_PX,
  formatDateRange,
  hasContent,
  type TemplateProps,
} from "./shared";

function SectionTitle({ title, accent }: { title: string; accent: string }) {
  return (
    <h2
      style={{
        margin: "0.6em 0 0.2em",
        fontSize: "1em",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: accent,
      }}
    >
      {title}
    </h2>
  );
}

function renderSection(r: Resume, key: SectionKey, accent: string) {
  if (!hasContent(r, key)) return null;
  switch (key) {
    case "summary":
      return (
        <section key={key}>
          <SectionTitle title="Summary" accent={accent} />
          <p style={{ margin: 0 }}>{r.personal.summary}</p>
        </section>
      );
    case "experience":
      return (
        <section key={key}>
          <SectionTitle title="Experience" accent={accent} />
          {r.experience.map((e) => (
            <div key={e.id} style={{ marginBottom: "0.45em" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0.75em",
                }}
              >
                <div>
                  <span style={{ fontWeight: 700 }}>{e.role}</span>
                  {e.company ? `, ${e.company}` : ""}
                  {e.location ? ` — ${e.location}` : ""}
                </div>
                <div style={{ whiteSpace: "nowrap", color: "#475569" }}>
                  {formatDateRange(e.startDate, e.endDate, e.current)}
                </div>
              </div>
              {e.bullets.filter((b) => b.trim()).length > 0 && (
                <ul style={{ margin: "0.1em 0 0", paddingLeft: "1em" }}>
                  {e.bullets
                    .filter((b) => b.trim())
                    .map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      );
    case "education":
      return (
        <section key={key}>
          <SectionTitle title="Education" accent={accent} />
          {r.education.map((e) => (
            <div
              key={e.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "0.75em",
              }}
            >
              <div>
                <span style={{ fontWeight: 700 }}>{e.school}</span>
                {" — "}
                {[e.degree, e.field].filter(Boolean).join(", ")}
                {e.location ? ` • ${e.location}` : ""}
                {e.details ? `. ${e.details}` : ""}
              </div>
              <div style={{ whiteSpace: "nowrap", color: "#475569" }}>
                {formatDateRange(e.startDate, e.endDate, false)}
              </div>
            </div>
          ))}
        </section>
      );
    case "projects":
      return (
        <section key={key}>
          <SectionTitle title="Projects" accent={accent} />
          {r.projects.map((p) => (
            <div key={p.id}>
              <span style={{ fontWeight: 700 }}>{p.name}</span>
              {p.link ? ` — ${p.link}` : ""}
              {p.description ? `. ${p.description}` : ""}
            </div>
          ))}
        </section>
      );
    case "skills":
      return (
        <section key={key}>
          <SectionTitle title="Skills" accent={accent} />
          {r.skills.map((g) => (
            <div key={g.id}>
              <span style={{ fontWeight: 700 }}>{g.category}:</span> {g.items}
            </div>
          ))}
        </section>
      );
    case "certifications":
      return (
        <section key={key}>
          <SectionTitle title="Certifications" accent={accent} />
          {r.certifications.map((c) => (
            <div key={c.id}>
              <span style={{ fontWeight: 700 }}>{c.name}</span>
              {c.issuer ? `, ${c.issuer}` : ""}
              {c.date ? ` (${c.date})` : ""}
            </div>
          ))}
        </section>
      );
    case "languages":
      return (
        <section key={key}>
          <SectionTitle title="Languages" accent={accent} />
          <div>
            {r.languages
              .map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`)
              .join(", ")}
          </div>
        </section>
      );
  }
}

export default function CompactTemplate({ resume }: TemplateProps) {
  const { design, personal } = resume;
  const accent = design.accentColor;
  const fontPx = FONT_SIZE_PX[design.fontSize];
  const fontFamily =
    design.fontFamily === "serif" ? "var(--font-serif)" : "var(--font-sans)";

  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.website,
    personal.linkedin,
    personal.github,
  ].filter((x) => x && x.trim());

  return (
    <div
      style={{
        fontFamily,
        fontSize: `${fontPx}pt`,
        lineHeight: 1.35,
        color: "#0f172a",
        padding: "0.55in 0.65in",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "1em",
          borderBottom: `2px solid ${accent}`,
          paddingBottom: "0.35em",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "1.7em", fontWeight: 700 }}>
            {personal.fullName || "Your Name"}
          </h1>
          {personal.title && (
            <div style={{ color: "#475569" }}>{personal.title}</div>
          )}
        </div>
        <div
          style={{
            fontSize: "0.85em",
            color: "#475569",
            textAlign: "right",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {contacts.map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </div>
      </header>
      {resume.sections.map((key) => renderSection(resume, key, accent))}
    </div>
  );
}
