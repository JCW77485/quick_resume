export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} QuickResume. Built for you.</div>
          <div>Your resumes stay in your browser — nothing is uploaded.</div>
        </div>
      </div>
    </footer>
  );
}
