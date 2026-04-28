import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  children: ReactNode;
}

export default function ItemCard({
  title,
  subtitle,
  defaultOpen = false,
  onMoveUp,
  onMoveDown,
  onDelete,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50">
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          {open ? (
            <ChevronUp size={14} className="text-slate-400" />
          ) : (
            <ChevronDown size={14} className="text-slate-400" />
          )}
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-slate-900">
              {title || "(untitled)"}
            </div>
            {subtitle && (
              <div className="truncate text-xs text-slate-500">{subtitle}</div>
            )}
          </div>
        </button>
        {onMoveUp && (
          <button
            type="button"
            title="Move up"
            onClick={onMoveUp}
            className="rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700"
          >
            <ArrowUp size={14} />
          </button>
        )}
        {onMoveDown && (
          <button
            type="button"
            title="Move down"
            onClick={onMoveDown}
            className="rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700"
          >
            <ArrowDown size={14} />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            title="Delete"
            onClick={onDelete}
            className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      {open && (
        <div className="space-y-3 border-t border-slate-200 bg-white px-3 py-3">
          {children}
        </div>
      )}
    </div>
  );
}
