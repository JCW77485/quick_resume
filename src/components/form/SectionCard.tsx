import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function SectionCard({
  title,
  subtitle,
  actions,
  defaultOpen = true,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          {open ? (
            <ChevronUp size={16} className="text-slate-400" />
          ) : (
            <ChevronDown size={16} className="text-slate-400" />
          )}
          <div>
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
          </div>
        </button>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>
      {open && <div className="space-y-3 px-4 py-4">{children}</div>}
    </div>
  );
}
