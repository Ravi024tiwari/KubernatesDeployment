import React from "react";
import { Todo } from "../types/todo.types";
import { TodoItem } from "./todo-item";
import { EmptyState } from "@/components/feedback/empty-state";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => Promise<void>;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => Promise<void>;
  isFiltered: boolean;
  onClearFilters?: () => void;
  onAddNew?: () => void;
}

export function TodoList({
  todos,
  onToggle,
  onEdit,
  onDelete,
  isFiltered,
  onClearFilters,
  onAddNew,
}: TodoListProps) {
  if (todos.length === 0) {
    return isFiltered ? (
      <EmptyState
        title="No matching tasks"
        description="Try adjusting your search or filters to find what you're looking for."
        actionLabel="Reset filters"
        onAction={onClearFilters}
        isFiltered
      />
    ) : (
      <EmptyState
        title="All clear! No tasks yet"
        description="Stay productive by creating your first task."
        actionLabel="Create Task"
        onAction={onAddNew}
      />
    );
  }

  return (
    <div className="space-y-2.5">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
