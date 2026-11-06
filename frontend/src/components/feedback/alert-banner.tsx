import React from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertBannerProps {
  type?: "info" | "success" | "error";
  message: string;
  onDismiss?: () => void;
}

export function AlertBanner({
  type = "error",
  message,
  onDismiss,
}: AlertBannerProps) {
  const styles = {
    info: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    error: "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
  };

  const icons = {
    info: <Info className="h-4 w-4 shrink-0" />,
    success: <CheckCircle className="h-4 w-4 shrink-0" />,
    error: <AlertCircle className="h-4 w-4 shrink-0" />,
  };

  return (
    <div
      role="alert"
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border p-3 text-sm transition-all",
        styles[type]
      )}
    >
      <div className="flex items-center gap-2">
        {icons[type]}
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
