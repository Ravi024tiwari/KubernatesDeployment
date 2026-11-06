import React from "react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:flex-row sm:px-6">
        <p>Production-Grade Todo System • Built with Next.js 16 & Express</p>
        <p className="flex items-center gap-2">
          <span>Container-ready</span>
          <span>•</span>
          <span>Zero-downtime rolling updates</span>
        </p>
      </div>
    </footer>
  );
}
