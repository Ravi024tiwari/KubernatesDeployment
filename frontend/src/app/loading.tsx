import { TodoSkeleton } from "@/features/todos/components/todo-skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-20 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      <div className="flex justify-between items-center">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>
      <TodoSkeleton />
    </div>
  );
}
