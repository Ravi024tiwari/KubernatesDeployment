"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Router Error Boundary Caught]", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
        <AlertOctagon className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">
        Something went wrong!
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => reset()} variant="primary">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
