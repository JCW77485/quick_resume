import type { Resume, SectionKey } from "../types/resume";
import {
  FONT_SIZE_PX,
  formatDateRange,
  hasContent,
  type TemplateProps,
} from "./shared";

const LEFT_KEYS: SectionKey[] = ["skills", "education", "certifications", "languages"];
const RIGHT_KEYS: SectionKey[] = ["summary", "experience", "projects"];

function SidebarTitle({ title }: { title: string }) {
  return (
    <h2
      style={{
        margin: "0.9em 0 0.3em",
        fontSize: "0.95em",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#f8fafc",
      }}
    >
      {title}
    </h2>
  );
}

function MainTitle({ title, accent }: { title: string; accent: string }) {
  return (
    <h2
      style={{
        margin: "0.9em 0 0.3em",
        fontSize: "1.05em",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: accent,
        borderBottom: `1px solid ${accent}`,
        paddingBottom: "2px",
      }}
    >
      {title}
    </h2>
  );
}

function renderLeftSection(r: Resume, key: SectionKey) {
  if (!hasContent(r, key)) return null;
  switch (key) {
    case "skills":
      return (
        <section key={key}>
          <SidebarTitle title="Skills" />
          {r.skills.map((g) => (
            <div key={g.id} style={{ marginBottom: "0.35em" }}>
              <div style={{ fontWeight: 700 }}>{g.category}</div>
              <div style={{ color: "#cbd5e1" }}>{g.items}</div>
            </div>
          ))}
        </section>
      );
    case "education":
      return (
        <section key={key}>
          <SidebarTitle title="Education" />
          {r.education.map((e) => (
            <div key={e.id} style={{ marginBottom: "0.45em" }}>
              <div style={{ fontWeight: 700 }}>{e.school}</div>
              <div style={{ color: "#cbd5e1" }}>
                {[e.degree, e.field].filter(Boolean).join(", ")}
                {e.location ? ` • ${e.location}` : ""}
              </div>
              <div style={{ color: "#94a3b8", fontSize: "0.85em" }}>
                {formatDateRange(e.startDate, e.endDate, false)}
              </div>
              {e.details && (
                <div style={{ color: "#cbd5e1", fontSize: "0.88em" }}>{e.details}</div>
              )}
            </div>
          ))}
        </section>
      );
    case "certifications":
      return (
        <section key={key}>
          <SidebarTitle title="Certifications" />
          {r.certifications.map((c) => (
            <div key={c.id} style={{ marginBottom: "0.3em" }}>
              <div style={{ fontWeight: 700 }}>{c.name}</div>
              <div style={{ color: "#cbd5e1", fontSize: "0.88em" }}>
                {c.issuer}
                {c.date ? ` · ${c.date}` : ""}
              </div>
            </div>
          ))}
        </section>
      );
    case "languages":
      return (
        <section key={key}>
          <SidebarTitle title="Languages" />
          {r.languages.map((l) => (
            <div key={l.id} style={{ color: "#cbd5e1" }}>
              <span style={{ fontWeight: 700, color: "white" }}>{l.name}</span>
              {l.level ? ` — ${l.level}` : ""}
            </div>
          ))}
        </section>
      );
    default:
      return null;
  }
}

function renderRightSection(r: Resume, key: SectionKey, accent: string) {
  if (!hasContent(r, key)) return null;
  switch (key) {
    case "summary":
      return (
        <section key={key}>
          <MainTitle title="Profile" accent={accent} />
          <p style={{ margin: 0 }}>{r.personal.summary}</p>
        </section>
      );
    case "experience":
      return (
        <section key={key}>
          <MainTitle title="Experience" accent={accent} />
          {r.experience.map((e) => (
            <div key={e.id} style={{ marginBottom: "0.65em" }}>
              <div style={{ fontWeight: 700, fontSize: "1.02em" }}>{e.role}</div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0.75em",
                  color: "#475569",
                }}
              >
                <div>
                  {e.company}
                  {e.location ? ` · ${e.location}` : ""}
                </div>
                <div style={{ whiteSpace: "nowrap" }}>
                  {formatDateRange(e.startDate, e.endDate, e.current)}
                </div>
              </div>
              {e.bullets.filter((b) => b.trim()).length > 0 && (
                <ul style={{ margin: "0.2em 0 0", paddingLeft: "1.15em" }}>
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
    case "projects":
      return (
        <section key={key}>
          <MainTitle title="Projects" accent={accent} />
          {r.projects.map((p) => (
            <div key={p.id} style={{ marginBottom: "0.4em" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0.75em",
                }}
              >
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                {p.link && <div style={{ color: accent }}>{p.link}</div>}
              </div>
              {p.description && <div>{p.description}</div>}
              {p.bullets.filter((b) => b.trim()).length > 0 && (
                <ul style={{ margin: "0.2em 0 0", paddingLeft: "1.15em" }}>
                  {p.bullets
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
    default:
      return null;
  }
}

export default function TwoColumnTemplate({ resume }: TemplateProps) {
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

  const leftOrdered = resume.sections.filter((k) => LEFT_KEYS.includes(k));
  const rightOrdered = resume.sections.filter((k) => RIGHT_KEYS.includes(k));

  return (
    <div
      style={{
        fontFamily,
        fontSize: `${fontPx}pt`,
        lineHeight: 1.4,
        color: "#0f172a",
        display: "grid",
        gridTemplateColumns: "3.1in 1fr",
        minHeight: "100%",
      }}
    >
      <aside
        style={{
          background: "#0f172a",
          color: "white",
          padding: "0.6in 0.4in",
          alignSelf: "stretch",   
        }}
      >
        <div style={{ marginBottom: "0.6em" }}>
          <h1 style={{ margin: 0, fontSize: "1.5em", fontWeight: 800, color: "white" }}>
            {personal.fullName || "Your Name"}
          </h1>
          {personal.title && (
            <div style={{ color: accent, fontWeight: 600 }}>{personal.title}</div>
          )}
        </div>
        {contacts.length > 0 && (
          <section>
            <SidebarTitle title="Contact" />
            {contacts.map((c, i) => (
              <div key={i} style={{ color: "#cbd5e1", wordBreak: "break-word" }}>
                {c}
              </div>
            ))}
          </section>
        )}
        {leftOrdered.map((k) => renderLeftSection(resume, k))}
      </aside>
      <main style={{ padding: "0.55in 0.55in" }}>
        {rightOrdered.map((k) => renderRightSection(resume, k, accent))}
      </main>
    </div>
  );
}
