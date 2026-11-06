import { apiClient } from "@/lib/api-client";
import {
  CreateTodoInput,
  Todo,
  TodoFilters,
  UpdateTodoInput,
} from "../types/todo.types";

export const todoService = {
  /**
   * Fetch all todos with optional query filters
   */
  async getTodos(filters?: TodoFilters): Promise<Todo[]> {
    const params: Record<string, string | number | boolean | undefined> = {};

    if (filters?.completed !== undefined) {
      params.completed = filters.completed;
    }
    if (filters?.priority) {
      params.priority = filters.priority;
    }
    if (filters?.search) {
      params.search = filters.search;
    }
    if (filters?.sortBy) {
      params.sortBy = filters.sortBy;
    }
    if (filters?.order) {
      params.order = filters.order;
    }

    return apiClient<Todo[]>("/todos", {
      method: "GET",
      params,
      cache: "no-store",
    });
  },

  /**
   * Fetch single todo by ID
   */
  async getTodoById(id: string): Promise<Todo> {
    return apiClient<Todo>(`/todos/${id}`, {
      method: "GET",
      cache: "no-store",
    });
  },

  /**
   * Create a new todo
   */
  async createTodo(input: CreateTodoInput): Promise<Todo> {
    return apiClient<Todo>("/todos", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  /**
   * Update an existing todo
   */
  async updateTodo(id: string, input: UpdateTodoInput): Promise<Todo> {
    return apiClient<Todo>(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },

  /**
   * Toggle completed status
   */
  async toggleTodo(id: string): Promise<Todo> {
    return apiClient<Todo>(`/todos/${id}/toggle`, {
      method: "PATCH",
    });
  },

  /**
   * Delete a todo by ID
   */
  async deleteTodo(id: string): Promise<{ id: string }> {
    return apiClient<{ id: string }>(`/todos/${id}`, {
      method: "DELETE",
    });
  },
};
