import { type ReactNode, forwardRef } from "react";

/**
 * A fixed US-letter-sized page container. Uses a single 8.5in x 11in canvas
 * so the preview matches the printed PDF exactly.
 */
const ResumePage = forwardRef<
  HTMLDivElement,
  { children: ReactNode; className?: string; printable?: boolean }
>(({ children, className = "", printable = false }, ref) => {
    return (
      <div
        ref={ref}
        data-print-target={printable ? "true" : undefined}
        className={"bg-white shadow-md " + className}
        style={{
          width: "8.5in",
          minHeight: printable ? "auto" : "11in",
          margin: "0 auto",
          boxSizing: "border-box",
          overflow: printable ? "visible" : "hidden", 
        }}
      >
        {children}
      </div>
    );
  },
);
ResumePage.displayName = "ResumePage";

export default ResumePage;
