import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface LabelProps {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, hint, children, className = "" }: LabelProps) {
  return (
    <label className={"flex flex-col gap-1 " + className}>
      <span className="text-xs font-medium text-slate-600">{label}</span>
      {children}
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClass + " " + (props.className ?? "")} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={inputClass + " min-h-[80px] resize-y " + (props.className ?? "")}
    />
  );
}
