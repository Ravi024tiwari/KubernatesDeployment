import { todoService } from "@/features/todos/services/todo.service";
import { TodoDashboard } from "@/features/todos/components/todo-dashboard";
import { Todo } from "@/features/todos/types/todo.types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let initialTodos: Todo[] = [];

  try {
    initialTodos = await todoService.getTodos();
  } catch (error) {
    // If backend isn't reached yet or during build, gracefully start with empty state
    console.warn(
      "[Server Component] Could not fetch initial todos from backend. Starting with empty state.",
      error instanceof Error ? error.message : error
    );
  }

  return <TodoDashboard initialTodos={initialTodos} />;
}
