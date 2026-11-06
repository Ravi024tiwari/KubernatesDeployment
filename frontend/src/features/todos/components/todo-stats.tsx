import React from "react";
import { Todo } from "../types/todo.types";
import { CheckCircle2, Clock, AlertTriangle, ListTodo, TrendingUp } from "lucide-react";

interface TodoStatsProps {
  todos: Todo[];
}

export function TodoStats({ todos }: TodoStatsProps) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriority = todos.filter((t) => !t.completed && t.priority === "high").length;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statItems = [
    {
      label: "Total Tasks",
      value: total,
      icon: ListTodo,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/50",
      borderColor: "border-indigo-100 dark:border-indigo-900/40",
    },
    {
      label: "In Progress",
      value: pending,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/50",
      borderColor: "border-amber-100 dark:border-amber-900/40",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
      borderColor: "border-emerald-100 dark:border-emerald-900/40",
    },
    {
      label: "High Priority",
      value: highPriority,
      icon: AlertTriangle,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/50",
      borderColor: "border-rose-100 dark:border-rose-900/40",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 4 Responsive Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-center gap-3.5 rounded-2xl border ${item.borderColor} bg-white p-4 shadow-xs transition-all hover:shadow-sm dark:bg-slate-900`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
                <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Completion Progress Bar */}
      {total > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="h-4 w-4" />
              Sprint Progress
            </span>
            <span className="font-bold">{completionPercentage}% Completed</span>
          </div>

          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>{completed} finished</span>
            <span>{pending} remaining</span>
          </div>
        </div>
      )}
    </div>
  );
}
