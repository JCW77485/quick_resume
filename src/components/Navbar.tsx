import { Link, NavLink } from "react-router-dom";
import { FileText } from "lucide-react";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  "text-sm font-medium transition-colors " +
  (isActive ? "text-brand-700" : "text-slate-600 hover:text-slate-900");

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-600 text-white">
            <FileText size={16} />
          </span>
          QuickResume
        </Link>
        <nav className="flex flex-1 items-center gap-5">
          <NavLink to="/templates" className={linkClass}>
            Templates
          </NavLink>
          <NavLink to="/builder" className={linkClass}>
            My Resumes
          </NavLink>
        </nav>
        <Link
          to="/builder"
          className="hidden rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 md:inline-flex"
        >
          Get started
        </Link>
      </div>
    </header>
  );
}
