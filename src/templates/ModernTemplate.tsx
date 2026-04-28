import type { Resume, SectionKey } from "../types/resume";
import {
  FONT_SIZE_PX,
  SPACING_GAP_REM,
  formatDateRange,
  hasContent,
  type TemplateProps,
} from "./shared";

function SectionHeading({ title, accent }: { title: string; accent: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5em",
        marginTop: "0.9em",
        marginBottom: "0.3em",
      }}
    >
      <div
        style={{
          width: "6px",
          height: "1em",
          background: accent,
          borderRadius: "2px",
        }}
      />
      <h2
        style={{
          margin: 0,
          fontSize: "1.05em",
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function renderSection(r: Resume, key: SectionKey, accent: string) {
  if (!hasContent(r, key)) return null;
  switch (key) {
    case "summary":
      return (
        <section key={key}>
          <SectionHeading title="About" accent={accent} />
          <p style={{ margin: 0 }}>{r.personal.summary}</p>
        </section>
      );
    case "experience":
      return (
        <section key={key}>
          <SectionHeading title="Experience" accent={accent} />
          {r.experience.map((e) => (
            <div key={e.id} style={{ marginBottom: "0.65em" }}>
              <div style={{ fontWeight: 700, fontSize: "1.02em" }}>
                {e.role || "Role"}
              </div>
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
                <ul style={{ margin: "0.25em 0 0", paddingLeft: "1.15em" }}>
                  {e.bullets
                    .filter((b) => b.trim())
                    .map((b, i) => (
                      <li key={i} style={{ marginBottom: "0.1em" }}>
                        {b}
                      </li>
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
          <SectionHeading title="Education" accent={accent} />
          {r.education.map((e) => (
            <div key={e.id} style={{ marginBottom: "0.45em" }}>
              <div style={{ fontWeight: 700 }}>{e.school || "School"}</div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0.75em",
                  color: "#475569",
                }}
              >
                <div>
                  {[e.degree, e.field].filter(Boolean).join(", ")}
                  {e.location ? ` · ${e.location}` : ""}
                </div>
                <div style={{ whiteSpace: "nowrap" }}>
                  {formatDateRange(e.startDate, e.endDate, false)}
                </div>
              </div>
              {e.details && <div style={{ color: "#475569" }}>{e.details}</div>}
            </div>
          ))}
        </section>
      );
    case "projects":
      return (
        <section key={key}>
          <SectionHeading title="Projects" accent={accent} />
          {r.projects.map((p) => (
            <div key={p.id} style={{ marginBottom: "0.45em" }}>
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
    case "skills":
      return (
        <section key={key}>
          <SectionHeading title="Skills" accent={accent} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "max-content 1fr",
              columnGap: "0.8em",
              rowGap: "0.2em",
            }}
          >
            {r.skills.map((g) => (
              <div key={g.id} style={{ display: "contents" }}>
                <div style={{ fontWeight: 700, color: "#334155" }}>{g.category}</div>
                <div>{g.items}</div>
              </div>
            ))}
          </div>
        </section>
      );
    case "certifications":
      return (
        <section key={key}>
          <SectionHeading title="Certifications" accent={accent} />
          {r.certifications.map((c) => (
            <div
              key={c.id}
              style={{ display: "flex", justifyContent: "space-between", gap: "0.75em" }}
            >
              <div>
                <span style={{ fontWeight: 700 }}>{c.name}</span>
                {c.issuer ? ` — ${c.issuer}` : ""}
              </div>
              <div style={{ color: "#475569" }}>{c.date}</div>
            </div>
          ))}
        </section>
      );
    case "languages":
      return (
        <section key={key}>
          <SectionHeading title="Languages" accent={accent} />
          <div>
            {r.languages
              .map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`)
              .join("  •  ")}
          </div>
        </section>
      );
  }
}

export default function ModernTemplate({ resume }: TemplateProps) {
  const { design, personal } = resume;
  const accent = design.accentColor;
  const fontPx = FONT_SIZE_PX[design.fontSize];
  const fontFamily =
    design.fontFamily === "serif" ? "var(--font-serif)" : "var(--font-sans)";
  const gap = SPACING_GAP_REM[design.spacing];

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
        lineHeight: 1.4,
        color: "#0f172a",
        padding: "0.55in 0.7in",
        display: "flex",
        flexDirection: "column",
        gap: `${gap}em`,
      }}
    >
      <header
        style={{
          borderLeft: `5px solid ${accent}`,
          paddingLeft: "0.75em",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "2.1em",
            fontWeight: 800,
            letterSpacing: "-0.01em",
          }}
        >
          {personal.fullName || "Your Name"}
        </h1>
        {personal.title && (
          <div style={{ color: accent, fontWeight: 600, marginTop: "0.1em" }}>
            {personal.title}
          </div>
        )}
        {contacts.length > 0 && (
          <div
            style={{
              marginTop: "0.3em",
              color: "#475569",
              fontSize: "0.92em",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.6em 1em",
            }}
          >
            {contacts.map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        )}
      </header>
      {resume.sections.map((key) => renderSection(resume, key, accent))}
    </div>
  );
}
