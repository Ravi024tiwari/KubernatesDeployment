"use client";

import React, { useState, useEffect } from "react";
import { Todo } from "../types/todo.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Check, Trash2, Edit3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => Promise<void>;
}

/**
 * Deterministic UTC date formatter to eliminate SSR / client hydration mismatches.
 */
function formatDueDate(dateString: string | null): string | null {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/**
 * Due date badge component that safely handles client mounting & overdue calculation.
 */
function DueDateBadge({
  dueDate,
  completed,
}: {
  dueDate: string | null;
  completed: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!dueDate) return null;

  const formattedDate = formatDueDate(dueDate);
  if (!formattedDate) return null;

  const isOverdue =
    mounted &&
    !completed &&
    new Date(dueDate).setHours(23, 59, 59, 999) < Date.now();

  return (
    <span
      suppressHydrationWarning
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md",
        isOverdue
          ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
          : "text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400"
      )}
    >
      {isOverdue ? <Clock className="h-3 w-3 shrink-0" /> : <Calendar className="h-3 w-3 shrink-0" />}
      <span suppressHydrationWarning>{formattedDate}</span>
      {isOverdue && <span>(Overdue)</span>}
    </span>
  );
}

export function TodoItem({
  todo,
  onToggle,
  onEdit,
  onDelete,
}: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await onToggle(todo._id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(todo._id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={cn(
        "group relative flex items-start justify-between gap-3.5 rounded-2xl border p-4 transition-all duration-200",
        todo.completed
          ? "border-slate-200/60 bg-slate-50/70 opacity-70 dark:border-slate-800/60 dark:bg-slate-900/40"
          : "border-slate-200/90 bg-white shadow-xs hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
      )}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        {/* Toggle Checkbox Button with micro-bounce animation */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          aria-label={todo.completed ? "Mark as pending" : "Mark as completed"}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 cursor-pointer active:scale-90",
            todo.completed
              ? "border-emerald-500 bg-emerald-500 text-white shadow-xs shadow-emerald-200 dark:shadow-none"
              : "border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 dark:border-slate-700 dark:hover:border-indigo-400"
          )}
        >
          {todo.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-semibold text-slate-900 dark:text-slate-100 break-words leading-snug transition-all",
              todo.completed && "line-through text-slate-400 dark:text-slate-500"
            )}
          >
            {todo.title}
          </p>

          {todo.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 break-words leading-relaxed">
              {todo.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant={todo.priority}>
              {todo.priority.toUpperCase()}
            </Badge>

            <DueDateBadge dueDate={todo.dueDate} completed={todo.completed} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-90 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(todo)}
          className="h-8 w-8 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800"
          aria-label="Edit task"
        >
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          isLoading={isDeleting}
          className="h-8 w-8 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
