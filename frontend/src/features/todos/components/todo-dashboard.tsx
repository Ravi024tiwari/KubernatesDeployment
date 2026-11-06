"use client";

import React, { useMemo, useState } from "react";
import { CreateTodoInput, Priority, Todo } from "../types/todo.types";
import { todoService } from "../services/todo.service";
import { TodoStats } from "./todo-stats";
import { TodoFiltersBar } from "./todo-filters";
import { TodoList } from "./todo-list";
import { TodoForm } from "./todo-form";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertBanner } from "@/components/feedback/alert-banner";
import { Plus, Sparkles, Send } from "lucide-react";

interface TodoDashboardProps {
  initialTodos: Todo[];
}

export function TodoDashboard({ initialTodos }: TodoDashboardProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickPriority, setQuickPriority] = useState<Priority>("medium");
  const [isQuickAdding, setIsQuickAdding] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Client-side filtering & search
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Status filter
      if (statusFilter === "completed" && !todo.completed) return false;
      if (statusFilter === "pending" && todo.completed) return false;

      // Priority filter
      if (priorityFilter !== "all" && todo.priority !== priorityFilter) return false;

      // Search term
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = todo.title.toLowerCase().includes(query);
        const matchesDesc = (todo.description || "").toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    });
  }, [todos, statusFilter, priorityFilter, search]);

  const isFiltered = statusFilter !== "all" || priorityFilter !== "all" || search.trim() !== "";

  // Reset filters
  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  // Quick Inline Add Task
  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || isQuickAdding) return;

    try {
      setIsQuickAdding(true);
      setErrorMessage(null);
      const newTodo = await todoService.createTodo({
        title: quickTitle.trim(),
        priority: quickPriority,
      });
      setTodos((prev) => [newTodo, ...prev]);
      setQuickTitle("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add task";
      setErrorMessage(msg);
    } finally {
      setIsQuickAdding(false);
    }
  };

  // Modal Create Todo
  const handleCreateTodo = async (data: CreateTodoInput) => {
    try {
      setErrorMessage(null);
      const newTodo = await todoService.createTodo(data);
      setTodos((prev) => [newTodo, ...prev]);
      setIsCreateModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create task";
      setErrorMessage(msg);
      throw err;
    }
  };

  // Toggle status (Optimistic update)
  const handleToggleTodo = async (id: string) => {
    const original = [...todos];

    // Optimistic toggle
    setTodos((prev) =>
      prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
    );

    try {
      setErrorMessage(null);
      const updated = await todoService.toggleTodo(id);
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err: unknown) {
      setTodos(original);
      const msg = err instanceof Error ? err.message : "Failed to update task";
      setErrorMessage(msg);
    }
  };

  // Update / Edit Todo
  const handleUpdateTodo = async (data: CreateTodoInput) => {
    if (!editingTodo) return;

    try {
      setErrorMessage(null);
      const updated = await todoService.updateTodo(editingTodo._id, data);
      setTodos((prev) => prev.map((t) => (t._id === editingTodo._id ? updated : t)));
      setEditingTodo(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update task";
      setErrorMessage(msg);
      throw err;
    }
  };

  // Delete Todo (Optimistic update)
  const handleDeleteTodo = async (id: string) => {
    const original = [...todos];

    setTodos((prev) => prev.filter((t) => t._id !== id));

    try {
      setErrorMessage(null);
      await todoService.deleteTodo(id);
    } catch (err: unknown) {
      setTodos(original);
      const msg = err instanceof Error ? err.message : "Failed to delete task";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Error */}
      {errorMessage && (
        <AlertBanner
          type="error"
          message={errorMessage}
          onDismiss={() => setErrorMessage(null)}
        />
      )}

      {/* Metrics Bar with Progress */}
      <TodoStats todos={todos} />

      {/* Interactive Quick Add Card */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/30 p-4 shadow-xs dark:border-indigo-950 dark:bg-slate-900/60">
        <form onSubmit={handleQuickAdd} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Sparkles className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500" />
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="Quick add a new task... (press Enter to save)"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={quickPriority}
              onChange={(e) => setQuickPriority(e.target.value as Priority)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <Button
              type="submit"
              disabled={!quickTitle.trim() || isQuickAdding}
              isLoading={isQuickAdding}
              className="rounded-xl shrink-0"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-xl shrink-0"
              title="Add with details"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Detailed</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <TodoFiltersBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
      />

      {/* Filtered Count indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-900 dark:text-slate-100">{filteredTodos.length}</strong> {filteredTodos.length === 1 ? "task" : "tasks"}
          {isFiltered && ` (filtered from ${todos.length})`}
        </span>
        {isFiltered && (
          <button
            onClick={handleClearFilters}
            className="text-indigo-600 hover:underline dark:text-indigo-400 font-medium cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Todo List */}
      <TodoList
        todos={filteredTodos}
        onToggle={handleToggleTodo}
        onEdit={(todo) => setEditingTodo(todo)}
        onDelete={handleDeleteTodo}
        isFiltered={isFiltered}
        onClearFilters={handleClearFilters}
        onAddNew={() => setIsCreateModalOpen(true)}
      />

      {/* Detailed Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
      >
        <TodoForm
          onSubmit={handleCreateTodo}
          onCancel={() => setIsCreateModalOpen(false)}
          submitLabel="Create Task"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={Boolean(editingTodo)}
        onClose={() => setEditingTodo(null)}
        title="Edit Task"
      >
        {editingTodo && (
          <TodoForm
            initialData={editingTodo}
            onSubmit={handleUpdateTodo}
            onCancel={() => setEditingTodo(null)}
            submitLabel="Save Changes"
          />
        )}
      </Modal>
    </div>
  );
}
