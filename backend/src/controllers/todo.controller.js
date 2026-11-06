import mongoose from 'mongoose';
import Todo from '../models/todo.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';

// Development In-Memory store fallback when MongoDB is not running locally
let inMemoryTodos = [
  {
    _id: 'sample-1',
    title: 'Explore the Enterprise Todo App 🚀',
    description: 'This is a sample task to demonstrate instant filtering, priorities, and stats.',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'sample-2',
    title: 'Connect MongoDB for persistent storage',
    description: 'Launch Docker Desktop or add a MongoDB Atlas URI in backend/.env',
    completed: false,
    priority: 'medium',
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all todos (with optional filtering and search)
// @route   GET /api/todos
// @access  Public
export const getTodos = asyncHandler(async (req, res) => {
  const { completed, priority, search, sortBy = 'createdAt', order = 'desc' } = req.query;

  if (isDbConnected()) {
    const query = {};

    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const todos = await Todo.find(query).sort({ [sortBy]: sortOrder });
    return ApiResponse.success(res, todos, 'Todos retrieved successfully');
  }

  // Fallback: In-memory store
  let filtered = [...inMemoryTodos];

  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    filtered = filtered.filter((t) => t.completed === isCompleted);
  }

  if (priority) {
    filtered = filtered.filter((t) => t.priority === priority);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (t) => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
    );
  }

  filtered.sort((a, b) => {
    const fieldA = a[sortBy] || '';
    const fieldB = b[sortBy] || '';
    if (order === 'asc') return fieldA > fieldB ? 1 : -1;
    return fieldA < fieldB ? 1 : -1;
  });

  return ApiResponse.success(res, filtered, 'Todos retrieved from dev in-memory store');
});

// @desc    Get single todo by ID
// @route   GET /api/todos/:id
// @access  Public
export const getTodoById = asyncHandler(async (req, res) => {
  if (isDbConnected()) {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return ApiResponse.error(res, 'Todo not found', 404);
    return ApiResponse.success(res, todo, 'Todo retrieved successfully');
  }

  const todo = inMemoryTodos.find((t) => t._id === req.params.id);
  if (!todo) return ApiResponse.error(res, 'Todo not found', 404);
  return ApiResponse.success(res, todo, 'Todo retrieved from dev in-memory store');
});

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Public
export const createTodo = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  if (!title || !title.trim()) {
    return ApiResponse.error(res, 'Title is required', 400);
  }

  if (isDbConnected()) {
    const newTodo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
    });
    return ApiResponse.created(res, newTodo, 'Todo created successfully');
  }

  // Fallback: In-memory store
  const newTodo = {
    _id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: title.trim(),
    description: description ? description.trim() : '',
    completed: false,
    priority: priority || 'medium',
    dueDate: dueDate || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  inMemoryTodos.unshift(newTodo);
  return ApiResponse.created(res, newTodo, 'Todo created in dev in-memory store');
});

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Public
export const updateTodo = asyncHandler(async (req, res) => {
  const { title, description, completed, priority, dueDate } = req.body;

  if (isDbConnected()) {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return ApiResponse.error(res, 'Todo not found', 404);

    if (title !== undefined) todo.title = title.trim();
    if (description !== undefined) todo.description = description.trim();
    if (completed !== undefined) todo.completed = Boolean(completed);
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate;

    const updatedTodo = await todo.save();
    return ApiResponse.success(res, updatedTodo, 'Todo updated successfully');
  }

  const index = inMemoryTodos.findIndex((t) => t._id === req.params.id);
  if (index === -1) return ApiResponse.error(res, 'Todo not found', 404);

  const existing = inMemoryTodos[index];
  inMemoryTodos[index] = {
    ...existing,
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(completed !== undefined && { completed: Boolean(completed) }),
    ...(priority !== undefined && { priority }),
    ...(dueDate !== undefined && { dueDate }),
    updatedAt: new Date().toISOString(),
  };

  return ApiResponse.success(res, inMemoryTodos[index], 'Todo updated in dev in-memory store');
});

// @desc    Toggle todo completion status
// @route   PATCH /api/todos/:id/toggle
// @access  Public
export const toggleTodoStatus = asyncHandler(async (req, res) => {
  if (isDbConnected()) {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return ApiResponse.error(res, 'Todo not found', 404);

    todo.completed = !todo.completed;
    const updatedTodo = await todo.save();
    return ApiResponse.success(
      res,
      updatedTodo,
      `Todo marked as ${updatedTodo.completed ? 'completed' : 'pending'}`
    );
  }

  const index = inMemoryTodos.findIndex((t) => t._id === req.params.id);
  if (index === -1) return ApiResponse.error(res, 'Todo not found', 404);

  inMemoryTodos[index] = {
    ...inMemoryTodos[index],
    completed: !inMemoryTodos[index].completed,
    updatedAt: new Date().toISOString(),
  };

  return ApiResponse.success(
    res,
    inMemoryTodos[index],
    `Todo marked as ${inMemoryTodos[index].completed ? 'completed' : 'pending'}`
  );
});

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Public
export const deleteTodo = asyncHandler(async (req, res) => {
  if (isDbConnected()) {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return ApiResponse.error(res, 'Todo not found', 404);
    return ApiResponse.success(res, { id: req.params.id }, 'Todo deleted successfully');
  }

  const index = inMemoryTodos.findIndex((t) => t._id === req.params.id);
  if (index === -1) return ApiResponse.error(res, 'Todo not found', 404);

  inMemoryTodos.splice(index, 1);
  return ApiResponse.success(res, { id: req.params.id }, 'Todo deleted from dev in-memory store');
});
