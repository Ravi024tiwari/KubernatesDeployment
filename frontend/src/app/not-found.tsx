import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <FileQuestion className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
        404 - Page Not Found
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        The task or page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
