export type Priority = "low" | "medium" | "high";

export interface Todo {
  _id: string;
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  dueDate?: string | null;
}

export interface TodoFilters {
  completed?: boolean;
  priority?: Priority;
  search?: string;
  sortBy?: "createdAt" | "title" | "dueDate" | "priority";
  order?: "asc" | "desc";
}
