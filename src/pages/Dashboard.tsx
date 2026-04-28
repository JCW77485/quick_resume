import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Copy, FilePlus, FileText, Sparkles, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useResumes } from "../store/resumes";
import ResumePreview from "../components/ResumePreview";

export default function Dashboard() {
  const { resumes, order, createResume, createSampleResume, deleteResume, duplicateResume } =
    useResumes();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-full flex-col bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Resumes</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const id = createResume();
                navigate(`/builder/${id}`);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              <FilePlus size={16} /> New resume
            </button>
            {/* <button
              type="button"
              onClick={() => {
                const id = createSampleResume();
                navigate(`/builder/${id}`);
              }}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Sparkles size={16} /> Start from sample
            </button> */}
          </div>
        </div>

        {order.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-100 text-brand-700">
              <FileText size={22} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              You don't have any resumes yet
            </h2>
            <p className="mt-1 text-slate-600">
              Create a blank resume or start from a filled-in sample to see how it works.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const id = createResume();
                  navigate(`/builder/${id}`);
                }}
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                New resume
              </button>
              <Link
                to="/templates"
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Browse templates
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {order.map((id) => {
              const r = resumes[id];
              if (!r) return null;
              return (
                <div
                  key={id}
                  className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <Link to={`/builder/${id}`} className="block bg-slate-100 p-3">
                    <div
                      style={{ width: "100%", aspectRatio: "8.5 / 11", overflow: "hidden" }}
                    >
                      <div
                        style={{
                          transformOrigin: "top left",
                          transform: "scale(0.33)",
                          width: "8.5in",
                        }}
                      >
                        <ResumePreview resume={r} scale={1} interactive={false} />
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between gap-3 border-t border-slate-200 p-3">
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-slate-900">{r.name}</div>
                      <div className="text-xs text-slate-500">
                        Updated {new Date(r.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        title="Duplicate"
                        onClick={() => duplicateResume(id)}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => setConfirmId(id)}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
      {confirmId && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={() => setConfirmId(null)}
        >
          <div
            className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900">Delete this resume?</h3>
            <p className="mt-1 text-sm text-slate-600">
              This can't be undone. The resume will be removed from your browser.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteResume(confirmId);
                  setConfirmId(null);
                }}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
