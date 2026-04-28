import type { Resume, SectionKey } from "../types/resume";
import {
  FONT_SIZE_PX,
  SPACING_GAP_REM,
  formatDateRange,
  hasContent,
  type TemplateProps,
} from "./shared";

function ContactLine({ resume }: { resume: Resume }) {
  const p = resume.personal;
  const parts = [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(
    (x) => x && x.trim(),
  );
  if (!parts.length) return null;
  return (
    <div className="text-center" style={{ fontSize: "0.9em", color: "#374151" }}>
      {parts.join("  •  ")}
    </div>
  );
}

function SectionTitle({ title, accent }: { title: string; accent: string }) {
  return (
    <div style={{ marginTop: "1em", marginBottom: "0.35em" }}>
      <h2
        style={{
          fontSize: "1.05em",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          margin: 0,
          paddingBottom: "2px",
          borderBottom: `1.5px solid ${accent}`,
          color: accent,
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
          <SectionTitle title="Summary" accent={accent} />
          <p style={{ margin: 0 }}>{r.personal.summary}</p>
        </section>
      );
    case "experience":
      return (
        <section key={key}>
          <SectionTitle title="Experience" accent={accent} />
          {r.experience.map((e) => (
            <div key={e.id} style={{ marginBottom: "0.7em" }}>
              <div className="flex justify-between gap-3">
                <div style={{ fontWeight: 700 }}>
                  {e.role || "Role"}
                  {e.company ? ` — ${e.company}` : ""}
                </div>
                <div style={{ color: "#4b5563", whiteSpace: "nowrap" }}>
                  {formatDateRange(e.startDate, e.endDate, e.current)}
                </div>
              </div>
              {e.location && (
                <div style={{ color: "#4b5563", fontStyle: "italic" }}>{e.location}</div>
              )}
              {e.bullets.filter((b) => b.trim()).length > 0 && (
                <ul style={{ margin: "0.2em 0 0", paddingLeft: "1.15em" }}>
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
          <SectionTitle title="Education" accent={accent} />
          {r.education.map((e) => (
            <div key={e.id} style={{ marginBottom: "0.5em" }}>
              <div className="flex justify-between gap-3">
                <div style={{ fontWeight: 700 }}>{e.school || "School"}</div>
                <div style={{ color: "#4b5563", whiteSpace: "nowrap" }}>
                  {formatDateRange(e.startDate, e.endDate, false)}
                </div>
              </div>
              <div style={{ color: "#374151" }}>
                {[e.degree, e.field].filter(Boolean).join(", ")}
                {e.location ? ` • ${e.location}` : ""}
              </div>
              {e.details && <div style={{ color: "#4b5563" }}>{e.details}</div>}
            </div>
          ))}
        </section>
      );
    case "projects":
      return (
        <section key={key}>
          <SectionTitle title="Projects" accent={accent} />
          {r.projects.map((p) => (
            <div key={p.id} style={{ marginBottom: "0.5em" }}>
              <div className="flex justify-between gap-3">
                <div style={{ fontWeight: 700 }}>{p.name || "Project"}</div>
                {p.link && <div style={{ color: "#4b5563" }}>{p.link}</div>}
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
            <div key={c.id} className="flex justify-between gap-3">
              <div>
                <span style={{ fontWeight: 700 }}>{c.name}</span>
                {c.issuer ? ` — ${c.issuer}` : ""}
              </div>
              <div style={{ color: "#4b5563" }}>{c.date}</div>
            </div>
          ))}
        </section>
      );
    case "languages":
  const levelMap = {
    Beginner: 20,
    Intermediate: 40,
    Advanced: 60,
    Fluent: 80,
    Native: 100,
  };

  return (
    <section key={key}>
      <SectionTitle title="Languages" accent={accent} />

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {r.languages.map((l, i) => {
          const percent = levelMap[l.level] || 0;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {/* Name */}
              <div style={{ minWidth: 100 }}>{l.name}</div>

              {/* Bar */}
              <div
                style={{
                  width: 120, // 👈 fixed width
                  height: 6,
                  background: "#e5e7eb",
                  borderRadius: 4,
                }}
              >
                <div
                  style={{
                    width: `${percent}%`,
                    height: "100%",
                    background: accent || "#4caf50",
                    borderRadius: 4,
                  }}
                />
              </div>

              {/* Level */}
              <div style={{ fontSize: 12, color: "#666" }}>
                {l.level}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
  }
}

export default function ClassicTemplate({ resume }: TemplateProps) {
  const { design, personal } = resume;
  const accent = design.accentColor;
  const fontPx = FONT_SIZE_PX[design.fontSize];
  const fontFamily =
    design.fontFamily === "serif"
      ? "var(--font-serif)"
      : "var(--font-sans)";
  const gap = SPACING_GAP_REM[design.spacing];

  return (
    <div
      style={{
        fontFamily,
        fontSize: `${fontPx}pt`,
        lineHeight: 1.4,
        color: "#111827",
        padding: "0.6in 0.7in",
        display: "flex",
        flexDirection: "column",
        gap: `${gap}em`,
      }}
    >
      <header style={{ textAlign: "center" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "2em",
            fontWeight: 700,
            letterSpacing: "0.01em",
            color: accent,
          }}
        >
          {personal.fullName || "Your Name"}
        </h1>
        {personal.title && (
          <div style={{ marginTop: "0.15em", color: "#374151", fontSize: "1.05em" }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: "0.35em" }}>
          <ContactLine resume={resume} />
        </div>
      </header>
      {resume.sections.map((key) => renderSection(resume, key, accent))}
    </div>
  );
}
