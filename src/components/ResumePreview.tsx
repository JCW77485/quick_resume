import type { Resume } from "../types/resume";
import ResumePage from "./ResumePage";
import { renderTemplate } from "../templates";

interface Props {
  resume: Resume;
  scale?: number;
  interactive?: boolean;
  printable?: boolean;
}

/**
 * Scales the 8.5in × 11in page down to fit a preview pane while keeping the
 * rendered output identical to what will be printed.
 */
export default function ResumePreview({
  resume,
  scale = 1,
  interactive = true,
  printable = false,
}: Props) {
  const width = 8.5 * 96 * scale;
  const height = 11 * 96 * scale;
  return (
    <div
      className="resume-preview-stage"
      style={{
        width,
        height,
        pointerEvents: interactive ? "auto" : "none",
      }}
    >
      <div
        className="resume-preview-scale"
        data-print-target      
        style={{
            transform: printable ? "none" : `scale(${scale})`,
            transformOrigin: "top left",
            width: "8.5in",
        }}
      >
        <ResumePage printable={printable}>{renderTemplate(resume)}</ResumePage>
      </div>
    </div>
  );
}
