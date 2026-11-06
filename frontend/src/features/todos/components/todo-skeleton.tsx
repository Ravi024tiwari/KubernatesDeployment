import React from "react";

export function TodoSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex animate-pulse items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-1.5">
              <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3 w-32 rounded bg-slate-100 dark:bg-slate-800/60" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
